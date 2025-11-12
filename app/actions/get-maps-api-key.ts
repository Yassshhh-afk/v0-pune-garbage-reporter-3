"use server"

export async function reverseGeocode(latitude: number, longitude: number) {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY
  if (!apiKey) {
    throw new Error("Google Maps API key not configured")
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`,
    )
    const data = await response.json()

    if (data.results && data.results.length > 0) {
      return data.results[0].formatted_address
    }
    return "Address not found"
  } catch (error) {
    console.error("[v0] Geocoding error:", error)
    return "Unable to fetch address"
  }
}
