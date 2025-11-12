"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Star, MessageCircle } from "lucide-react"

type Comment = {
  id: string
  user_id: string
  username?: string
  comment_text: string
  rating: number | null
  created_at: string
}

type CommentSectionProps = {
  reportId: string
  userEmail?: string | null
  onAuthRequired?: () => void
  onStatsUpdate?: (stats: { totalReviews: number; averageRating: number }) => void
}

export function CommentSection({ reportId, userEmail, onAuthRequired, onStatsUpdate }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [newComment, setNewComment] = useState("")
  const [rating, setRating] = useState(5)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentUsername, setCurrentUsername] = useState<string | null>(null)

  const supabase = createClient()

  useEffect(() => {
    fetchComments()
    fetchCurrentUserUsername()
  }, [reportId])

  const fetchCurrentUserUsername = async () => {
    try {
      const user = (await supabase.auth.getUser()).data.user
      if (user) {
        const { data } = await supabase.from("user_profiles").select("username").eq("id", user.id).single()
        setCurrentUsername(data?.username || null)
      }
    } catch (err) {
      console.error("[v0] Error fetching user profile:", err)
    }
  }

  const fetchComments = async () => {
    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from("comments")
        .select(
          `
          id,
          user_id,
          username,
          comment_text,
          rating,
          created_at
        `,
        )
        .eq("report_id", reportId)
        .order("created_at", { ascending: false })

      if (error) throw error

      const mappedComments = (data || []).map((comment: any) => ({
        id: comment.id,
        user_id: comment.user_id,
        username: comment.username || "Anonymous",
        comment_text: comment.comment_text,
        rating: comment.rating,
        created_at: comment.created_at,
      }))

      setComments(mappedComments)

      const reviewsWithRatings = mappedComments.filter((c) => c.rating !== null)
      const totalReviews = reviewsWithRatings.length
      const averageRating =
        totalReviews > 0 ? reviewsWithRatings.reduce((sum, c) => sum + (c.rating || 0), 0) / totalReviews : 0

      onStatsUpdate?.({ totalReviews, averageRating })
    } catch (err) {
      console.error("[v0] Error fetching comments:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!userEmail) {
      onAuthRequired?.()
      return
    }

    if (!rating) {
      setError("Please select a rating")
      return
    }

    try {
      setIsSubmitting(true)
      setError(null)

      const { error } = await supabase.from("comments").insert([
        {
          report_id: reportId,
          user_id: (await supabase.auth.getUser()).data.user?.id,
          username: currentUsername || "Anonymous",
          comment_text: newComment || null,
          rating: rating,
        },
      ])

      if (error) throw error

      setNewComment("")
      setRating(5)
      await fetchComments()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add review")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <MessageCircle className="h-5 w-5" />
        <h3 className="text-lg font-semibold">Reviews & Comments ({comments.length})</h3>
      </div>

      {!userEmail ? (
        <Alert>
          <AlertDescription>
            <Button variant="link" className="p-0 h-auto" onClick={() => onAuthRequired?.()}>
              Login to add a review
            </Button>
          </AlertDescription>
        </Alert>
      ) : (
        <Card className="p-4">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="text-sm font-medium">Rating *</label>
              <div className="flex gap-2 mt-1">
                {[1, 2, 3, 4, 5].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRating(r)}
                    className={`p-1 rounded ${rating >= r ? "text-yellow-500" : "text-gray-300"}`}
                  >
                    <Star className="h-5 w-5 fill-current" />
                  </button>
                ))}
              </div>
            </div>
            <Textarea
              placeholder="Share your comment or review... (optional)"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={3}
            />
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Posting..." : "Post Review"}
            </Button>
          </form>
        </Card>
      )}

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading reviews...</p>
        ) : comments.length === 0 ? (
          <p className="text-sm text-muted-foreground">No reviews yet. Be the first to review!</p>
        ) : (
          comments.map((comment) => (
            <Card key={comment.id} className="p-3">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-blue-600">{comment.username}</p>
                <p className="text-xs text-muted-foreground">{new Date(comment.created_at).toLocaleDateString()}</p>
              </div>
              {comment.rating && (
                <div className="flex gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < comment.rating ? "fill-yellow-500 text-yellow-500" : "text-gray-300"}`}
                    />
                  ))}
                </div>
              )}
              {comment.comment_text && <p className="text-sm">{comment.comment_text}</p>}
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
