export async function POST(request: Request) {
  try {
    const { latitude, longitude } = await request.json()

    const lat = Number.parseFloat(latitude)
    const lng = Number.parseFloat(longitude)

    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return Response.json({ error: "Invalid coordinates" }, { status: 400 })
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY
    if (!apiKey) {
      throw new Error("Google Maps API key not configured")
    }

    const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`)

    if (!response.ok) {
      throw new Error("Failed to fetch location details")
    }

    const data = await response.json()

    if (data.results && data.results.length > 0) {
      const firstResult = data.results[0]

      let locationName = ""
      for (const component of firstResult.address_components) {
        if (component.types.includes("locality") || component.types.includes("administrative_area_level_3")) {
          locationName = component.long_name
          break
        }
      }

      if (!locationName) {
        locationName = firstResult.formatted_address.split(",")[0]
      }

      return Response.json({
        locationName,
        address: firstResult.formatted_address,
      })
    }

    return Response.json({ error: "No results found" }, { status: 404 })
  } catch (error) {
    console.error("Geocoding error:", error)
    return Response.json({ error: "Geocoding failed" }, { status: 500 })
  }
}
