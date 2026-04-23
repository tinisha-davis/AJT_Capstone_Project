import { supabase } from '../lib/supabase'

// Sign up new user
export async function signUp(email, password, fullName = '', studentId = '') {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    })

    if (error) throw error

    // Create profile for the new user
    if (data.user) {
        const { error: profileError } = await supabase
            .from('profiles')
            .insert({
                id: data.user.id,
                email: email,
                full_name: fullName,
                student_id: studentId
            })

        if (profileError) {
            console.error('Error creating profile:', profileError)
        }
    }

    return data
}

// Sign in existing user
export async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) throw error
    return data
}

// Sign out
export async function signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
}

// Get current user
export async function getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser()
    return user
}

// Get current session
export async function getSession() {
    const { data: { session } } = await supabase.auth.getSession()
    return session
}

// Get user profile
export async function getProfile(userId) {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

    if (error) throw error
    return data
}

// Update user profile
export async function updateProfile(userId, updates) {
    const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single()

    if (error) throw error
    return data
}

// Listen to auth state changes
export function onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange((event, session) => {
        callback(event, session)
    })
}