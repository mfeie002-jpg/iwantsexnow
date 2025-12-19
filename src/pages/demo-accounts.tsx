import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SEO from "@/components/SEO";
import { Heart, User, Crown, Shield, Star, MessageCircle, Camera, Clock, MapPin, Calendar, Award, Zap, Phone, Mail, Globe, Lock, CheckCircle, Eye } from "lucide-react";
import Link from "next/link";

interface DemoAccount {
  id: string;
  type: string;
  name: string;
  email: string;
  password: string;
  avatar: string;
  badge?: string;
  description: string;
  features: string[];
  stats?: {
    label: string;
    value: string;
    icon: any;
  }[];
  profileData?: any;
}

export default function DemoAccounts() {
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  const demoAccounts: DemoAccount[] = [
    {
      id: "premium-escort",
      type: "Premium Escort",
      name: "Sophia Elite",
      email: "sophia.elite@demo.ch",
      password: "Demo2025!",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
      badge: "VIP",
      description: "Premium verified escort with full profile features, photo gallery, video profile, and priority booking system.",
      features: [
        "Verified profile with blue checkmark",
        "Premium listing placement",
        "Unlimited photo uploads (50+ photos)",
        "Video profile support",
        "Priority in search results",
        "Advanced analytics dashboard",
        "Direct booking calendar",
        "Client review management",
        "WhatsApp integration",
        "Virtual tour feature"
      ],
      stats: [
        { label: "Profile Views", value: "12,453", icon: Eye },
        { label: "Total Reviews", value: "127", icon: Star },
        { label: "Avg Rating", value: "5.0", icon: Award },
        { label: "Response Time", value: "< 5 min", icon: Clock }
      ],
      profileData: {
        age: 26,
        location: "Zürich City Center",
        languages: ["German", "English", "French"],
        services: ["GFE", "Dinner Dates", "Overnight", "Travel"],
        rate: "CHF 500/hour",
        availability: "Available today"
      }
    },
    {
      id: "standard-escort",
      type: "Standard Escort",
      name: "Emma Sweet",
      email: "emma.sweet@demo.ch",
      password: "Demo2025!",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop",
      description: "Standard verified escort account with essential features and photo gallery.",
      features: [
        "Verified profile",
        "Standard listing placement",
        "Up to 20 photo uploads",
        "Basic profile analytics",
        "Contact form",
        "Client messaging",
        "Profile customization",
        "Safety features"
      ],
      stats: [
        { label: "Profile Views", value: "3,247", icon: Eye },
        { label: "Total Reviews", value: "43", icon: Star },
        { label: "Avg Rating", value: "4.7", icon: Award },
        { label: "Response Time", value: "< 30 min", icon: Clock }
      ],
      profileData: {
        age: 24,
        location: "Basel",
        languages: ["German", "English"],
        services: ["GFE", "Massage"],
        rate: "CHF 350/hour",
        availability: "Available tomorrow"
      }
    },
    {
      id: "premium-client",
      type: "Premium Client",
      name: "Michael VIP",
      email: "michael.vip@demo.ch",
      password: "Demo2025!",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
      badge: "PREMIUM",
      description: "Premium client account with unlimited messaging, priority bookings, and exclusive access to VIP escorts.",
      features: [
        "Unlimited messaging",
        "Priority booking system",
        "Access to VIP/Premium escorts",
        "Advanced search filters",
        "Save unlimited favorites",
        "Private photo galleries access",
        "Read all reviews",
        "Video call requests",
        "Concierge service",
        "Discreet billing"
      ],
      stats: [
        { label: "Bookings Made", value: "47", icon: Calendar },
        { label: "Favorites", value: "23", icon: Heart },
        { label: "Messages Sent", value: "156", icon: MessageCircle },
        { label: "Member Since", value: "Jan 2024", icon: Clock }
      ]
    },
    {
      id: "standard-client",
      type: "Standard Client",
      name: "David Regular",
      email: "david.regular@demo.ch",
      password: "Demo2025!",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
      description: "Free standard client account with basic browsing and messaging features.",
      features: [
        "Browse all profiles",
        "Basic search filters",
        "Up to 10 favorites",
        "Limited messaging (5/day)",
        "View public photos",
        "Read reviews",
        "Contact escorts",
        "Safety features"
      ],
      stats: [
        { label: "Bookings Made", value: "8", icon: Calendar },
        { label: "Favorites", value: "10", icon: Heart },
        { label: "Messages Sent", value: "34", icon: MessageCircle },
        { label: "Member Since", value: "Jun 2024", icon: Clock }
      ]
    },
    {
      id: "agency-owner",
      type: "Agency Owner",
      name: "Swiss Elite Agency",
      email: "agency@demo.ch",
      password: "Demo2025!",
      avatar: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=400&h=400&fit=crop",
      badge: "AGENCY",
      description: "Agency account managing multiple escort profiles with advanced dashboard and booking management.",
      features: [
        "Manage multiple profiles (up to 50)",
        "Agency branding",
        "Centralized booking calendar",
        "Team member access",
        "Advanced analytics",
        "Bulk photo uploads",
        "Custom agency page",
        "Priority customer support",
        "White-label options",
        "Revenue tracking"
      ],
      stats: [
        { label: "Active Escorts", value: "12", icon: Users },
        { label: "Total Bookings", value: "342", icon: Calendar },
        { label: "Total Revenue", value: "CHF 245K", icon: Award },
        { label: "Avg Response", value: "< 2 min", icon: Clock }
      ]
    },
    {
      id: "content-creator",
      type: "Content Creator",
      name: "Bella Content",
      email: "bella.content@demo.ch",
      password: "Demo2025!",
      avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop",
      badge: "CREATOR",
      description: "Content creator account with monetization features, exclusive content posting, and subscriber management.",
      features: [
        "Post exclusive content",
        "Subscription tiers",
        "Live streaming",
        "Pay-per-view content",
        "Tips & donations",
        "Creator analytics",
        "Subscriber management",
        "Content calendar",
        "Automated payouts",
        "Copyright protection"
      ],
      stats: [
        { label: "Subscribers", value: "1,247", icon: Users },
        { label: "Content Posts", value: "89", icon: Camera },
        { label: "Monthly Revenue", value: "CHF 12.5K", icon: Award },
        { label: "Engagement Rate", value: "87%", icon: Zap }
      ]
    }
  ];

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedEmail(id);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <SEO 
        title="Demo Accounts - Try All Features | iWantSexNow.ch"
        description="Explore demo accounts for escorts, clients, agencies, and content creators. Test all features before signing up."
      />

      {/* Header */}
      <header className="border-b border-white/10 bg-black/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <Heart className="text-pink-600 fill-pink-600" size={36} />
                <div className="absolute inset-0 bg-pink-600/20 blur-xl group-hover:bg-pink-600/40 transition-all" />
              </div>
              <div>
                <span className="text-2xl font-black text-white tracking-tight">
                  iWantSexNow.ch
                </span>
                <div className="text-xs text-pink-500 font-semibold tracking-wider">DEMO ACCOUNTS</div>
              </div>
            </Link>
            
            <div className="flex items-center gap-4">
              <Button variant="ghost" className="text-white hover:bg-white/10" asChild>
                <Link href="/">Back to Home</Link>
              </Button>
              <Button className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700" asChild>
                <Link href="/register">Sign Up Free</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-b from-purple-900/30 to-transparent">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-black text-white mb-6">
              Try Before You Sign Up
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Explore our demo accounts to experience all features for escorts, clients, agencies, and content creators.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Shield className="text-green-500" size={16} />
                <span>100% Safe Testing Environment</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="text-blue-500" size={16} />
                <span>No Credit Card Required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="text-pink-500" size={16} />
                <span>Full Feature Access</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Accounts Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-white/5 border border-white/10 mb-8">
                <TabsTrigger value="all">All Accounts</TabsTrigger>
                <TabsTrigger value="escort">Escorts</TabsTrigger>
                <TabsTrigger value="client">Clients</TabsTrigger>
                <TabsTrigger value="business">Business</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-6">
                {demoAccounts.map((account) => (
                  <DemoAccountCard 
                    key={account.id} 
                    account={account}
                    copiedEmail={copiedEmail}
                    onCopy={copyToClipboard}
                  />
                ))}
              </TabsContent>

              <TabsContent value="escort" className="space-y-6">
                {demoAccounts.filter(acc => acc.type.includes('Escort')).map((account) => (
                  <DemoAccountCard 
                    key={account.id} 
                    account={account}
                    copiedEmail={copiedEmail}
                    onCopy={copyToClipboard}
                  />
                ))}
              </TabsContent>

              <TabsContent value="client" className="space-y-6">
                {demoAccounts.filter(acc => acc.type.includes('Client')).map((account) => (
                  <DemoAccountCard 
                    key={account.id} 
                    account={account}
                    copiedEmail={copiedEmail}
                    onCopy={copyToClipboard}
                  />
                ))}
              </TabsContent>

              <TabsContent value="business" className="space-y-6">
                {demoAccounts.filter(acc => acc.type.includes('Agency') || acc.type.includes('Creator')).map((account) => (
                  <DemoAccountCard 
                    key={account.id} 
                    account={account}
                    copiedEmail={copiedEmail}
                    onCopy={copyToClipboard}
                  />
                ))}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-pink-900/30 via-purple-900/30 to-orange-900/30 border-y border-white/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-black text-white mb-6">
              Ready to Create Your Own Account?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of satisfied users on Switzerland's premier adult platform
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-bold" asChild>
                <Link href="/register">
                  <User className="mr-2" size={20} />
                  Register Free
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10" asChild>
                <Link href="/pricing">
                  <Crown className="mr-2" size={20} />
                  View Pricing
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-white/10 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Heart className="text-pink-600 fill-pink-600" size={24} />
              <span className="text-xl font-bold text-white">iWantSexNow.ch</span>
            </div>
            <p className="text-gray-400 text-sm mb-2">Where Desire Meets Discretion</p>
            <p className="text-gray-500 text-xs">
              &copy; {new Date().getFullYear()} iWantSexNow.ch. All rights reserved. 18+
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function DemoAccountCard({ 
  account, 
  copiedEmail,
  onCopy 
}: { 
  account: DemoAccount;
  copiedEmail: string | null;
  onCopy: (text: string, id: string) => void;
}) {
  return (
    <Card className="overflow-hidden bg-white/5 backdrop-blur-sm border-white/10 hover:border-pink-500/50 transition-all">
      <div className="p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Avatar & Basic Info */}
          <div className="flex-shrink-0">
            <div className="relative">
              <img
                src={account.avatar}
                alt={account.name}
                className="w-32 h-32 rounded-xl object-cover"
              />
              {account.badge && (
                <Badge className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-black border-0 font-bold">
                  {account.badge}
                </Badge>
              )}
            </div>
          </div>

          {/* Account Details */}
          <div className="flex-1 space-y-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-2xl font-black text-white">{account.name}</h3>
                <Badge variant="outline" className="border-pink-500 text-pink-400">
                  {account.type}
                </Badge>
              </div>
              <p className="text-gray-400 leading-relaxed">{account.description}</p>
            </div>

            {/* Login Credentials */}
            <div className="grid md:grid-cols-2 gap-4 p-4 bg-black/40 rounded-lg border border-white/10">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Email</label>
                <div className="flex items-center gap-2">
                  <code className="text-sm text-white font-mono">{account.email}</code>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 px-2 text-xs"
                    onClick={() => onCopy(account.email, account.id)}
                  >
                    {copiedEmail === account.id ? '✓ Copied' : 'Copy'}
                  </Button>
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Password</label>
                <div className="flex items-center gap-2">
                  <code className="text-sm text-white font-mono">{account.password}</code>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 px-2 text-xs"
                    onClick={() => onCopy(account.password, `${account.id}-pass`)}
                  >
                    {copiedEmail === `${account.id}-pass` ? '✓ Copied' : 'Copy'}
                  </Button>
                </div>
              </div>
            </div>

            {/* Stats */}
            {account.stats && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {account.stats.map((stat, idx) => {
                  const Icon = stat.icon;
                  return (
                    <div key={idx} className="text-center p-3 bg-white/5 rounded-lg">
                      <Icon className="mx-auto text-pink-400 mb-1" size={20} />
                      <div className="text-lg font-bold text-white">{stat.value}</div>
                      <div className="text-xs text-gray-400">{stat.label}</div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Features */}
            <div>
              <h4 className="text-sm font-bold text-white mb-3">Key Features:</h4>
              <div className="grid md:grid-cols-2 gap-2">
                {account.features.slice(0, 6).map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm text-gray-300">
                    <CheckCircle size={14} className="text-green-500 flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              {account.features.length > 6 && (
                <p className="text-xs text-gray-500 mt-2">
                  + {account.features.length - 6} more features
                </p>
              )}
            </div>

            {/* Profile Data (for escorts) */}
            {account.profileData && (
              <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <User size={14} />
                  <span>{account.profileData.age} years</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin size={14} />
                  <span>{account.profileData.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Globe size={14} />
                  <span>{account.profileData.languages.join(', ')}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Award size={14} />
                  <span>{account.profileData.rate}</span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-2">
              <Button className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700" asChild>
                <Link href="/login">
                  <User className="mr-2" size={16} />
                  Login as {account.type}
                </Link>
              </Button>
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/10" asChild>
                <Link href={account.type.includes('Escort') ? '/profile' : '/account-settings'}>
                  View Dashboard
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

// Missing Users import
import { Users } from "lucide-react";