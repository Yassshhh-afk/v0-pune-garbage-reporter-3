import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AdminDashboard } from "@/components/admin-dashboard"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { LogOut } from "lucide-react"

export default async function AdminPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  if (data.user.email !== "kondanayash@gmail.com") {
    redirect("/")
  }

  const { data: reports, error: reportsError } = await supabase
    .from("garbage_reports")
    .select("*")
    .order("created_at", { ascending: false })

  const { data: statusUpdates, error: statusError } = await supabase
    .from("status_updates")
    .select("*")
    .order("created_at", { ascending: false })

  if (reportsError) {
    console.error("[v0] Error fetching reports:", reportsError)
  }

  if (statusError) {
    console.error("[v0] Error fetching status updates:", statusError)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Manage all garbage reports, status updates, and communities insights
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">{data.user.email}</div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/auth/logout">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Link>
            </Button>
          </div>
        </div>
        <AdminDashboard reports={reports || []} statusUpdates={statusUpdates || []} />
      </div>
    </div>
  )
}
