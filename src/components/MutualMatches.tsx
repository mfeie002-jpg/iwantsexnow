import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Star, MessageCircle, Sparkles } from "lucide-react";
import Link from "next/link";

export function MutualMatches() {
  const matches = [
    {
      id: 1,
      name: "Sarah",
      age: 26,
      location: "Zürich",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
      matchPercentage: 94,
      online: true,
      verified: true,
      mutualInterests: ["Travel", "Fitness", "Music"]
    },
    {
      id: 2,
      name: "Anna",
      age: 29,
      location: "Lugano",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop",
      matchPercentage: 87,
      online: true,
      verified: true,
      mutualInterests: ["Food", "Art", "Wine"]
    },
    {
      id: 3,
      name: "Emma",
      age: 28,
      location: "Basel",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop",
      matchPercentage: 82,
      online: false,
      verified: true,
      mutualInterests: ["Travel", "Photography"]
    }
  ];

  return (
    <Card className="p-6 bg-gradient-to-br from-pink-50 to-purple-50 border-2 border-pink-200">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 flex items-center justify-center">
          <Sparkles className="text-white" size={20} />
        </div>
        <div>
          <h3 className="text-xl font-bold">Mutual Matches</h3>
          <p className="text-sm text-gray-600">People who liked you back!</p>
        </div>
      </div>

      <div className="space-y-4">
        {matches.map((match) => (
          <Card key={match.id} className="p-4 bg-white shadow-md hover:shadow-xl transition-all">
            <div className="flex items-start gap-4">
              <div className="relative">
                <img
                  src={match.image}
                  alt={match.name}
                  className="w-20 h-20 rounded-lg object-cover"
                />
                {match.online && (
                  <div className="absolute bottom-1 right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                )}
                {match.verified && (
                  <div className="absolute top-1 right-1 bg-blue-500 text-white rounded-full p-0.5">
                    <Star size={10} fill="white" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-bold">{match.name}, {match.age}</h4>
                  <Badge className="bg-gradient-to-r from-pink-600 to-purple-600 border-0 text-xs">
                    {match.matchPercentage}% Match
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-2">{match.location}</p>
                <div className="flex flex-wrap gap-1 mb-3">
                  {match.mutualInterests.map((interest, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {interest}
                    </Badge>
                  ))}
                </div>
                <Button size="sm" className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700" asChild>
                  <Link href="/messages">
                    <MessageCircle size={14} className="mr-2" />
                    Start Chatting
                  </Link>
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Button variant="outline" className="w-full mt-4" asChild>
        <Link href="/matches">View All Matches</Link>
      </Button>
    </Card>
  );
}