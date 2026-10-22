import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, MapPin, MessageCircle, Star, Shield, Calendar, Briefcase, GraduationCap, ArrowLeft, Phone, Video, Clock, DollarSign, CheckCircle, XCircle, Image as ImageIcon, ThumbsUp, Share2, Flag, ChevronLeft, ChevronRight, Filter, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function ProfileDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [liked, setLiked] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  
  // Review Pagination & Filtering State
  const [reviewPage, setReviewPage] = useState(1);
  const [reviewsPerPage] = useState(5);
  const [sortBy, setSortBy] = useState<"recent" | "highest" | "lowest">("recent");
  const [filterRating, setFilterRating] = useState<number | "all">("all");
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);

  // Mock detailed profile data
  const profile = {
    id: Number(id),
    name: "Sarah",
    age: 26,
    gender: "female",
    location: "Zürich",
    images: [
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&h=800&fit=crop"
    ],
    online: true,
    verified: true,
    premium: true,
    responseTime: "Within 1 hour",
    lastActive: "5 minutes ago",
    about: "Welcome to my profile! I'm a sophisticated and elegant companion who loves meeting interesting people. I pride myself on creating genuine connections and memorable experiences. Whether you're looking for a dinner date, travel companion, or intimate moments, I ensure discretion, class, and professionalism.",
    interests: ["Travel", "Fine Dining", "Fitness", "Music", "Photography", "Art", "Wine Tasting"],
    lookingFor: "Upscale companionship, dinner dates, travel",
    education: "University Graduate - Business Administration",
    occupation: "Independent Companion",
    languages: ["German (Native)", "English (Fluent)", "French (Fluent)", "Italian (Basic)"],
    height: "168 cm",
    weight: "55 kg",
    hairColor: "Blonde",
    eyeColor: "Blue",
    bodyType: "Athletic",
    ethnicity: "European",
    joinDate: "January 2025",
    
    // Services & Rates
    services: {
      included: [
        "GFE (Girlfriend Experience)",
        "Dinner Dates",
        "Social Events",
        "Travel Companion",
        "Overnight Stays",
        "Couples Welcome",
        "Massage",
        "Role Play"
      ],
      notIncluded: [
        "Explicit Services (Ask privately)",
        "Same-day bookings under 2 hours"
      ]
    },
    
    rates: [
      { duration: "1 Hour", price: "500 CHF", description: "Perfect for a quick encounter" },
      { duration: "2 Hours", price: "900 CHF", description: "Relaxed time together", popular: true },
      { duration: "Dinner Date (4h)", price: "1,600 CHF", description: "Evening with fine dining" },
      { duration: "Overnight (12h)", price: "3,500 CHF", description: "Intimate night together" },
      { duration: "Weekend", price: "8,000 CHF", description: "Full weekend experience" },
      { duration: "Travel Day", price: "5,000 CHF", description: "24h + expenses covered" }
    ],
    
    availability: {
      monday: { available: true, times: "10:00 - 22:00" },
      tuesday: { available: true, times: "10:00 - 22:00" },
      wednesday: { available: true, times: "14:00 - 22:00" },
      thursday: { available: true, times: "10:00 - 22:00" },
      friday: { available: true, times: "10:00 - 02:00" },
      saturday: { available: true, times: "12:00 - 02:00" },
      sunday: { available: false, times: "By appointment only" }
    },
    
    // Expanded Reviews
    reviews: [
      {
        id: 1,
        author: "Michael Z.",
        rating: 5,
        date: "2 days ago",
        timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000,
        verified: true,
        comment: "Absolutely amazing experience! Sarah is everything described and more. Professional, elegant, and incredibly charming. The dinner date was perfect, and she made me feel completely at ease. Highly recommended!",
        helpful: 12
      },
      {
        id: 2,
        author: "David L.",
        rating: 5,
        date: "1 week ago",
        timestamp: Date.now() - 7 * 24 * 60 * 60 * 1000,
        verified: true,
        comment: "Best companion I've ever met. Sarah is genuine, warm, and knows exactly how to create a memorable evening. Her English is perfect, and conversation flows naturally. Will definitely meet again!",
        helpful: 8
      },
      {
        id: 3,
        author: "Thomas B.",
        rating: 5,
        date: "2 weeks ago",
        timestamp: Date.now() - 14 * 24 * 60 * 60 * 1000,
        verified: true,
        comment: "A true lady! Met Sarah for a business dinner and she was the perfect plus one. Intelligent conversation, stunning appearance, and very discreet. Worth every franc!",
        helpful: 15
      },
      {
        id: 4,
        author: "Andreas K.",
        rating: 4,
        date: "3 weeks ago",
        timestamp: Date.now() - 21 * 24 * 60 * 60 * 1000,
        verified: false,
        comment: "Great experience overall. Sarah is very professional and makes you feel comfortable. Only minor thing was that she was 15 minutes late, but she made up for it with extra time. Would book again.",
        helpful: 5
      },
      {
        id: 5,
        author: "Marco P.",
        rating: 5,
        date: "1 month ago",
        timestamp: Date.now() - 30 * 24 * 60 * 60 * 1000,
        verified: true,
        comment: "Exceptional service! Sarah exceeded all expectations. Her attention to detail and genuine personality made the entire experience unforgettable. 10/10 would recommend.",
        helpful: 20
      },
      {
        id: 6,
        author: "Stefan H.",
        rating: 5,
        date: "1 month ago",
        timestamp: Date.now() - 32 * 24 * 60 * 60 * 1000,
        verified: true,
        comment: "Perfect companion for my business trip. Sarah's multilingual skills and social grace made networking events so much easier. Highly professional.",
        helpful: 7
      },
      {
        id: 7,
        author: "Robert M.",
        rating: 4,
        date: "6 weeks ago",
        timestamp: Date.now() - 42 * 24 * 60 * 60 * 1000,
        verified: true,
        comment: "Very good experience. Sarah is beautiful and engaging. Communication before meeting was excellent. Would have given 5 stars but the location was a bit difficult to find.",
        helpful: 4
      },
      {
        id: 8,
        author: "Felix S.",
        rating: 5,
        date: "2 months ago",
        timestamp: Date.now() - 60 * 24 * 60 * 60 * 1000,
        verified: false,
        comment: "Outstanding! Sarah made my birthday celebration truly special. She's charming, intelligent, and knows how to make every moment count. Can't wait to see her again.",
        helpful: 11
      },
      {
        id: 9,
        author: "Daniel W.",
        rating: 5,
        date: "2 months ago",
        timestamp: Date.now() - 65 * 24 * 60 * 60 * 1000,
        verified: true,
        comment: "Incredible experience from start to finish. Sarah's professionalism and warmth are unmatched. She went above and beyond to ensure I had an amazing time. Definitely booking again!",
        helpful: 18
      },
      {
        id: 10,
        author: "Christian B.",
        rating: 3,
        date: "3 months ago",
        timestamp: Date.now() - 90 * 24 * 60 * 60 * 1000,
        verified: false,
        comment: "Decent experience but felt a bit rushed. Sarah is nice but I expected more for the price. Service was professional though.",
        helpful: 2
      },
      {
        id: 11,
        author: "Alexander L.",
        rating: 5,
        date: "3 months ago",
        timestamp: Date.now() - 95 * 24 * 60 * 60 * 1000,
        verified: true,
        comment: "Best decision I made! Sarah is absolutely wonderful. Her genuine personality and stunning looks make her stand out. Communication was excellent throughout.",
        helpful: 14
      },
      {
        id: 12,
        author: "Patrick K.",
        rating: 4,
        date: "4 months ago",
        timestamp: Date.now() - 120 * 24 * 60 * 60 * 1000,
        verified: true,
        comment: "Great companion for travel. Sarah adapted perfectly to different social situations. Very intelligent and well-spoken. Minor issue with scheduling but overall fantastic.",
        helpful: 6
      }
    ],
    
    stats: {
      totalReviews: 47,
      averageRating: 4.9,
      responseRate: 98,
      repeatClients: 73
    }
  };

  // Review Filtering Logic
  const getFilteredReviews = () => {
    let filtered = [...profile.reviews];

    // Filter by rating
    if (filterRating !== "all") {
      filtered = filtered.filter(review => review.rating === filterRating);
    }

    // Filter by verified status
    if (showVerifiedOnly) {
      filtered = filtered.filter(review => review.verified);
    }

    // Sort reviews
    switch (sortBy) {
      case "highest":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "lowest":
        filtered.sort((a, b) => a.rating - b.rating);
        break;
      case "recent":
      default:
        filtered.sort((a, b) => b.timestamp - a.timestamp);
        break;
    }

    return filtered;
  };

  const filteredReviews = getFilteredReviews();
  
  // Pagination Logic
  const totalReviewPages = Math.ceil(filteredReviews.length / reviewsPerPage);
  const startReviewIndex = (reviewPage - 1) * reviewsPerPage;
  const endReviewIndex = startReviewIndex + reviewsPerPage;
  const paginatedReviews = filteredReviews.slice(startReviewIndex, endReviewIndex);

  const handleReviewPageChange = (page: number) => {
    setReviewPage(page);
    document.getElementById('reviews-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleWhatsAppContact = () => { void router.push('/contact'); };
  const handlePhoneCall = () => { void router.push('/contact'); };

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star key={i} size={16} className={i < rating ? "fill-yellow-500 text-yellow-500" : "text-gray-300"} />
    ));
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    profile.reviews.forEach(review => {
      distribution[review.rating as keyof typeof distribution]++;
    });
    return distribution;
  };

  const ratingDistribution = getRatingDistribution();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <header className="border-b border-white/10 bg-black/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Heart className="text-pink-600 fill-pink-600" size={32} />
            <span className="text-2xl font-black text-white">
              iWantSexNow.ch
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Button variant="ghost" className="text-white hover:bg-white/10" asChild>
              <Link href="/search">Browse</Link>
            </Button>
            <Button variant="ghost" className="text-white hover:bg-white/10" asChild>
              <Link href="/messages">Messages</Link>
            </Button>
            <Button className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700" asChild>
              <Link href="/premium">Go Premium</Link>
            </Button>
          </div>
        </div>
      </header>

      <p className="mx-auto max-w-5xl rounded-xl border border-amber-400 bg-amber-100 p-4 text-amber-950">DEMO-PROFIL: Fiktive Person, Stockfotos und Beispielbewertungen. Nicht geprüft oder buchbar. Kontaktaufnahme ist deaktiviert.</p>
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => router.back()} className="mb-6 text-white hover:bg-white/10">
          <ArrowLeft size={20} className="mr-2" />
          Back to Search
        </Button>

        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Left Column - Photos & Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Photo Gallery */}
            <Card className="overflow-hidden bg-white/5 backdrop-blur-sm border-white/10">
              <div className="relative">
                <img
                  src={profile.images[selectedImage]}
                  alt={profile.name}
                  className="w-full h-[600px] object-cover"
                />
                {profile.online && (
                  <Badge className="absolute top-4 right-4 bg-green-500 border-0 text-lg">
                    <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse" />
                    Demo-Status
                  </Badge>
                )}
                {profile.verified && (
                  <div className="absolute top-4 left-4 bg-blue-500 text-white rounded-full p-2">
                    <Shield size={24} />
                  </div>
                )}
                {profile.premium && (
                  <Badge className="absolute bottom-4 right-4 bg-gradient-to-r from-yellow-500 to-orange-500 border-0 text-lg">
                    ⭐ Premium
                  </Badge>
                )}
              </div>
              
              {/* Thumbnail Strip */}
              <div className="grid grid-cols-6 gap-2 p-4 bg-black/40">
                {profile.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative overflow-hidden rounded-lg border-2 transition-all ${
                      selectedImage === index ? 'border-pink-500 scale-105' : 'border-white/20 hover:border-white/40'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${profile.name} ${index + 1}`}
                      className="w-full h-20 object-cover"
                    />
                  </button>
                ))}
              </div>
            </Card>

            {/* Tabbed Content */}
            <Tabs defaultValue="about" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-white/5 border border-white/10">
                <TabsTrigger value="about" className="data-[state=active]:bg-pink-600">About</TabsTrigger>
                <TabsTrigger value="services" className="data-[state=active]:bg-pink-600">Beispielkategorien &amp; Preise</TabsTrigger>
                <TabsTrigger value="availability" className="data-[state=active]:bg-pink-600">Demo-Zeiten</TabsTrigger>
                <TabsTrigger value="reviews" className="data-[state=active]:bg-pink-600">Demo-Bewertungen ({profile.stats.totalReviews})</TabsTrigger>
              </TabsList>

              <TabsContent value="about" className="space-y-6">
                <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
                  <h2 className="text-2xl font-bold text-white mb-4">About Me</h2>
                  <p className="text-gray-300 leading-relaxed">{profile.about}</p>
                </Card>

                <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
                  <h2 className="text-2xl font-bold text-white mb-4">Interests</h2>
                  <div className="flex flex-wrap gap-2">
                    {profile.interests.map((interest, index) => (
                      <Badge key={index} variant="secondary" className="text-base py-2 px-4 bg-pink-600/20 text-pink-200 border-pink-500/30">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </Card>

                <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
                  <h2 className="text-2xl font-bold text-white mb-4">Physical Attributes</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-400">Height</p>
                      <p className="text-white font-medium">{profile.height}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Weight</p>
                      <p className="text-white font-medium">{profile.weight}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Hair Color</p>
                      <p className="text-white font-medium">{profile.hairColor}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Eye Color</p>
                      <p className="text-white font-medium">{profile.eyeColor}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Body Type</p>
                      <p className="text-white font-medium">{profile.bodyType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Ethnicity</p>
                      <p className="text-white font-medium">{profile.ethnicity}</p>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="services" className="space-y-6">
                <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
                  <h2 className="text-2xl font-bold text-white mb-4">Services Included</h2>
                  <div className="space-y-2">
                    {profile.services.included.map((service, index) => (
                      <div key={index} className="flex items-center gap-3 text-white">
                        <CheckCircle size={20} className="text-green-500" />
                        <span>{service}</span>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
                  <h2 className="text-2xl font-bold text-white mb-4">Not Included</h2>
                  <div className="space-y-2">
                    {profile.services.notIncluded.map((service, index) => (
                      <div key={index} className="flex items-center gap-3 text-gray-400">
                        <XCircle size={20} className="text-red-500" />
                        <span>{service}</span>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
                  <h2 className="text-2xl font-bold text-white mb-4">Rates</h2>
                  <div className="space-y-3">
                    {profile.rates.map((rate, index) => (
                      <div key={index} className={`flex items-center justify-between p-4 rounded-lg ${
                        rate.popular ? 'bg-gradient-to-r from-pink-600/20 to-purple-600/20 border-2 border-pink-500/50' : 'bg-white/5'
                      }`}>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="text-white font-bold text-lg">{rate.duration}</p>
                            {rate.popular && (
                              <Badge className="bg-yellow-500 border-0 text-xs">Most Popular</Badge>
                            )}
                          </div>
                          <p className="text-gray-400 text-sm">{rate.description}</p>
                        </div>
                        <p className="text-pink-400 font-black text-2xl">{rate.price}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-gray-400 text-sm mt-4 italic">* Travel expenses not included for outcalls</p>
                </Card>
              </TabsContent>

              <TabsContent value="availability" className="space-y-6">
                <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
                  <h2 className="text-2xl font-bold text-white mb-4">Weekly Schedule</h2>
                  <div className="space-y-3">
                    {Object.entries(profile.availability).map(([day, schedule]) => (
                      <div key={day} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Clock size={20} className={schedule.available ? "text-green-500" : "text-red-500"} />
                          <span className="text-white font-medium capitalize">{day}</span>
                        </div>
                        <div className="text-right">
                          {schedule.available ? (
                            <p className="text-green-400 font-medium">{schedule.times}</p>
                          ) : (
                            <p className="text-gray-500">{schedule.times}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-gray-400 text-sm mt-4">
                    📅 <strong>Advance Booking Recommended:</strong> Please book at least 2 hours in advance for best availability.
                  </p>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="space-y-6" id="reviews-section">
                {/* Stats Overview */}
                <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <p className="text-3xl font-black text-pink-400">{profile.stats.averageRating}</p>
                      <div className="flex justify-center gap-1 my-2">
                        {renderStars(5)}
                      </div>
                      <p className="text-sm text-gray-400">Beispielbewertung</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-black text-pink-400">{profile.stats.totalReviews}</p>
                      <p className="text-sm text-gray-400 mt-2">Demo-Bewertungen</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-black text-pink-400">{profile.stats.responseRate}%</p>
                      <p className="text-sm text-gray-400 mt-2">Fiktive Antwortrate</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-black text-pink-400">{profile.stats.repeatClients}%</p>
                      <p className="text-sm text-gray-400 mt-2">Repeat Clients</p>
                    </div>
                  </div>
                </Card>

                {/* Rating Distribution */}
                <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
                  <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                    <TrendingUp size={20} className="text-pink-400" />
                    Rating Distribution
                  </h3>
                  <div className="space-y-3">
                    {[5, 4, 3, 2, 1].map((rating) => {
                      const count = ratingDistribution[rating as keyof typeof ratingDistribution];
                      const percentage = profile.reviews.length > 0 ? (count / profile.reviews.length) * 100 : 0;
                      return (
                        <div key={rating} className="flex items-center gap-3">
                          <div className="flex items-center gap-1 w-20">
                            <span className="text-white font-medium">{rating}</span>
                            <Star size={14} className="fill-yellow-500 text-yellow-500" />
                          </div>
                          <div className="flex-1 h-3 bg-gray-700 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 transition-all duration-500"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-gray-400 text-sm w-16 text-right">
                            {count} ({percentage.toFixed(0)}%)
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </Card>

                {/* Filter & Sort Controls */}
                <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-white flex items-center gap-2">
                      <Filter size={20} className="text-pink-400" />
                      Filter Reviews
                    </h3>
                    <Badge className="bg-pink-600 border-0">
                      {filteredReviews.length} {filteredReviews.length === 1 ? 'Review' : 'Reviews'}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Sort By */}
                    <div>
                      <label className="text-sm text-gray-400 mb-2 block">Sort By</label>
                      <Select value={sortBy} onValueChange={(value: any) => { setSortBy(value); setReviewPage(1); }}>
                        <SelectTrigger className="bg-gray-800/80 border-gray-700 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="recent">Most Recent</SelectItem>
                          <SelectItem value="highest">Highest Rating</SelectItem>
                          <SelectItem value="lowest">Lowest Rating</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Filter by Rating */}
                    <div>
                      <label className="text-sm text-gray-400 mb-2 block">Filter by Rating</label>
                      <Select value={filterRating.toString()} onValueChange={(value) => { setFilterRating(value === "all" ? "all" : Number(value)); setReviewPage(1); }}>
                        <SelectTrigger className="bg-gray-800/80 border-gray-700 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Ratings</SelectItem>
                          <SelectItem value="5">5 Stars</SelectItem>
                          <SelectItem value="4">4 Stars</SelectItem>
                          <SelectItem value="3">3 Stars</SelectItem>
                          <SelectItem value="2">2 Stars</SelectItem>
                          <SelectItem value="1">1 Star</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Verified Only */}
                    <div>
                      <label className="text-sm text-gray-400 mb-2 block">Show Only</label>
                      <label className="flex items-center gap-3 bg-gray-800/80 border border-gray-700 rounded-lg px-4 py-2.5 cursor-pointer hover:border-pink-500 transition-all">
                        <input
                          type="checkbox"
                          checked={showVerifiedOnly}
                          onChange={(e) => { setShowVerifiedOnly(e.target.checked); setReviewPage(1); }}
                          className="w-4 h-4 rounded accent-pink-600"
                        />
                        <span className="text-white font-medium">Demo-Bewertungen</span>
                        <CheckCircle size={16} className="text-blue-500 ml-auto" />
                      </label>
                    </div>
                  </div>
                </Card>

                {/* No Results Message */}
                {filteredReviews.length === 0 && (
                  <Card className="p-12 bg-white/5 backdrop-blur-sm border-white/10 text-center">
                    <div className="max-w-md mx-auto">
                      <MessageCircle size={48} className="text-gray-500 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-white mb-2">No Reviews Found</h3>
                      <p className="text-gray-400 mb-4">
                        Try adjusting your filters to see more reviews.
                      </p>
                      <Button 
                        variant="outline" 
                        className="border-white/30 text-white hover:bg-white/10"
                        onClick={() => {
                          setFilterRating("all");
                          setShowVerifiedOnly(false);
                          setSortBy("recent");
                          setReviewPage(1);
                        }}
                      >
                        Reset Filters
                      </Button>
                    </div>
                  </Card>
                )}

                {/* Individual Reviews */}
                {paginatedReviews.map((review) => (
                  <Card key={review.id} className="p-6 bg-white/5 backdrop-blur-sm border-white/10 hover:border-pink-500/30 transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-bold text-white">{review.author}</p>
                          {review.verified && (
                            <Badge className="bg-blue-500 border-0 text-xs">
                              <CheckCircle size={12} className="mr-1" />
                              Nicht geprüft
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-400">{review.date}</p>
                      </div>
                      <div className="flex gap-1">
                        {renderStars(review.rating)}
                      </div>
                    </div>
                    <p className="text-gray-300 leading-relaxed">{review.comment}</p>
                    <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/10">
                      <button className="flex items-center gap-2 text-gray-400 hover:text-pink-400 transition-colors">
                        <ThumbsUp size={16} />
                        <span className="text-sm">Helpful ({review.helpful})</span>
                      </button>
                      <button className="flex items-center gap-2 text-gray-400 hover:text-pink-400 transition-colors">
                        <Flag size={16} />
                        <span className="text-sm">Meldestatus</span>
                      </button>
                    </div>
                  </Card>
                ))}

                {/* Pagination Controls */}
                {filteredReviews.length > reviewsPerPage && (
                  <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                      <p className="text-sm text-gray-400">
                        Showing {startReviewIndex + 1} - {Math.min(endReviewIndex, filteredReviews.length)} of {filteredReviews.length} reviews
                      </p>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReviewPageChange(reviewPage - 1)}
                          disabled={reviewPage === 1}
                          className="border-white/30 text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <ChevronLeft size={16} className="mr-1" />
                          Previous
                        </Button>

                        <div className="flex items-center gap-1">
                          {Array.from({ length: totalReviewPages }, (_, i) => i + 1).map((page) => {
                            // Show first, last, current, and adjacent pages
                            if (
                              page === 1 ||
                              page === totalReviewPages ||
                              (page >= reviewPage - 1 && page <= reviewPage + 1)
                            ) {
                              return (
                                <Button
                                  key={page}
                                  variant={page === reviewPage ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => handleReviewPageChange(page)}
                                  className={page === reviewPage 
                                    ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white" 
                                    : "border-white/30 text-white hover:bg-white/10"
                                  }
                                >
                                  {page}
                                </Button>
                              );
                            } else if (
                              page === reviewPage - 2 ||
                              page === reviewPage + 2
                            ) {
                              return <span key={page} className="text-gray-500 px-2">...</span>;
                            }
                            return null;
                          })}
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReviewPageChange(reviewPage + 1)}
                          disabled={reviewPage === totalReviewPages}
                          className="border-white/30 text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Next
                          <ChevronRight size={16} className="ml-1" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Contact & Info */}
          <div className="space-y-6">
            <Card className="p-6 sticky top-24 bg-white/5 backdrop-blur-sm border-white/10">
              <div className="text-center mb-6">
                <h1 className="text-4xl font-black text-white mb-2">{profile.name}, {profile.age}</h1>
                <div className="flex items-center justify-center gap-2 text-gray-300 mb-4">
                  <MapPin size={20} />
                  <span className="text-lg">{profile.location}</span>
                </div>
                <div className="flex items-center justify-center gap-3 mb-4">
                  {profile.verified && (
                    <Badge className="bg-blue-500 border-0 text-sm">
                      <Shield size={14} className="mr-1" />
                      Nicht geprüft
                    </Badge>
                  )}
                  {profile.premium && (
                    <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 border-0 text-sm">
                      ⭐ Premium
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-400">
                  Beispielstatus: <span className="text-green-400">Keine Live-Aktivität</span>
                </p>
                <p className="text-sm text-gray-400">
                  Reaktionszeit: <span className="text-white">Keine echte Erreichbarkeit</span>
                </p>
              </div>

              {/* Contact Buttons */}
              <div className="space-y-3 mb-6">
                <Button
                  className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white text-lg h-12 font-bold"
                  onClick={handleWhatsAppContact}
                >
                  <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  Kontakt nicht aktiv
                </Button>
                
                <Button
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white text-lg h-12 font-bold"
                  onClick={handlePhoneCall}
                >
                  <Phone size={20} className="mr-2" />
                  Kontaktstatus ansehen
                </Button>

                <Button
                  className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white text-lg h-12 font-bold"
                  asChild
                >
                  <Link href="/messages">
                    <MessageCircle size={20} className="mr-2" />
                    Nachrichten nicht aktiv
                  </Link>
                </Button>

                <Button
                  variant="outline"
                  className="w-full text-lg h-12 border-white/30 text-white hover:bg-white/10"
                  onClick={() => setLiked(!liked)}
                >
                  <Heart size={20} className={`mr-2 ${liked ? "fill-pink-600 text-pink-600" : ""}`} />
                  {liked ? "Liked" : "Add to Favorites"}
                </Button>
              </div>

              {/* Additional Info */}
              <div className="space-y-4 pt-4 border-t border-white/10">
                <div className="flex items-center gap-3">
                  <Briefcase size={20} className="text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-400">Occupation</p>
                    <p className="text-white font-medium">{profile.occupation}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <GraduationCap size={20} className="text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-400">Education</p>
                    <p className="text-white font-medium">{profile.education}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar size={20} className="text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-400">Member Since</p>
                    <p className="text-white font-medium">{profile.joinDate}</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 mt-4">
                <p className="text-sm text-gray-400 mb-2">Looking For</p>
                <p className="text-white font-medium mb-4">{profile.lookingFor}</p>

                <p className="text-sm text-gray-400 mb-2">Languages</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {profile.languages.map((lang, index) => (
                    <Badge key={index} variant="outline" className="border-white/30 text-white">{lang}</Badge>
                  ))}
                </div>
              </div>

              {/* Share & Report */}
              <div className="pt-4 border-t border-white/10 mt-4 flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 border-white/30 text-white hover:bg-white/10" onClick={() => void router.push("/faq")}>
                  <Share2 size={16} className="mr-2" />
                  Vorschau-Informationen
                </Button>
                <Button variant="outline" size="sm" className="flex-1 border-white/30 text-white hover:bg-white/10" onClick={() => void router.push("/safety")}>
                  <Flag size={16} className="mr-2" />
                  Meldestatus
                </Button>
              </div>
            </Card>

            {/* Safety Tips */}
            <Card className="p-6 bg-yellow-500/10 backdrop-blur-sm border-yellow-500/30">
              <h3 className="font-bold text-white mb-3 flex items-center gap-2">
                <Shield size={20} className="text-yellow-500" />
                Safety Tips
              </h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>✓ Always meet in public first</li>
                <li>✓ Verify identity before meeting</li>
                <li>✓ Share your location with a friend</li>
                <li>✓ Trust your instincts</li>
                <li>✓ Keep communications on platform</li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}