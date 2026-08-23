"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GlassCard } from "@/components/ui/glass-card";
import { useAuthStore } from "@/stores/auth-store";
import { useMessagesStore } from "@/stores/messages-store";
import { formatDateTime } from "@/lib/format";

interface TrackChatProps {
  trackId: string;
  hostId: string;
  hostName: string;
}

export function TrackChat({ trackId, hostId, hostName }: TrackChatProps) {
  const user = useAuthStore((s) => s.user);
  const send = useMessagesStore((s) => s.send);
  const getConversation = useMessagesStore((s) => s.getConversation);
  const fetchMessages = useMessagesStore((s) => s.fetchMessages);
  const subscribeRealtime = useMessagesStore((s) => s.subscribeRealtime);
  const messageRecords = useMessagesStore((s) => s.messages);
  const hasLoaded = useMessagesStore((s) => s.hasLoaded);
  const messages = useMemo(
    () =>
      user ? getConversation(user.id, hostId, trackId) : [],
    [getConversation, messageRecords, user, hostId, trackId]
  );
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;
    if (!hasLoaded) fetchMessages();
    subscribeRealtime(user.id);
  }, [user, hasLoaded, fetchMessages, subscribeRealtime]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim() || !user) return;
    setError("");
    startTransition(async () => {
      const result = await send({
        trackId,
        senderId: user.id,
        receiverId: hostId,
        content,
      });
      if (result.error) setError(result.error);
      else setContent("");
    });
  }

  if (!user) {
    return (
      <GlassCard className="p-6 text-center text-sm text-muted-foreground">
        Autentifică-te pentru a contacta proprietarul.
      </GlassCard>
    );
  }

  return (
    <GlassCard className="flex h-[420px] flex-col overflow-hidden">
      <div className="border-b border-white/5 px-4 py-3">
        <p className="font-heading font-semibold">Chat cu {hostName}</p>
        <p className="text-xs text-muted-foreground">
          Întreabă despre condiții, închiriere moto sau disponibilitate
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-8">
            Niciun mesaj încă. Scrie proprietarului!
          </p>
        ) : (
          messages.map((msg) => {
            const isMine = msg.senderId === user.id;
            return (
              <div
                key={msg.id}
                className={`flex ${isMine ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                    isMine
                      ? "bg-primary text-primary-foreground"
                      : "bg-white/10"
                  }`}
                >
                  <p>{msg.content}</p>
                  <p
                    className={`mt-1 text-[10px] ${isMine ? "text-primary-foreground/70" : "text-muted-foreground"}`}
                  >
                    {formatDateTime(msg.createdAt)}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {error && (
        <p className="border-t border-white/5 px-4 py-2 text-xs text-destructive">
          {error}
        </p>
      )}

      <form
        onSubmit={handleSend}
        className="flex gap-2 border-t border-white/5 p-3"
      >
        <Input
          placeholder="Ex: Aveți KTM EXC 250 disponibil duminică?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={pending}
        />
        <Button type="submit" size="icon" disabled={pending || !content.trim()}>
          {pending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Send className="size-4" />
          )}
        </Button>
      </form>
    </GlassCard>
  );
}
