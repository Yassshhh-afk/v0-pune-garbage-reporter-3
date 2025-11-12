import { ReportForm } from "@/components/report-form"

export default function ReportPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Report Garbage</h1>
          <p className="text-muted-foreground">Help keep Pune clean by reporting garbage locations</p>
        </div>
        <ReportForm />
      </div>
    </div>
  )
}
