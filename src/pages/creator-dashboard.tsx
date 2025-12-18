import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Heart, DollarSign, Users, Eye, TrendingUp, Lock, Unlock, Image, Video, MessageCircle, Plus, Settings } from "lucide-react";
import Link from "next/link";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function CreatorDashboard() {
  const [subscriptionPrice, setSubscriptionPrice] = useState(19.90);

  // Mock earnings data
  const earningsData = [
    { month: "Jul", subscriptions: 1200, tips: 450, content: 320 },
    { month: "Aug", subscriptions: 1450, tips: 580, content: 410 },
    { month: "Sep", subscriptions: 1680, tips: 620, content: 550 },
    { month: "Oct", subscriptions: 1920, tips: 780, content: 630 },
    { month: "Nov", subscriptions: 2340, tips: 890, content: 720 },
    { month: "Dec", subscriptions: 2650, tips: 1020, content: 850 }
  ];

  const stats = {
    totalEarnings: 7520,
    monthlyEarnings: 2650,
    subscribers: 142,
    newSubscribers: 18,
    totalPosts: 87,
    totalViews: 12450,
    averageTip: 15.60
  };

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
              <Link href="/profile">My Profile</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/content-feed">Content Feed</Link>
            </Button>
            <Badge className="bg-gradient-to-r from-green-600 to-emerald-600 border-0 px-4 py-2">
              CHF {stats.totalEarnings.toLocaleString()}
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-black mb-2">Creator Dashboard</h1>
              <p className="text-gray-600">Manage your premium content and earnings</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" size="lg">
                <Settings size={20} className="mr-2" />
                Settings
              </Button>
              <Button size="lg" className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700" asChild>
                <Link href="/create-post">
                  <Plus size={20} className="mr-2" />
                  Create Post
                </Link>
              </Button>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <DollarSign className="text-green-600" size={24} />
                </div>
                <TrendingUp className="text-green-600" size={20} />
              </div>
              <div className="text-3xl font-black text-green-600 mb-1">
                CHF {stats.totalEarnings.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Total Earnings</div>
              <div className="text-xs text-green-600 mt-2">
                +CHF {stats.monthlyEarnings} this month
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <Users className="text-purple-600" size={24} />
                </div>
                <Badge className="bg-green-500 border-0">+{stats.newSubscribers}</Badge>
              </div>
              <div className="text-3xl font-black text-purple-600 mb-1">
                {stats.subscribers}
              </div>
              <div className="text-sm text-gray-600">Active Subscribers</div>
              <div className="text-xs text-gray-500 mt-2">
                CHF {subscriptionPrice}/month each
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <Eye className="text-blue-600" size={24} />
                </div>
                <TrendingUp className="text-blue-600" size={20} />
              </div>
              <div className="text-3xl font-black text-blue-600 mb-1">
                {stats.totalViews.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Total Views</div>
              <div className="text-xs text-gray-500 mt-2">
                {stats.totalPosts} posts published
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center">
                  <Heart className="text-pink-600" size={24} />
                </div>
              </div>
              <div className="text-3xl font-black text-pink-600 mb-1">
                CHF {stats.averageTip}
              </div>
              <div className="text-sm text-gray-600">Average Tip</div>
              <div className="text-xs text-gray-500 mt-2">
                From {Math.floor(stats.totalViews / 100)} tips
              </div>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            {/* Earnings Chart */}
            <Card className="lg:col-span-2 p-6">
              <h2 className="text-2xl font-bold mb-6">Earnings Overview</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={earningsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="subscriptions" fill="#EC4899" name="Subscriptions" />
                  <Bar dataKey="tips" fill="#9333EA" name="Tips" />
                  <Bar dataKey="content" fill="#F59E0B" name="PPV Content" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Subscription Settings */}
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Subscription Settings</h2>
              <div className="space-y-4">
                <div>
                  <Label>Monthly Subscription Price</Label>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-2xl font-bold">CHF</span>
                    <Input
                      type="number"
                      value={subscriptionPrice}
                      onChange={(e) => setSubscriptionPrice(parseFloat(e.target.value))}
                      className="text-2xl font-bold"
                      step="0.10"
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    You earn: CHF {(subscriptionPrice * 0.8).toFixed(2)} (80%)
                  </p>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Free trial period</span>
                    <Badge variant="outline">7 days</Badge>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Subscription status</span>
                    <Badge className="bg-green-500 border-0">Active</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Auto-renewal</span>
                    <Badge className="bg-blue-500 border-0">Enabled</Badge>
                  </div>
                </div>

                <Button className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700">
                  Update Settings
                </Button>
              </div>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6 hover:shadow-xl transition-all cursor-pointer" onClick={() => window.location.href = '/create-post'}>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center">
                  <Image className="text-pink-600" size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Photo Post</h3>
                  <p className="text-sm text-gray-600">Upload premium photos</p>
                </div>
              </div>
              <Button className="w-full bg-pink-600 hover:bg-pink-700">
                Create Photo Post
              </Button>
            </Card>

            <Card className="p-6 hover:shadow-xl transition-all cursor-pointer" onClick={() => window.location.href = '/create-post'}>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center">
                  <Video className="text-purple-600" size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Video Post</h3>
                  <p className="text-sm text-gray-600">Upload premium videos</p>
                </div>
              </div>
              <Button className="w-full bg-purple-600 hover:bg-purple-700">
                Create Video Post
              </Button>
            </Card>

            <Card className="p-6 hover:shadow-xl transition-all cursor-pointer" onClick={() => window.location.href = '/create-post'}>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                  <MessageCircle className="text-blue-600" size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Text Post</h3>
                  <p className="text-sm text-gray-600">Share premium messages</p>
                </div>
              </div>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Create Text Post
              </Button>
            </Card>
          </div>

          {/* Recent Subscribers */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Recent Subscribers</h2>
              <Button variant="outline" asChild>
                <Link href="/subscribers">View All</Link>
              </Button>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { name: "Emma", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop", date: "Today" },
                { name: "Sarah", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop", date: "Yesterday" },
                { name: "Mia", image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&h=100&fit=crop", date: "2 days ago" },
                { name: "Nina", image: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=100&h=100&fit=crop", date: "3 days ago" }
              ].map((sub, idx) => (
                <Card key={idx} className="p-4">
                  <img src={sub.image} alt={sub.name} className="w-16 h-16 rounded-full mx-auto mb-3" />
                  <h4 className="font-bold text-center">{sub.name}</h4>
                  <p className="text-xs text-gray-600 text-center">{sub.date}</p>
                  <Badge className="w-full justify-center mt-2 bg-green-500 border-0">
                    Active
                  </Badge>
                </Card>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}