import type { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { GarbageMap } from "@/components/garbage-map"

interface PageProps {
  params: Promise<{
    reportId: string
  }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { reportId } = await params
  const supabase = await createClient()

  const { data: report } = await supabase.from("garbage_reports").select("*").eq("id", reportId).single()

  if (!report) {
    return {
      title: "Report Not Found",
      description: "This garbage report could not be found.",
    }
  }

  const title = `Garbage Report: ${report.address || "Unreported Area"}`
  const description = `Status: ${report.status}. ${report.description || "Help keep Pune clean by reporting garbage issues."}`
  const imageUrl = report.image_url || "/garbage-report.jpg"

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://pune-garbage-reporter.vercel.app/map/${reportId}`,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  }
}

export default async function ReportPage({ params }: PageProps) {
  const { reportId } = await params
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
        <GarbageMap reports={reports || []} wards={wards || []} userEmail={user?.email} selectedReportId={reportId} />
      </div>
    </div>
  )
}
