import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Check, Star, Zap, Crown, TrendingUp, Eye, MousePointer, DollarSign, Calculator } from "lucide-react";
import Link from "next/link";

export default function Pricing() {
  const [promoCredits, setPromoCredits] = useState(100);
  const [promoType, setPromoType] = useState<"views" | "clicks">("views");

  const calculatePromoCost = () => {
    const costPerView = 0.10;
    const costPerClick = 0.50;
    return promoType === "views" 
      ? (promoCredits * costPerView).toFixed(2)
      : (promoCredits * costPerClick).toFixed(2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 md:py-4">
          <div className="flex items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-2 min-w-0">
              <Heart className="text-pink-600 fill-pink-600 flex-shrink-0" size={28} />
              <span className="text-xl md:text-2xl font-black text-pink-600 truncate">
                iWantSexNow.ch
              </span>
            </Link>
            <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
              <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
                <Link href="/register">Register</Link>
              </Button>
              <Button className="bg-pink-600 hover:bg-pink-700" size="sm" asChild>
                <Link href="/login">Login</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 md:mb-16">
            <Badge className="mb-4 bg-gradient-to-r from-pink-600 to-purple-600 border-0 text-base md:text-lg px-4 md:px-6 py-2">
              <Zap size={18} className="mr-2" />
              Premium Membership & Promotion
            </Badge>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black mb-4 md:mb-6 px-4">
              Get More Clients with Smart Promotion
            </h1>
            <p className="text-base md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Basic membership CHF 15/month + pay only for the promotion you need. Control your budget, maximize your visibility.
            </p>
          </div>

          {/* Membership Plan */}
          <Card className="p-6 md:p-12 mb-8 md:mb-16 max-w-4xl mx-auto border-2 md:border-4 border-pink-500 shadow-2xl">
            <div className="text-center mb-6 md:mb-8">
              <div className="w-20 h-20 md:w-24 md:h-24 mx-auto rounded-full bg-gradient-to-br from-pink-600 to-purple-600 flex items-center justify-center mb-4 md:mb-6">
                <Crown size={36} className="text-white md:w-12 md:h-12" />
              </div>
              <h2 className="text-3xl md:text-4xl font-black mb-4">Basic Membership</h2>
              <div className="text-4xl md:text-6xl font-black text-pink-600 mb-2">CHF 15</div>
              <p className="text-lg md:text-xl text-gray-600">per month</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-6 md:mb-8">
              <div>
                <h3 className="font-bold text-lg md:text-xl mb-4 flex items-center gap-2">
                  <Star className="text-yellow-500 fill-yellow-500" size={24} />
                  Included in Membership:
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <Check size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm md:text-base">Profile listing in regular search results</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm md:text-base">Upload up to 10 photos</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm md:text-base">Basic profile analytics</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm md:text-base">Message system access</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm md:text-base">Profile verification badge</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm md:text-base">Customer support</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-lg md:text-xl mb-4 flex items-center gap-2">
                  <TrendingUp className="text-orange-500" size={24} />
                  Add Promotion (Pay-as-you-go):
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <Check size={20} className="text-orange-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm md:text-base"><strong>Pay-per-View:</strong> CHF 0.10 per profile view</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={20} className="text-orange-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm md:text-base"><strong>Pay-per-Click:</strong> CHF 0.50 per profile click</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={20} className="text-orange-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm md:text-base">Appear in <strong>TOP AD</strong> sections</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={20} className="text-orange-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm md:text-base">Featured at top of search results</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={20} className="text-orange-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm md:text-base">Gold badge highlight</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={20} className="text-orange-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm md:text-base">Set daily budget limits</span>
                  </li>
                </ul>
              </div>
            </div>

            <Button size="lg" className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-lg md:text-xl h-14 md:h-16" asChild>
              <Link href="/register">
                Start Your Membership - CHF 15/month
              </Link>
            </Button>
          </Card>

          {/* Promotion Calculator */}
          <Card className="p-6 md:p-8 mb-8 md:mb-16 max-w-4xl mx-auto bg-gradient-to-br from-orange-50 to-yellow-50 border-2 border-orange-200">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
              <Calculator size={32} className="text-orange-600 flex-shrink-0" />
              <div>
                <h2 className="text-2xl md:text-3xl font-black">Promotion Cost Calculator</h2>
                <p className="text-sm md:text-base text-gray-700">Estimate your promotion costs</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 md:gap-8">
              <div>
                <label className="block font-bold mb-3">Promotion Type:</label>
                <div className="space-y-3">
                  <label className={`flex items-center gap-3 p-3 md:p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    promoType === "views" ? "border-orange-500 bg-white shadow-md" : "border-gray-300 hover:border-orange-300"
                  }`}>
                    <input
                      type="radio"
                      name="promoType"
                      checked={promoType === "views"}
                      onChange={() => setPromoType("views")}
                      className="w-4 h-4 md:w-5 md:h-5 accent-orange-600 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 font-bold text-sm md:text-base">
                        <Eye size={20} className="text-orange-600 flex-shrink-0" />
                        Pay-per-View
                      </div>
                      <p className="text-xs md:text-sm text-gray-600">CHF 0.10 per profile view</p>
                    </div>
                  </label>

                  <label className={`flex items-center gap-3 p-3 md:p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    promoType === "clicks" ? "border-orange-500 bg-white shadow-md" : "border-gray-300 hover:border-orange-300"
                  }`}>
                    <input
                      type="radio"
                      name="promoType"
                      checked={promoType === "clicks"}
                      onChange={() => setPromoType("clicks")}
                      className="w-4 h-4 md:w-5 md:h-5 accent-orange-600 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 font-bold text-sm md:text-base">
                        <MousePointer size={20} className="text-orange-600 flex-shrink-0" />
                        Pay-per-Click
                      </div>
                      <p className="text-xs md:text-sm text-gray-600">CHF 0.50 per profile click</p>
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-bold mb-3">
                  Number of {promoType === "views" ? "Views" : "Clicks"}:
                </label>
                <input
                  type="range"
                  min="10"
                  max="1000"
                  step="10"
                  value={promoCredits}
                  onChange={(e) => setPromoCredits(parseInt(e.target.value))}
                  className="w-full h-3 bg-orange-200 rounded-lg appearance-none cursor-pointer accent-orange-600 mb-4"
                />
                <div className="text-center mb-6">
                  <div className="text-4xl md:text-5xl font-black text-orange-600 mb-2">{promoCredits}</div>
                  <p className="text-sm md:text-base text-gray-600">{promoType === "views" ? "Profile Views" : "Profile Clicks"}</p>
                </div>

                <Card className="p-4 md:p-6 bg-white border-2 border-orange-300">
                  <div className="flex items-center justify-between mb-2 text-sm md:text-base">
                    <span className="text-gray-700">Base Membership:</span>
                    <span className="font-bold">CHF 15.00</span>
                  </div>
                  <div className="flex items-center justify-between mb-2 text-sm md:text-base">
                    <span className="text-gray-700">Promotion Cost:</span>
                    <span className="font-bold">CHF {calculatePromoCost()}</span>
                  </div>
                  <div className="border-t-2 border-gray-300 my-3"></div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg md:text-xl font-bold">Total Estimate:</span>
                    <span className="text-2xl md:text-3xl font-black text-orange-600">
                      CHF {(15 + parseFloat(calculatePromoCost())).toFixed(2)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-3 text-center">
                    Per month estimate (membership + promotion)
                  </p>
                </Card>
              </div>
            </div>
          </Card>

          {/* How It Works */}
          <div className="max-w-5xl mx-auto mb-16">
            <h2 className="text-4xl font-black text-center mb-12">How Promotion Works</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="p-6 text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-pink-100 flex items-center justify-center mb-4">
                  <span className="text-3xl font-black text-pink-600">1</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Choose Your Budget</h3>
                <p className="text-gray-700">
                  Set a daily or monthly budget for views or clicks. You're always in control.
                </p>
              </Card>

              <Card className="p-6 text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-orange-100 flex items-center justify-center mb-4">
                  <span className="text-3xl font-black text-orange-600">2</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Get Featured</h3>
                <p className="text-gray-700">
                  Your profile appears at the top with a gold "TOP AD" badge in search results.
                </p>
              </Card>

              <Card className="p-6 text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-purple-100 flex items-center justify-center mb-4">
                  <span className="text-3xl font-black text-purple-600">3</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Pay for Results</h3>
                <p className="text-gray-700">
                  Only pay when users view or click your profile. Track everything in your dashboard.
                </p>
              </Card>
            </div>
          </div>

          {/* Comparison Table */}
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl font-black text-center mb-12">Regular vs Promoted</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-8">
                <h3 className="text-2xl font-bold mb-6 text-center">Regular Listing</h3>
                <div className="text-center mb-6">
                  <div className="text-4xl font-black text-gray-600">CHF 15</div>
                  <p className="text-gray-600">per month only</p>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <Check size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Shows in search results</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Standard positioning</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                    <span>All basic features</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-400">
                    <span className="text-xl">✗</span>
                    <span>No featured placement</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-400">
                    <span className="text-xl">✗</span>
                    <span>No TOP AD badge</span>
                  </li>
                </ul>
              </Card>

              <Card className="p-8 border-4 border-orange-500 shadow-xl bg-gradient-to-br from-orange-50 to-yellow-50">
                <Badge className="mb-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-black border-0 font-bold">
                  RECOMMENDED
                </Badge>
                <h3 className="text-2xl font-bold mb-6 text-center">With Promotion</h3>
                <div className="text-center mb-6">
                  <div className="text-4xl font-black text-orange-600">CHF 15+</div>
                  <p className="text-gray-700">+ pay-per-view/click</p>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <Check size={20} className="text-orange-600 flex-shrink-0 mt-0.5" />
                    <span className="font-semibold">Everything in Regular</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={20} className="text-orange-600 flex-shrink-0 mt-0.5" />
                    <span className="font-semibold">Featured at top of results</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={20} className="text-orange-600 flex-shrink-0 mt-0.5" />
                    <span className="font-semibold">Gold "TOP AD" badge</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={20} className="text-orange-600 flex-shrink-0 mt-0.5" />
                    <span className="font-semibold">10x more visibility</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={20} className="text-orange-600 flex-shrink-0 mt-0.5" />
                    <span className="font-semibold">Budget control</span>
                  </li>
                </ul>
              </Card>
            </div>
          </div>

          {/* CTA */}
          <Card className="p-12 mt-16 bg-gradient-to-r from-pink-600 to-purple-600 text-white text-center">
            <h2 className="text-4xl font-black mb-4">Ready to Get More Clients?</h2>
            <p className="text-xl mb-8 text-white/95">
              Start with CHF 15/month membership and add promotion only when you need it
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-8" asChild>
                <Link href="/register">Start Free Trial</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 text-lg px-8" asChild>
                <Link href="/contact">Contact Sales</Link>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}