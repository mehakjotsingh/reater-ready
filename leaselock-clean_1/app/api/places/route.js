// Server-side proxy for Geoapify Address Autocomplete.
// Edge runtime: minimal cold start, runs close to the user, key stays server-side.
export const runtime = 'edge'

const KEY = process.env.GEOAPIFY_API_KEY

export async function GET(req) {
  try {
    if (!KEY) return Response.json({ suggestions: [] })
    const input = (new URL(req.url).searchParams.get('q') || '').trim()
    if (input.length < 3) return Response.json({ suggestions: [] })

    const url = 'https://api.geoapify.com/v1/geocode/autocomplete'
      + `?text=${encodeURIComponent(input)}`
      + '&format=json&filter=countrycode:us&limit=6'
      + `&apiKey=${KEY}`

    const res = await fetch(url)
    const data = await res.json()
    const suggestions = (data.results || []).map(r => ({
      placeId: r.place_id,
      text: r.formatted,
    }))
    // Cache identical lookups at Vercel's edge so repeat prefixes skip the Geoapify hop.
    return Response.json({ suggestions }, {
      headers: { 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=86400' },
    })
  } catch (e) {
    return Response.json({ suggestions: [], error: e.message }, { status: 200 })
  }
}
