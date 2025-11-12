"use client"

import { useState, useEffect } from "react"
import { PagePreloader } from "@/components/page-preloader"

export function LayoutPreloader() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  return <PagePreloader isLoading={isLoading} minDuration={500} />
}
