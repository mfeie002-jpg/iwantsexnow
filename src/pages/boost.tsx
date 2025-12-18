import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Zap, TrendingUp, Eye, Clock, Star, Sparkles } from "lucide-react";
import Link from "next/link";

export default function Boost() {
  const boostPlans = [
    {
      duration: "30 minutes",
      price: "9.90",
      views: "50+",
      multiplier: "5x"
    },
    {
      duration: "1 hour",
      price: "14.90",
      views: "100+",
      multiplier: "10x",
      popular: true
    },
    {
      duration: "3 hours",
      price: "24.90",
      views: "300+",
      multiplier: "20x"
    }
  ];

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
              <Link href="/profile">Back to Profile</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-gradient-to-r from-yellow-500 to-orange-600 border-0 text-lg px-6 py-2">
              <Zap size={18} className="mr-2" />
              Profile Boost
            </Badge>
            <h1 className="text-5xl md:text-6xl font-black mb-6">
              Get Seen by Thousands!
            </h1>
            <p className="text-xl text-gray-600">
              Boost your profile to the top of search results and get up to 20x more views
            </p>
          </div>

          {/* How It Works */}
          <Card className="p-8 mb-12 bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200">
            <h2 className="text-2xl font-bold mb-6 text-center">How Profile Boost Works</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-yellow-500 flex items-center justify-center mb-4">
                  <Star className="text-white" size={32} />
                </div>
                <h3 className="font-bold mb-2">1. Choose Duration</h3>
                <p className="text-sm text-gray-700">Select how long you want to be boosted</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-orange-500 flex items-center justify-center mb-4">
                  <TrendingUp className="text-white" size={32} />
                </div>
                <h3 className="font-bold mb-2">2. Rise to the Top</h3>
                <p className="text-sm text-gray-700">Your profile appears first in searches</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-pink-500 flex items-center justify-center mb-4">
                  <Eye className="text-white" size={32} />
                </div>
                <h3 className="font-bold mb-2">3. Get More Views</h3>
                <p className="text-sm text-gray-700">Receive up to 20x more profile views</p>
              </div>
            </div>
          </Card>

          {/* Boost Plans */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {boostPlans.map((plan, index) => (
              <Card
                key={index}
                className={`p-8 text-center relative ${
                  plan.popular ? "border-4 border-yellow-500 shadow-2xl scale-105" : "border-2"
                }`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-500 to-orange-600 border-0 text-base px-6 py-2">
                    Most Popular
                  </Badge>
                )}

                <div className="mb-6">
                  <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center mb-4">
                    <Zap size={40} className="text-white" />
                  </div>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Clock size={20} className="text-gray-600" />
                    <h3 className="text-2xl font-black">{plan.duration}</h3>
                  </div>
                  <div className="mb-4">
                    <span className="text-4xl font-black">CHF {plan.price}</span>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-center gap-2">
                    <TrendingUp className="text-green-600" size={20} />
                    <span className="font-semibold">{plan.multiplier} more visibility</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Eye className="text-blue-600" size={20} />
                    <span className="font-semibold">{plan.views} profile views</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Sparkles className="text-purple-600" size={20} />
                    <span className="font-semibold">Top search position</span>
                  </div>
                </div>

                <Button
                  size="lg"
                  className={`w-full text-lg ${
                    plan.popular
                      ? "bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700"
                      : "bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
                  }`}
                >
                  Boost Now
                </Button>
              </Card>
            ))}
          </div>

          {/* Stats & Benefits */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <TrendingUp className="text-green-600" size={24} />
                Average Results
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="font-medium">Profile Views</span>
                  <span className="text-2xl font-black text-green-600">+847%</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="font-medium">New Likes</span>
                  <span className="text-2xl font-black text-blue-600">+512%</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                  <span className="font-medium">Messages Received</span>
                  <span className="text-2xl font-black text-purple-600">+334%</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Star className="text-yellow-600" size={24} />
                Why Boost Works
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-green-600 text-sm">✓</span>
                  </div>
                  <span className="text-gray-700">Appear first in all search results for your area</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-green-600 text-sm">✓</span>
                  </div>
                  <span className="text-gray-700">Get featured badge on your profile</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-green-600 text-sm">✓</span>
                  </div>
                  <span className="text-gray-700">Show up in "New Members" section</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-green-600 text-sm">✓</span>
                  </div>
                  <span className="text-gray-700">Increase your match rate dramatically</span>
                </li>
              </ul>
            </Card>
          </div>

          {/* Premium Members Note */}
          <Card className="p-8 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-center">
            <h3 className="text-2xl font-bold mb-4">Premium Members Get More!</h3>
            <p className="text-lg mb-6 text-white/95">
              Platinum members get 2 free boosts per month + 50% off additional boosts
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100" asChild>
                <Link href="/premium">Upgrade to Platinum</Link>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}