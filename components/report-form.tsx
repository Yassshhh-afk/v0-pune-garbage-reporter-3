"use client"

import type React from "react"
import { compressImage } from "@/lib/utils/image-compressor"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MapPin, AlertCircle, Loader2, Map as MapX } from "lucide-react"
import { WardInfo } from "./ward-info"
import { isValidServiceArea, getServiceAreaError } from "@/lib/utils/location-validator"

export function ReportForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [isGeocodingLoading, setIsGeocodingLoading] = useState(false)
  const [locationError, setLocationError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    locationName: "",
    address: "",
    latitude: "",
    longitude: "",
    description: "",
    severity: "",
    photoBase64: "",
  })

  useEffect(() => {
    const fetchLocationDetails = async () => {
      const lat = Number.parseFloat(formData.latitude)
      const lng = Number.parseFloat(formData.longitude)

      if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        return
      }

      const areaError = getServiceAreaError(lat, lng)
      setLocationError(areaError)

      if (areaError) {
        setIsGeocodingLoading(false)
        return
      }

      setIsGeocodingLoading(true)
      try {
        const response = await fetch("/api/geocode", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ latitude: lat, longitude: lng }),
        })

        if (!response.ok) throw new Error("Failed to fetch location details")

        const data = await response.json()

        setFormData((prev) => ({
          ...prev,
          locationName: data.locationName,
          address: data.address,
        }))
      } catch (err) {
        console.error("Geocoding error:", err)
      } finally {
        setIsGeocodingLoading(false)
      }
    }

    const timer = setTimeout(() => {
      if (formData.latitude && formData.longitude) {
        fetchLocationDetails()
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [formData.latitude, formData.longitude])

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      setError("Photo must be less than 5MB")
      return
    }

    const reader = new FileReader()
    reader.onload = async (event) => {
      const base64String = event.target?.result as string
      setIsLoading(true)

      try {
        const compressedBase64 = await compressImage(base64String)
        setFormData({ ...formData, photoBase64: compressedBase64 })
        setPhotoPreview(compressedBase64)
        setError(null)
      } catch (err) {
        setError("Failed to process image")
        console.error("[v0] Image processing error:", err)
      } finally {
        setIsLoading(false)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const lat = Number.parseFloat(formData.latitude)
      const lng = Number.parseFloat(formData.longitude)

      if (isNaN(lat) || isNaN(lng)) {
        throw new Error("Invalid coordinates")
      }

      if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        throw new Error("Coordinates out of valid range")
      }

      if (!isValidServiceArea(lat, lng)) {
        throw new Error(
          "This location is outside Pune and Pimpri-Chinchwad. This app only tracks garbage in these areas.",
        )
      }

      const supabase = createClient()

      const { error: insertError } = await supabase.from("garbage_reports").insert({
        location_name: formData.locationName,
        address: formData.address,
        latitude: lat,
        longitude: lng,
        description: formData.description,
        severity: formData.severity,
        status: "pending",
        photo_url: formData.photoBase64 || null,
      })

      if (insertError) throw insertError

      setSuccess(true)

      setFormData({
        locationName: "",
        address: "",
        latitude: "",
        longitude: "",
        description: "",
        severity: "",
        photoBase64: "",
      })
      setPhotoPreview(null)

      setTimeout(() => {
        router.push("/map")
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit report")
    } finally {
      setIsLoading(false)
    }
  }

  const getCurrentLocation = () => {
    if ("geolocation" in navigator) {
      setIsLoading(true)
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            latitude: position.coords.latitude.toFixed(6),
            longitude: position.coords.longitude.toFixed(6),
          })
          setIsLoading(false)
        },
        (error) => {
          setError("Failed to get current location: " + error.message)
          setIsLoading(false)
        },
      )
    } else {
      setError("Geolocation is not supported by your browser")
    }
  }

  if (success) {
    return (
      <Alert className="bg-green-50 border-green-200">
        <AlertCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          Report submitted successfully! Redirecting to map...
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>Submit a New Report</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="latitude">Latitude</Label>
              <Input
                id="latitude"
                type="number"
                step="any"
                placeholder="18.5204"
                value={formData.latitude}
                onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="longitude">Longitude</Label>
              <Input
                id="longitude"
                type="number"
                step="any"
                placeholder="73.8567"
                value={formData.longitude}
                onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                required
              />
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={getCurrentLocation}
            className="w-full md:w-auto bg-transparent"
            disabled={isLoading}
          >
            <MapPin className="mr-2 h-4 w-4" />
            Use Current Location
          </Button>

          {locationError && (
            <Alert className="border-red-200 bg-red-50">
              <MapX className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700">{locationError}</AlertDescription>
            </Alert>
          )}

          <WardInfo
            latitude={formData.latitude ? Number.parseFloat(formData.latitude) : null}
            longitude={formData.longitude ? Number.parseFloat(formData.longitude) : null}
            loading={isGeocodingLoading}
          />

          <div className="space-y-2">
            <Label htmlFor="locationName">
              Location Name
              {isGeocodingLoading && <Loader2 className="inline ml-2 h-4 w-4 animate-spin" />}
            </Label>
            <Input
              id="locationName"
              placeholder="e.g., Koregaon Park, Shivajinagar"
              value={formData.locationName}
              onChange={(e) => setFormData({ ...formData, locationName: e.target.value })}
              required
            />
            {isGeocodingLoading && <p className="text-xs text-muted-foreground">Auto-fetching location details...</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Full Address</Label>
            <Textarea
              id="address"
              placeholder="e.g., 123 Main Street, Pune, Maharashtra..."
              rows={2}
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
            <p className="text-xs text-muted-foreground">Auto-suggested from coordinates, editable</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="severity">Severity Level</Label>
            <Select
              value={formData.severity}
              onValueChange={(value) => setFormData({ ...formData, severity: value })}
              required
            >
              <SelectTrigger id="severity">
                <SelectValue placeholder="Select severity level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low - Minor litter</SelectItem>
                <SelectItem value="medium">Medium - Moderate accumulation</SelectItem>
                <SelectItem value="high">High - Serious health hazard</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the garbage issue in detail..."
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="photo">Photo (Optional)</Label>
            <div className="flex gap-2">
              <Input id="photo" type="file" accept="image/*" onChange={handlePhotoChange} disabled={isLoading} />
            </div>
            {photoPreview && (
              <div className="mt-2 relative w-32 h-32 rounded-lg overflow-hidden border border-gray-200">
                <img src={photoPreview || "/placeholder.svg"} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
            <p className="text-xs text-muted-foreground">Max file size: 5MB</p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full" disabled={isLoading || !!locationError}>
            {isLoading ? "Submitting..." : "Submit Report"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
