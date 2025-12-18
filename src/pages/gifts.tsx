import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Gift, Star, Sparkles, Crown, Coffee, Wine, Flower2, Cake, Diamond } from "lucide-react";
import Link from "next/link";

export default function Gifts() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const giftCategories = [
    { id: "all", name: "All Gifts" },
    { id: "romantic", name: "Romantic" },
    { id: "fun", name: "Fun & Playful" },
    { id: "luxury", name: "Luxury" },
    { id: "flirty", name: "Flirty" }
  ];

  const gifts = [
    {
      id: 1,
      name: "Red Rose",
      price: 5,
      category: "romantic",
      icon: Flower2,
      color: "text-red-500",
      bgColor: "bg-red-100",
      description: "Classic romantic gesture"
    },
    {
      id: 2,
      name: "Champagne",
      price: 15,
      category: "romantic",
      icon: Wine,
      color: "text-amber-600",
      bgColor: "bg-amber-100",
      description: "Celebrate your connection"
    },
    {
      id: 3,
      name: "Coffee Date",
      price: 8,
      category: "fun",
      icon: Coffee,
      color: "text-brown-600",
      bgColor: "bg-orange-100",
      description: "Virtual coffee invitation"
    },
    {
      id: 4,
      name: "Birthday Cake",
      price: 10,
      category: "fun",
      icon: Cake,
      color: "text-pink-500",
      bgColor: "bg-pink-100",
      description: "Make their day special"
    },
    {
      id: 5,
      name: "Diamond",
      price: 50,
      category: "luxury",
      icon: Diamond,
      color: "text-blue-400",
      bgColor: "bg-blue-100",
      description: "Show you really care"
    },
    {
      id: 6,
      name: "Gold Crown",
      price: 30,
      category: "luxury",
      icon: Crown,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
      description: "Make them feel like royalty"
    },
    {
      id: 7,
      name: "Sparkles",
      price: 3,
      category: "flirty",
      icon: Sparkles,
      color: "text-purple-500",
      bgColor: "bg-purple-100",
      description: "Catch their attention"
    },
    {
      id: 8,
      name: "Love Heart",
      price: 5,
      category: "flirty",
      icon: Heart,
      color: "text-pink-600",
      bgColor: "bg-pink-100",
      description: "Send some love their way"
    },
    {
      id: 9,
      name: "Golden Star",
      price: 12,
      category: "fun",
      icon: Star,
      color: "text-yellow-500",
      bgColor: "bg-yellow-100",
      description: "You're a star!"
    }
  ];

  const filteredGifts = selectedCategory === "all" 
    ? gifts 
    : gifts.filter(g => g.category === selectedCategory);

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
              <Link href="/profile">Profile</Link>
            </Button>
            <Badge className="bg-gradient-to-r from-pink-600 to-purple-600 border-0 px-4 py-2">
              Credits: 150
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-gradient-to-r from-pink-600 to-purple-600 border-0 text-lg px-6 py-2">
              <Gift size={18} className="mr-2" />
              Virtual Gifts
            </Badge>
            <h1 className="text-5xl font-black mb-4">Send a Gift</h1>
            <p className="text-xl text-gray-600">
              Make someone's day with a thoughtful virtual gift
            </p>
          </div>

          {/* Credits Info */}
          <Card className="p-6 mb-8 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 flex items-center justify-center">
                  <Sparkles className="text-white" size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1">Your Credit Balance: 150 Credits</h3>
                  <p className="text-gray-600">Purchase more credits to send premium gifts</p>
                </div>
              </div>
              <Button size="lg" className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700">
                Buy Credits
              </Button>
            </div>
          </Card>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-3 mb-8">
            {giftCategories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className={selectedCategory === category.id ? "bg-pink-600 hover:bg-pink-700" : ""}
              >
                {category.name}
              </Button>
            ))}
          </div>

          {/* Gifts Grid */}
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
            {filteredGifts.map((gift) => {
              const Icon = gift.icon;
              return (
                <Card
                  key={gift.id}
                  className="p-6 text-center hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                >
                  <div className={`w-24 h-24 mx-auto rounded-full ${gift.bgColor} flex items-center justify-center mb-4`}>
                    <Icon size={48} className={gift.color} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{gift.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{gift.description}</p>
                  <Badge className="bg-gradient-to-r from-pink-600 to-purple-600 border-0 mb-4 text-base px-4 py-1">
                    {gift.price} Credits
                  </Badge>
                  <Button className="w-full bg-pink-600 hover:bg-pink-700">
                    Send Gift
                  </Button>
                </Card>
              );
            })}
          </div>

          {/* How It Works */}
          <Card className="p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6 text-center">How Virtual Gifts Work</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-pink-100 flex items-center justify-center mb-4">
                  <span className="text-2xl font-black text-pink-600">1</span>
                </div>
                <h3 className="font-bold mb-2">Choose a Gift</h3>
                <p className="text-sm text-gray-600">Browse our collection and pick the perfect gift</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-purple-100 flex items-center justify-center mb-4">
                  <span className="text-2xl font-black text-purple-600">2</span>
                </div>
                <h3 className="font-bold mb-2">Send to Someone</h3>
                <p className="text-sm text-gray-600">Select a member and send your gift with a message</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <span className="text-2xl font-black text-blue-600">3</span>
                </div>
                <h3 className="font-bold mb-2">Make Their Day</h3>
                <p className="text-sm text-gray-600">They'll receive a notification and see your thoughtful gift!</p>
              </div>
            </div>
          </Card>

          {/* Credit Packages */}
          <Card className="p-8 bg-gradient-to-r from-pink-600 to-purple-600 text-white">
            <h2 className="text-3xl font-bold mb-6 text-center">Buy Credits</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
                <div className="text-4xl font-black mb-2">100</div>
                <div className="text-sm mb-4">Credits</div>
                <div className="text-3xl font-black mb-4">CHF 9.90</div>
                <Button size="lg" className="w-full bg-white text-purple-600 hover:bg-gray-100">
                  Buy Now
                </Button>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6 text-center border-4 border-white">
                <Badge className="bg-yellow-500 border-0 mb-2">Most Popular</Badge>
                <div className="text-4xl font-black mb-2">300</div>
                <div className="text-sm mb-4">Credits</div>
                <div className="text-3xl font-black mb-4">CHF 24.90</div>
                <Button size="lg" className="w-full bg-white text-purple-600 hover:bg-gray-100">
                  Buy Now
                </Button>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
                <div className="text-4xl font-black mb-2">500</div>
                <div className="text-sm mb-4">Credits</div>
                <div className="text-3xl font-black mb-4">CHF 39.90</div>
                <Button size="lg" className="w-full bg-white text-purple-600 hover:bg-gray-100">
                  Buy Now
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}