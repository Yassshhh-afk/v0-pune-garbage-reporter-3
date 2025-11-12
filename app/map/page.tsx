import { GarbageMap } from "@/components/garbage-map"
import { createClient } from "@/lib/supabase/server"

export default async function MapPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: reports, error } = await supabase
    .from("garbage_reports")
    .select("*")
    .order("created_at", { ascending: false })

  const { data: wards, error: wardsError } = await supabase.from("wards").select("*")

  if (error) {
    console.error("[v0] Error fetching reports:", error)
  }

  if (wardsError) {
    console.error("[v0] Error fetching wards:", wardsError)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Live Garbage Reports</h1>
          <p className="text-gray-600 max-w-2xl">
            Track ongoing garbage issues across Pune and Pimpri-Chinchwad. Click on any report to view details, contact
            the nearest ward office, and join the community in keeping our city clean. {reports?.length || 0} active
            reports.
          </p>
        </div>
        <GarbageMap reports={reports || []} wards={wards || []} userEmail={user?.email} />
      </div>
    </div>
  )
}
