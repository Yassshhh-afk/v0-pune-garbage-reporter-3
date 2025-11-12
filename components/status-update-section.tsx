"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2 } from "lucide-react"

type StatusUpdate = {
  id: string
  status_type: "clean" | "dirty" | "partially_clean"
  photo_url: string
  description: string | null
  created_at: string
}

type StatusUpdateSectionProps = {
  reportId: string
  userEmail?: string | null
  statusUpdates?: StatusUpdate[]
}

export function StatusUpdateSection({ reportId, userEmail, statusUpdates = [] }: StatusUpdateSectionProps) {
  const [selectedStatus, setSelectedStatus] = useState<"clean" | "dirty" | "partially_clean">("clean")
  const [description, setDescription] = useState("")
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const supabase = createClient()

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPhotoFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!userEmail) {
      setError("Please login to submit a status update")
      return
    }

    if (!photoPreview) {
      setError("Please select a photo as proof")
      return
    }

    try {
      setIsSubmitting(true)
      setError(null)

      const user = (await supabase.auth.getUser()).data.user
      if (!user) throw new Error("Not authenticated")

      const { error } = await supabase.from("status_updates").insert([
        {
          report_id: reportId,
          user_id: user.id,
          status_type: selectedStatus,
          photo_url: photoPreview,
          description: description || null,
        },
      ])

      if (error) throw error

      setSuccess(true)
      setDescription("")
      setPhotoFile(null)
      setPhotoPreview(null)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit status update")
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "clean":
        return "text-green-600 bg-green-50"
      case "partially_clean":
        return "text-yellow-600 bg-yellow-50"
      case "dirty":
        return "text-red-600 bg-red-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  const getStatusLabel = (status: string) => {
    return status === "partially_clean" ? "Partially Clean" : status.charAt(0).toUpperCase() + status.slice(1)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <CheckCircle2 className="h-5 w-5" />
        <h3 className="text-lg font-semibold">Report Area Status</h3>
      </div>

      {!userEmail ? (
        <Alert>
          <AlertDescription>Please login to report the current area status</AlertDescription>
        </Alert>
      ) : (
        <Card className="p-4">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="text-sm font-medium block mb-2">Current Status</label>
              <div className="grid grid-cols-3 gap-2">
                {(["clean", "partially_clean", "dirty"] as const).map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setSelectedStatus(status)}
                    className={`p-3 rounded border-2 transition ${
                      selectedStatus === status
                        ? "border-primary bg-primary/10"
                        : "border-gray-200 hover:border-gray-300"
                    } ${getStatusColor(status)}`}
                  >
                    <div className="font-medium text-sm">{getStatusLabel(status)}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium block mb-2">Photo Proof</label>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoSelect}
                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
              />
              {photoPreview && (
                <div className="mt-2 relative w-full h-40 rounded-lg overflow-hidden bg-gray-100">
                  <img src={photoPreview || "/placeholder.svg"} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            <Textarea
              placeholder="Additional details (optional)..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert className="bg-green-50 border-green-200">
                <AlertDescription className="text-green-800">Status update submitted successfully!</AlertDescription>
              </Alert>
            )}

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Status Update"}
            </Button>
          </form>
        </Card>
      )}

      {statusUpdates && statusUpdates.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Recent Updates ({statusUpdates.length})</p>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {statusUpdates.map((update) => (
              <Card key={update.id} className={`p-3 ${getStatusColor(update.status_type)}`}>
                <div className="flex gap-3">
                  {update.photo_url && (
                    <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0">
                      <img
                        src={update.photo_url || "/placeholder.svg"}
                        alt="Status"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{getStatusLabel(update.status_type)}</p>
                    {update.description && <p className="text-xs mt-1">{update.description}</p>}
                    <p className="text-xs opacity-70 mt-1">{new Date(update.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
