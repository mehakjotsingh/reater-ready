// Server-side proxy for Google Places Autocomplete (New).
// Keeps GOOGLE_MAPS_API_KEY secret, same pattern as the Anthropic route.
// If the key is missing, returns empty results so the input degrades to a plain text field.

const KEY = process.env.GOOGLE_MAPS_API_KEY

export async function POST(req) {
  try {
    if (!KEY) return Response.json({ suggestions: [], address: '' })
    const body = await req.json()
    const { action } = body

    if (action === 'autocomplete') {
      const { input, sessionToken } = body
      if (!input || input.length < 3) return Response.json({ suggestions: [] })
      const res = await fetch('https://places.googleapis.com/v1/places:autocomplete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Goog-Api-Key': KEY },
        body: JSON.stringify({
          input,
          sessionToken,
          includedRegionCodes: ['us'],
        }),
      })
      const data = await res.json()
      const suggestions = (data.suggestions || [])
        .filter(s => s.placePrediction)
        .map(s => ({
          placeId: s.placePrediction.placeId,
          text: s.placePrediction.text?.text || '',
        }))
      return Response.json({ suggestions })
    }

    if (action === 'details') {
      const { placeId, sessionToken } = body
      if (!placeId) return Response.json({ address: '' })
      const url = `https://places.googleapis.com/v1/places/${placeId}?sessionToken=${encodeURIComponent(sessionToken || '')}`
      const res = await fetch(url, {
        headers: { 'X-Goog-Api-Key': KEY, 'X-Goog-FieldMask': 'formattedAddress' },
      })
      const data = await res.json()
      return Response.json({ address: data.formattedAddress || '' })
    }

    return Response.json({ error: 'unknown action' }, { status: 400 })
  } catch (e) {
    return Response.json({ suggestions: [], address: '', error: e.message }, { status: 200 })
  }
}
