import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, MessageCircle, Lock, DollarSign, Eye, Share2, Gift, Star, TrendingUp, Clock, Filter } from "lucide-react";
import Link from "next/link";

export default function ContentFeed() {
  const [filter, setFilter] = useState<"all" | "subscribed" | "free">("all");
  const [sortBy, setSortBy] = useState<"newest" | "trending" | "popular">("newest");

  const posts = [
    {
      id: 1,
      creator: "Sarah",
      creatorImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
      subscriptionPrice: 19.90,
      isSubscribed: true,
      isVerified: true,
      timestamp: "2 hours ago",
      type: "photo",
      preview: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&h=400&fit=crop",
      isLocked: true,
      pricing: "subscription",
      caption: "Exclusive beach photoshoot 🏖️ More photos available for subscribers!",
      likes: 234,
      comments: 45,
      views: 1250,
      trending: true
    },
    {
      id: 2,
      creator: "Emma",
      creatorImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
      subscriptionPrice: 24.90,
      isSubscribed: false,
      isVerified: true,
      timestamp: "5 hours ago",
      type: "video",
      preview: "https://images.unsplash.com/photo-1516478177764-9fe5bd7e9717?w=600&h=400&fit=crop",
      isLocked: true,
      pricing: "ppv",
      ppvPrice: 12.90,
      caption: "Behind the scenes video 🎥",
      likes: 456,
      comments: 89,
      views: 2340,
      trending: true
    },
    {
      id: 3,
      creator: "Mia",
      creatorImage: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&h=100&fit=crop",
      subscriptionPrice: 29.90,
      isSubscribed: true,
      isVerified: true,
      timestamp: "1 day ago",
      type: "photo",
      preview: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&h=400&fit=crop",
      isLocked: false,
      caption: "Good morning everyone! ☀️ Free preview of today's content",
      likes: 789,
      comments: 123,
      views: 3450,
      trending: false
    },
    {
      id: 4,
      creator: "Nina",
      creatorImage: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=100&h=100&fit=crop",
      subscriptionPrice: 15.90,
      isSubscribed: false,
      isVerified: false,
      timestamp: "1 day ago",
      type: "photo",
      preview: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&h=400&fit=crop",
      isLocked: true,
      pricing: "ppv",
      ppvPrice: 9.90,
      caption: "Fitness motivation 💪 Unlock to see the full workout session",
      likes: 345,
      comments: 67,
      views: 1890,
      trending: false
    }
  ];

  // Filter posts
  let filteredPosts = posts.filter(post => {
    if (filter === "subscribed") return post.isSubscribed;
    if (filter === "free") return !post.isLocked;
    return true;
  });

  // Sort posts
  filteredPosts = [...filteredPosts].sort((a, b) => {
    if (sortBy === "trending") {
      if (a.trending && !b.trending) return -1;
      if (!a.trending && b.trending) return 1;
      return b.views - a.views;
    }
    if (sortBy === "popular") return b.likes - a.likes;
    return 0; // newest by default (already in order)
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Heart className="text-pink-600 fill-pink-600" size={32} />
            <span className="text-xl md:text-2xl font-black text-pink-600">
              iWantSexNow.ch
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link href="/subscriptions">My Subscriptions</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/profile">Profile</Link>
            </Button>
            <Button className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700" asChild>
              <Link href="/creator-dashboard">Creator Dashboard</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-black mb-2">Content Feed</h1>
            <p className="text-sm md:text-base text-gray-600">Discover exclusive content from creators</p>
          </div>

          {/* Filters & Sort */}
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <div className="flex-1 flex flex-wrap gap-3">
              <Button
                variant={filter === "all" ? "default" : "outline"}
                onClick={() => setFilter("all")}
                className={`${filter === "all" ? "bg-pink-600 hover:bg-pink-700" : ""} flex-1 sm:flex-none`}
              >
                All Content
              </Button>
              <Button
                variant={filter === "subscribed" ? "default" : "outline"}
                onClick={() => setFilter("subscribed")}
                className={`${filter === "subscribed" ? "bg-pink-600 hover:bg-pink-700" : ""} flex-1 sm:flex-none`}
              >
                Subscribed
              </Button>
              <Button
                variant={filter === "free" ? "default" : "outline"}
                onClick={() => setFilter("free")}
                className={`${filter === "free" ? "bg-pink-600 hover:bg-pink-700" : ""} flex-1 sm:flex-none`}
              >
                Free Posts
              </Button>
            </div>

            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter size={16} className="mr-2" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">
                  <div className="flex items-center gap-2">
                    <Clock size={16} />
                    <span>Newest First</span>
                  </div>
                </SelectItem>
                <SelectItem value="trending">
                  <div className="flex items-center gap-2">
                    <TrendingUp size={16} />
                    <span>Trending</span>
                  </div>
                </SelectItem>
                <SelectItem value="popular">
                  <div className="flex items-center gap-2">
                    <Heart size={16} />
                    <span>Most Popular</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Content Feed */}
          <div className="space-y-6">
            {filteredPosts.map((post) => (
              <Card key={post.id} className="overflow-hidden">
                {/* Creator Header */}
                <div className="p-4 flex items-center justify-between border-b">
                  <div className="flex items-center gap-3">
                    <img
                      src={post.creatorImage}
                      alt={post.creator}
                      className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-sm md:text-base">{post.creator}</h3>
                        {post.isVerified && (
                          <Star size={14} className="text-blue-500 fill-blue-500" />
                        )}
                        {post.trending && (
                          <Badge className="bg-orange-500 border-0 text-xs">
                            <TrendingUp size={10} className="mr-1" />
                            Trending
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs md:text-sm text-gray-600">{post.timestamp}</p>
                    </div>
                  </div>
                  {!post.isSubscribed && (
                    <Button size="sm" className="bg-pink-600 hover:bg-pink-700 text-xs md:text-sm">
                      Subscribe CHF {post.subscriptionPrice}/mo
                    </Button>
                  )}
                </div>

                {/* Content Preview */}
                <div className="relative">
                  <img
                    src={post.preview}
                    alt="Content preview"
                    className={`w-full h-64 md:h-96 object-cover ${post.isLocked ? "blur-md" : ""}`}
                  />
                  
                  {/* Lock Overlay */}
                  {post.isLocked && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-4">
                      <Card className="p-6 md:p-8 max-w-md mx-4 text-center">
                        <div className="w-16 h-16 md:w-20 md:h-20 mx-auto rounded-full bg-pink-600 flex items-center justify-center mb-4">
                          <Lock className="text-white" size={32} />
                        </div>
                        <h3 className="text-xl md:text-2xl font-bold mb-2">Locked Content</h3>
                        {post.pricing === "subscription" ? (
                          <>
                            <p className="text-sm md:text-base text-gray-600 mb-6">
                              Subscribe to {post.creator} to unlock this and all their exclusive content
                            </p>
                            <Button size="lg" className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-sm md:text-base">
                              Subscribe for CHF {post.subscriptionPrice}/month
                            </Button>
                          </>
                        ) : (
                          <>
                            <p className="text-sm md:text-base text-gray-600 mb-6">
                              Purchase this post to unlock and view the full content
                            </p>
                            <Button size="lg" className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-sm md:text-base">
                              <DollarSign size={18} className="mr-2" />
                              Unlock for CHF {post.ppvPrice}
                            </Button>
                            <p className="text-xs md:text-sm text-gray-500 mt-3">
                              Or subscribe to get access to all content
                            </p>
                          </>
                        )}
                      </Card>
                    </div>
                  )}

                  {/* Stats Overlay */}
                  <div className="absolute top-4 right-4 flex gap-2">
                    <Badge className="bg-black/70 text-white border-0 text-xs">
                      <Eye size={12} className="mr-1" />
                      {post.views.toLocaleString()}
                    </Badge>
                    {post.type === "video" && (
                      <Badge className="bg-pink-600 border-0 text-xs">Video</Badge>
                    )}
                  </div>
                </div>

                {/* Caption & Actions */}
                <div className="p-4">
                  <p className="text-sm md:text-base text-gray-700 mb-4">{post.caption}</p>
                  
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4 md:gap-6">
                      <button className="flex items-center gap-2 hover:text-pink-600 transition-colors">
                        <Heart size={20} />
                        <span className="font-semibold text-sm md:text-base">{post.likes}</span>
                      </button>
                      <button className="flex items-center gap-2 hover:text-pink-600 transition-colors">
                        <MessageCircle size={20} />
                        <span className="font-semibold text-sm md:text-base">{post.comments}</span>
                      </button>
                      <button className="flex items-center gap-2 hover:text-pink-600 transition-colors">
                        <Share2 size={20} />
                      </button>
                    </div>
                    <Button variant="outline" size="sm" className="w-full sm:w-auto">
                      <Gift size={14} className="mr-2" />
                      Send Tip
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Become Creator CTA */}
          <Card className="p-8 md:p-12 mt-12 bg-gradient-to-r from-pink-600 to-purple-600 text-white text-center">
            <h2 className="text-2xl md:text-4xl font-black mb-4">Become a Creator</h2>
            <p className="text-base md:text-xl mb-8 text-white/95">
              Start earning by sharing exclusive content with your fans
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl md:text-3xl font-black mb-2">80%</div>
                <div className="text-xs md:text-sm">Revenue Share</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl md:text-3xl font-black mb-2">Free</div>
                <div className="text-xs md:text-sm">To Get Started</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl md:text-3xl font-black mb-2">24/7</div>
                <div className="text-xs md:text-sm">Creator Support</div>
              </div>
            </div>
            <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 text-base md:text-lg px-8" asChild>
              <Link href="/creator-dashboard">Start Creating</Link>
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}