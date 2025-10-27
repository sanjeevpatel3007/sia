import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      console.error('Calendar permission error:', error.message)
      return NextResponse.redirect(`${requestUrl.origin}/?error=calendar_permission_failed`)
    }

    if (data.session) {
      // Test calendar access to verify permissions
      try {
        const response = await fetch('https://www.googleapis.com/calendar/v3/users/me/calendarList', {
          headers: {
            'Authorization': `Bearer ${data.session.provider_token}`,
          },
        })
        
        if (response.ok) {
          // Update user metadata to indicate calendar permission granted
          const { error: updateError } = await supabase.auth.updateUser({
            data: { 
              calendar_permission_granted: true,
              calendar_permission_date: new Date().toISOString()
            }
          })
          
          if (updateError) {
            console.error('Error updating user metadata:', updateError.message)
          }
          
          return NextResponse.redirect(`${requestUrl.origin}/?calendar_permission=success`)
        } else {
          return NextResponse.redirect(`${requestUrl.origin}/?error=calendar_permission_failed`)
        }
      } catch (error) {
        console.error('Error testing calendar access:', error)
        return NextResponse.redirect(`${requestUrl.origin}/?error=calendar_permission_failed`)
      }
    }
  }

  // Redirect to home page after calendar permission
  return NextResponse.redirect(`${requestUrl.origin}/`)
}
