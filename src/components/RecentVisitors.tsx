import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Star, Heart, MessageCircle } from "lucide-react";
import Link from "next/link";

export function RecentVisitors() {
  const visitors = [
    {
      id: 1,
      name: "Emma",
      age: 28,
      location: "Basel",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop",
      visitTime: "2 minutes ago",
      online: true,
      verified: true
    },
    {
      id: 2,
      name: "Mia",
      age: 24,
      location: "Genève",
      image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&h=200&fit=crop",
      visitTime: "15 minutes ago",
      online: true,
      verified: true
    },
    {
      id: 3,
      name: "Sophie",
      age: 23,
      location: "Zürich",
      image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=200&h=200&fit=crop",
      visitTime: "1 hour ago",
      online: false,
      verified: true
    },
    {
      id: 4,
      name: "Nina",
      age: 27,
      location: "Lausanne",
      image: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=200&h=200&fit=crop",
      visitTime: "3 hours ago",
      online: true,
      verified: false
    },
    {
      id: 5,
      name: "Laura",
      age: 25,
      location: "Bern",
      image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop",
      visitTime: "5 hours ago",
      online: false,
      verified: false
    }
  ];

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Eye className="text-pink-600" size={24} />
          <h3 className="text-xl font-bold">Recent Visitors</h3>
        </div>
        <Badge className="bg-pink-600">{visitors.length} new</Badge>
      </div>

      <div className="space-y-3">
        {visitors.map((visitor) => (
          <div key={visitor.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border">
            <div className="relative">
              <img
                src={visitor.image}
                alt={visitor.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              {visitor.online && (
                <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
              )}
              {visitor.verified && (
                <div className="absolute top-0 right-0 bg-blue-500 text-white rounded-full p-0.5">
                  <Star size={12} fill="white" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-bold text-sm">{visitor.name}, {visitor.age}</h4>
                {visitor.online && (
                  <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                    Online
                  </Badge>
                )}
              </div>
              <p className="text-xs text-gray-600">{visitor.location}</p>
              <p className="text-xs text-gray-500">{visitor.visitTime}</p>
            </div>
            <div className="flex gap-1">
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0" asChild>
                <Link href={`/profile/${visitor.id}`}>
                  <Eye size={16} />
                </Link>
              </Button>
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                <Heart size={16} />
              </Button>
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0" asChild>
                <Link href="/messages">
                  <MessageCircle size={16} />
                </Link>
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Button variant="outline" className="w-full mt-4" asChild>
        <Link href="/visitors">View All Visitors</Link>
      </Button>
    </Card>
  );
}