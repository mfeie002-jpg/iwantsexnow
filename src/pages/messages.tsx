import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Send, Search, MoreVertical } from "lucide-react";
import Link from "next/link";

interface Message {
  id: number;
  text: string;
  sender: "user" | "other";
  timestamp: string;
}

interface Conversation {
  id: number;
  name: string;
  image: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  online: boolean;
}

export default function Messages() {
  const [selectedChat, setSelectedChat] = useState<number>(1);
  const [messageText, setMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);

  const conversations: Conversation[] = [
    {
      id: 1,
      name: "Sarah",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
      lastMessage: "Hey! How are you doing?",
      timestamp: "2m ago",
      unread: 2,
      online: true
    },
    {
      id: 2,
      name: "Mia",
      image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&h=100&fit=crop",
      lastMessage: "Would love to meet up sometime",
      timestamp: "1h ago",
      unread: 0,
      online: true
    },
    {
      id: 3,
      name: "Emma",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
      lastMessage: "Thanks for the message!",
      timestamp: "3h ago",
      unread: 1,
      online: false
    },
    {
      id: 4,
      name: "Nina",
      image: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=100&h=100&fit=crop",
      lastMessage: "That sounds amazing!",
      timestamp: "1d ago",
      unread: 0,
      online: true
    }
  ];

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hi! I saw your profile and wanted to say hello",
      sender: "other",
      timestamp: "10:30 AM"
    },
    {
      id: 2,
      text: "Hey! Thanks for reaching out 😊",
      sender: "user",
      timestamp: "10:32 AM"
    },
    {
      id: 3,
      text: "How are you doing?",
      sender: "other",
      timestamp: "10:33 AM"
    },
    {
      id: 4,
      text: "I'm great! Just browsing around. How about you?",
      sender: "user",
      timestamp: "10:35 AM"
    }
  ]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    const newMessage: Message = {
      id: messages.length + 1,
      text: messageText,
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, newMessage]);
    setMessageText("");
  };

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentConversation = conversations.find(c => c.id === selectedChat);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <header className={`border-b bg-white/80 backdrop-blur-sm fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'py-2 md:py-3' : 'py-3 md:py-4'
      } ${
        headerVisible ? 'translate-y-0' : '-translate-y-full'
      }`}>
        <div className="container mx-auto px-4 py-3 md:py-4">
          <div className="flex items-center justify-between gap-2">
            <Link href="/" className="flex items-center gap-2 min-w-0">
              <Heart className={`text-pink-600 fill-pink-600 flex-shrink-0 transition-all duration-300 ${
                scrolled ? 'w-6 h-6 md:w-7 md:h-7' : 'w-7 h-7 md:w-8 md:h-8'
              }`} />
              <span className="text-lg md:text-2xl font-black text-pink-600 truncate">
                iWantSexNow.ch
              </span>
            </Link>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex text-xs md:text-sm">
                <Link href="/search">Browse</Link>
              </Button>
              <Button variant="ghost" size="sm" asChild className="text-xs md:text-sm">
                <Link href="/profile">Profile</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 md:py-12 pt-24 md:pt-28">
        <h1 className="text-3xl md:text-4xl font-black mb-6">Messages</h1>

        <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-250px)]">
          {/* Conversations List */}
          <Card className="lg:col-span-1 overflow-hidden flex flex-col">
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  placeholder="Search messages..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {filteredConversations.map((conv) => (
                <div
                  key={conv.id}
                  className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedChat === conv.id ? "bg-pink-50" : ""
                  }`}
                  onClick={() => setSelectedChat(conv.id)}
                >
                  <div className="flex gap-3">
                    <div className="relative">
                      <img
                        src={conv.image}
                        alt={conv.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      {conv.online && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold truncate">{conv.name}</h3>
                        <span className="text-xs text-gray-500">{conv.timestamp}</span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">{conv.lastMessage}</p>
                    </div>
                    {conv.unread > 0 && (
                      <Badge className="bg-pink-600 h-5 min-w-5 flex items-center justify-center">
                        {conv.unread}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Chat Window */}
          <Card className="lg:col-span-2 overflow-hidden flex flex-col">
            {currentConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b bg-white flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={currentConversation.image}
                        alt={currentConversation.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      {currentConversation.online && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold">{currentConversation.name}</h3>
                      <p className="text-sm text-gray-600">
                        {currentConversation.online ? "Active now" : "Offline"}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <MoreVertical size={20} />
                  </Button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                          message.sender === "user"
                            ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white"
                            : "bg-white border"
                        }`}
                      >
                        <p>{message.text}</p>
                        <p
                          className={`text-xs mt-1 ${
                            message.sender === "user" ? "text-white/70" : "text-gray-500"
                          }`}
                        >
                          {message.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <form onSubmit={handleSendMessage} className="p-4 border-t bg-white">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type a message..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      type="submit"
                      size="icon"
                      className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
                    >
                      <Send size={20} />
                    </Button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                Select a conversation to start messaging
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}