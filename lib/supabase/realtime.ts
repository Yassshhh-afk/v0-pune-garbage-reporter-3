import { createClient } from "@/lib/supabase/client"
import type { RealtimeChannel } from "@supabase/supabase-js"

export function subscribeToReports(callback: (reports: any[]) => void, onError?: (error: any) => void): () => void {
  const supabase = createClient()
  let channel: RealtimeChannel | null = null

  const subscribe = () => {
    channel = supabase
      .channel("garbage_reports")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "garbage_reports",
        },
        (payload) => {
          console.log("[v0] Real-time update received:", payload.eventType)
          // Fetch updated reports list
          fetchReports()
        },
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "status_updates",
        },
        (payload) => {
          console.log("[v0] Status update received:", payload.eventType)
          // Fetch updated reports to reflect status changes
          fetchReports()
        },
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          console.log("[v0] Real-time subscribed to reports")
        }
      })
  }

  const fetchReports = async () => {
    try {
      const { data } = await supabase.from("garbage_reports").select("*")
      if (data) {
        callback(data)
      }
    } catch (error) {
      console.error("[v0] Error fetching reports:", error)
      if (onError) {
        onError(error)
      }
    }
  }

  subscribe()

  // Cleanup function
  return () => {
    if (channel) {
      supabase.removeChannel(channel)
    }
  }
}

export function subscribeToComments(
  reportId: string,
  callback: (comments: any[]) => void,
  onError?: (error: any) => void,
): () => void {
  const supabase = createClient()
  let channel: RealtimeChannel | null = null

  const subscribe = () => {
    channel = supabase
      .channel(`comments_${reportId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "comments",
          filter: `report_id=eq.${reportId}`,
        },
        (payload) => {
          console.log("[v0] Comment update received:", payload.eventType)
          fetchComments()
        },
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          console.log("[v0] Real-time subscribed to comments for report", reportId)
        }
      })
  }

  const fetchComments = async () => {
    try {
      const { data } = await supabase
        .from("comments")
        .select("*")
        .eq("report_id", reportId)
        .order("created_at", { ascending: false })

      if (data) {
        callback(data)
      }
    } catch (error) {
      console.error("[v0] Error fetching comments:", error)
      if (onError) {
        onError(error)
      }
    }
  }

  subscribe()

  // Cleanup function
  return () => {
    if (channel) {
      supabase.removeChannel(channel)
    }
  }
}

export function subscribeToStatusUpdates(
  reportId: string,
  callback: (updates: any[]) => void,
  onError?: (error: any) => void,
): () => void {
  const supabase = createClient()
  let channel: RealtimeChannel | null = null

  const subscribe = () => {
    channel = supabase
      .channel(`status_updates_${reportId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "status_updates",
          filter: `report_id=eq.${reportId}`,
        },
        (payload) => {
          console.log("[v0] Status update received:", payload.eventType)
          fetchUpdates()
        },
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          console.log("[v0] Real-time subscribed to status updates for report", reportId)
        }
      })
  }

  const fetchUpdates = async () => {
    try {
      const { data } = await supabase
        .from("status_updates")
        .select("*")
        .eq("report_id", reportId)
        .order("created_at", { ascending: false })

      if (data) {
        callback(data)
      }
    } catch (error) {
      console.error("[v0] Error fetching status updates:", error)
      if (onError) {
        onError(error)
      }
    }
  }

  subscribe()

  // Cleanup function
  return () => {
    if (channel) {
      supabase.removeChannel(channel)
    }
  }
}
