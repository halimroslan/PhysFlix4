// Notification Store for AI Tutor (Sir Halim) Replies & User Questions
// Provides persistent storage in localStorage with real-time cross-tab & window event sync

export interface AIReplyNotification {
  id: string;
  type: "ai_reply";
  videoId: string;
  questionId: string;
  lessonTitleBm: string;
  lessonTitleDlp: string;
  questionText: string;
  replyText: string;
  timestamp: string;
  createdAt: number;
  isRead: boolean;
}

export interface PendingQuestion {
  questionId: string;
  videoId: string;
  questionText: string;
  lessonTitleBm: string;
  lessonTitleDlp: string;
  askedAt: number;
}

const STORAGE_NOTIFICATIONS_KEY = "physflix_ai_reply_notifications_v1";
const STORAGE_PENDING_QUESTIONS_KEY = "physflix_pending_questions_v1";
export const NOTIFICATIONS_CHANGED_EVENT = "physflix_notifications_updated";

// Helper to safely dispatch updates across components
function notifyChange() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(NOTIFICATIONS_CHANGED_EVENT));
  }
}

// 1. Get all AI reply notifications
export function getAIReplyNotifications(): AIReplyNotification[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_NOTIFICATIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.warn("Failed to read AI reply notifications:", err);
    return [];
  }
}

// 2. Add a new AI reply notification
export function addAIReplyNotification(
  data: Omit<AIReplyNotification, "id" | "type" | "isRead"> & {
    id?: string;
    type?: "ai_reply";
    isRead?: boolean;
  }
): void {
  if (typeof window === "undefined") return;
  try {
    const current = getAIReplyNotifications();
    // Check if notification already exists for this question
    const existingIndex = current.findIndex(
      (n) => n.questionId === data.questionId
    );

    if (existingIndex >= 0) {
      // Update existing
      current[existingIndex] = {
        ...current[existingIndex],
        replyText: data.replyText,
        timestamp: data.timestamp || "Terkini",
        createdAt: data.createdAt || Date.now(),
        isRead: false, // Re-open unread badge
      };
    } else {
      // Add new to top
      const newNotif: AIReplyNotification = {
        id: data.id || `notif-ai-${data.questionId}-${Date.now()}`,
        type: "ai_reply",
        videoId: data.videoId,
        questionId: data.questionId,
        lessonTitleBm: data.lessonTitleBm || "Fizik SPM",
        lessonTitleDlp: data.lessonTitleDlp || "SPM Physics",
        questionText: data.questionText || "",
        replyText: data.replyText || "",
        timestamp: data.timestamp || "Terkini",
        createdAt: data.createdAt || Date.now(),
        isRead: false,
      };
      current.unshift(newNotif);
    }

    // Keep max 20 latest notifications
    const trimmed = current.slice(0, 20);
    localStorage.setItem(STORAGE_NOTIFICATIONS_KEY, JSON.stringify(trimmed));
    notifyChange();
  } catch (err) {
    console.warn("Failed to save AI reply notification:", err);
  }
}

// 3. Mark single notification as read
export function markAIReplyAsRead(id: string): void {
  if (typeof window === "undefined") return;
  try {
    const current = getAIReplyNotifications();
    const updated = current.map((n) =>
      n.id === id ? { ...n, isRead: true } : n
    );
    localStorage.setItem(STORAGE_NOTIFICATIONS_KEY, JSON.stringify(updated));
    notifyChange();
  } catch (err) {
    console.warn("Failed to mark notification as read:", err);
  }
}

// 4. Mark all AI notifications as read
export function markAllAIRepliesAsRead(): void {
  if (typeof window === "undefined") return;
  try {
    const current = getAIReplyNotifications();
    const updated = current.map((n) => ({ ...n, isRead: true }));
    localStorage.setItem(STORAGE_NOTIFICATIONS_KEY, JSON.stringify(updated));
    notifyChange();
  } catch (err) {
    console.warn("Failed to mark all notifications as read:", err);
  }
}

// 5. Delete a notification
export function deleteAIReplyNotification(id: string): void {
  if (typeof window === "undefined") return;
  try {
    const current = getAIReplyNotifications();
    const updated = current.filter((n) => n.id !== id);
    localStorage.setItem(STORAGE_NOTIFICATIONS_KEY, JSON.stringify(updated));
    notifyChange();
  } catch (err) {
    console.warn("Failed to delete notification:", err);
  }
}

// 6. Record that current student asked a question (so we can monitor for AI replies in background)
export function recordPendingQuestion(item: PendingQuestion): void {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(STORAGE_PENDING_QUESTIONS_KEY);
    const list: PendingQuestion[] = raw ? JSON.parse(raw) : [];
    if (!list.some((q) => q.questionId === item.questionId)) {
      list.push(item);
      localStorage.setItem(
        STORAGE_PENDING_QUESTIONS_KEY,
        JSON.stringify(list.slice(-15))
      );
    }
  } catch (err) {
    console.warn("Failed to record pending question:", err);
  }
}

// 7. Remove a question from pending
export function removePendingQuestion(questionId: string): void {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(STORAGE_PENDING_QUESTIONS_KEY);
    if (!raw) return;
    const list: PendingQuestion[] = JSON.parse(raw);
    const filtered = list.filter((q) => q.questionId !== questionId);
    localStorage.setItem(STORAGE_PENDING_QUESTIONS_KEY, JSON.stringify(filtered));
  } catch (err) {
    console.warn("Failed to remove pending question:", err);
  }
}

// 8. Background checker to see if any pending questions received an AI reply
export async function syncPendingQuestionsWithServer(): Promise<void> {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(STORAGE_PENDING_QUESTIONS_KEY);
    if (!raw) return;
    const list: PendingQuestion[] = JSON.parse(raw);
    if (!list || list.length === 0) return;

    // Group by videoId to minimize API calls
    const videoGroups = new Map<string, PendingQuestion[]>();
    for (const item of list) {
      const g = videoGroups.get(item.videoId) || [];
      g.push(item);
      videoGroups.set(item.videoId, g);
    }

    let hasAnyNewReply = false;

    for (const [videoId, pendingItems] of videoGroups.entries()) {
      try {
        const res = await fetch(`/api/qa?videoId=${videoId}`);
        if (!res.ok) continue;
        const data = await res.json();
        const questions: any[] = data.questions || [];

        for (const pending of pendingItems) {
          const matchedQ = questions.find((q) => q.id === pending.questionId);
          if (matchedQ && matchedQ.replies && matchedQ.replies.length > 0) {
            // Find reply from Sir Halim / AI Tutor
            const aiReply = matchedQ.replies.find(
              (r: any) =>
                r.id?.startsWith("reply-ai-") ||
                r.authorName?.includes("AI Tutor") ||
                r.authorName === "Sir Halim" ||
                r.authorRole === "guru"
            );

            if (aiReply) {
              addAIReplyNotification({
                id: `notif-ai-${pending.questionId}`,
                type: "ai_reply",
                videoId: pending.videoId,
                questionId: pending.questionId,
                lessonTitleBm: pending.lessonTitleBm,
                lessonTitleDlp: pending.lessonTitleDlp,
                questionText: pending.questionText,
                replyText: aiReply.text,
                timestamp: aiReply.timestamp || "Terkini",
                createdAt: Date.now(),
              });
              removePendingQuestion(pending.questionId);
              hasAnyNewReply = true;
            }
          }
        }
      } catch (e) {
        // Skip on network errors
      }
    }

    if (hasAnyNewReply) {
      notifyChange();
    }
  } catch (err) {
    console.warn("Failed to sync pending questions:", err);
  }
}
