import { supabase } from '../lib/supabase'
import { getCartItems, clearCart, calculateCartTotal } from './cart'

// Create a new order from current cart
export async function createOrder() {
    // Get current cart items
    const cartItems = await getCartItems()

    if (!cartItems || cartItems.length === 0) {
        throw new Error('Cart is empty')
    }

    // Calculate total
    const total = calculateCartTotal(cartItems)

    // Get current user
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('Must be logged in to place an order')
    }

    // Create the order
    const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
            user_id: user.id,
            total: total,
            status: 'pending'
        })
        .select()
        .single()

    if (orderError) throw orderError

    // Create order items
    const orderItems = cartItems.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price_at_purchase: item.products.price
    }))

    const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)

    if (itemsError) throw itemsError

    // Clear the cart after successful order
    await clearCart()

    return order
}

// Get user's orders
export async function getOrders() {
    const { data, error } = await supabase
        .from('orders')
        .select(`
      id,
      status,
      total,
      pickup_confirmed,
      created_at,
      order_items (
        id,
        quantity,
        price_at_purchase,
        products (
          name,
          image_url
        )
      )
    `)
        .order('created_at', { ascending: false })

    if (error) throw error
    return data
}

// Get single order by ID
export async function getOrderById(orderId) {
    const { data, error } = await supabase
        .from('orders')
        .select(`
      id,
      status,
      total,
      pickup_confirmed,
      created_at,
      order_items (
        id,
        quantity,
        price_at_purchase,
        products (
          name,
          image_url
        )
      )
    `)
        .eq('id', orderId)
        .single()

    if (error) throw error
    return data
}