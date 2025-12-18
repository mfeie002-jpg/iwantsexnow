import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { MobileNav } from "@/components/MobileNav";
import { Crown, Shield, Lock, Clock, Star, MapPin, MessageCircle, Heart, Eye, Phone, Search, CheckCircle, Award, Sparkles, DollarSign, Calendar, Gift, Image as ImageIcon } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");

  // Featured premium escorts
  const featuredEscorts = [
    {
      id: 1,
      name: "Sophia",
      age: 26,
      location: "Zürich City Center",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=600&fit=crop",
      verified: true,
      premium: true,
      available: true,
      rating: 5.0,
      reviews: 127,
      rate: 500,
      services: ["GFE", "Dinner Dates", "Events"],
      languages: ["German", "English", "French"]
    },
    {
      id: 2,
      name: "Isabella",
      age: 24,
      location: "Geneva",
      image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=600&fit=crop",
      verified: true,
      premium: true,
      available: true,
      rating: 4.9,
      reviews: 203,
      rate: 600,
      services: ["PSE", "Travel", "Overnight"],
      languages: ["Italian", "English"]
    },
    {
      id: 3,
      name: "Emma",
      age: 28,
      location: "Basel",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=600&fit=crop",
      verified: true,
      premium: false,
      available: false,
      rating: 4.8,
      reviews: 156,
      rate: 400,
      services: ["GFE", "Massage"],
      languages: ["German", "English"]
    },
    {
      id: 4,
      name: "Mia",
      age: 25,
      location: "Bern",
      image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=600&fit=crop",
      verified: true,
      premium: true,
      available: true,
      rating: 5.0,
      reviews: 189,
      rate: 700,
      services: ["PSE", "Events", "Travel"],
      languages: ["German", "French", "English"]
    }
  ];

  // Major Swiss cities with escort services
  const majorCities = [
    { name: "Zürich", escorts: 200, href: "/escort-zurich" },
    { name: "Geneva", escorts: 150, href: "/escort-geneva" },
    { name: "Basel", escorts: 120, href: "/escort-basel" },
    { name: "Bern", escorts: 100, href: "/escort-bern" },
    { name: "Lausanne", escorts: 90, href: "/escort-lausanne" },
    { name: "Lucerne", escorts: 75, href: "/escort-lucerne" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/40 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <Crown className="text-yellow-500" size={36} />
                <div className="absolute inset-0 bg-yellow-500/20 blur-xl group-hover:bg-yellow-500/40 transition-all" />
              </div>
              <div>
                <span className="text-2xl font-black text-white tracking-tight">
                  Elite Escorts
                </span>
                <div className="text-xs text-yellow-500 font-semibold tracking-wider">SWITZERLAND</div>
              </div>
            </Link>
            
            <nav className="hidden md:flex items-center gap-4">
              <Button variant="ghost" className="text-white hover:text-yellow-500" asChild>
                <Link href="#services">Services</Link>
              </Button>
              <Button variant="ghost" className="text-white hover:text-yellow-500" asChild>
                <Link href="#cities">Locations</Link>
              </Button>
              <Button variant="ghost" className="text-white hover:text-yellow-500" asChild>
                <Link href="#about">About</Link>
              </Button>
              <Button className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold">
                <Phone size={18} className="mr-2" />
                Book Now
              </Button>
            </nav>

            <MobileNav />
          </div>
        </div>
      </header>

      {/* Animated Hero Section */}
      <section className="relative py-32 md:py-48 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-pink-600/20 to-orange-600/20 animate-pulse" />
          <div className="absolute top-0 left-0 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-float-delayed" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9Ii4wNSIvPjwvZz48L3N2Zz4=')] opacity-20" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center space-y-8">
            {/* Animated Badge */}
            <div className="animate-fade-in-down">
              <Badge className="bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 border-0 text-black text-lg px-8 py-3 font-bold shadow-2xl shadow-yellow-500/50">
                <Crown size={20} className="mr-2" />
                Switzerland's #1 Elite Escort Service
              </Badge>
            </div>

            {/* Animated Headline */}
            <div className="space-y-4 animate-fade-in-up">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 animate-gradient">
                  Elite Companions
                </span>
                <br />
                <span className="text-white drop-shadow-2xl">Across Switzerland</span>
              </h1>
              <p className="text-xl md:text-3xl text-gray-300 font-light max-w-4xl mx-auto leading-relaxed">
                Experience luxury companionship with verified, sophisticated escorts in all major Swiss cities.
                <span className="text-yellow-500 font-semibold"> Discreet. Professional. Available 24/7.</span>
              </p>
            </div>

            {/* Search Box */}
            <div className="max-w-3xl mx-auto animate-fade-in-up animation-delay-200">
              <Card className="p-3 shadow-2xl bg-white/10 backdrop-blur-md border-white/20">
                <div className="flex gap-3 flex-col sm:flex-row">
                  <div className="flex-1 flex items-center gap-3 px-4 py-2 bg-white/10 rounded-lg">
                    <Search className="text-gray-400" size={24} />
                    <Input
                      placeholder="Search by city or canton..."
                      className="border-0 bg-transparent focus-visible:ring-0 text-lg text-white placeholder:text-gray-400"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold px-10"
                  >
                    <Search size={20} className="mr-2" />
                    Search
                  </Button>
                </div>
              </Card>
            </div>

            {/* Animated Stats */}
            <div className="flex flex-wrap justify-center gap-8 pt-8 animate-fade-in animation-delay-400">
              {[
                { number: "500+", label: "Elite Escorts", icon: Crown },
                { number: "26", label: "Swiss Cantons", icon: MapPin },
                { number: "24/7", label: "Always Available", icon: Clock },
                { number: "100%", label: "Verified & Safe", icon: Shield }
              ].map((stat, idx) => (
                <div key={idx} className="text-center group animate-scale-in" style={{ animationDelay: `${idx * 100}ms` }}>
                  <div className="relative">
                    <stat.icon className="mx-auto mb-2 text-yellow-500 group-hover:scale-110 transition-transform" size={32} />
                    <div className="absolute inset-0 bg-yellow-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="text-4xl md:text-5xl font-black text-yellow-500 mb-1">{stat.number}</div>
                  <div className="text-sm text-gray-400 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Animated CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8 animate-fade-in-up animation-delay-600">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold text-lg px-10 h-16 shadow-2xl shadow-yellow-500/50 hover:shadow-yellow-500/70 transition-all hover:scale-105"
                asChild
              >
                <Link href="#escorts">
                  <Search size={22} className="mr-2" />
                  Browse All Escorts
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-white border-2 border-white/30 hover:bg-white/10 text-lg px-10 h-16 backdrop-blur-sm"
                asChild
              >
                <Link href="#contact">
                  <Phone size={22} className="mr-2" />
                  Contact Us
                </Link>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="pt-8 flex flex-wrap justify-center gap-6 text-sm text-gray-400 animate-fade-in animation-delay-800">
              <div className="flex items-center gap-2">
                <Shield size={16} className="text-green-500" />
                <span>SSL Encrypted</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock size={16} className="text-green-500" />
                <span>100% Discreet</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-green-500" />
                <span>Verified Profiles</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Escorts Section */}
      <section id="escorts" className="py-20 bg-black/40 backdrop-blur-sm border-y border-white/10">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-gradient-to-r from-pink-600 to-purple-600 border-0 text-lg px-6 py-2">
                <Sparkles size={18} className="mr-2" />
                Featured Elite Companions
              </Badge>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                Premium Escorts Available Now
              </h2>
              <p className="text-xl text-gray-300">
                Verified, sophisticated companions ready to meet you
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {featuredEscorts.map((escort) => (
                <Card 
                  key={escort.id} 
                  className="group overflow-hidden bg-white/5 backdrop-blur-sm border-white/10 hover:border-yellow-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-yellow-500/20 hover:-translate-y-1 cursor-pointer"
                >
                  <div className="relative">
                    <img
                      src={escort.image}
                      alt={escort.name}
                      className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    {/* Status Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2">
                      <div className="flex flex-col gap-2">
                        {escort.verified && (
                          <Badge className="bg-blue-500 border-0 shadow-lg">
                            <Shield size={12} className="mr-1" />
                            Verified
                          </Badge>
                        )}
                        {escort.premium && (
                          <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black border-0 shadow-lg font-bold">
                            <Crown size={12} className="mr-1" />
                            Premium
                          </Badge>
                        )}
                      </div>
                      {escort.available ? (
                        <Badge className="bg-green-500 border-0 shadow-lg animate-pulse">
                          <div className="w-2 h-2 bg-white rounded-full mr-2" />
                          Available
                        </Badge>
                      ) : (
                        <Badge className="bg-red-500/80 border-0 shadow-lg">
                          Busy
                        </Badge>
                      )}
                    </div>

                    {/* Gradient Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/50 to-transparent p-4">
                      <h3 className="text-white text-2xl font-bold mb-1">{escort.name}, {escort.age}</h3>
                      <div className="flex items-center gap-2 text-white/90 text-sm mb-2">
                        <MapPin size={14} />
                        <span>{escort.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star size={14} className="text-yellow-500 fill-yellow-500" />
                        <span className="text-white text-sm font-medium">{escort.rating.toFixed(1)}</span>
                        <span className="text-white/60 text-xs">({escort.reviews} reviews)</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 space-y-3">
                    <div className="flex flex-wrap gap-1">
                      {escort.services.slice(0, 3).map((service, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs border-white/20 text-gray-300">
                          {service}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-white/10">
                      <div>
                        <div className="text-xs text-gray-400">From</div>
                        <div className="text-xl font-black text-yellow-500">CHF {escort.rate}</div>
                        <div className="text-xs text-gray-400">per hour</div>
                      </div>
                      <Button 
                        size="sm"
                        className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold"
                      >
                        <MessageCircle size={16} className="mr-2" />
                        Contact
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <Button 
                size="lg" 
                variant="outline"
                className="text-white border-white/30 hover:bg-white/10 text-lg px-10"
                asChild
              >
                <Link href="/escort-zurich">
                  View All 500+ Escorts
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Service Categories */}
      <section id="services" className="py-20 bg-gradient-to-b from-transparent to-black/40">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              Premium Escort Services
            </h2>
            <p className="text-xl text-gray-300">
              Exclusive experiences tailored to your desires
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
            {[
              { 
                icon: Heart, 
                title: "Girlfriend Experience (GFE)", 
                description: "Intimate, passionate companionship with genuine connection and affection",
                color: "from-pink-500 to-rose-500"
              },
              { 
                icon: Calendar, 
                title: "Dinner & Social Events", 
                description: "Sophisticated companion for business dinners, galas, and social occasions",
                color: "from-purple-500 to-indigo-500"
              },
              { 
                icon: Clock, 
                title: "Overnight & Travel", 
                description: "Extended bookings for overnight stays and international travel companionship",
                color: "from-yellow-500 to-orange-500"
              },
              { 
                icon: Sparkles, 
                title: "Pornstar Experience (PSE)", 
                description: "Adventurous, uninhibited experiences for those seeking excitement",
                color: "from-red-500 to-pink-500"
              },
              { 
                icon: Gift, 
                title: "Massage & Spa", 
                description: "Professional relaxation and sensual massage experiences",
                color: "from-teal-500 to-cyan-500"
              },
              { 
                icon: Crown, 
                title: "VIP Elite Services", 
                description: "Exclusive premium experiences with our highest-rated companions",
                color: "from-yellow-500 to-amber-500"
              }
            ].map((service, idx) => (
              <Card key={idx} className="p-8 text-center bg-white/5 backdrop-blur-sm border-white/10 hover:border-white/30 transition-all group">
                <div className="relative mb-6">
                  <div className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-br ${service.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <service.icon className="text-white" size={40} />
                  </div>
                  <div className={`absolute inset-0 bg-gradient-to-br ${service.color} blur-2xl opacity-20 group-hover:opacity-40 transition-opacity`} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">{service.title}</h3>
                <p className="text-gray-300">{service.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Cities Section */}
      <section id="cities" className="py-20 bg-black/40 backdrop-blur-sm border-y border-white/10">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                Elite Escorts Across Switzerland
              </h2>
              <p className="text-xl text-gray-300">
                Premium companionship services in all major Swiss cities
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {majorCities.map((city, idx) => (
                <Link key={idx} href={city.href}>
                  <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10 hover:border-yellow-500/50 transition-all hover:shadow-xl hover:shadow-yellow-500/20 hover:-translate-y-1 cursor-pointer">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
                          <MapPin className="text-white" size={24} />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-white">{city.name}</h3>
                          <p className="text-gray-400 text-sm">{city.escorts} escorts available</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="text-white border-white/30">
                        Browse
                      </Button>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <CheckCircle size={14} className="text-green-500" />
                      <span>Verified profiles</span>
                      <CheckCircle size={14} className="text-green-500" />
                      <span>24/7 available</span>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>

            <div className="text-center mt-8">
              <p className="text-gray-400 mb-4">
                Available in all 26 Swiss cantons
              </p>
              <Button 
                variant="outline"
                className="text-white border-white/30 hover:bg-white/10"
              >
                View All Locations
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section id="about" className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                Why Choose Elite Escorts Switzerland?
              </h2>
              <p className="text-xl text-gray-300">
                The premier luxury escort service in Switzerland
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Shield,
                  title: "100% Verified & Safe",
                  description: "Every escort is ID verified and background checked. Your safety is our priority.",
                  color: "bg-blue-500"
                },
                {
                  icon: Crown,
                  title: "Elite Selection Only",
                  description: "Handpicked sophisticated companions. Educated, beautiful, and professional.",
                  color: "bg-purple-500"
                },
                {
                  icon: Lock,
                  title: "Complete Discretion",
                  description: "Anonymous bookings, encrypted communications. Your privacy absolutely guaranteed.",
                  color: "bg-pink-500"
                },
                {
                  icon: Star,
                  title: "Top Rated Service",
                  description: "Highest client satisfaction ratings. Verified reviews from real clients.",
                  color: "bg-yellow-500"
                },
                {
                  icon: Clock,
                  title: "24/7 Availability",
                  description: "Round-the-clock bookings. Escorts available any time, day or night.",
                  color: "bg-green-500"
                },
                {
                  icon: Award,
                  title: "Professional Service",
                  description: "Licensed, legal, and compliant. Premium experience every time.",
                  color: "bg-orange-500"
                }
              ].map((feature, idx) => (
                <Card key={idx} className="p-8 bg-white/5 backdrop-blur-sm border-white/10 hover:border-white/30 transition-all">
                  <div className={`w-16 h-16 rounded-full ${feature.color} flex items-center justify-center mb-6`}>
                    <feature.icon className="text-white" size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-300">{feature.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-20 bg-gradient-to-r from-purple-900/50 via-pink-900/50 to-orange-900/50 border-y border-white/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              Ready to Book Your Experience?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Contact us now for discreet, professional escort services
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold text-lg px-10 h-16"
              >
                <Phone size={22} className="mr-2" />
                Call +41 XX XXX XX XX
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="text-white border-2 border-white/30 hover:bg-white/10 text-lg px-10 h-16"
              >
                <MessageCircle size={22} className="mr-2" />
                Send Message
              </Button>
            </div>
            <p className="text-sm text-gray-400 mt-6">
              <Lock size={14} className="inline mr-1" />
              All inquiries are 100% confidential and encrypted
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-white/10 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Crown className="text-yellow-500" size={24} />
                <span className="text-xl font-bold text-white">Elite Escorts</span>
              </div>
              <p className="text-gray-400 text-sm">
                Switzerland's premier luxury escort service platform
              </p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Top Cities</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/escort-zurich" className="hover:text-white">Zürich Escorts</Link></li>
                <li><Link href="/escort-geneva" className="hover:text-white">Geneva Escorts</Link></li>
                <li><Link href="/escort-basel" className="hover:text-white">Basel Escorts</Link></li>
                <li><Link href="/escort-bern" className="hover:text-white">Bern Escorts</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Information</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/about" className="hover:text-white">About Us</Link></li>
                <li><Link href="/safety" className="hover:text-white">Safety & Privacy</Link></li>
                <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
                <li><Link href="/members" className="hover:text-white">Browse Members</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
                <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center">
            <p className="text-gray-400 text-sm">© 2025 Elite Escorts Switzerland. All rights reserved. | 18+ Only | Licensed & Legal</p>
          </div>
        </div>
      </footer>

      {/* Custom Animations */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-30px); }
        }
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes fade-in-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        .animate-fade-in-down {
          animation: fade-in-down 0.6s ease-out;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        .animate-scale-in {
          animation: scale-in 0.5s ease-out;
        }
        .animation-delay-200 {
          animation-delay: 200ms;
        }
        .animation-delay-400 {
          animation-delay: 400ms;
        }
        .animation-delay-600 {
          animation-delay: 600ms;
        }
        .animation-delay-800 {
          animation-delay: 800ms;
        }
      `}</style>
    </div>
  );
}