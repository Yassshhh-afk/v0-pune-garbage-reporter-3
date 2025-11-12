"use client"

// ... existing imports ...
import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { GoogleMap } from "@/components/google-map"
import { CommentSection } from "@/components/comment-section"
import { StatusUpdateSection } from "@/components/status-update-section"
import { AuthModal } from "@/components/auth-modal"
import { AreaStatusModal } from "@/components/area-status-modal"
import { reverseGeocode } from "@/app/actions/get-maps-api-key"
import { createClient } from "@/lib/supabase/client"
import { Star, MessageCircle, MapPin, Phone, Search, X, TrendingUp } from "lucide-react"
import { Input } from "@/components/ui/input"
import { ShareReportButton } from "./share-report-button"
import { subscribeToReports, subscribeToComments, subscribeToStatusUpdates } from "@/lib/supabase/realtime"
import type { GarbageMapProps, GarbageReport, ReportStats, Ward } from "@/types" // Importing the missing types

// ... existing types ...

export function GarbageMap({ reports: initialReports, wards, userEmail, selectedReportId }: GarbageMapProps) {
  const [reports, setReports] = useState(initialReports)
  const [selectedReport, setSelectedReport] = useState<GarbageReport | null>(null)
  const [address, setAddress] = useState<string | null>(null)
  const [isLoadingAddress, setIsLoadingAddress] = useState(false)
  const [comments, setComments] = useState<any[]>([])
  const [statusUpdates, setStatusUpdates] = useState<any[]>([])
  const [isLoadingDetails, setIsLoadingDetails] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showAreaStatusModal, setShowAreaStatusModal] = useState(false)
  const [reportStats, setReportStats] = useState<Map<string, ReportStats>>(new Map())
  const [nearestWard, setNearestWard] = useState<Ward | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<GarbageReport[]>([])
  const [showSearchDropdown, setShowSearchDropdown] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    const unsubscribeReports = subscribeToReports((updatedReports) => {
      setReports(updatedReports)
      console.log("[v0] Map updated with latest reports")
    })

    return () => {
      unsubscribeReports()
    }
  }, [])

  useEffect(() => {
    if (!selectedReport) return

    const unsubscribeComments = subscribeToComments(selectedReport.id, (updatedComments) => {
      setComments(updatedComments)
      console.log("[v0] Comments updated in real-time")
    })

    const unsubscribeStatusUpdates = subscribeToStatusUpdates(selectedReport.id, (updatedStatus) => {
      setStatusUpdates(updatedStatus)
      console.log("[v0] Status updates received in real-time")
    })

    return () => {
      unsubscribeComments()
      unsubscribeStatusUpdates()
    }
  }, [selectedReport])

  useEffect(() => {
    if (selectedReportId && initialReports.length > 0) {
      const reportToSelect = initialReports.find((r) => r.id === selectedReportId)
      if (reportToSelect) {
        setSelectedReport(reportToSelect)
      }
    }
  }, [selectedReportId, initialReports])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query.trim() === "") {
      setSearchResults([])
      setShowSearchDropdown(false)
      return
    }

    const filtered = reports.filter((report) => {
      const matchLocation = report.location_name.toLowerCase().includes(query.toLowerCase())
      const matchDescription = report.description.toLowerCase().includes(query.toLowerCase())
      return matchLocation || matchDescription
    })

    setSearchResults(filtered)
    setShowSearchDropdown(true)
  }

  const handleSelectSearchResult = (report: GarbageReport) => {
    setSelectedReport(report)
    setSearchQuery("")
    setSearchResults([])
    setShowSearchDropdown(false)
  }

  const handleStatsUpdate = (stats: ReportStats) => {
    if (selectedReport) {
      const newStats = new Map(reportStats)
      newStats.set(selectedReport.id, stats)
      setReportStats(newStats)
    }
  }

  useEffect(() => {
    if (selectedReport) {
      loadReportDetails()
    }
  }, [selectedReport])

  const loadReportDetails = async () => {
    if (!selectedReport) return

    try {
      setIsLoadingAddress(true)
      setIsLoadingDetails(true)

      const addr = await reverseGeocode(selectedReport.latitude, selectedReport.longitude)
      setAddress(addr)

      const nearest = findNearestWard(selectedReport.latitude, selectedReport.longitude)
      setNearestWard(nearest)

      const { data: commentsData } = await supabase
        .from("comments")
        .select("*")
        .eq("report_id", selectedReport.id)
        .order("created_at", { ascending: false })

      setComments(commentsData || [])

      const { data: statusData } = await supabase
        .from("status_updates")
        .select("*")
        .eq("report_id", selectedReport.id)
        .order("created_at", { ascending: false })

      setStatusUpdates(statusData || [])
    } catch (error) {
      console.error("[v0] Error loading report details:", error)
    } finally {
      setIsLoadingAddress(false)
      setIsLoadingDetails(false)
    }
  }

  const findNearestWard = (lat: number, lng: number): Ward | null => {
    if (wards.length === 0) return null

    let nearest = wards[0]
    let minDistance = calculateDistance(lat, lng, nearest.latitude, nearest.longitude)

    for (let i = 1; i < wards.length; i++) {
      const distance = calculateDistance(lat, lng, wards[i].latitude, wards[i].longitude)
      if (distance < minDistance) {
        minDistance = distance
        nearest = wards[i]
      }
    }

    return nearest
  }

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLng = ((lng2 - lng1) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
      default:
        return "secondary"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved":
        return "bg-green-100 text-green-800 border-green-200"
      case "in-progress":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "pending":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <>
      <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6">
        {/* Map Section */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <Card className="overflow-hidden h-[500px] lg:h-[700px] border border-gray-200 shadow-sm">
            <GoogleMap reports={reports} wards={wards} onMarkerClick={setSelectedReport} />
          </Card>
        </div>

        {/* ... existing sidebar code continues (search, statistics, legend, etc.) ... */}
        <div className="flex flex-col gap-4">
          {/* Search Box */}
          <div className="relative">
            <Card className="p-3 border border-gray-200 shadow-sm">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search reports..."
                  className="pl-10 pr-8 h-9 text-sm border-gray-200"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  onFocus={() => searchResults.length > 0 && setShowSearchDropdown(true)}
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery("")
                      setSearchResults([])
                      setShowSearchDropdown(false)
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {showSearchDropdown && searchResults.length > 0 && (
                <div className="mt-2 max-h-60 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg">
                  {searchResults.map((report) => (
                    <button
                      key={report.id}
                      onClick={() => handleSelectSearchResult(report)}
                      className="w-full text-left p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
                    >
                      <p className="font-medium text-gray-900 text-sm">{report.location_name}</p>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-1">{report.description}</p>
                    </button>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Statistics Card */}
          {!selectedReport && (
            <Card className="p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold text-gray-900">Overview</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Reports</span>
                  <span className="font-bold text-gray-900">{reports.length}</span>
                </div>
                <div className="flex justify-between text-sm border-t border-gray-200 pt-2">
                  <span className="text-gray-600">Pending</span>
                  <span className="font-bold text-red-600">{reports.filter((r) => r.status === "pending").length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">In Progress</span>
                  <span className="font-bold text-blue-600">
                    {reports.filter((r) => r.status === "in-progress").length}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Resolved</span>
                  <span className="font-bold text-green-600">
                    {reports.filter((r) => r.status === "resolved").length}
                  </span>
                </div>
              </div>
            </Card>
          )}

          {/* Legend Card */}
          <Card className="p-4 border border-gray-200 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">Legend</h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-semibold text-gray-600 uppercase mb-2">Severity</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="text-sm text-gray-700">High</span>
                    <span className="ml-auto text-xs font-medium text-gray-500">
                      {reports.filter((r) => r.severity === "high").length}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <span className="text-sm text-gray-700">Medium</span>
                    <span className="ml-auto text-xs font-medium text-gray-500">
                      {reports.filter((r) => r.severity === "medium").length}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="text-sm text-gray-700">Low</span>
                    <span className="ml-auto text-xs font-medium text-gray-500">
                      {reports.filter((r) => r.severity === "low").length}
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-3">
                <h4 className="text-xs font-semibold text-gray-600 uppercase mb-2">Ward Offices</h4>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="text-sm text-gray-700">Ward Office</span>
                  <span className="ml-auto text-xs font-medium text-gray-500">{wards.length}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Nearest Ward Info */}
          {selectedReport && nearestWard && (
            <Card className="p-4 border border-blue-200 bg-blue-50 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="h-4 w-4 text-blue-600" />
                <h3 className="font-semibold text-gray-900 text-sm">Nearest Ward</h3>
              </div>
              <div className="space-y-2">
                <div>
                  <p className="text-xs text-gray-600">Office Name</p>
                  <p className="font-medium text-gray-900 text-sm mt-1">{nearestWard.ward_name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Address</p>
                  <p className="text-xs text-gray-700 mt-1">{isLoadingAddress ? "Loading..." : address || "N/A"}</p>
                </div>
                {nearestWard.phone && (
                  <a
                    href={`tel:${nearestWard.phone}`}
                    className="flex items-center gap-2 pt-2 border-t border-blue-200 text-blue-600 hover:text-blue-700 text-xs font-medium"
                  >
                    <Phone className="h-3 w-3" />
                    {nearestWard.phone}
                  </a>
                )}
              </div>
            </Card>
          )}

          {/* Selected Report Details */}
          {selectedReport && (
            <>
              <Card className="p-4 border border-gray-200 shadow-sm max-h-96 overflow-y-auto">
                <h3 className="font-semibold text-gray-900 text-sm mb-3">Report Details</h3>
                <div className="space-y-3">
                  {selectedReport.photo_url && (
                    <img
                      src={selectedReport.photo_url || "/placeholder.svg"}
                      alt="Report"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  )}
                  <div>
                    <p className="text-xs text-gray-600">Location</p>
                    <p className="font-medium text-gray-900 text-sm mt-1">{selectedReport.location_name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Address</p>
                    <p className="text-xs text-gray-700 mt-1">{isLoadingAddress ? "Loading..." : address || "N/A"}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-xs text-gray-600">Severity</p>
                      <Badge variant={getSeverityColor(selectedReport.severity)} className="mt-1 text-xs">
                        {selectedReport.severity.toUpperCase()}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Status</p>
                      <Badge className={`${getStatusColor(selectedReport.status)} mt-1 text-xs`}>
                        {selectedReport.status.replace("-", " ").toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < Math.round(reportStats.get(selectedReport.id)?.averageRating || 0)
                                  ? "fill-yellow-500 text-yellow-500"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="ml-2 font-semibold text-gray-900">
                          {(reportStats.get(selectedReport.id)?.averageRating || 0).toFixed(1)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600">
                        <MessageCircle className="h-4 w-4" />
                        <span className="text-sm">{reportStats.get(selectedReport.id)?.totalReviews || 0} reviews</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Description</p>
                    <p className="text-xs text-gray-700 mt-1 line-clamp-3">{selectedReport.description}</p>
                  </div>
                </div>
              </Card>

              <ShareReportButton
                reportId={selectedReport.id}
                locationName={selectedReport.location_name}
                description={selectedReport.description}
                status={selectedReport.status}
                rating={reportStats.get(selectedReport.id)?.averageRating || 0}
                totalReviews={reportStats.get(selectedReport.id)?.totalReviews || 0}
              />

              <Button
                onClick={() => {
                  if (!userEmail) {
                    setShowAuthModal(true)
                  } else {
                    setShowAreaStatusModal(true)
                  }
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm"
              >
                <MapPin className="h-4 w-4 mr-2" />
                Report Update
              </Button>

              <Card className="p-4 border border-gray-200 shadow-sm">
                <CommentSection
                  reportId={selectedReport.id}
                  userEmail={userEmail}
                  onAuthRequired={() => setShowAuthModal(true)}
                  onStatsUpdate={handleStatsUpdate}
                />
              </Card>

              <Card className="p-4 border border-gray-200 shadow-sm">
                <StatusUpdateSection
                  reportId={selectedReport.id}
                  userEmail={userEmail}
                  statusUpdates={statusUpdates}
                  onAuthRequired={() => setShowAuthModal(true)}
                />
              </Card>
            </>
          )}
        </div>
      </div>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} mode="login" />

      {selectedReport && (
        <AreaStatusModal
          isOpen={showAreaStatusModal}
          onClose={() => setShowAreaStatusModal(false)}
          reportId={selectedReport.id}
          userEmail={userEmail}
          onSuccess={loadReportDetails}
        />
      )}
    </>
  )
}
