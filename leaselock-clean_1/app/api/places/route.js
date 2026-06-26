// Server-side proxy for Geoapify Address Autocomplete.
// Edge runtime: minimal cold start, runs close to the user, key stays server-side.
export const runtime = 'edge'

const KEY = process.env.GEOAPIFY_API_KEY

export async function POST(req) {
  try {
    if (!KEY) return Response.json({ suggestions: [] })
    const { input } = await req.json()
    if (!input || input.trim().length < 3) return Response.json({ suggestions: [] })

    const url = 'https://api.geoapify.com/v1/geocode/autocomplete'
      + `?text=${encodeURIComponent(input)}`
      + '&format=json&filter=countrycode:us&limit=5'
      + `&apiKey=${KEY}`

    const res = await fetch(url)
    const data = await res.json()
    const suggestions = (data.results || []).map(r => ({
      placeId: r.place_id,
      text: r.formatted,
    }))
    return Response.json({ suggestions })
  } catch (e) {
    return Response.json({ suggestions: [], error: e.message }, { status: 200 })
  }
}
