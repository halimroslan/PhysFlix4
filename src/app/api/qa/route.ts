import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { checkQuickAbusive } from "@/utils/moderation";

const STORE_PATH = path.join(process.cwd(), "src/data/qa_store.json");
const MASTER_BACKUP_PATH = "/Users/halimroslan/NEW CIDS SUITES PRO/physics-spm-flix-backup/qa_comments_archive/qa_store_master_backup.json";

const SUPERADMIN_EMAILS = [
  "ahalimroslan@gmail.com",
  "abdulhalimroslan@gmail.com",
];

export interface QAReply {
  id: string;
  authorName: string;
  authorRole: "pelajar" | "guru" | "rakan";
  isVerified?: boolean;
  text: string;
  timestamp: string;
  createdAt?: number;
  likes: number;
}

export interface QAItem {
  id: string;
  videoId: string;
  authorName: string;
  authorRole: "pelajar" | "guru" | "rakan";
  timestamp: string;
  createdAt: number;
  category: "Konsep" | "Pengiraan" | "SPM Kertas 2" | "SPM Kertas 1" | "Amali";
  question: string;
  likes: number;
  isLiked?: boolean;
  replies: QAReply[];
}

// In-memory cache + file sync
let qaStoreCache: Record<string, QAItem[]> | null = null;

// Lossless store merger: ensures no question or Ox Alpha reply is ever lost
function mergeStores(
  primary: Record<string, QAItem[]>,
  secondary: Record<string, QAItem[]>
): Record<string, QAItem[]> {
  const merged: Record<string, QAItem[]> = { ...secondary, ...primary };
  for (const [vid, items] of Object.entries(secondary)) {
    if (primary[vid]) {
      const primaryQuestionIds = new Set(primary[vid].map((q) => q.id));
      const missingQuestions = items.filter((q) => !primaryQuestionIds.has(q.id));

      const updatedPrimary = primary[vid].map((pq) => {
        const secQ = items.find((sq) => sq.id === pq.id);
        if (secQ && Array.isArray(secQ.replies)) {
          const existingReplyIds = new Set(pq.replies.map((r) => r.id));
          const missingReplies = secQ.replies.filter((r) => !existingReplyIds.has(r.id));
          if (missingReplies.length > 0) {
            return { ...pq, replies: [...pq.replies, ...missingReplies] };
          }
        }
        return pq;
      });

      merged[vid] = [...updatedPrimary, ...missingQuestions];
    } else {
      merged[vid] = items;
    }
  }
  return merged;
}

function loadStore(): Record<string, QAItem[]> {
  if (qaStoreCache) return qaStoreCache;
  let primaryStore: Record<string, QAItem[]> = {};

  try {
    if (fs.existsSync(STORE_PATH)) {
      const data = fs.readFileSync(STORE_PATH, "utf-8");
      primaryStore = JSON.parse(data) || {};
    }
  } catch (err) {
    console.warn("Failed to read qa_store.json, initializing empty store:", err);
  }

  // Failsafe preservation: merge with master backup if available
  try {
    if (fs.existsSync(MASTER_BACKUP_PATH)) {
      const backupData = fs.readFileSync(MASTER_BACKUP_PATH, "utf-8");
      const backupStore = JSON.parse(backupData) || {};
      primaryStore = mergeStores(primaryStore, backupStore);
    }
  } catch {
    // Ignore in environments where external folder is not present
  }

  qaStoreCache = primaryStore;
  return qaStoreCache;
}

function saveStore(store: Record<string, QAItem[]>) {
  qaStoreCache = store;
  try {
    const dir = path.dirname(STORE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to write to qa_store.json:", err);
  }

  // Automatically preserve to external master backup folder
  try {
    const backupDir = path.dirname(MASTER_BACKUP_PATH);
    if (fs.existsSync(backupDir)) {
      fs.writeFileSync(MASTER_BACKUP_PATH, JSON.stringify(store, null, 2), "utf-8");
    }
  } catch {
    // Ignore in read-only / cloud environments
  }
}

// GET: Retrieve public Q&A for a specific video
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const videoId = searchParams.get("videoId");

    if (!videoId) {
      return NextResponse.json({ error: "videoId is required" }, { status: 400 });
    }

    const store = loadStore();
    const items = store[videoId] || [];

    // Filter out abusive or legacy dummy questions
    const cleanItems = items.filter(
      (item) =>
        item.id &&
        !item.id.startsWith("qa-gen-") &&
        !item.id.startsWith("qa-1-") &&
        !item.id.startsWith("qa-2-") &&
        !item.id.startsWith("qa-3-") &&
        !item.id.startsWith("qa-4-") &&
        !item.id.startsWith("qa-5-") &&
        !checkQuickAbusive(item.question).isAbusive
    );

    return NextResponse.json({ questions: cleanItems });
  } catch (err) {
    console.error("Error in GET /api/qa:", err);
    return NextResponse.json({ questions: [] }, { status: 200 });
  }
}

