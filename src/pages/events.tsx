import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Calendar, MapPin, Users, Clock, Plus, Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function Events() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const events = [
    {
      id: 1,
      title: "Speed Dating Night",
      date: "2025-12-20",
      time: "19:00",
      location: "Zürich, Bellevue",
      category: "speed-dating",
      attendees: 24,
      maxAttendees: 30,
      price: "CHF 25",
      image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&h=400&fit=crop",
      description: "Meet 15 singles in one evening! Drinks included.",
      ageRange: "25-40",
      host: "EventTeam Zürich"
    },
    {
      id: 2,
      title: "Singles Wine Tasting",
      date: "2025-12-22",
      time: "18:30",
      location: "Genève, Old Town",
      category: "social",
      attendees: 18,
      maxAttendees: 25,
      price: "CHF 45",
      image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&h=400&fit=crop",
      description: "Sophisticated wine tasting event for singles who appreciate the finer things.",
      ageRange: "30-50",
      host: "Wine & Dine GE"
    },
    {
      id: 3,
      title: "Hiking & Picnic Meetup",
      date: "2025-12-21",
      time: "10:00",
      location: "Interlaken",
      category: "outdoor",
      attendees: 16,
      maxAttendees: 20,
      price: "Free",
      image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&h=400&fit=crop",
      description: "Beautiful mountain hike followed by a group picnic. Perfect for nature lovers!",
      ageRange: "25-45",
      host: "Outdoor Singles CH"
    },
    {
      id: 4,
      title: "Cocktail Mixer Party",
      date: "2025-12-27",
      time: "20:00",
      location: "Basel, City Center",
      category: "party",
      attendees: 32,
      maxAttendees: 50,
      price: "CHF 30",
      image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=600&h=400&fit=crop",
      description: "Upscale cocktail party with live DJ, networking games, and great vibes!",
      ageRange: "21-35",
      host: "Basel Nightlife"
    },
    {
      id: 5,
      title: "Cooking Class for Two",
      date: "2025-12-23",
      time: "17:00",
      location: "Lausanne",
      category: "workshop",
      attendees: 12,
      maxAttendees: 16,
      price: "CHF 65",
      image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600&h=400&fit=crop",
      description: "Learn to cook a romantic Italian dinner while meeting new people!",
      ageRange: "28-50",
      host: "Culinary Arts CH"
    },
    {
      id: 6,
      title: "Board Game Evening",
      date: "2025-12-19",
      time: "19:30",
      location: "Bern, Kramgasse",
      category: "social",
      attendees: 14,
      maxAttendees: 20,
      price: "CHF 15",
      image: "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=600&h=400&fit=crop",
      description: "Relaxed board game night in a cozy cafe. Great for introverts!",
      ageRange: "22-40",
      host: "Game Night Bern"
    }
  ];

  const categories = [
    { id: "all", name: "All Events", icon: Calendar },
    { id: "speed-dating", name: "Speed Dating", icon: Heart },
    { id: "social", name: "Social", icon: Users },
    { id: "outdoor", name: "Outdoor", icon: MapPin },
    { id: "party", name: "Parties", icon: Heart },
    { id: "workshop", name: "Workshops", icon: Calendar }
  ];

  const filteredEvents = selectedCategory === "all" 
    ? events 
    : events.filter(e => e.category === selectedCategory);

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
            <Button className="bg-pink-600 hover:bg-pink-700">
              <Plus size={20} className="mr-2" />
              Create Event
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-gradient-to-r from-pink-600 to-purple-600 border-0 text-lg px-6 py-2">
              <Calendar size={18} className="mr-2" />
              Singles Events
            </Badge>
            <h1 className="text-5xl font-black mb-4">Meet In Real Life</h1>
            <p className="text-xl text-gray-600">
              Join local events and meetups to connect with singles near you
            </p>
          </div>

          {/* Search Bar */}
          <Card className="p-4 mb-8">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  placeholder="Search events..."
                  className="pl-10"
                />
              </div>
              <Button variant="outline">
                <Filter size={20} className="mr-2" />
                Filters
              </Button>
            </div>
          </Card>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-3 mb-8">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.id)}
                  className={selectedCategory === category.id ? "bg-pink-600 hover:bg-pink-700" : ""}
                >
                  <Icon size={16} className="mr-2" />
                  {category.name}
                </Button>
              );
            })}
          </div>

          {/* Events Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <Card key={event.id} className="overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                <div className="relative">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-48 object-cover"
                  />
                  <Badge className="absolute top-3 right-3 bg-pink-600 border-0">
                    {event.price}
                  </Badge>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    <h3 className="text-white text-xl font-bold">{event.title}</h3>
                  </div>
                </div>
                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Calendar size={16} className="text-pink-600" />
                    <span className="text-sm font-medium">{event.date} at {event.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <MapPin size={16} className="text-pink-600" />
                    <span className="text-sm">{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Users size={16} className="text-pink-600" />
                    <span className="text-sm">{event.attendees}/{event.maxAttendees} attending • Ages {event.ageRange}</span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">{event.description}</p>
                  <div className="pt-3 border-t">
                    <p className="text-xs text-gray-500 mb-3">Hosted by {event.host}</p>
                    <Button className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700">
                      Join Event
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Create Event CTA */}
          <Card className="p-12 mt-12 bg-gradient-to-r from-pink-600 to-purple-600 text-white text-center">
            <h2 className="text-4xl font-black mb-4">Want to Host an Event?</h2>
            <p className="text-xl mb-8 text-white/95">
              Create your own singles event and bring your community together!
            </p>
            <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-8">
              <Plus size={20} className="mr-2" />
              Create Your Event
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}