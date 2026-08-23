"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Bell, MessageSquare, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAuthStore } from "@/stores/auth-store";
import { useMessagesStore } from "@/stores/messages-store";
import { useBookingsStore } from "@/stores/bookings-store";
import { useTracksStore } from "@/stores/tracks-store";
import { formatDateTime } from "@/lib/format";

interface NotificationItem {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  href: string;
  time: string;
}

export function NotificationsPopover() {
  const user = useAuthStore((s) => s.user);
  const messages = useMessagesStore((s) => s.messages);
  const bookingRecords = useBookingsStore((s) => s.bookings);
  const trackRecords = useTracksStore((s) => s.tracks);

  const notifications = useMemo<NotificationItem[]>(() => {
    if (!user) return [];
    const items: NotificationItem[] = [];

    const unread = messages.filter(
      (m) => m.receiverId === user.id && !m.read
    );
    for (const msg of unread) {
      items.push({
        id: `msg-${msg.id}`,
        icon: MessageSquare,
        title: `Mesaj nou de la ${msg.senderName ?? "Utilizator"}`,
        description: msg.content,
        href: "/dashboard/messages",
        time: msg.createdAt,
      });
    }

    if (user.role === "host") {
      const hostTrackIds = trackRecords
        .filter((t) => t.hostId === user.id)
        .map((t) => t.id);
      const pending = bookingRecords.filter(
        (b) => hostTrackIds.includes(b.trackId) && b.status === "pending"
      );
      for (const booking of pending) {
        items.push({
          id: `booking-${booking.id}`,
          icon: Clock,
          title: "Rezervare în așteptare",
          description: `${booking.trackName} — ${booking.riderName}, ${booking.slotDate}`,
          href: "/dashboard/bookings",
          time: booking.createdAt,
        });
      }
    }

    return items.sort(
      (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()
    );
  }, [user, messages, bookingRecords, trackRecords]);

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button variant="ghost" size="icon" className="relative" aria-label="Notificări">
            <Bell className="size-5" />
            {notifications.length > 0 && (
              <Badge className="absolute -right-1 -top-1 size-4 justify-center rounded-full p-0 text-[10px]">
                {notifications.length}
              </Badge>
            )}
          </Button>
        }
      />
      <PopoverContent className="w-80 p-0">
        <div className="border-b border-white/5 px-4 py-3">
          <p className="text-sm font-semibold">Notificări</p>
        </div>
        <div className="max-h-80 overflow-y-auto p-1.5">
          {notifications.length === 0 ? (
            <p className="px-3 py-6 text-center text-sm text-muted-foreground">
              Nicio notificare nouă
            </p>
          ) : (
            notifications.map((n) => (
              <Link
                key={n.id}
                href={n.href}
                className="flex gap-3 rounded-lg p-3 text-sm hover:bg-white/5"
              >
                <n.icon className="mt-0.5 size-4 shrink-0 text-primary" />
                <div className="min-w-0">
                  <p className="font-medium leading-tight">{n.title}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {n.description}
                  </p>
                  <p className="mt-0.5 text-[10px] text-muted-foreground/70">
                    {formatDateTime(n.time)}
                  </p>
                </div>
              </Link>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
