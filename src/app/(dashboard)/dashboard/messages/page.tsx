"use client";

import { useEffect, useState, useTransition } from "react";
import { motion } from "framer-motion";
import { Loader2, Send } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EASE_OUT } from "@/lib/animations";
import { useAuthStore } from "@/stores/auth-store";
import { useMessagesStore } from "@/stores/messages-store";
import { formatDateTime } from "@/lib/format";

export default function MessagesPage() {
  const user = useAuthStore((s) => s.user);
  const send = useMessagesStore((s) => s.send);
  const fetchMessages = useMessagesStore((s) => s.fetchMessages);
  const subscribeRealtime = useMessagesStore((s) => s.subscribeRealtime);
  const hasLoaded = useMessagesStore((s) => s.hasLoaded);
  // Subscribe to the messages array so this page re-renders on new/realtime messages.
  useMessagesStore((s) => s.messages);
  const getConversationsForUser = useMessagesStore(
    (s) => s.getConversationsForUser
  );
  const getConversation = useMessagesStore((s) => s.getConversation);

  useEffect(() => {
    if (!user) return;
    if (!hasLoaded) fetchMessages();
    subscribeRealtime(user.id);
  }, [user, hasLoaded, fetchMessages, subscribeRealtime]);

  const conversations = user ? getConversationsForUser(user.id) : [];

  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeTrackId, setActiveTrackId] = useState<string>("");
  const [content, setContent] = useState("");
  const [pending, startTransition] = useTransition();

  const messages =
    user && activeId
      ? getConversation(user.id, activeId, activeTrackId || undefined)
      : [];

  function selectConversation(otherUserId: string, trackId: string) {
    setActiveId(otherUserId);
    setActiveTrackId(trackId);
  }

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!activeId || !content.trim() || !user || !activeTrackId) return;
    startTransition(async () => {
      const result = await send({
        trackId: activeTrackId,
        senderId: user.id,
        receiverId: activeId,
        content,
      });
      if (!result.error) setContent("");
    });
  }

  const activeName =
    conversations.find((c) => c.otherUserId === activeId)?.otherUserName ??
    "Conversație";

  return (
    <>
      <DashboardHeader title="Mesaje" subtitle="Discuții cu rideri și proprietari" />
      <div className="flex flex-1 overflow-hidden p-6 gap-4">
        <GlassCard className="glass-edge w-72 shrink-0 overflow-y-auto p-2">
          {conversations.length === 0 ? (
            <p className="p-4 text-sm text-muted-foreground">
              Nicio conversație încă. Contactează un proprietar de pe pagina
              unui traseu.
            </p>
          ) : (
            conversations.map((conv) => (
              <button
                key={`${conv.otherUserId}-${conv.trackId}`}
                type="button"
                onClick={() =>
                  selectConversation(conv.otherUserId, conv.trackId)
                }
                className={`press w-full rounded-lg p-3 text-left text-sm transition-colors duration-200 ${
                  activeId === conv.otherUserId
                    ? "bg-primary/15 text-primary"
                    : "hover:bg-white/5"
                }`}
              >
                <p className="font-medium">{conv.otherUserName}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {conv.lastMessage}
                </p>
              </button>
            ))
          )}
        </GlassCard>

        <GlassCard className="glass-edge flex flex-1 flex-col overflow-hidden">
          {activeId ? (
            <>
              <div className="border-b border-white/5 px-4 py-3 font-heading font-semibold">
                {activeName}
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg) => {
                  const isMine = msg.senderId === user?.id;
                  return (
                    <motion.div
                      key={msg.id}
                      layout
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.25, ease: EASE_OUT }}
                      className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
                          isMine
                            ? "bg-primary text-primary-foreground"
                            : "bg-white/10"
                        }`}
                      >
                        <p>{msg.content}</p>
                        <p className="mt-1 text-[10px] opacity-70">
                          {formatDateTime(msg.createdAt)}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
              <form
                onSubmit={handleSend}
                className="flex gap-2 border-t border-white/5 p-3"
              >
                <Input
                  placeholder="Scrie un mesaj..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  disabled={pending}
                />
                <Button type="submit" size="icon" disabled={pending}>
                  {pending ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Send className="size-4" />
                  )}
                </Button>
              </form>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center text-muted-foreground text-sm">
              Selectează o conversație
            </div>
          )}
        </GlassCard>
      </div>
    </>
  );
}
