"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type GarbageReport = {
  id: string
  location_name: string
  latitude: number
  longitude: number
  description: string
  severity: "low" | "medium" | "high"
  status: "pending" | "in-progress" | "resolved"
  photo_url?: string | null
  created_at: string
  updated_at: string
}

type StatusUpdate = {
  id: string
  report_id: string
  status_type: "clean" | "dirty" | "partially_clean"
  photo_url: string
  description?: string
  created_at: string
}

type AdminDashboardProps = {
  reports: GarbageReport[]
  statusUpdates: StatusUpdate[]
}

export function AdminDashboard({ reports: initialReports, statusUpdates: initialStatusUpdates }: AdminDashboardProps) {
  const router = useRouter()
  const [reports, setReports] = useState(initialReports)
  const [statusUpdates, setStatusUpdates] = useState(initialStatusUpdates)
  const [selectedReport, setSelectedReport] = useState<GarbageReport | null>(null)
  const [selectedStatusUpdate, setSelectedStatusUpdate] = useState<StatusUpdate | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterSeverity, setFilterSeverity] = useState<string>("all")
  const [showAddLocation, setShowAddLocation] = useState(false)
  const [newLocation, setNewLocation] = useState({
    locationName: "",
    latitude: "",
    longitude: "",
    description: "",
    severity: "medium",
  })

  const handleStatusUpdate = async (reportId: string, newStatus: string) => {
    setIsLoading(true)
    const supabase = createClient()

    try {
      const { error } = await supabase
        .from("garbage_reports")
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", reportId)

      if (error) throw error

      setReports((prev) =>
        prev.map((report) =>
          report.id === reportId
            ? { ...report, status: newStatus as any, updated_at: new Date().toISOString() }
            : report,
        ),
      )

      router.refresh()
    } catch (error) {
      console.error("[v0] Error updating status:", error)
      alert("Failed to update status")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (reportId: string) => {
    if (!confirm("Are you sure you want to delete this report?")) return

    setIsLoading(true)
    const supabase = createClient()

    try {
      const { error } = await supabase.from("garbage_reports").delete().eq("id", reportId)

      if (error) throw error

      setReports((prev) => prev.filter((report) => report.id !== reportId))
      setSelectedReport(null)
      router.refresh()
    } catch (error) {
      console.error("[v0] Error deleting report:", error)
      alert("Failed to delete report")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteStatusUpdate = async (statusUpdateId: string) => {
    if (!confirm("Are you sure you want to delete this status update?")) return

    setIsLoading(true)
    const supabase = createClient()

    try {
      const { error } = await supabase.from("status_updates").delete().eq("id", statusUpdateId)

      if (error) throw error

      setStatusUpdates((prev) => prev.filter((update) => update.id !== statusUpdateId))
      setSelectedStatusUpdate(null)
      router.refresh()
    } catch (error) {
      console.error("[v0] Error deleting status update:", error)
      alert("Failed to delete status update")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddLocation = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const lat = Number.parseFloat(newLocation.latitude)
      const lng = Number.parseFloat(newLocation.longitude)

      if (isNaN(lat) || isNaN(lng)) {
        throw new Error("Invalid coordinates")
      }

      const supabase = createClient()
      const { error } = await supabase.from("garbage_reports").insert({
        location_name: newLocation.locationName,
        latitude: lat,
        longitude: lng,
        description: newLocation.description,
        severity: newLocation.severity,
        status: "pending",
      })

      if (error) throw error

      router.refresh()
      setShowAddLocation(false)
      setNewLocation({
        locationName: "",
        latitude: "",
        longitude: "",
        description: "",
        severity: "medium",
      })
    } catch (error) {
      console.error("[v0] Error adding location:", error)
      alert("Failed to add location: " + (error instanceof Error ? error.message : "Unknown error"))
    } finally {
      setIsLoading(false)
    }
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
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "pending":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusUpdateColor = (statusType: string) => {
    switch (statusType) {
      case "clean":
        return "bg-green-100 text-green-800 border-green-200"
      case "partially_clean":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "dirty":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const filteredReports = reports.filter((report) => {
    const matchesSearch = report.location_name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || report.status === filterStatus
    const matchesSeverity = filterSeverity === "all" || report.severity === filterSeverity
    return matchesSearch && matchesStatus && matchesSeverity
  })

  const stats = {
    total: reports.length,
    pending: reports.filter((r) => r.status === "pending").length,
    inProgress: reports.filter((r) => r.status === "in-progress").length,
    resolved: reports.filter((r) => r.status === "resolved").length,
    highSeverity: reports.filter((r) => r.severity === "high").length,
    statusUpdates: statusUpdates.length,
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.inProgress}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.highSeverity}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Area Updates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.statusUpdates}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="reports" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="reports">Garbage Reports</TabsTrigger>
          <TabsTrigger value="updates">Area Status Updates</TabsTrigger>
        </TabsList>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-4 flex-1">
                  <Input
                    placeholder="Search by location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                  />
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterSeverity} onValueChange={setFilterSeverity}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Filter by severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Severities</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={() => setShowAddLocation(true)}>+ Add Location</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Location</TableHead>
                      <TableHead>Coordinates</TableHead>
                      <TableHead>Severity</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReports.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          No reports found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredReports.map((report) => (
                        <TableRow key={report.id}>
                          <TableCell className="font-medium">
                            <button onClick={() => setSelectedReport(report)} className="hover:underline text-left">
                              {report.location_name}
                            </button>
                          </TableCell>
                          <TableCell className="text-sm font-mono">
                            {report.latitude.toFixed(4)}, {report.longitude.toFixed(4)}
                          </TableCell>
                          <TableCell>
                            <Badge variant={getSeverityColor(report.severity)}>{report.severity.toUpperCase()}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(report.status)}>
                              {report.status.replace("-", " ").toUpperCase()}
                            </Badge>
                          </TableCell>
                          <TableCell>{new Date(report.created_at).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Select
                                value={report.status}
                                onValueChange={(value) => handleStatusUpdate(report.id, value)}
                                disabled={isLoading}
                              >
                                <SelectTrigger className="w-[140px]">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">Pending</SelectItem>
                                  <SelectItem value="in-progress">In Progress</SelectItem>
                                  <SelectItem value="resolved">Resolved</SelectItem>
                                </SelectContent>
                              </Select>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDelete(report.id)}
                                disabled={isLoading}
                              >
                                Delete
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="updates" className="space-y-4">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Community Area Status Updates</h3>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Report Location</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Photo</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {statusUpdates.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          No status updates yet
                        </TableCell>
                      </TableRow>
                    ) : (
                      statusUpdates.map((update) => {
                        const report = reports.find((r) => r.id === update.report_id)
                        return (
                          <TableRow key={update.id}>
                            <TableCell className="font-medium">{report?.location_name || "Unknown"}</TableCell>
                            <TableCell>
                              <Badge className={getStatusUpdateColor(update.status_type)}>
                                {update.status_type.replace("_", " ").toUpperCase()}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <button
                                onClick={() => setSelectedStatusUpdate(update)}
                                className="text-primary hover:underline text-sm"
                              >
                                View Photo
                              </button>
                            </TableCell>
                            <TableCell>{new Date(update.created_at).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteStatusUpdate(update.id)}
                                disabled={isLoading}
                              >
                                Delete
                              </Button>
                            </TableCell>
                          </TableRow>
                        )
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={selectedReport !== null} onOpenChange={(open) => !open && setSelectedReport(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Report Details</DialogTitle>
            <DialogDescription>Complete information about this garbage report</DialogDescription>
          </DialogHeader>
          {selectedReport && (
            <div className="space-y-4">
              {selectedReport.photo_url && (
                <div className="relative w-full h-64 rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={selectedReport.photo_url || "/placeholder.svg"}
                    alt="Report"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Location</p>
                  <p className="font-medium">{selectedReport.location_name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Coordinates</p>
                  <p className="font-mono text-sm">
                    {selectedReport.latitude.toFixed(6)}, {selectedReport.longitude.toFixed(6)}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Severity</p>
                  <Badge variant={getSeverityColor(selectedReport.severity)}>
                    {selectedReport.severity.toUpperCase()}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <Badge className={getStatusColor(selectedReport.status)}>
                    {selectedReport.status.replace("-", " ").toUpperCase()}
                  </Badge>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Description</p>
                <p className="text-sm mt-1">{selectedReport.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Created At</p>
                  <p className="text-sm">{new Date(selectedReport.created_at).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                  <p className="text-sm">{new Date(selectedReport.updated_at).toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={selectedStatusUpdate !== null} onOpenChange={(open) => !open && setSelectedStatusUpdate(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Status Update Details</DialogTitle>
            <DialogDescription>Community area status update information</DialogDescription>
          </DialogHeader>
          {selectedStatusUpdate && (
            <div className="space-y-4">
              {selectedStatusUpdate.photo_url && (
                <div className="relative w-full h-64 rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={selectedStatusUpdate.photo_url || "/placeholder.svg"}
                    alt="Status Update"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <Badge className={getStatusUpdateColor(selectedStatusUpdate.status_type)}>
                  {selectedStatusUpdate.status_type.replace("_", " ").toUpperCase()}
                </Badge>
              </div>
              {selectedStatusUpdate.description && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Description</p>
                  <p className="text-sm mt-1">{selectedStatusUpdate.description}</p>
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-muted-foreground">Submitted At</p>
                <p className="text-sm">{new Date(selectedStatusUpdate.created_at).toLocaleString()}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showAddLocation} onOpenChange={setShowAddLocation}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Location</DialogTitle>
            <DialogDescription>Add a new garbage collection location to the system</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddLocation} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newLocationName">Location Name</Label>
              <Input
                id="newLocationName"
                placeholder="e.g., Koregaon Park Junction"
                value={newLocation.locationName}
                onChange={(e) => setNewLocation({ ...newLocation, locationName: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="newLatitude">Latitude</Label>
                <Input
                  id="newLatitude"
                  type="number"
                  step="any"
                  placeholder="18.5204"
                  value={newLocation.latitude}
                  onChange={(e) => setNewLocation({ ...newLocation, latitude: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newLongitude">Longitude</Label>
                <Input
                  id="newLongitude"
                  type="number"
                  step="any"
                  placeholder="73.8567"
                  value={newLocation.longitude}
                  onChange={(e) => setNewLocation({ ...newLocation, longitude: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="newSeverity">Initial Severity</Label>
              <Select
                value={newLocation.severity}
                onValueChange={(value) => setNewLocation({ ...newLocation, severity: value })}
              >
                <SelectTrigger id="newSeverity">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="newDescription">Description</Label>
              <Textarea
                id="newDescription"
                placeholder="Describe the location and issue..."
                rows={3}
                value={newLocation.description}
                onChange={(e) => setNewLocation({ ...newLocation, description: e.target.value })}
                required
              />
            </div>

            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={() => setShowAddLocation(false)} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Adding..." : "Add Location"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
