"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Share2, Copy, CheckCircle } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface ShareReportButtonProps {
  reportId: string
  locationName: string
  description: string
  status: string
  rating: number
  totalReviews: number
}

export function ShareReportButton({
  reportId,
  locationName,
  description,
  status,
  rating,
  totalReviews,
}: ShareReportButtonProps) {
  const [copied, setCopied] = useState(false)

  const productionUrl = process.env.NEXT_PUBLIC_DEPLOYED_URL || "https://pune-garbage-reporter.vercel.app"
  const reportUrl = `${productionUrl}/map/${reportId}`

  const shareText = `Check out this garbage report on Pune Garbage Reporter:\n\nLocation: ${locationName}\nStatus: ${status}\nRating: ${rating.toFixed(1)}/5 (${totalReviews} reviews)\n\n${description}\n\nView more: ${reportUrl}`

  const handleWhatsAppShare = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`
    window.open(whatsappUrl, "_blank")
  }

  const handleTwitterShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      `Just reported garbage at ${locationName} on @PuneGarbageReport. Status: ${status} 🗑️\n${reportUrl}`,
    )}`
    window.open(twitterUrl, "_blank")
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(reportUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Garbage Report - ${locationName}`,
          text: shareText,
          url: reportUrl,
        })
      } catch (err) {
        console.error("[v0] Share error:", err)
      }
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="w-full gap-2 bg-transparent">
          <Share2 className="h-4 w-4" />
          Share Report
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={handleWhatsAppShare} className="cursor-pointer">
          <div className="flex items-center gap-2">
            <span className="text-lg">💬</span>
            <span>Share on WhatsApp</span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleTwitterShare} className="cursor-pointer">
          <div className="flex items-center gap-2">
            <span className="text-lg">𝕏</span>
            <span>Share on Twitter</span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleCopyLink} className="cursor-pointer">
          <div className="flex items-center gap-2">
            {copied ? (
              <>
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Link Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                <span>Copy Link</span>
              </>
            )}
          </div>
        </DropdownMenuItem>
        {typeof navigator !== "undefined" && navigator.share && (
          <DropdownMenuItem onClick={handleNativeShare} className="cursor-pointer">
            <div className="flex items-center gap-2">
              <Share2 className="h-4 w-4" />
              <span>More Options</span>
            </div>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
