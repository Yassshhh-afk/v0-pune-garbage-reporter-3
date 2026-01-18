import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MapPin, AlertTriangle, Phone, ArrowRight, CheckCircle2, Users, Clock, Star, Share2, Zap, Shield } from "lucide-react"
import { TestimonialCarousel } from "@/components/testimonial-carousel"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg text-foreground">Pune Garbage Reporter</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <Link href="/map" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Map
              </Link>
              <Link href="/report" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Report
              </Link>
              <Link href="/admin" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Admin
              </Link>
            </div>
            <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
              <Link href="/report">Get Started</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-44 md:pb-32 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-100 rounded-full blur-3xl opacity-60" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-60" />
        </div>

        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            {/* Badge */}
            <div className="flex justify-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full border border-blue-200">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-blue-700">Live Platform - 500+ Active Reports</span>
              </div>
            </div>

            {/* Main Heading */}
            <h1 className="text-center text-5xl md:text-7xl lg:text-8xl font-bold text-foreground mb-8 leading-[1.1] tracking-tight">
              The complete
              <br />
              platform to
              <br />
              <span className="text-blue-600">clean Pune.</span>
            </h1>

            {/* Subheading */}
            <p className="text-center text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
              Report garbage locations directly to ward officials and track cleanup progress in real-time. 
              Join thousands making Pune cleaner.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold h-14 px-8 text-lg rounded-xl">
                <Link href="/report" className="flex items-center gap-2">
                  Report an Issue
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-2 border-border font-semibold h-14 px-8 text-lg rounded-xl bg-background hover:bg-muted">
                <Link href="/map" className="flex items-center gap-2">
                  Explore the Map
                </Link>
              </Button>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border rounded-2xl overflow-hidden border border-border">
              <div className="bg-background p-6 md:p-8 text-center">
                <div className="text-3xl md:text-4xl font-bold text-foreground mb-1">500+</div>
                <div className="text-sm text-muted-foreground">Active Reports</div>
              </div>
              <div className="bg-background p-6 md:p-8 text-center">
                <div className="text-3xl md:text-4xl font-bold text-foreground mb-1">18</div>
                <div className="text-sm text-muted-foreground">Ward Offices</div>
              </div>
              <div className="bg-background p-6 md:p-8 text-center">
                <div className="text-3xl md:text-4xl font-bold text-foreground mb-1">2.5k+</div>
                <div className="text-sm text-muted-foreground">Community Users</div>
              </div>
              <div className="bg-background p-6 md:p-8 text-center">
                <div className="text-3xl md:text-4xl font-bold text-foreground mb-1">85%</div>
                <div className="text-sm text-muted-foreground">Resolution Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 md:py-32 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
              Everything you need to keep your city clean
            </h2>
            <p className="text-lg text-muted-foreground">
              Powerful features designed for citizens and municipal officials alike
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Feature 1 */}
            <div className="group p-8 rounded-2xl bg-background border border-border hover:border-blue-300 hover:shadow-xl hover:shadow-blue-100/50 transition-all duration-300">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:scale-110 transition-all duration-300">
                <MapPin className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Precise Location Pinning</h3>
              <p className="text-muted-foreground leading-relaxed">
                Drop a pin on Google Maps to mark exact garbage locations. Our system auto-detects the nearest ward office.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group p-8 rounded-2xl bg-background border border-border hover:border-blue-300 hover:shadow-xl hover:shadow-blue-100/50 transition-all duration-300">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:scale-110 transition-all duration-300">
                <Zap className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Real-time Updates</h3>
              <p className="text-muted-foreground leading-relaxed">
                WebSocket-powered live updates. See new reports and status changes instantly without refreshing.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group p-8 rounded-2xl bg-background border border-border hover:border-blue-300 hover:shadow-xl hover:shadow-blue-100/50 transition-all duration-300">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:scale-110 transition-all duration-300">
                <Star className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Community Ratings</h3>
              <p className="text-muted-foreground leading-relaxed">
                Rate cleanup efforts and leave reviews. Help other citizens identify problem areas and celebrate wins.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group p-8 rounded-2xl bg-background border border-border hover:border-blue-300 hover:shadow-xl hover:shadow-blue-100/50 transition-all duration-300">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:scale-110 transition-all duration-300">
                <Share2 className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Social Sharing</h3>
              <p className="text-muted-foreground leading-relaxed">
                Share reports on WhatsApp and Twitter with rich previews. Amplify your voice and drive faster action.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="group p-8 rounded-2xl bg-background border border-border hover:border-blue-300 hover:shadow-xl hover:shadow-blue-100/50 transition-all duration-300">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:scale-110 transition-all duration-300">
                <Phone className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Ward Office Directory</h3>
              <p className="text-muted-foreground leading-relaxed">
                Access phone numbers and addresses for all 18 ward offices. Direct communication when you need it.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="group p-8 rounded-2xl bg-background border border-border hover:border-blue-300 hover:shadow-xl hover:shadow-blue-100/50 transition-all duration-300">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:scale-110 transition-all duration-300">
                <Shield className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Admin Dashboard</h3>
              <p className="text-muted-foreground leading-relaxed">
                Municipal officials get a dedicated dashboard to manage reports, update statuses, and track performance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
              How it works
            </h2>
            <p className="text-lg text-muted-foreground">
              Three simple steps to make your neighborhood cleaner
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {/* Connecting Line (desktop only) */}
              <div className="hidden md:block absolute top-16 left-1/6 right-1/6 h-0.5 bg-border" />

              {/* Step 1 */}
              <div className="relative text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-2xl font-bold text-xl mb-6 relative z-10">
                  1
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Report</h3>
                <p className="text-muted-foreground">
                  Pin the location on the map, upload a photo, and describe the issue. Takes less than 30 seconds.
                </p>
              </div>

              {/* Step 2 */}
              <div className="relative text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-2xl font-bold text-xl mb-6 relative z-10">
                  2
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Notify</h3>
                <p className="text-muted-foreground">
                  Your report is automatically sent to the nearest ward office with all details and location data.
                </p>
              </div>

              {/* Step 3 */}
              <div className="relative text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-2xl font-bold text-xl mb-6 relative z-10">
                  3
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Track</h3>
                <p className="text-muted-foreground">
                  Monitor cleanup progress with real-time status updates. Rate the cleanup and leave feedback.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials / Social Proof */}
      <section className="py-20 md:py-32 bg-blue-600">
        <div className="container mx-auto px-4">
          <TestimonialCarousel />
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="relative rounded-3xl bg-gradient-to-br from-blue-50 via-background to-blue-50 p-12 md:p-16 border border-blue-100 overflow-hidden">
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2" />
              
              <div className="relative z-10 text-center">
                <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
                  Ready to make a difference?
                </h2>
                <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                  Join thousands of citizens who are actively making Pune cleaner. Your voice matters.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold h-14 px-8 text-lg rounded-xl">
                    <Link href="/report" className="flex items-center gap-2">
                      Report Your First Issue
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="border-2 border-border font-semibold h-14 px-8 text-lg rounded-xl bg-background hover:bg-muted">
                    <Link href="/map">
                      View Live Map
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg text-foreground">Pune Garbage Reporter</span>
            </div>
            <div className="flex items-center gap-8">
              <Link href="/map" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Map
              </Link>
              <Link href="/report" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Report
              </Link>
              <Link href="/admin" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Admin
              </Link>
            </div>
            <div className="text-sm text-muted-foreground">
              Built for Pune and Pimpri-Chinchwad
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
