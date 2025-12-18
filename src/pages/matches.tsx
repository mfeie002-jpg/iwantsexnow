import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, Star, Sparkles, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Matches() {
  const router = useRouter();
  
  const matches = [
    {
      id: 1,
      name: "Sarah",
      age: 26,
      location: "Zürich",
      distance: 5,
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
      matchPercentage: 94,
      online: true,
      verified: true,
      mutualInterests: ["Travel", "Fitness", "Music", "Food"],
      bio: "Love traveling and meeting new people. Looking for fun and adventure!",
      matchedDate: "Today"
    },
    {
      id: 2,
      name: "Anna",
      age: 29,
      location: "Lugano",
      distance: 180,
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
      matchPercentage: 87,
      online: true,
      verified: true,
      mutualInterests: ["Food", "Art", "Wine"],
      bio: "Yoga instructor and nature lover seeking authentic connections",
      matchedDate: "Yesterday"
    },
    {
      id: 3,
      name: "Emma",
      age: 28,
      location: "Basel",
      distance: 80,
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop",
      matchPercentage: 82,
      online: false,
      verified: true,
      mutualInterests: ["Travel", "Photography", "Hiking"],
      bio: "Adventure seeker and foodie. Life is too short for boring!",
      matchedDate: "2 days ago"
    },
    {
      id: 4,
      name: "Mia",
      age: 24,
      location: "Genève",
      distance: 150,
      image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop",
      matchPercentage: 79,
      online: true,
      verified: true,
      mutualInterests: ["Fitness", "Travel"],
      bio: "Professional woman seeking genuine connections",
      matchedDate: "3 days ago"
    },
    {
      id: 5,
      name: "Nina",
      age: 27,
      location: "Lausanne",
      distance: 200,
      image: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&h=400&fit=crop",
      matchPercentage: 76,
      online: true,
      verified: true,
      mutualInterests: ["Fitness", "Music", "Dancing"],
      bio: "Fitness instructor who loves life. No drama, just good vibes!",
      matchedDate: "1 week ago"
    }
  ];

  const icebreakers = [
    "What's your ideal weekend adventure?",
    "Coffee or wine date first?",
    "What's something you're passionate about?",
    "Best travel destination you've been to?",
    "What made you smile today?"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Heart className="text-pink-600 fill-pink-600" size={32} />
            <span className="text-2xl font-black text-pink-600">
              iWantSexNow.ch
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link href="/members">Browse</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/messages">Messages</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/profile">Profile</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-gradient-to-r from-pink-600 to-purple-600 border-0 text-lg px-6 py-2">
              <Sparkles size={18} className="mr-2" />
              {matches.length} Mutual Matches
            </Badge>
            <h1 className="text-5xl font-black mb-4">Your Matches</h1>
            <p className="text-xl text-gray-600">
              These people liked you back! Start chatting now.
            </p>
          </div>

          {/* Match Quality Indicator */}
          <Card className="p-6 mb-8 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center">
                <TrendingUp className="text-white" size={32} />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-green-900 mb-1">Great Match Quality!</h3>
                <p className="text-green-800">
                  Your matches have an average compatibility of 84%. You share common interests and are likely to connect well!
                </p>
              </div>
            </div>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            {matches.map((match) => (
              <Card key={match.id} className="overflow-hidden hover:shadow-2xl transition-all duration-300">
                <div className="relative">
                  <img
                    src={match.image}
                    alt={match.name}
                    className="w-full h-64 object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                    onClick={() => router.push(`/profile/${match.id}`)}
                  />
                  {match.online && (
                    <Badge className="absolute top-3 right-3 bg-green-500 border-0">
                      Online
                    </Badge>
                  )}
                  {match.verified && (
                    <div className="absolute top-3 left-3 bg-blue-500 text-white rounded-full p-1">
                      <Star size={16} fill="white" />
                    </div>
                  )}
                  <div className="absolute top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-pink-600 to-purple-600 border-0 text-lg px-4 py-1">
                      <Sparkles size={16} className="mr-1" />
                      {match.matchPercentage}% Match
                    </Badge>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4">
                    <h3 className="text-white text-2xl font-bold">{match.name}, {match.age}</h3>
                    <p className="text-white/90 text-sm">{match.location} • {match.distance} km away</p>
                    <p className="text-white/70 text-xs mt-1">Matched {match.matchedDate}</p>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <p className="text-gray-700">{match.bio}</p>

                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-2">Mutual Interests:</p>
                    <div className="flex flex-wrap gap-2">
                      {match.mutualInterests.map((interest, idx) => (
                        <Badge key={idx} variant="secondary" className="bg-pink-100 text-pink-700">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Break the ice:</p>
                    <div className="grid gap-2">
                      {icebreakers.slice(0, 2).map((icebreaker, idx) => (
                        <Button
                          key={idx}
                          variant="outline"
                          size="sm"
                          className="text-left justify-start h-auto py-2 px-3 text-xs"
                          onClick={() => router.push('/messages')}
                        >
                          💬 "{icebreaker}"
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700" asChild>
                      <Link href="/messages">
                        <MessageCircle size={18} className="mr-2" />
                        Start Chat
                      </Link>
                    </Button>
                    <Button variant="outline" size="icon">
                      <Heart size={18} className="fill-pink-600 text-pink-600" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {matches.length === 0 && (
            <Card className="p-12 text-center">
              <Sparkles size={64} className="mx-auto text-gray-300 mb-4" />
              <h2 className="text-2xl font-bold mb-2">No matches yet</h2>
              <p className="text-gray-600 mb-6">
                Start liking profiles to find your mutual matches!
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