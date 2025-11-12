"use client"

import { Card } from "@/components/ui/card"
import { MapPin, Phone, Mail, AlertCircle } from "lucide-react"
import { useEffect, useState } from "react"

export interface Ward {
  id: string
  ward_name: string
  address: string
  phone: string | null
  email: string | null
  latitude: number
  longitude: number
}

interface WardInfoProps {
  latitude: number | null
  longitude: number | null
  loading?: boolean
}

export function WardInfo({ latitude, longitude, loading = false }: WardInfoProps) {
  const [ward, setWard] = useState<Ward | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!latitude || !longitude) {
      setWard(null)
      setError(null)
      return
    }

    const fetchNearestWard = async () => {
      setIsLoading(true)
      setError(null)
      try {
        console.log("[v0] Fetching nearest ward for:", { latitude, longitude })
        const response = await fetch(`/api/nearest-ward?latitude=${latitude}&longitude=${longitude}`)
        console.log("[v0] API response status:", response.status)

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.error || "Failed to fetch nearest ward")
        }
        const data = await response.json()
        console.log("[v0] Ward data received:", data)
        setWard(data)
        setError(null)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Error fetching ward information"
        console.error("[v0] Error fetching ward:", errorMessage)
        setError(errorMessage)
        setWard(null)
      } finally {
        setIsLoading(false)
      }
    }

    const timer = setTimeout(fetchNearestWard, 500)
    return () => clearTimeout(timer)
  }, [latitude, longitude])

  if (!latitude || !longitude) {
    return (
      <Card className="p-4 bg-muted/30 border-dashed">
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <MapPin className="h-4 w-4" />
          <p>Enter coordinates to see the nearest ward office</p>
        </div>
      </Card>
    )
  }

  if (isLoading || loading) {
    return (
      <Card className="p-4 bg-blue-50/50 border-blue-200">
        <div className="flex items-center gap-2">
          <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
          <p className="text-sm text-blue-700">Finding nearest ward office...</p>
        </div>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="p-4 border-amber-200 bg-amber-50">
        <div className="flex items-start gap-2">
          <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-amber-700">{error}</p>
        </div>
      </Card>
    )
  }

  if (!ward) {
    return (
      <Card className="p-4 border-dashed bg-muted/20">
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <AlertCircle className="h-4 w-4" />
          <p>No ward found at this location</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-4 bg-green-50 border-green-200">
      <div className="space-y-3">
        <div className="flex items-start gap-2">
          <MapPin className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-green-900">{ward.ward_name} Ward</h4>
            <p className="text-sm text-green-700 mt-1">{ward.address}</p>
          </div>
        </div>

        {ward.phone && (
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-green-600 flex-shrink-0" />
            <a
              href={`tel:${ward.phone.split(",")[0].trim()}`}
              className="text-sm text-green-700 hover:underline font-medium"
            >
              {ward.phone}
            </a>
          </div>
        )}

        {ward.email && (
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-green-600 flex-shrink-0" />
            <a href={`mailto:${ward.email}`} className="text-sm text-green-700 hover:underline font-medium">
              {ward.email}
            </a>
          </div>
        )}
      </div>
    </Card>
  )
}
