export interface QAReply {
  id: string;
  authorName: string;
  authorRole: "guru" | "pelajar" | "admin";
  authorAvatar?: string;
  text: string;
  timestamp: string;
  createdAt: number;
  likes: number;
  isVerified?: boolean;
}

export interface QAItem {
  id: string;
  lessonId: string;
  chapterNum: number;
  form: number;
  authorName: string;
  authorRole: "guru" | "pelajar" | "admin";
  authorAvatar?: string;
  question: string;
  category: "Konsep" | "Pengiraan" | "SPM Kertas 2" | "SPM Kertas 1" | "Amali";
  timestamp: string;
  createdAt: number;
  likes: number;
  isLiked?: boolean;
  replies: QAReply[];
}

export const defaultQAItems: Record<string, QAItem[]> = {};

/**
 * Returns user Q&A discussions for a lesson (zero dummy chats)
 */
export function getLessonQAItems(lessonId: string): QAItem[] {
  if (defaultQAItems[lessonId]) {
    return defaultQAItems[lessonId];
  }
  return [];
}
