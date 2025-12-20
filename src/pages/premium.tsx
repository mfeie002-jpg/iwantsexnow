import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Check, Star, Zap, Crown } from "lucide-react";
import Link from "next/link";

export default function Premium() {
  const plans = [
    {
      name: "Free",
      price: "0",
      period: "forever",
      icon: Heart,
      color: "gray",
      features: [
        "Basic profile",
        "Limited messages (5/day)",
        "View profiles",
        "Basic search",
        "Standard support"
      ],
      limitations: [
        "No priority listing",
        "Limited filters",
        "Ads displayed"
      ]
    },
    {
      name: "Gold",
      price: "29.90",
      period: "month",
      icon: Star,
      color: "yellow",
      popular: true,
      features: [
        "Everything in Free",
        "Unlimited messages",
        "Advanced search filters",
        "See who viewed your profile",
        "Priority listing",
        "Ad-free experience",
        "Read receipts",
        "Profile boost (2x/month)",
        "Priority support"
      ]
    },
    {
      name: "Platinum",
      price: "49.90",
      period: "month",
      icon: Crown,
      color: "purple",
      features: [
        "Everything in Gold",
        "Exclusive badge",
        "Profile boost (unlimited)",
        "Advanced matching algorithm",
        "Private mode",
        "VIP support 24/7",
        "Early access to new features",
        "Custom profile themes",
        "Featured in search results"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 md:py-4">
          <div className="flex items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-2 min-w-0">
              <span className="text-xl md:text-2xl font-bold tracking-tight">
                <span className="text-[#0D1B2A] dark:text-white">iWant</span>
                <span className="text-[#C69C6D] dark:text-[#D5A021]">Sex</span>
                <span className="text-[#0D1B2A] dark:text-white">Now</span>
                <span className="text-gray-500 dark:text-gray-400 text-lg">.ch</span>
              </span>
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6">
              <Link href="/members" className="text-[#0D1B2A] dark:text-white hover:text-[#C69C6D] dark:hover:text-[#D5A021] font-medium transition-colors">
                Browse
              </Link>
              <Link href="/messages" className="text-[#0D1B2A] dark:text-white hover:text-[#C69C6D] dark:hover:text-[#D5A021] font-medium transition-colors">
                Messages
              </Link>
              <Link href="/profile" className="text-[#0D1B2A] dark:text-white hover:text-[#C69C6D] dark:hover:text-[#D5A021] font-medium transition-colors">
                Profile
              </Link>
            </nav>

            <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
              <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
                <Link href="/search">Browse</Link>
              </Button>
              <Button variant="ghost" size="sm" asChild className="hidden md:inline-flex">
                <Link href="/messages">Messages</Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/profile">Profile</Link>
              </Button>
              
              {/* Mobile Navigation */}
              <div className="lg:hidden">
                <MobileNav />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="text-center max-w-3xl mx-auto mb-8 md:mb-16">
          <Badge className="mb-4 bg-gradient-to-r from-pink-600 to-purple-600 border-0 text-base md:text-lg px-4 md:px-6 py-2">
            <Zap size={18} className="mr-2" />
            Upgrade Your Experience
          </Badge>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black mb-4 md:mb-6 px-4">
            Unlock Premium Features
          </h1>
          <p className="text-base md:text-xl text-gray-600 px-4">
            Get more matches, unlimited messages, and exclusive features to maximize your dating experience
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative p-6 md:p-8 ${
                plan.popular
                  ? "border-4 border-pink-500 shadow-2xl md:scale-105"
                  : "border-2"
              }`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 md:-top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-pink-600 to-purple-600 border-0 text-sm md:text-base px-4 md:px-6 py-2">
                  Most Popular
                </Badge>
              )}

              <div className="text-center mb-6">
                <div
                  className={`w-16 h-16 md:w-20 md:h-20 mx-auto rounded-full flex items-center justify-center mb-4 ${
                    plan.color === "gray"
                      ? "bg-gray-100"
                      : plan.color === "yellow"
                      ? "bg-gradient-to-br from-yellow-400 to-orange-500"
                      : "bg-gradient-to-br from-purple-600 to-pink-600"
                  }`}
                >
                  <plan.icon
                    size={32}
                    className={plan.color === "gray" ? "text-gray-600" : "text-white"}
                  />
                </div>
                <h3 className="text-2xl md:text-3xl font-black mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-3xl md:text-5xl font-black">CHF {plan.price}</span>
                  <span className="text-gray-600">/{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-2 md:space-y-3 mb-6 md:mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check
                      size={20}
                      className={`flex-shrink-0 mt-0.5 ${
                        plan.color === "gray"
                          ? "text-gray-600"
                          : "text-green-600"
                      }`}
                    />
                    <span className="text-xs md:text-sm">{feature}</span>
                  </li>
                ))}
                {plan.limitations?.map((limitation, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-gray-400">
                    <span className="flex-shrink-0 mt-0.5">✗</span>
                    <span className="text-xs md:text-sm line-through">{limitation}</span>
                  </li>
                ))}
              </ul>

              <Button
                size="lg"
                className={`w-full text-base md:text-lg ${
                  plan.color === "gray"
                    ? "bg-gray-600 hover:bg-gray-700"
                    : "bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
                }`}
                disabled={plan.color === "gray"}
              >
                {plan.color === "gray" ? "Current Plan" : `Upgrade to ${plan.name}`}
              </Button>
            </Card>
          ))}
        </div>

        <div className="mt-16 max-w-4xl mx-auto">
          <Card className="p-8 bg-gradient-to-r from-pink-600 to-purple-600 text-white">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex-1">
                <h3 className="text-3xl font-black mb-2">Special Offer!</h3>
                <p className="text-white/90 text-lg">
                  Get 3 months for the price of 2 when you subscribe to any premium plan today
                </p>
              </div>
              <Button
                size="lg"
                className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-8 whitespace-nowrap"
              >
                Claim Offer
              </Button>
            </div>
          </Card>
        </div>

        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-3xl font-black text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <Card className="p-6">
              <h4 className="font-bold text-lg mb-2">Can I cancel anytime?</h4>
              <p className="text-gray-600">
                Yes, you can cancel your subscription at any time. Your premium features will remain active until the end of your billing period.
              </p>
            </Card>
            <Card className="p-6">
              <h4 className="font-bold text-lg mb-2">What payment methods do you accept?</h4>
              <p className="text-gray-600">
                We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and Twint.
              </p>
            </Card>
            <Card className="p-6">
              <h4 className="font-bold text-lg mb-2">Is my payment information secure?</h4>
              <p className="text-gray-600">
                Absolutely. We use industry-standard encryption and never store your payment details on our servers. All transactions are processed through secure payment gateways.
              </p>
            </Card>
            <Card className="p-6">
              <h4 className="font-bold text-lg mb-2">Can I upgrade or downgrade my plan?</h4>
              <p className="text-gray-600">
                Yes, you can change your plan at any time. When upgrading, you'll get immediate access to new features. When downgrading, the change takes effect at the end of your current billing period.
              </p>
            </Card>
          </div>
        </div>
      </div>

      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl font-bold tracking-tight">
                  <span className="text-white">iWant</span>
                  <span className="text-[#D5A021]">Sex</span>
                  <span className="text-white">Now</span>
                  <span className="text-gray-400 text-base">.ch</span>
                </span>
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
            <p>© 2025 iWantSexNow.ch. All rights reserved. | 18+ Only</p>
            <p className="mt-2">This site is intended for adults only and may contain adult content.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}