// POST: Add question, add reply, or like
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, videoId } = body;

    if (!videoId) {
      return NextResponse.json({ error: "videoId is required" }, { status: 400 });
    }

    const store = loadStore();
    if (!store[videoId]) {
      store[videoId] = [];
    }

    if (action === "add_question") {
      const { question, authorName, authorRole, category } = body;
      if (!question || !question.trim()) {
        return NextResponse.json({ error: "Question text is required" }, { status: 400 });
      }

      const quickCheck = checkQuickAbusive(question.trim());
      if (quickCheck.isAbusive) {
        return NextResponse.json({
          error: "Komen mengandungi unsur yang tidak sopan atau tidak relevan.",
          isAbusive: true,
        }, { status: 400 });
      }

      const newItem: QAItem = {
        id: `qa-real-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        videoId,
        authorName: authorName || "Pelajar",
        authorRole: authorRole || "pelajar",
        timestamp: "Baru sahaja",
        createdAt: Date.now(),
        category: category || "Konsep",
        question: question.trim(),
        likes: 0,
        replies: [],
      };

      store[videoId].unshift(newItem);
      saveStore(store);

      return NextResponse.json({ success: true, item: newItem, questions: store[videoId] });
    }

    if (action === "add_reply") {
      const { questionId, text, authorName, authorRole, isVerified } = body;
      if (!questionId || !text || !text.trim()) {
        return NextResponse.json({ error: "questionId and text are required" }, { status: 400 });
      }

      const quickCheck = checkQuickAbusive(text.trim());
      if (quickCheck.isAbusive && authorRole !== "guru" && !authorName?.includes("Sir Halim") && !authorName?.includes("AI Tutor")) {
        return NextResponse.json({
          error: "Balasan mengandungi unsur yang tidak sopan.",
          isAbusive: true,
        }, { status: 400 });
      }

      const newReply: QAReply = {
        id: `reply-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        authorName: authorName || "Pelajar",
        authorRole: authorRole || "pelajar",
        isVerified: Boolean(isVerified),
        text: text.trim(),
        timestamp: "Baru sahaja",
        createdAt: Date.now(),
        likes: 0,
      };

      store[videoId] = store[videoId].map((q) => {
        if (q.id === questionId) {
          return {
            ...q,
            replies: [...q.replies, newReply],
          };
        }
        return q;
      });

      saveStore(store);
      return NextResponse.json({ success: true, reply: newReply, questions: store[videoId] });
    }

    if (action === "like_question") {
      const { questionId } = body;
      store[videoId] = store[videoId].map((q) => {
        if (q.id === questionId) {
          return { ...q, likes: q.likes + 1 };
        }
        return q;
      });
      saveStore(store);
      return NextResponse.json({ success: true, questions: store[videoId] });
    }

    if (action === "like_reply") {
      const { questionId, replyId } = body;
      store[videoId] = store[videoId].map((q) => {
        if (q.id === questionId) {
          return {
            ...q,
            replies: q.replies.map((r) => (r.id === replyId ? { ...r, likes: r.likes + 1 } : r)),
          };
        }
        return q;
      });
      saveStore(store);
      return NextResponse.json({ success: true, questions: store[videoId] });
    }

    if (action === "sync_local_items") {
      const { items } = body;
      if (Array.isArray(items) && items.length > 0) {
        const existingIds = new Set(store[videoId].map((q) => q.id));
        let changed = false;

        for (const localQ of items) {
          if (!localQ || !localQ.id) continue;
          if (!existingIds.has(localQ.id)) {
            store[videoId].unshift(localQ);
            existingIds.add(localQ.id);
            changed = true;
          } else {
            // Merge missing replies
            const targetQ = store[videoId].find((q) => q.id === localQ.id);
            if (targetQ && Array.isArray(localQ.replies)) {
              const replyIds = new Set(targetQ.replies.map((r) => r.id));
              for (const rep of localQ.replies) {
                if (!replyIds.has(rep.id)) {
                  targetQ.replies.push(rep);
                  replyIds.add(rep.id);
                  changed = true;
                }
              }
            }
          }
        }

        if (changed) {
          saveStore(store);
        }
      }
      return NextResponse.json({ success: true, questions: store[videoId] });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err) {
    console.error("Error in POST /api/qa:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE: SuperAdmin ONLY
export async function DELETE(req: NextRequest) {
  try {
    const { videoId, questionId, replyId, userEmail } = await req.json();

    const normalizedEmail = (userEmail || "").toLowerCase().trim();
    if (!SUPERADMIN_EMAILS.includes(normalizedEmail)) {
      return NextResponse.json(
        { error: "Akses ditolak: Hanya Superadmin dibenarkan memadam komen." },
        { status: 403 }
      );
    }

    if (!videoId || !questionId) {
      return NextResponse.json({ error: "videoId and questionId are required" }, { status: 400 });
    }

    const store = loadStore();
    if (!store[videoId]) {
      return NextResponse.json({ success: true, questions: [] });
    }

    if (replyId) {
      // Delete reply
      store[videoId] = store[videoId].map((q) => {
        if (q.id === questionId) {
          return {
            ...q,
            replies: q.replies.filter((r) => r.id !== replyId),
          };
        }
        return q;
      });
    } else {
      // Delete whole question
      store[videoId] = store[videoId].filter((q) => q.id !== questionId);
    }

    saveStore(store);
    return NextResponse.json({ success: true, questions: store[videoId] });
  } catch (err) {
    console.error("Error in DELETE /api/qa:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
