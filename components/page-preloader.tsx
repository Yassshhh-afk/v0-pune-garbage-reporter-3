"use client"

import { useEffect, useState } from "react"
import { Spinner } from "@/components/ui/spinner"

interface PagePreloaderProps {
  isLoading: boolean
  minDuration?: number
}

export function PagePreloader({ isLoading, minDuration = 500 }: PagePreloaderProps) {
  const [shouldShow, setShouldShow] = useState(isLoading)

  useEffect(() => {
    if (isLoading) {
      setShouldShow(true)
    } else {
      // Keep showing for at least minDuration to avoid flashing
      const timer = setTimeout(() => setShouldShow(false), minDuration)
      return () => clearTimeout(timer)
    }
  }, [isLoading, minDuration])

  if (!shouldShow) return null

  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Spinner className="size-8" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  )
}
