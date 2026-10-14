export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({error:'Method not allowed'});
  const { text } = req.body;
  const ELEVEN_API_KEY = process.env.ELEVENLABS_API_KEY;
  const VOICE_ID = process.env.VOICE_ID || "j9j8zRoJNmP9YadxB7bZ";
  if (!ELEVEN_API_KEY) return res.status(500).json({error:'API key not set'});
  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
      method: 'POST',
      headers: { 'xi-api-key': ELEVEN_API_KEY, 'Content-Type': 'application/json', 'Accept': 'audio/mpeg' },
      body: JSON.stringify({ text: text, model_id: "eleven_multilingual_v2", voice_settings: { stability: 0.75, similarity_boost: 0.85, style: 0.3, use_speaker_boost: true } })
    });
    if (!response.ok) { const err = await response.text(); return res.status(500).json({error: err}); }
    const audioBuffer = await response.arrayBuffer();
    res.setHeader('Content-Type', 'audio/mpeg');
    res.send(Buffer.from(audioBuffer));
  } catch (e) { res.status(500).json({error: e.message}); }
}
