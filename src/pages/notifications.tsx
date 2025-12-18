import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, Eye, Star, Bell, Settings, Trash2 } from "lucide-react";
import Link from "next/link";

export default function Notifications() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "like",
      user: "Sarah",
      userImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
      message: "liked your profile",
      time: "2 minutes ago",
      read: false
    },
    {
      id: 2,
      type: "message",
      user: "Mia",
      userImage: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&h=100&fit=crop",
      message: "sent you a message",
      time: "15 minutes ago",
      read: false
    },
    {
      id: 3,
      type: "view",
      user: "Emma",
      userImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
      message: "viewed your profile",
      time: "1 hour ago",
      read: true
    },
    {
      id: 4,
      type: "match",
      user: "Nina",
      userImage: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=100&h=100&fit=crop",
      message: "It's a match! Start chatting now",
      time: "2 hours ago",
      read: false
    },
    {
      id: 5,
      type: "like",
      user: "Sophie",
      userImage: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=100&h=100&fit=crop",
      message: "liked your profile",
      time: "3 hours ago",
      read: true
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const getIcon = (type: string) => {
    switch(type) {
      case "like": return <Heart className="text-pink-600 fill-pink-600" size={20} />;
      case "message": return <MessageCircle className="text-purple-600" size={20} />;
      case "view": return <Eye className="text-blue-600" size={20} />;
      case "match": return <Star className="text-yellow-600 fill-yellow-600" size={20} />;
      default: return <Bell className="text-gray-600" size={20} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-50">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Heart className="text-pink-600 fill-pink-600 w-7 h-7 md:w-8 md:h-8" />
              <span className="text-xl md:text-2xl font-black text-pink-600">
                iWantSexNow.ch
              </span>
            </Link>
            <div className="flex items-center gap-2 md:gap-3">
              <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
                <Link href="/members">Browse</Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/profile">Profile</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 md:mb-8 gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-black mb-2">Notifications</h1>
              <p className="text-sm md:text-base text-gray-600">
                {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
              </p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              {unreadCount > 0 && (
                <Button variant="outline" size="sm" onClick={markAllAsRead} className="flex-1 sm:flex-none">
                  Mark all read
                </Button>
              )}
              <Button variant="ghost" size="icon">
                <Settings size={20} />
              </Button>
            </div>
          </div>

          {notifications.length > 0 ? (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <Card
                  key={notification.id}
                  className={`p-4 cursor-pointer transition-all hover:shadow-lg ${
                    !notification.read ? 'bg-pink-50 border-pink-200' : ''
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={notification.userImage}
                      alt={notification.user}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className="font-semibold">
                            {notification.user}{" "}
                            <span className="font-normal text-gray-700">
                              {notification.message}
                            </span>
                          </p>
                          <p className="text-sm text-gray-500 mt-1">{notification.time}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {getIcon(notification.type)}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notification.id);
                            }}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </div>
                      {!notification.read && (
                        <Badge className="bg-pink-600 mt-2">New</Badge>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <Bell size={64} className="mx-auto text-gray-300 mb-4" />
              <h2 className="text-2xl font-bold mb-2">No notifications</h2>
              <p className="text-gray-600 mb-6">
                You're all caught up! Check back later for updates.
              </p>
              <Button className="bg-pink-600 hover:bg-pink-700" asChild>
                <Link href="/members">Browse Members</Link>
              </Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}