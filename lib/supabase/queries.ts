import { createServerClient } from "@/lib/supabase/server"

export interface Ward {
  id: string
  ward_name: string
  address: string
  phone: string | null
  email: string | null
  latitude: number
  longitude: number
}

// Calculate distance between two coordinates using Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export async function findNearestWard(latitude: number, longitude: number): Promise<Ward | null> {
  const supabase = await createServerClient()

  const { data: wards, error } = await supabase.from("wards").select("*")

  if (error || !wards) {
    console.error("Error fetching wards:", error)
    return null
  }

  // Find the nearest ward
  let nearestWard = wards[0]
  let minDistance = calculateDistance(latitude, longitude, wards[0].latitude, wards[0].longitude)

  for (const ward of wards) {
    const distance = calculateDistance(latitude, longitude, ward.latitude, ward.longitude)
    if (distance < minDistance) {
      minDistance = distance
      nearestWard = ward
    }
  }

  return nearestWard
}

export async function getAllWards(): Promise<Ward[]> {
  const supabase = await createServerClient()

  const { data: wards, error } = await supabase.from("wards").select("*")

  if (error) {
    console.error("Error fetching wards:", error)
    return []
  }

  return wards || []
}

export async function getReviewStats(reportId: string) {
  const supabase = await createServerClient()

  const { data: comments, error } = await supabase
    .from("comments")
    .select("rating")
    .eq("report_id", reportId)
    .not("rating", "is", null)

  if (error) {
    console.error("Error fetching review stats:", error)
    return { totalReviews: 0, averageRating: 0 }
  }

  if (!comments || comments.length === 0) {
    return { totalReviews: 0, averageRating: 0 }
  }

  const totalReviews = comments.length
  const averageRating = comments.reduce((sum, c) => sum + (c.rating || 0), 0) / totalReviews

  return { totalReviews, averageRating }
}
