export default async function handler(req, res) {
  // CORS headers allow karne ke liye
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed, use POST' });
  }

  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'Video URL dena zaroori hai!' });
  }

  const apiKey = process.env.RAPIDAPI_KEY || '431413e0e5msh753c90ba93c972fp12f37djsn4a55a355a8a8';
  const apiHost = 'auto-download-all-in-one.p.rapidapi.com';

  try {
    // RapidAPI ko request bhejna
    const apiResponse = await fetch(`https://${apiHost}/v1/social/autodown?url=${encodeURIComponent(url)}`, {
      method: 'GET',
      headers: {
        'x-rapidapi-key': apiKey,
        'x-rapidapi-host': apiHost
      }
    });

    const data = await apiResponse.json();

    if (!apiResponse.ok) {
      return res.status(apiResponse.status).json({ error: data.message || 'API se data laane mein masla hua.' });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('Server Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
