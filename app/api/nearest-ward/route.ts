import { findNearestWard } from "@/lib/supabase/queries"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const latitude = Number.parseFloat(searchParams.get("latitude") || "")
    const longitude = Number.parseFloat(searchParams.get("longitude") || "")

    if (isNaN(latitude) || isNaN(longitude)) {
      return NextResponse.json({ error: "Invalid latitude or longitude" }, { status: 400 })
    }

    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      return NextResponse.json({ error: "Coordinates out of valid range" }, { status: 400 })
    }

    const nearestWard = await findNearestWard(latitude, longitude)

    if (!nearestWard) {
      return NextResponse.json({ error: "No wards found in database" }, { status: 404 })
    }

    return NextResponse.json(nearestWard)
  } catch (error) {
    console.error("[v0] Error finding nearest ward:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
