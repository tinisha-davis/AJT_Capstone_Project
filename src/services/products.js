import { supabase } from '../lib/supabase'

// Fetch all products
export async function getProducts() {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) throw error
    return data
}

// Fetch a single product by ID
export async function getProductById(id) {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()

    if (error) throw error
    return data
}

// Fetch products by category
export async function getProductsByCategory(category) {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', category)
        .order('created_at', { ascending: false })

    if (error) throw error
    return data
}

// Check if product is in stock
export function isInStock(product) {
    return product.inventory_count > 0
}