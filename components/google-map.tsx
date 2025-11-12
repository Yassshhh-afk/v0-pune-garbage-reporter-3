"use client"

import { useEffect, useRef, useState } from "react"
import type { google } from "google-maps"

type GarbageReport = {
  id: string
  location_name: string
  latitude: number
  longitude: number
  description: string
  severity: "low" | "medium" | "high"
  status: "pending" | "in-progress" | "resolved"
  photo_url?: string | null
}

type Ward = {
  id: string
  ward_name: string
  address: string
  phone?: string
  email?: string
  latitude: number
  longitude: number
}

type GoogleMapProps = {
  reports: GarbageReport[]
  wards: Ward[]
  onMarkerClick: (report: GarbageReport) => void
  showWards?: boolean
}

export function GoogleMap({ reports, wards, onMarkerClick, showWards = false }: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<google.maps.Map | null>(null)
  const markersRef = useRef<google.maps.Marker[]>([])
  const wardMarkersRef = useRef<google.maps.Marker[]>([])
  const [wardVisibility, setWardVisibility] = useState(showWards)

  useEffect(() => {
    const loadGoogleMaps = async () => {
      if (typeof window.google !== "undefined") {
        initMap()
        return
      }

      try {
        const response = await fetch("/api/maps/key")
        const { apiKey } = await response.json()

        const script = document.createElement("script")
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`
        script.async = true
        script.defer = true
        script.onload = () => initMap()
        document.head.appendChild(script)
      } catch (error) {
        console.error("[v0] Failed to load Google Maps:", error)
      }
    }

    const initMap = () => {
      if (!mapRef.current) return

      // Center on Pune
      const puneCenter = { lat: 18.5204, lng: 73.8567 }

      const map = new window.google.maps.Map(mapRef.current, {
        zoom: 12,
        center: puneCenter,
        mapTypeControl: true,
        streetViewControl: false,
        fullscreenControl: true,
      })

      mapInstanceRef.current = map

      // Clear existing markers
      markersRef.current.forEach((marker) => marker.setMap(null))
      markersRef.current = []

      wardMarkersRef.current.forEach((marker) => marker.setMap(null))
      wardMarkersRef.current = []

      // Add markers for each report
      reports.forEach((report) => {
        const markerColor = getMarkerColor(report.severity)

        const marker = new window.google.maps.Marker({
          position: {
            lat: Number(report.latitude),
            lng: Number(report.longitude),
          },
          map,
          title: report.location_name,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: markerColor,
            fillOpacity: 0.8,
            strokeColor: "#ffffff",
            strokeWeight: 2,
          },
        })

        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 8px; max-width: 200px;">
              <h3 style="margin: 0 0 8px 0; font-weight: bold; font-size: 14px;">${report.location_name}</h3>
              <p style="margin: 4px 0; font-size: 12px;"><strong>Severity:</strong> ${report.severity.toUpperCase()}</p>
              <p style="margin: 4px 0; font-size: 12px;"><strong>Status:</strong> ${report.status.replace("-", " ").toUpperCase()}</p>
              ${report.photo_url ? `<div style="margin: 8px 0; max-height: 100px; overflow: hidden;"><img src="${report.photo_url}" style="max-width: 100%; border-radius: 4px;" alt="Report" /></div>` : ""}
              <p style="margin: 4px 0; font-size: 12px;">${report.description.substring(0, 100)}${report.description.length > 100 ? "..." : ""}</p>
            </div>
          `,
        })

        marker.addListener("click", () => {
          onMarkerClick(report)
          infoWindow.open(map, marker)
        })

        markersRef.current.push(marker)
      })

      if (wardVisibility) {
        wards.forEach((ward) => {
          const wardMarker = new window.google.maps.Marker({
            position: {
              lat: Number(ward.latitude),
              lng: Number(ward.longitude),
            },
            map,
            title: ward.ward_name,
            icon: {
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: "#3b82f6",
              fillOpacity: 0.6,
              strokeColor: "#ffffff",
              strokeWeight: 2,
            },
          })

          const wardInfoWindow = new window.google.maps.InfoWindow({
            content: `
              <div style="padding: 8px; max-width: 220px;">
                <h3 style="margin: 0 0 8px 0; font-weight: bold; font-size: 14px;">${ward.ward_name} Ward Office</h3>
                <p style="margin: 4px 0; font-size: 12px;"><strong>Address:</strong> ${ward.address}</p>
                ${ward.phone ? `<p style="margin: 4px 0; font-size: 12px;"><strong>Phone:</strong> ${ward.phone}</p>` : ""}
                ${ward.email ? `<p style="margin: 4px 0; font-size: 12px;"><strong>Email:</strong> ${ward.email}</p>` : ""}
              </div>
            `,
          })

          wardMarker.addListener("click", () => {
            wardInfoWindow.open(map, wardMarker)
          })

          wardMarkersRef.current.push(wardMarker)
        })
      }
    }

    loadGoogleMaps()

    return () => {
      markersRef.current.forEach((marker) => marker.setMap(null))
      wardMarkersRef.current.forEach((marker) => marker.setMap(null))
    }
  }, [reports, wards, wardVisibility, onMarkerClick])

  const getMarkerColor = (severity: string): string => {
    switch (severity) {
      case "high":
        return "#ef4444"
      case "medium":
        return "#eab308"
      case "low":
        return "#22c55e"
      default:
        return "#6b7280"
    }
  }

  useEffect(() => {
    if (mapInstanceRef.current) {
      wardMarkersRef.current.forEach((marker) => marker.setMap(null))
      wardMarkersRef.current = []

      if (wardVisibility) {
        wards.forEach((ward) => {
          const wardMarker = new window.google.maps.Marker({
            position: {
              lat: Number(ward.latitude),
              lng: Number(ward.longitude),
            },
            map: mapInstanceRef.current,
            title: ward.ward_name,
            icon: {
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: "#3b82f6",
              fillOpacity: 0.6,
              strokeColor: "#ffffff",
              strokeWeight: 2,
            },
          })

          const wardInfoWindow = new window.google.maps.InfoWindow({
            content: `
              <div style="padding: 8px; max-width: 220px;">
                <h3 style="margin: 0 0 8px 0; font-weight: bold; font-size: 14px;">${ward.ward_name} Ward Office</h3>
                <p style="margin: 4px 0; font-size: 12px;"><strong>Address:</strong> ${ward.address}</p>
                ${ward.phone ? `<p style="margin: 4px 0; font-size: 12px;"><strong>Phone:</strong> ${ward.phone}</p>` : ""}
                ${ward.email ? `<p style="margin: 4px 0; font-size: 12px;"><strong>Email:</strong> ${ward.email}</p>` : ""}
              </div>
            `,
          })

          wardMarker.addListener("click", () => {
            wardInfoWindow.open(mapInstanceRef.current, wardMarker)
          })

          wardMarkersRef.current.push(wardMarker)
        })
      }
    }
  }, [wardVisibility, wards])

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full" />
      <button
        onClick={() => setWardVisibility(!wardVisibility)}
        className="absolute top-2 right-2 px-4 py-2 rounded-lg shadow-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 z-10 transition-colors duration-200"
      >
        {wardVisibility ? "Hide Wards" : "Show Wards"}
      </button>
    </div>
  )
}
