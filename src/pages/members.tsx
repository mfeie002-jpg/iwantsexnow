import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Heart, MapPin, MessageCircle, Star, Search as SearchIcon, Filter, Camera, Eye, Calendar, Zap, Gift } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Members() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

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

  const [filters, setFilters] = useState({
    gender: "all",
    ageMin: 18,
    ageMax: 65,
    location: "",
    distance: 50,
    lookingFor: "all",
    bodyType: "all",
    height: "all",
    relationship: "all",
    smoking: "all",
    drinking: "all",
    onlineOnly: false,
    verifiedOnly: false,
    withPhotos: true
  });

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Extended mock profiles with detailed info
  const allProfiles = [
    {
      id: 1,
      name: "Sarah",
      age: 26,
      gender: "female",
      location: "Zürich",
      distance: 5,
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
      images: 8,
      online: true,
      verified: true,
      lastActive: "Active now",
      bio: "Love traveling and meeting new people. Looking for fun and adventure!",
      lookingFor: "Casual dating",
      bodyType: "Athletic",
      height: "168 cm",
      relationship: "Single",
      smoking: "No",
      drinking: "Socially"
    },
    {
      id: 2,
      name: "Mia",
      age: 24,
      gender: "female",
      location: "Genève",
      distance: 150,
      image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop",
      images: 12,
      online: true,
      verified: true,
      lastActive: "Active now",
      bio: "Professional woman seeking genuine connections and good times",
      lookingFor: "Friends with benefits",
      bodyType: "Slim",
      height: "165 cm",
      relationship: "Single",
      smoking: "No",
      drinking: "Occasionally"
    },
    {
      id: 3,
      name: "Emma",
      age: 28,
      gender: "female",
      location: "Basel",
      distance: 80,
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop",
      images: 6,
      online: false,
      verified: true,
      lastActive: "2 hours ago",
      bio: "Adventure seeker and foodie. Life is too short for boring conversations!",
      lookingFor: "Open relationship",
      bodyType: "Average",
      height: "170 cm",
      relationship: "It's complicated",
      smoking: "No",
      drinking: "Yes"
    },
    {
      id: 4,
      name: "Max",
      age: 30,
      gender: "male",
      location: "Zürich",
      distance: 3,
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
      images: 5,
      online: true,
      verified: true,
      lastActive: "Active now",
      bio: "Tech entrepreneur and fitness enthusiast. Let's make memories!",
      lookingFor: "Casual dating",
      bodyType: "Athletic",
      height: "182 cm",
      relationship: "Single",
      smoking: "No",
      drinking: "Socially"
    },
    {
      id: 5,
      name: "Laura",
      age: 25,
      gender: "female",
      location: "Bern",
      distance: 120,
      image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop",
      images: 10,
      online: true,
      verified: false,
      lastActive: "Active now",
      bio: "Coffee lover and book enthusiast. Looking for spontaneous adventures",
      lookingFor: "Casual encounters",
      bodyType: "Curvy",
      height: "163 cm",
      relationship: "Single",
      smoking: "Sometimes",
      drinking: "Yes"
    },
    {
      id: 6,
      name: "Nina",
      age: 27,
      gender: "female",
      location: "Lausanne",
      distance: 200,
      image: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&h=400&fit=crop",
      images: 15,
      online: true,
      verified: true,
      lastActive: "Active now",
      bio: "Fitness instructor who loves life. No drama, just good vibes!",
      lookingFor: "Friends with benefits",
      bodyType: "Athletic",
      height: "172 cm",
      relationship: "Single",
      smoking: "No",
      drinking: "Socially"
    },
    {
      id: 7,
      name: "Sophie",
      age: 23,
      gender: "female",
      location: "Zürich",
      distance: 8,
      image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=400&fit=crop",
      images: 9,
      online: false,
      verified: true,
      lastActive: "1 day ago",
      bio: "Art lover and wine connoisseur. Let's explore the city together!",
      lookingFor: "Casual dating",
      bodyType: "Slim",
      height: "166 cm",
      relationship: "Single",
      smoking: "No",
      drinking: "Yes"
    },
    {
      id: 8,
      name: "Luca",
      age: 28,
      gender: "male",
      location: "Genève",
      distance: 155,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
      images: 7,
      online: true,
      verified: false,
      lastActive: "Active now",
      bio: "Musician and coffee addict. Always up for new experiences",
      lookingFor: "Casual encounters",
      bodyType: "Average",
      height: "178 cm",
      relationship: "Single",
      smoking: "No",
      drinking: "Socially"
    }
  ];

  const filteredProfiles = allProfiles.filter(profile => {
    if (filters.gender !== "all" && profile.gender !== filters.gender) return false;
    if (profile.age < filters.ageMin || profile.age > filters.ageMax) return false;
    if (filters.location && !profile.location.toLowerCase().includes(filters.location.toLowerCase())) return false;
    if (profile.distance > filters.distance) return false;
    if (filters.lookingFor !== "all" && profile.lookingFor !== filters.lookingFor) return false;
    if (filters.bodyType !== "all" && profile.bodyType !== filters.bodyType) return false;
    if (filters.onlineOnly && !profile.online) return false;
    if (filters.verifiedOnly && !profile.verified) return false;
    if (filters.withPhotos && profile.images < 3) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-[#0D1B2A] dark:via-[#1a2a3a] dark:to-[#0D1B2A]">
      <header className={`border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-[#0D1B2A]/80 backdrop-blur-sm fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'py-2 md:py-3' : 'py-3 md:py-4'
      } ${
        headerVisible ? 'translate-y-0' : '-translate-y-full'
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
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
              <Button variant="ghost" size="sm" asChild className="hidden sm:flex">
                <Link href="/favorites">Favorites</Link>
              </Button>
              <Button variant="ghost" size="sm" asChild className="hidden md:flex">
                <Link href="/profile">Profile</Link>
              </Button>
              <Button className="bg-pink-600 hover:bg-pink-700 text-sm md:text-base" size="sm" asChild>
                <Link href="/premium">Premium</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 pt-24 md:pt-28">
        {/* Premium Upgrade Banner - Mobile Optimized */}
        <Card className="p-4 md:p-6 mb-6 md:mb-8 bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3 md:gap-4 flex-1">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center flex-shrink-0">
                <Zap className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-lg md:text-2xl font-black mb-1">Unlock Premium Features!</h3>
                <p className="text-sm md:text-base text-gray-700">Get 10x more matches with unlimited messaging & advanced filters</p>
              </div>
            </div>
            <Button size="sm" className="w-full sm:w-auto bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 whitespace-nowrap" asChild>
              <Link href="/premium">
                <Gift size={16} className="mr-2" />
                Upgrade Now
              </Link>
            </Button>
          </div>
        </Card>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden">
            <Button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              variant="outline"
              className="w-full"
            >
              <Filter size={18} className="mr-2" />
              {showMobileFilters ? "Hide Filters" : "Show Filters"}
            </Button>
          </div>

          {/* Filters Sidebar - Responsive */}
          <Card className={`${showMobileFilters ? 'block' : 'hidden'} lg:block w-full lg:w-80 p-4 md:p-6 h-fit lg:sticky lg:top-24`}>
            <div className="flex items-center gap-2 mb-6">
              <Filter size={24} className="text-pink-600" />
              <h2 className="text-xl md:text-2xl font-bold">Advanced Filters</h2>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label>I'm looking for</Label>
                <Select value={filters.gender} onValueChange={(value) => setFilters({ ...filters, gender: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Everyone</SelectItem>
                    <SelectItem value="female">Women</SelectItem>
                    <SelectItem value="male">Men</SelectItem>
                    <SelectItem value="couple">Couples</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Age: {filters.ageMin} - {filters.ageMax}</Label>
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
                <Label>Location</Label>
                <Input
                  placeholder="City or canton..."
                  value={filters.location}
                  onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Distance: {filters.distance} km</Label>
                <Slider
                  min={5}
                  max={300}
                  step={5}
                  value={[filters.distance]}
                  onValueChange={([value]) => setFilters({ ...filters, distance: value })}
                  className="mt-2"
                />
              </div>

              <div className="space-y-2">
                <Label>Looking for</Label>
                <Select value={filters.lookingFor} onValueChange={(value) => setFilters({ ...filters, lookingFor: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Anything</SelectItem>
                    <SelectItem value="Casual dating">Casual dating</SelectItem>
                    <SelectItem value="Friends with benefits">Friends with benefits</SelectItem>
                    <SelectItem value="Casual encounters">Casual encounters</SelectItem>
                    <SelectItem value="Open relationship">Open relationship</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Body type</Label>
                <Select value={filters.bodyType} onValueChange={(value) => setFilters({ ...filters, bodyType: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any</SelectItem>
                    <SelectItem value="Slim">Slim</SelectItem>
                    <SelectItem value="Athletic">Athletic</SelectItem>
                    <SelectItem value="Average">Average</SelectItem>
                    <SelectItem value="Curvy">Curvy</SelectItem>
                    <SelectItem value="Full figured">Full figured</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={filters.onlineOnly}
                    onCheckedChange={(checked) => setFilters({ ...filters, onlineOnly: checked as boolean })}
                  />
                  <span className="text-sm">Online now only</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={filters.verifiedOnly}
                    onCheckedChange={(checked) => setFilters({ ...filters, verifiedOnly: checked as boolean })}
                  />
                  <span className="text-sm">Verified profiles only</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={filters.withPhotos}
                    onCheckedChange={(checked) => setFilters({ ...filters, withPhotos: checked as boolean })}
                  />
                  <span className="text-sm">With photos (3+)</span>
                </label>
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => setFilters({
                  gender: "all",
                  ageMin: 18,
                  ageMax: 65,
                  location: "",
                  distance: 50,
                  lookingFor: "all",
                  bodyType: "all",
                  height: "all",
                  relationship: "all",
                  smoking: "all",
                  drinking: "all",
                  onlineOnly: false,
                  verifiedOnly: false,
                  withPhotos: true
                })}
              >
                Reset All Filters
              </Button>
            </div>
          </Card>

          {/* Results - Mobile Optimized */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-black mb-2">Browse Members</h1>
                <p className="text-sm md:text-base text-gray-600">{filteredProfiles.length} profiles match your criteria</p>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                  className={`${viewMode === "grid" ? "bg-pink-600 hover:bg-pink-700" : ""} flex-1 sm:flex-none`}
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <rect x="2" y="2" width="7" height="7" />
                    <rect x="11" y="2" width="7" height="7" />
                    <rect x="2" y="11" width="7" height="7" />
                    <rect x="11" y="11" width="7" height="7" />
                  </svg>
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                  className={`${viewMode === "list" ? "bg-pink-600 hover:bg-pink-700" : ""} flex-1 sm:flex-none`}
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <rect x="2" y="3" width="16" height="3" />
                    <rect x="2" y="8" width="16" height="3" />
                    <rect x="2" y="13" width="16" height="3" />
                  </svg>
                </Button>
              </div>
            </div>

            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProfiles.map((profile) => (
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
                      <div className="absolute top-3 left-1/2 -translate-x-1/2 flex gap-2">
                        <Badge variant="secondary" className="bg-black/70 text-white border-0">
                          <Camera size={12} className="mr-1" />
                          {profile.images}
                        </Badge>
                      </div>
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
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{profile.bio}</p>
                      <div className="flex flex-wrap gap-1 mb-3">
                        <Badge variant="outline" className="text-xs">{profile.lookingFor}</Badge>
                        <Badge variant="outline" className="text-xs">{profile.bodyType}</Badge>
                        <Badge variant="outline" className="text-xs">{profile.height}</Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button className="flex-1 bg-pink-600 hover:bg-pink-700" asChild>
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
            ) : (
              <div className="space-y-4">
                {filteredProfiles.map((profile) => (
                  <Card key={profile.id} className="overflow-hidden hover:shadow-xl transition-all cursor-pointer">
                    <div className="flex gap-4 p-4">
                      <div className="relative w-32 h-32 flex-shrink-0">
                        <img
                          src={profile.image}
                          alt={profile.name}
                          className="w-full h-full object-cover rounded-lg"
                          onClick={() => router.push(`/profile/${profile.id}`)}
                        />
                        {profile.online && (
                          <div className="absolute top-2 right-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                          </div>
                        )}
                        {profile.verified && (
                          <div className="absolute top-2 left-2 bg-blue-500 text-white rounded-full p-1">
                            <Star size={12} fill="white" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-xl font-bold">{profile.name}, {profile.age}</h3>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <MapPin size={14} />
                              <span>{profile.location} • {profile.distance} km away</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">{profile.lastActive}</p>
                          </div>
                          <Badge variant="secondary" className="bg-gray-100">
                            <Camera size={12} className="mr-1" />
                            {profile.images}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{profile.bio}</p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <Badge variant="outline" className="text-xs">{profile.lookingFor}</Badge>
                          <Badge variant="outline" className="text-xs">{profile.bodyType}</Badge>
                          <Badge variant="outline" className="text-xs">{profile.height}</Badge>
                          <Badge variant="outline" className="text-xs">{profile.relationship}</Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" className="bg-pink-600 hover:bg-pink-700" asChild>
                            <Link href="/messages">
                              <MessageCircle size={16} className="mr-2" />
                              Send Message
                            </Link>
                          </Button>
                          <Button size="sm" variant="outline">
                            <Heart size={16} className="mr-2" />
                            Add to Favorites
                          </Button>
                          <Button size="sm" variant="outline" asChild>
                            <Link href={`/profile/${profile.id}`}>
                              <Eye size={16} className="mr-2" />
                              View Profile
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {filteredProfiles.length === 0 && (
              <Card className="p-12 text-center">
                <SearchIcon size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-2xl font-bold mb-2">No profiles found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your filters to see more results</p>
                <Button onClick={() => setFilters({
                  gender: "all",
                  ageMin: 18,
                  ageMax: 65,
                  location: "",
                  distance: 50,
                  lookingFor: "all",
                  bodyType: "all",
                  height: "all",
                  relationship: "all",
                  smoking: "all",
                  drinking: "all",
                  onlineOnly: false,
                  verifiedOnly: false,
                  withPhotos: true
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