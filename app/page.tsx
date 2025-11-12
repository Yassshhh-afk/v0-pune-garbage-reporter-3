import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MapPin, AlertTriangle, Phone } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-background via-background to-blue-50/30 py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full border border-blue-200 mb-8">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-blue-600">Civic Engagement Platform</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
              Report Garbage.
              <br />
              <span className="text-blue-600">Get Results.</span>
            </h1>

            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              Empower your community. Report garbage locations directly to ward officials and track cleanup progress in
              real-time across Pune and Pimpri-Chinchwad.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                <Link href="/report" className="flex items-center">
                  <AlertTriangle className="mr-2 h-5 w-5" />
                  Report Now
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-2 font-semibold bg-transparent">
                <Link href="/map" className="flex items-center">
                  <MapPin className="mr-2 h-5 w-5" />
                  View Active Reports
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-16 pt-12 border-t border-border">
              <div>
                <div className="text-3xl font-bold text-blue-600">500+</div>
                <div className="text-sm text-muted-foreground">Active Reports</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600">18</div>
                <div className="text-sm text-muted-foreground">Ward Offices</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600">2.5k+</div>
                <div className="text-sm text-muted-foreground">Community Members</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Why Use Pune Garbage Reporter?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to make your city cleaner, one report at a time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Card 1 */}
          <div className="group p-8 rounded-xl bg-card border border-border hover:border-blue-300 hover:shadow-lg hover:shadow-blue-100 transition-all duration-300 cursor-pointer">
            <div className="bg-blue-100 w-14 h-14 rounded-lg flex items-center justify-center mb-6 group-hover:bg-blue-200 transition-colors">
              <AlertTriangle className="h-7 w-7 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-foreground">Instant Reporting</h3>
            <p className="text-muted-foreground leading-relaxed">
              Pin the exact location, upload photos, and add details. Our system automatically detects the nearest ward
              office and notifies them instantly.
            </p>
            <div className="mt-6 flex items-center text-blue-600 font-medium group-hover:gap-2 transition-all">
              Learn more <span className="ml-2">→</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="group p-8 rounded-xl bg-card border border-border hover:border-blue-300 hover:shadow-lg hover:shadow-blue-100 transition-all duration-300 cursor-pointer">
            <div className="bg-blue-100 w-14 h-14 rounded-lg flex items-center justify-center mb-6 group-hover:bg-blue-200 transition-colors">
              <MapPin className="h-7 w-7 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-foreground">Live Map Tracking</h3>
            <p className="text-muted-foreground leading-relaxed">
              See all reported garbage locations on an interactive map. Search by area and track cleanup progress with
              real-time updates from officials.
            </p>
            <div className="mt-6 flex items-center text-blue-600 font-medium group-hover:gap-2 transition-all">
              Explore map <span className="ml-2">→</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="group p-8 rounded-xl bg-card border border-border hover:border-blue-300 hover:shadow-lg hover:shadow-blue-100 transition-all duration-300 cursor-pointer">
            <div className="bg-blue-100 w-14 h-14 rounded-lg flex items-center justify-center mb-6 group-hover:bg-blue-200 transition-colors">
              <Phone className="h-7 w-7 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-foreground">Direct Contact</h3>
            <p className="text-muted-foreground leading-relaxed">
              Get instant access to ward office phone numbers and emails. Follow up on your reports or coordinate
              community cleanup efforts directly.
            </p>
            <div className="mt-6 flex items-center text-blue-600 font-medium group-hover:gap-2 transition-all">
              View contacts <span className="ml-2">→</span>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-blue-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground">Three simple steps to a cleaner city</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-full font-bold text-xl mb-6">
                1
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Report</h3>
              <p className="text-muted-foreground">Use our app to report garbage with location and photos</p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-full font-bold text-xl mb-6">
                2
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Notify</h3>
              <p className="text-muted-foreground">Ward officials are automatically notified with all details</p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-full font-bold text-xl mb-6">
                3
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Track</h3>
              <p className="text-muted-foreground">Monitor cleanup progress and celebrate community wins</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto text-center bg-gradient-to-br from-blue-50 to-blue-100 p-12 rounded-2xl border border-blue-200">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Ready to Make a Difference?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of citizens helping keep Pune clean. Every report counts.
          </p>
          <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold">
            <Link href="/report">Report Your First Issue</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
