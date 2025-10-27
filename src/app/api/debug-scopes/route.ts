export async function POST(req: Request) {
  try {
    const { session } = await req.json();
    
    if (!session) {
      return Response.json({ error: 'No session provided' }, { status: 400 });
    }
    
    console.log('Session data for scope debugging:', {
      hasProviderToken: !!session.provider_token,
      tokenPreview: session.provider_token?.substring(0, 20) + '...',
      userMetadata: session.user?.user_metadata,
      appMetadata: session.user?.app_metadata,
      providerToken: session.provider_token?.substring(0, 50) + '...'
    });
    
    // Try to get token info from Google
    if (session.provider_token) {
      try {
        const tokenInfoResponse = await fetch(`https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${session.provider_token}`);
        const tokenInfo = await tokenInfoResponse.json();
        console.log('Google token info:', tokenInfo);
        
        return Response.json({
          success: true,
          sessionData: {
            hasProviderToken: !!session.provider_token,
            userEmail: session.user?.email,
            calendarPermission: session.user?.user_metadata?.calendar_permission_granted
          },
          tokenInfo: tokenInfo,
          scopes: tokenInfo.scope?.split(' ') || []
        });
      } catch (error) {
        console.error('Error getting token info:', error);
        return Response.json({
          success: false,
          error: 'Could not get token info',
          details: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
    
    return Response.json({
      success: false,
      error: 'No provider token available'
    });
    
  } catch (error) {
    console.error('Debug scopes error:', error);
    return Response.json({ 
      error: 'Debug failed', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
