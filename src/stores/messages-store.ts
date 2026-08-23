import { create } from "zustand";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import type { MessageRecord } from "@/lib/db/schema";
import type { DbMessage } from "@/types/database";

let realtimeChannel: RealtimeChannel | null = null;

interface MessagesState {
  messages: MessageRecord[];
  isLoading: boolean;
  hasLoaded: boolean;
  fetchMessages: () => Promise<void>;
  subscribeRealtime: (userId: string) => void;
  unsubscribeRealtime: () => void;
  send: (input: {
    trackId: string;
    senderId: string;
    receiverId: string;
    content: string;
  }) => Promise<{ error?: string }>;
  getConversation: (
    userId: string,
    otherUserId: string,
    trackId?: string
  ) => MessageRecord[];
  getConversationsForUser: (userId: string) => {
    otherUserId: string;
    otherUserName: string;
    lastMessage: string;
    trackId: string;
  }[];
}

function recordFromDb(m: DbMessage): MessageRecord {
  return {
    id: m.id,
    trackId: m.track_id ?? "",
    senderId: m.sender_id,
    senderName: m.sender?.name,
    receiverId: m.receiver_id,
    receiverName: m.receiver?.name,
    content: m.content,
    read: m.read,
    createdAt: m.created_at,
  };
}

export const useMessagesStore = create<MessagesState>()((set, get) => ({
  messages: [],
  isLoading: false,
  hasLoaded: false,

  fetchMessages: async () => {
    set({ isLoading: true });
    const supabase = createClient();
    const { data, error } = await supabase
      .from("messages")
      .select(
        "*, sender:profiles!messages_sender_id_fkey(name), receiver:profiles!messages_receiver_id_fkey(name)"
      )
      .order("created_at", { ascending: true });

    if (error || !data) {
      set({ isLoading: false, hasLoaded: true });
      return;
    }
    set({
      messages: (data as unknown as DbMessage[]).map(recordFromDb),
      isLoading: false,
      hasLoaded: true,
    });
  },

  subscribeRealtime: (userId) => {
    if (realtimeChannel) return;
    const supabase = createClient();
    realtimeChannel = supabase
      .channel(`messages-${userId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        async (payload) => {
          const row = payload.new as DbMessage;
          if (row.sender_id !== userId && row.receiver_id !== userId) return;
          if (get().messages.some((m) => m.id === row.id)) return;

          // Payload-ul realtime nu include join-uri — luăm numele separat.
          const { data: profiles } = await supabase
            .from("profiles")
            .select("id, name")
            .in("id", [row.sender_id, row.receiver_id]);
          const nameById = new Map(
            (profiles ?? []).map((p) => [p.id, p.name])
          );

          const record = recordFromDb({
            ...row,
            sender: { name: nameById.get(row.sender_id) ?? "Utilizator" },
            receiver: { name: nameById.get(row.receiver_id) ?? "Utilizator" },
          });
          set((s) =>
            s.messages.some((m) => m.id === row.id)
              ? s
              : { messages: [...s.messages, record] }
          );
        }
      )
      .subscribe();
  },

  unsubscribeRealtime: () => {
    if (realtimeChannel) {
      const supabase = createClient();
      supabase.removeChannel(realtimeChannel);
      realtimeChannel = null;
    }
  },

  send: async ({ trackId, senderId, receiverId, content }) => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("messages")
      .insert({
        track_id: trackId,
        sender_id: senderId,
        receiver_id: receiverId,
        content: content.trim(),
      })
      .select(
        "*, sender:profiles!messages_sender_id_fkey(name), receiver:profiles!messages_receiver_id_fkey(name)"
      )
      .single();

    if (error || !data) return { error: error?.message ?? "Eroare la trimiterea mesajului." };

    const record = recordFromDb(data as unknown as DbMessage);
    set((s) =>
      s.messages.some((m) => m.id === record.id)
        ? s
        : { messages: [...s.messages, record] }
    );
    return {};
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

  getConversationsForUser: (userId) => {
    const msgs = get()
      .messages.filter((m) => m.senderId === userId || m.receiverId === userId)
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
      const isMine = msg.senderId === userId;
      const otherId = isMine ? msg.receiverId : msg.senderId;
      const otherName = isMine ? msg.receiverName : msg.senderName;
      const key = `${otherId}-${msg.trackId}`;
      if (seen.has(key)) continue;
      seen.add(key);
      result.push({
        otherUserId: otherId,
        otherUserName: otherName ?? "Utilizator",
        lastMessage: msg.content,
        trackId: msg.trackId,
      });
    }
    return result;
  },
}));
