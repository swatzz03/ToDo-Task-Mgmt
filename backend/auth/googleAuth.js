// backend/auth/googleAuth.js
const { getDb } = require('../db/mongo');
const { setCookie } = require('../utils/cookie');
const https = require('https');
const querystring = require('querystring');

// Setup from .env
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI; // e.g., http://localhost:3000/auth/google/callback

function handleGoogleAuth(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (url.pathname === '/auth/google') {
    // Step 1: Redirect to Google's OAuth screen
    const authURL = `https://accounts.google.com/o/oauth2/v2/auth?${querystring.stringify({
      client_id: CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      response_type: 'code',
      scope: 'openid email profile',
      access_type: 'online'
    })}`;

    res.writeHead(302, { Location: authURL });
    res.end();
  }

  else if (url.pathname === '/auth/google/callback') {
    const code = url.searchParams.get('code');

    // Step 2: Exchange code for access_token
    const tokenData = querystring.stringify({
      code,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
      grant_type: 'authorization_code',
    });

    const tokenReq = https.request({
      hostname: 'oauth2.googleapis.com',
      path: '/token',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': tokenData.length,
      }
    }, tokenRes => {
      let data = '';
      tokenRes.on('data', chunk => data += chunk);
      tokenRes.on('end', async () => {
        const { access_token } = JSON.parse(data);

        // Step 3: Get user profile info
        https.get('https://www.googleapis.com/oauth2/v2/userinfo', {
          headers: { Authorization: `Bearer ${access_token}` }
        }, async profileRes => {
          let body = '';
          profileRes.on('data', chunk => body += chunk);
          profileRes.on('end', async () => {
            const profile = JSON.parse(body);
            const db = getDb();
            const users = db.collection('users');

            // Insert or update user
            const user = await users.findOneAndUpdate(
              { email: profile.email },
              { $set: { name: profile.name, picture: profile.picture } },
              { upsert: true, returnDocument: 'after' }
            );

            // Generate a session (basic string token)
            const sessionToken = `${profile.id}-${Date.now()}`;
            await db.collection('sessions').insertOne({
              token: sessionToken,
              userEmail: profile.email,
              createdAt: new Date()
            });

            // Set cookie
            setCookie(res, 'session_token', sessionToken, {
              httpOnly: true,
              path: '/',
              maxAge: 3600,
              sameSite: 'Lax'
            });

            // Redirect to frontend dashboard
            res.writeHead(302, { Location: '/' });
            res.end();
          });
        });
      });
    });

    tokenReq.write(tokenData);
    tokenReq.end();
  }
}

module.exports = { handleGoogleAuth };
