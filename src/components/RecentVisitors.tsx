import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Star, Heart, MessageCircle } from "lucide-react";
import Link from "next/link";
import { profilePhotoPlaceholder } from "@/components/night/profile-image-model";

export function RecentVisitors() {
  const visitors = [
    {
      id: 1,
      name: "Emma",
      age: 28,
      location: "Basel",
      image: profilePhotoPlaceholder("Emma"),
      visitTime: "2 minutes ago",
      online: true,
      verified: true
    },
    {
      id: 2,
      name: "Mia",
      age: 24,
      location: "Genève",
      image: profilePhotoPlaceholder("Mia"),
      visitTime: "15 minutes ago",
      online: true,
      verified: true
    },
    {
      id: 3,
      name: "Sophie",
      age: 23,
      location: "Zürich",
      image: profilePhotoPlaceholder("Sophie"),
      visitTime: "1 hour ago",
      online: false,
      verified: true
    },
    {
      id: 4,
      name: "Nina",
      age: 27,
      location: "Lausanne",
      image: profilePhotoPlaceholder("Nina"),
      visitTime: "3 hours ago",
      online: true,
      verified: false
    },
    {
      id: 5,
      name: "Laura",
      age: 25,
      location: "Bern",
      image: profilePhotoPlaceholder("Laura"),
      visitTime: "5 hours ago",
      online: false,
      verified: false
    }
  ];

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Eye className="text-glow-600" size={24} />
          <h3 className="text-xl font-bold">Recent Visitors</h3>
        </div>
        <Badge className="bg-glow-600">{visitors.length} new</Badge>
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
                <div className="absolute bottom-0 right-0 w-4 h-4 bg-mint-500 rounded-full border-2 border-white" />
              )}
              {visitor.verified && (
                <div className="absolute top-0 right-0 bg-lake-500 text-white rounded-full p-0.5">
                  <Star size={12} fill="white" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-bold text-sm">{visitor.name}, {visitor.age}</h4>
                {visitor.online && (
                  <Badge variant="secondary" className="bg-mint-100 text-mint-700 text-xs">
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
        <Link href="/members">View All Visitors</Link>
      </Button>
    </Card>
  );
}