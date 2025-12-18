import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, MapPin, MessageCircle, Star, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Favorites() {
  const router = useRouter();
  const [favorites, setFavorites] = useState<any[]>([]);

  useEffect(() => {
    // Load favorites from localStorage
    const savedFavorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    setFavorites(savedFavorites);
  }, []);

  const removeFavorite = (id: number) => {
    const updated = favorites.filter(f => f.id !== id);
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  // Mock favorites data
  const mockFavorites = [
    {
      id: 1,
      name: "Sarah",
      age: 26,
      location: "Zürich",
      distance: 5,
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
      online: true,
      verified: true,
      lastActive: "Active now",
      bio: "Love traveling and meeting new people"
    },
    {
      id: 2,
      name: "Mia",
      age: 24,
      location: "Genève",
      distance: 150,
      image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop",
      online: true,
      verified: true,
      lastActive: "Active now",
      bio: "Looking for genuine connections"
    },
    {
      id: 5,
      name: "Nina",
      age: 27,
      location: "Lausanne",
      distance: 200,
      image: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&h=400&fit=crop",
      online: true,
      verified: true,
      lastActive: "Active now",
      bio: "Fitness enthusiast and traveler"
    }
  ];

  const displayFavorites = favorites.length > 0 ? favorites : mockFavorites;

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
          <div className="mb-8">
            <h1 className="text-4xl font-black mb-2">Your Favorites</h1>
            <p className="text-gray-600">
              {displayFavorites.length} {displayFavorites.length === 1 ? "profile" : "profiles"} you've liked
            </p>
          </div>

          {displayFavorites.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayFavorites.map((profile) => (
                <Card key={profile.id} className="overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
                  <div className="relative">
                    <img
                      src={profile.image}
                      alt={profile.name}
                      className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
                      onClick={() => router.push(`/profile/${profile.id}`)}
                    />
                    {profile.online && (
                      <Badge className="absolute top-3 right-3 bg-green-500 border-0">
                        Online
                      </Badge>
                    )}
                    {profile.verified && (
                      <div className="absolute top-3 left-3 bg-blue-500 text-white rounded-full p-1">
                        <Star size={16} fill="white" />
                      </div>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFavorite(profile.id);
                      }}
                      className="absolute top-3 right-3 bg-red-500 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={16} />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                      <h3 className="text-white text-2xl font-bold">{profile.name}, {profile.age}</h3>
                      <div className="flex items-center gap-1 text-white/90 text-sm">
                        <MapPin size={14} />
                        <span>{profile.location} • {profile.distance} km</span>
                      </div>
                      <p className="text-white/80 text-xs mt-1">{profile.lastActive}</p>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-gray-600 mb-3">{profile.bio}</p>
                    <div className="flex gap-2">
                      <Button className="flex-1 bg-pink-600 hover:bg-pink-700" asChild>
                        <Link href="/messages">
                          <MessageCircle size={18} className="mr-2" />
                          Message
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => removeFavorite(profile.id)}
                      >
                        <Heart size={18} className="fill-pink-600 text-pink-600" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <Heart size={64} className="mx-auto text-gray-300 mb-4" />
              <h2 className="text-2xl font-bold mb-2">No favorites yet</h2>
              <p className="text-gray-600 mb-6">
                Start browsing and add members you like to your favorites!
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