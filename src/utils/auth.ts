import { supabase } from '@/lib/supabase'

export const signInWithGoogle = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: 'http://localhost:3000/auth/callback'
    }
  })
  if (error) console.error('Google sign-in error:', error.message)
}
