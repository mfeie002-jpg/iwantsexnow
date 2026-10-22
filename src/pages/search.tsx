import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Heart, MapPin, MessageCircle, Star, Search as SearchIcon, Filter } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useToast } from "@/hooks/use-toast";

export default function Search() {
  const router = useRouter();
  const { toast } = useToast();
  const [scrolled, setScrolled] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 50);
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setHeaderVisible(false);
      } else {
        setHeaderVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const [filters, setFilters] = useState({
    gender: "all",
    ageMin: 18,
    ageMax: 50,
    city: "",
    onlineOnly: false,
    verifiedOnly: false
  });

  const [sortBy, setSortBy] = useState<"newest" | "distance" | "popular" | "age">("newest");

  // Extended mock profiles data
  const allProfiles = [
    {
      id: 1,
      name: "Sarah",
      age: 26,
      gender: "female",
      location: "Zürich",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
      online: true,
      verified: true,
      bio: "Love traveling and meeting new people"
    },
    {
      id: 2,
      name: "Mia",
      age: 24,
      gender: "female",
      location: "Genève",
      image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop",
      online: true,
      verified: true,
      bio: "Looking for genuine connections"
    },
    {
      id: 3,
      name: "Emma",
      age: 28,
      gender: "female",
      location: "Basel",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop",
      online: false,
      verified: true,
      bio: "Adventure seeker and foodie"
    },
    {
      id: 4,
      name: "Laura",
      age: 25,
      gender: "female",
      location: "Bern",
      image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop",
      online: true,
      verified: false,
      bio: "Coffee lover and book enthusiast"
    },
    {
      id: 5,
      name: "Nina",
      age: 27,
      gender: "female",
      location: "Lausanne",
      image: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&h=400&fit=crop",
      online: true,
      verified: true,
      bio: "Fitness enthusiast and traveler"
    },
    {
      id: 6,
      name: "Sophie",
      age: 23,
      gender: "female",
      location: "Zürich",
      image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=400&fit=crop",
      online: false,
      verified: true,
      bio: "Art lover and wine connoisseur"
    },
    {
      id: 7,
      name: "Max",
      age: 30,
      gender: "male",
      location: "Zürich",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
      online: true,
      verified: true,
      bio: "Tech entrepreneur and adventure seeker"
    },
    {
      id: 8,
      name: "Luca",
      age: 28,
      gender: "male",
      location: "Genève",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
      online: true,
      verified: false,
      bio: "Musician and coffee addict"
    },
    {
      id: 9,
      name: "Anna",
      age: 29,
      gender: "female",
      location: "Lugano",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
      online: true,
      verified: true,
      bio: "Yoga instructor and nature lover"
    }
  ];

  const filteredProfiles = allProfiles.filter(profile => {
    if (filters.gender !== "all" && profile.gender !== filters.gender) return false;
    if (profile.age < filters.ageMin || profile.age > filters.ageMax) return false;
    if (filters.city && !profile.location.toLowerCase().includes(filters.city.toLowerCase())) return false;
    if (filters.onlineOnly && !profile.online) return false;
    if (filters.verifiedOnly && !profile.verified) return false;
    return true;
  });

  // Sorting
  const sortedProfiles = [...filteredProfiles].sort((a, b) => {
    switch (sortBy) {
      case "age":
        return a.age - b.age;
      case "popular":
        return b.id - a.id; // Simulate popularity
      case "newest":
      default:
        return b.id - a.id;
    }
  });

  // Show search results count
  useEffect(() => {
    if (debouncedQuery) {
      toast({
        title: `${sortedProfiles.length} Profile gefunden`,
        description: `Suche nach: "${debouncedQuery}"`,
        duration: 2000,
      });
    }
  }, [debouncedQuery, sortedProfiles.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <header className={`border-b bg-white/80 backdrop-blur-sm fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'py-2 md:py-3' : 'py-3 md:py-4'
      } ${
        headerVisible ? 'translate-y-0' : '-translate-y-full'
      }`}>
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className={`font-bold tracking-tight transition-all duration-300 ${
              scrolled ? 'text-xl md:text-2xl' : 'text-2xl md:text-3xl'
            }`}>
              <span className="text-[#0D1B2A] dark:text-white">iWant</span>
              <span className="text-[#C69C6D] dark:text-[#D5A021]">Sex</span>
              <span className="text-[#0D1B2A] dark:text-white">Now</span>
              <span className="text-gray-500 dark:text-gray-400 text-lg">.ch</span>
            </span>
          </Link>
          <div className="flex items-center gap-2 md:gap-3">
            <Button variant="ghost" size="sm" asChild className="hidden sm:flex">
              <Link href="/messages">Messages</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/profile">Profile</Link>
            </Button>
            <Button className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700" asChild>
              <Link href="/premium">Go Premium</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 pt-24 md:pt-28">
        <div className="flex gap-6">
          {/* Filters Sidebar */}
          <Card className="w-80 p-6 h-fit sticky top-24">
            <div className="flex items-center gap-2 mb-6">
              <Filter size={24} className="text-pink-600" />
              <h2 className="text-2xl font-bold">Filters</h2>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Gender</Label>
                <Select value={filters.gender} onValueChange={(value) => setFilters({ ...filters, gender: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Genders</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Age Range: {filters.ageMin} - {filters.ageMax}</Label>
                <Slider
                  min={18}
                  max={65}
                  step={1}
                  value={[filters.ageMin, filters.ageMax]}
                  onValueChange={([min, max]) => setFilters({ ...filters, ageMin: min, ageMax: max })}
                  className="mt-2"
                />
              </div>

              <div className="space-y-2">
                <Label>City</Label>
                <Input
                  placeholder="Enter city..."
                  value={filters.city}
                  onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                />
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.onlineOnly}
                    onChange={(e) => setFilters({ ...filters, onlineOnly: e.target.checked })}
                    className="w-4 h-4 accent-pink-600"
                  />
                  <span>Demo-Status filtern</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.verifiedOnly}
                    onChange={(e) => setFilters({ ...filters, verifiedOnly: e.target.checked })}
                    className="w-4 h-4 accent-pink-600"
                  />
                  <span>Demo-Merkmal filtern</span>
                </label>
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => setFilters({
                  gender: "all",
                  ageMin: 18,
                  ageMax: 50,
                  city: "",
                  onlineOnly: false,
                  verifiedOnly: false
                })}
              >
                Reset Filters
              </Button>
            </div>
          </Card>

          {/* Results */}
          <div className="flex-1">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-4xl font-black mb-2">Beispielprofile</h1>
                  <p className="text-gray-600">Found {sortedProfiles.length} profiles matching your criteria</p>
                </div>
                <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="age">Age</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedProfiles.map((profile) => (
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
                        Demo-Status
                      </Badge>
                    )}
                    {profile.verified && (
                      <div className="absolute top-3 left-3 bg-blue-500 text-white rounded-full p-1">
                        <span className="text-xs font-bold">Demo</span>
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
                  <div className="p-4">
                    <p className="text-sm text-gray-600 mb-3">{profile.bio}</p>
                    <div className="flex gap-2">
                      <Button className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700" asChild>
                        <Link href="/messages">
                          <MessageCircle size={18} className="mr-2" />
                          Message
                        </Link>
                      </Button>
                      <Button variant="outline" size="icon">
                        <Heart size={18} />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {sortedProfiles.length === 0 && (
              <Card className="p-12 text-center">
                <SearchIcon size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-2xl font-bold mb-2">No profiles found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your filters to see more results</p>
                <Button onClick={() => setFilters({
                  gender: "all",
                  ageMin: 18,
                  ageMax: 50,
                  city: "",
                  onlineOnly: false,
                  verifiedOnly: false
                })}>
                  Reset Filters
                </Button>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}