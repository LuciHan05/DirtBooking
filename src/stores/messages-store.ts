import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { MessageRecord } from "@/lib/db/schema";
import { SEED_MESSAGES } from "@/lib/db/seed";
import { generateId } from "@/lib/db/mappers";

interface MessagesState {
  messages: MessageRecord[];
  send: (input: {
    trackId: string;
    senderId: string;
    receiverId: string;
    content: string;
  }) => void;
  getConversation: (
    userId: string,
    otherUserId: string,
    trackId?: string
  ) => MessageRecord[];
  getConversationsForUser: (
    userId: string,
    profiles: { id: string; name: string }[]
  ) => {
    otherUserId: string;
    otherUserName: string;
    lastMessage: string;
    trackId: string;
  }[];
}

export const useMessagesStore = create<MessagesState>()(
  persist(
    (set, get) => ({
      messages: SEED_MESSAGES,

      send: ({ trackId, senderId, receiverId, content }) => {
        const msg: MessageRecord = {
          id: generateId("msg"),
          trackId,
          senderId,
          receiverId,
          content: content.trim(),
          read: false,
          createdAt: new Date().toISOString(),
        };
        set((s) => ({ messages: [...s.messages, msg] }));
      },

      getConversation: (userId, otherUserId, trackId) => {
        return get()
          .messages.filter(
            (m) =>
              ((m.senderId === userId && m.receiverId === otherUserId) ||
                (m.senderId === otherUserId && m.receiverId === userId)) &&
              (!trackId || m.trackId === trackId)
          )
          .sort(
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
      },

      getConversationsForUser: (userId, profiles) => {
        const msgs = get()
          .messages.filter(
            (m) => m.senderId === userId || m.receiverId === userId
          )
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );

        const seen = new Set<string>();
        const result: {
          otherUserId: string;
          otherUserName: string;
          lastMessage: string;
          trackId: string;
        }[] = [];

        for (const msg of msgs) {
          const otherId =
            msg.senderId === userId ? msg.receiverId : msg.senderId;
          const key = `${otherId}-${msg.trackId}`;
          if (seen.has(key)) continue;
          seen.add(key);
          const profile = profiles.find((p) => p.id === otherId);
          result.push({
            otherUserId: otherId,
            otherUserName: profile?.name ?? "Utilizator",
            lastMessage: msg.content,
            trackId: msg.trackId,
          });
        }
        return result;
      },
    }),
    { name: "dirtbooking-messages" }
  )
);
