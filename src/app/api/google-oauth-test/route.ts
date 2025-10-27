export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');
    
    if (!code) {
      // Generate OAuth URL
      const clientId = process.env.GOOGLE_CLIENT_ID;
      const redirectUri = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/google-oauth-test`;
      const scopes = [
        'https://www.googleapis.com/auth/calendar.readonly',
        'https://www.googleapis.com/auth/calendar.events',
        'https://www.googleapis.com/auth/calendar'
      ].join(' ');
      
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${clientId}&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `scope=${encodeURIComponent(scopes)}&` +
        `response_type=code&` +
        `access_type=offline&` +
        `prompt=consent`;
      
      return Response.json({ 
        authUrl,
        message: 'Visit this URL to test OAuth with correct scopes',
        scopes: scopes.split(' ')
      });
    }
    
    // Exchange code for token
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/google-oauth-test`;
    
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId!,
        client_secret: clientSecret!,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
      }),
    });
    
    const tokenData = await tokenResponse.json();
    
    if (tokenData.error) {
      return Response.json({ 
        success: false, 
        error: tokenData.error_description || tokenData.error 
      });
    }
    
    // Test calendar access with the token
    const calendarResponse = await fetch('https://www.googleapis.com/calendar/v3/users/me/calendarList', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
      },
    });
    
    const calendarData = await calendarResponse.json();
    
    return Response.json({
      success: calendarResponse.ok,
      tokenData: {
        access_token: tokenData.access_token?.substring(0, 20) + '...',
        scope: tokenData.scope,
        expires_in: tokenData.expires_in
      },
      calendarTest: {
        status: calendarResponse.status,
        statusText: calendarResponse.statusText,
        data: calendarData
      }
    });
    
  } catch (error) {
    console.error('Google OAuth test error:', error);
    return Response.json({ 
      success: false,
      error: 'OAuth test failed', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
