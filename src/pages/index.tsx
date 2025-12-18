import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Heart, MessageCircle, Star } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");

  // Mock profiles data
  const featuredProfiles = [
    {
      id: 1,
      name: "Sarah",
      age: 26,
      location: "Zürich",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
      online: true,
      verified: true
    },
    {
      id: 2,
      name: "Mia",
      age: 24,
      location: "Genève",
      image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop",
      online: true,
      verified: true
    },
    {
      id: 3,
      name: "Emma",
      age: 28,
      location: "Basel",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop",
      online: false,
      verified: true
    },
    {
      id: 4,
      name: "Laura",
      age: 25,
      location: "Bern",
      image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop",
      online: true,
      verified: false
    },
    {
      id: 5,
      name: "Nina",
      age: 27,
      location: "Lausanne",
      image: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&h=400&fit=crop",
      online: true,
      verified: true
    },
    {
      id: 6,
      name: "Sophie",
      age: 23,
      location: "Zürich",
      image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=400&fit=crop",
      online: false,
      verified: true
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Heart className="text-pink-600 fill-pink-600" size={32} />
            <span className="text-2xl font-black bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              iWantSexNow.ch
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700" asChild>
              <Link href="/register">Register Free</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-5xl md:text-7xl font-black leading-tight">
            <span className="bg-gradient-to-r from-pink-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Meet Singles
            </span>
            <br />
            <span className="text-gray-900">Near You Tonight</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto font-medium">
            Thousands of verified members are waiting to connect with you. Join Switzerland's hottest dating community.
          </p>

          {/* Search Box */}
          <div className="max-w-2xl mx-auto mt-8">
            <Card className="p-2 shadow-2xl border-2">
              <div className="flex gap-2">
                <div className="flex-1 flex items-center gap-2 px-3">
                  <Search className="text-gray-400" size={20} />
                  <Input
                    placeholder="Search by city or canton..."
                    className="border-0 focus-visible:ring-0 text-lg"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button size="lg" className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 px-8">
                  Search
                </Button>
              </div>
            </Card>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 pt-8">
            <div className="text-center">
              <div className="text-4xl font-black text-pink-600">50K+</div>
              <div className="text-sm text-gray-600 font-medium">Active Members</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black text-purple-600">15K+</div>
              <div className="text-sm text-gray-600 font-medium">Online Now</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black text-pink-600">100%</div>
              <div className="text-sm text-gray-600 font-medium">Free to Join</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Profiles */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black mb-4">Members Online Now</h2>
          <p className="text-xl text-gray-600">Connect with verified profiles instantly</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {featuredProfiles.map((profile) => (
            <Card key={profile.id} className="overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
              <div className="relative">
                <img
                  src={profile.image}
                  alt={profile.name}
                  className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
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
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <h3 className="text-white text-2xl font-bold">{profile.name}, {profile.age}</h3>
                  <div className="flex items-center gap-1 text-white/90">
                    <MapPin size={16} />
                    <span>{profile.location}</span>
                  </div>
                </div>
              </div>
              <div className="p-4 flex gap-2">
                <Button className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700">
                  <MessageCircle size={18} className="mr-2" />
                  Message
                </Button>
                <Button variant="outline" size="icon">
                  <Heart size={18} />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button size="lg" variant="outline" className="text-lg px-8">
            View All Profiles
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="bg-gradient-to-r from-pink-600 to-purple-600 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white space-y-6">
            <h2 className="text-4xl font-black">Why Join iWantSexNow.ch?</h2>
            <div className="grid md:grid-cols-3 gap-8 pt-8">
              <div className="space-y-3">
                <div className="text-5xl">✓</div>
                <h3 className="text-xl font-bold">Verified Profiles</h3>
                <p className="text-white/90">All members are verified for your safety and peace of mind</p>
              </div>
              <div className="space-y-3">
                <div className="text-5xl">✓</div>
                <h3 className="text-xl font-bold">100% Discreet</h3>
                <p className="text-white/90">Your privacy is our priority. Anonymous browsing available</p>
              </div>
              <div className="space-y-3">
                <div className="text-5xl">✓</div>
                <h3 className="text-xl font-bold">Instant Matching</h3>
                <p className="text-white/90">Advanced algorithm connects you with compatible members</p>
              </div>
            </div>
            <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 mt-8 text-lg px-12" asChild>
              <Link href="/register">Join Free Now</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Heart className="text-pink-600 fill-pink-600" size={24} />
                <span className="text-xl font-bold">iWantSexNow.ch</span>
              </div>
              <p className="text-gray-400 text-sm">
                Switzerland's leading adult dating platform
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/about" className="hover:text-white">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
                <li><Link href="/careers" className="hover:text-white">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
                <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
                <li><Link href="/safety" className="hover:text-white">Safety Tips</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/help" className="hover:text-white">Help Center</Link></li>
                <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
                <li><Link href="/report" className="hover:text-white">Report Abuse</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>© {new Date().getFullYear()} iWantSexNow.ch. All rights reserved. | 18+ Only</p>
            <p className="mt-2">This site is intended for adults only and may contain adult content.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}