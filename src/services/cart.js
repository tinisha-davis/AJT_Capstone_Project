import { supabase } from '../lib/supabase'

// Get current user's cart items with product details
export async function getCartItems() {
    const { data, error } = await supabase
        .from('cart_items')
        .select(`
      id,
      quantity,
      product_id,
      products (
        id,
        name,
        price,
        image_url,
        inventory_count
      )
    `)

    if (error) throw error
    return data
}

// Add item to cart (or update quantity if already exists)
export async function addToCart(productId, quantity = 1) {
    // First check if item already exists in cart
    const { data: existingItem } = await supabase
        .from('cart_items')
        .select('id, quantity')
        .eq('product_id', productId)
        .single()

    if (existingItem) {
        // Update quantity
        const { data, error } = await supabase
            .from('cart_items')
            .update({ quantity: existingItem.quantity + quantity })
            .eq('id', existingItem.id)
            .select()

        if (error) throw error
        return data
    } else {
        // Insert new item
        const { data, error } = await supabase
            .from('cart_items')
            .insert({ product_id: productId, quantity })
            .select()

        if (error) throw error
        return data
    }
}

// Update cart item quantity
export async function updateCartItemQuantity(cartItemId, quantity) {
    if (quantity <= 0) {
        return removeFromCart(cartItemId)
    }

    const { data, error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', cartItemId)
        .select()

    if (error) throw error
    return data
}

// Remove item from cart
export async function removeFromCart(cartItemId) {
    const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', cartItemId)

    if (error) throw error
    return true
}

// Clear entire cart
export async function clearCart() {
    const { error } = await supabase
        .from('cart_items')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000') // Deletes all rows

    if (error) throw error
    return true
}

// Calculate cart total
export function calculateCartTotal(cartItems) {
    return cartItems.reduce((total, item) => {
        return total + (item.products.price * item.quantity)
    }, 0)
}