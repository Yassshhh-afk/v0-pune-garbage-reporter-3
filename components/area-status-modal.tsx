"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { createClient } from "@/lib/supabase/client"

type AreaStatusModalProps = {
  isOpen: boolean
  onClose: () => void
  reportId: string
  userEmail?: string | null
  onSuccess?: () => void
}

export function AreaStatusModal({ isOpen, onClose, reportId, userEmail, onSuccess }: AreaStatusModalProps) {
  const [step, setStep] = useState<"questions" | "upload">("questions")
  const [selectedStatus, setSelectedStatus] = useState<"clean" | "dirty" | "partially_clean">("clean")
  const [description, setDescription] = useState("")
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
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

  const handleQuestionsSubmit = () => {
    setStep("upload")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!userEmail) {
      setError("Please login to submit")
      return
    }

    if (!photoPreview) {
      setError("Photo is required as proof")
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

      onSuccess?.()
      handleClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setStep("questions")
    setSelectedStatus("clean")
    setDescription("")
    setPhotoFile(null)
    setPhotoPreview(null)
    setError(null)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Report Area Status</DialogTitle>
          <DialogDescription>Help us understand the current condition of this garbage location</DialogDescription>
        </DialogHeader>

        {step === "questions" ? (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-4">What is the current status of this area?</h3>
              <div className="grid grid-cols-3 gap-3">
                {(["clean", "partially_clean", "dirty"] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => setSelectedStatus(status)}
                    className={`p-4 rounded-lg border-2 transition font-medium text-sm ${
                      selectedStatus === status
                        ? "border-primary bg-primary/10"
                        : "border-gray-200 hover:border-gray-300"
                    } ${
                      status === "clean"
                        ? "text-green-600"
                        : status === "partially_clean"
                          ? "text-yellow-600"
                          : "text-red-600"
                    }`}
                  >
                    {status === "partially_clean"
                      ? "Partially Clean"
                      : status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <Textarea
              placeholder="Any additional details about the area condition? (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />

            <Button onClick={handleQuestionsSubmit} className="w-full">
              Continue to Upload Photo
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium block mb-2">Photo Proof (Required)</label>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoSelect}
                required
                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
              />
              {photoPreview && (
                <div className="mt-3 relative w-full h-40 rounded-lg overflow-hidden bg-gray-100">
                  <img src={photoPreview || "/placeholder.svg"} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => setStep("questions")} className="flex-1">
                Back
              </Button>
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? "Submitting..." : "Submit Status"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
