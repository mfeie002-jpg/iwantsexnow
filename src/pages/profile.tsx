import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, MapPin, MessageCircle, Settings, LogOut, Camera, Star, Eye, TrendingUp, Award, Zap, Gift } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ProfileStats } from "@/components/ProfileStats";
import { ProfileCompletion } from "@/components/ProfileCompletion";
import { RecentVisitors } from "@/components/RecentVisitors";
import { MutualMatches } from "@/components/MutualMatches";

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"overview" | "stats" | "visitors" | "matches">("overview");

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
      router.push("/login");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const userData = users.find((u: any) => u.username === currentUser);
    setUser(userData);

    const userPhotos = JSON.parse(localStorage.getItem("userPhotos") || "[]");
    setPhotos(userPhotos);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    router.push("/");
  };

  if (!user) return null;

  const completionPercentage = 60;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-50">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Heart className="text-pink-600 fill-pink-600" size={32} />
            <span className="text-2xl font-black text-pink-600">
              iWantSexNow.ch
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/messages">
                <MessageCircle size={20} />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link href="/members">
                <Eye size={20} />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link href="/favorites">
                <Heart size={20} />
              </Link>
            </Button>
            <Button variant="ghost" size="icon">
              <Settings size={20} />
            </Button>
            <Button variant="ghost" onClick={handleLogout}>
              <LogOut size={20} className="mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Premium Upgrade Banner */}
          <Card className="p-6 mb-8 bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                  <Zap className="text-white" size={32} />
                </div>
                <div>
                  <h3 className="text-2xl font-black mb-1">Unlock Premium Features!</h3>
                  <p className="text-gray-700">Get 10x more matches with unlimited messaging & advanced filters</p>
                </div>
              </div>
              <Button size="lg" className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700" asChild>
                <Link href="/premium">
                  <Gift size={20} className="mr-2" />
                  Upgrade Now
                </Link>
              </Button>
            </div>
          </Card>

          {/* Tab Navigation */}
          <div className="flex gap-2 mb-6 overflow-x-auto">
            <Button
              variant={activeTab === "overview" ? "default" : "outline"}
              onClick={() => setActiveTab("overview")}
              className={activeTab === "overview" ? "bg-pink-600 hover:bg-pink-700" : ""}
            >
              Overview
            </Button>
            <Button
              variant={activeTab === "stats" ? "default" : "outline"}
              onClick={() => setActiveTab("stats")}
              className={activeTab === "stats" ? "bg-pink-600 hover:bg-pink-700" : ""}
            >
              <TrendingUp size={16} className="mr-2" />
              Statistics
            </Button>
            <Button
              variant={activeTab === "visitors" ? "default" : "outline"}
              onClick={() => setActiveTab("visitors")}
              className={activeTab === "visitors" ? "bg-pink-600 hover:bg-pink-700" : ""}
            >
              <Eye size={16} className="mr-2" />
              Visitors
            </Button>
            <Button
              variant={activeTab === "matches" ? "default" : "outline"}
              onClick={() => setActiveTab("matches")}
              className={activeTab === "matches" ? "bg-pink-600 hover:bg-pink-700" : ""}
            >
              <Heart size={16} className="mr-2" />
              Matches
            </Button>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Profile Card - Always Visible */}
            <div className="lg:col-span-1">
              <Card className="p-6 space-y-6 sticky top-24">
                <div className="text-center">
                  {photos.length > 0 ? (
                    <div className="relative inline-block">
                      <img
                        src={photos[0]}
                        alt="Profile"
                        className="w-32 h-32 mx-auto rounded-full object-cover border-4 border-pink-200 mb-4"
                      />
                      <div className="absolute bottom-4 right-0 bg-green-500 w-8 h-8 rounded-full border-4 border-white"></div>
                    </div>
                  ) : (
                    <div className="w-32 h-32 mx-auto rounded-full bg-pink-600 flex items-center justify-center text-white text-5xl font-bold mb-4">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <h2 className="text-2xl font-bold">{user.username}</h2>
                  <div className="flex items-center justify-center gap-1 text-gray-600 mt-2">
                    <MapPin size={16} />
                    <span>{user.city}</span>
                  </div>
                  <div className="mt-4 flex gap-2 justify-center flex-wrap">
                    <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                      Online
                    </span>
                    {user.verified && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                        <Star size={14} />
                        Verified
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Gender:</span>
                    <span className="font-medium capitalize">{user.gender}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Age:</span>
                    <span className="font-medium">{user.age} years</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium text-sm">{user.email}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button className="w-full bg-pink-600 hover:bg-pink-700">
                    Edit Profile
                  </Button>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/upload-photos">
                      <Camera size={18} className="mr-2" />
                      Manage Photos
                    </Link>
                  </Button>
                </div>
              </Card>
            </div>

            {/* Dynamic Content Area */}
            <div className="lg:col-span-2 space-y-6">
              {activeTab === "overview" && (
                <>
                  <ProfileCompletion completionPercentage={completionPercentage} />

                  <Card className="p-6">
                    <h3 className="text-2xl font-bold mb-4">Quick Actions</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <Button size="lg" className="bg-pink-600 hover:bg-pink-700" asChild>
                        <Link href="/members">
                          <Eye size={20} className="mr-2" />
                          Browse Members
                        </Link>
                      </Button>
                      <Button size="lg" variant="outline" asChild>
                        <Link href="/upload-photos">
                          <Camera size={20} className="mr-2" />
                          Add Photos
                        </Link>
                      </Button>
                      <Button size="lg" variant="outline" asChild>
                        <Link href="/messages">
                          <MessageCircle size={20} className="mr-2" />
                          Messages
                        </Link>
                      </Button>
                      <Button size="lg" variant="outline" asChild>
                        <Link href="/favorites">
                          <Heart size={20} className="mr-2" />
                          Favorites
                        </Link>
                      </Button>
                    </div>
                  </Card>

                  <div className="grid md:grid-cols-3 gap-4">
                    <Card className="p-4 text-center hover:shadow-lg transition-shadow cursor-pointer">
                      <div className="text-4xl font-black text-blue-600 mb-2">332</div>
                      <div className="text-sm text-gray-600 font-medium">Profile Views</div>
                      <div className="text-xs text-green-600 mt-1">+28 today</div>
                    </Card>
                    <Card className="p-4 text-center hover:shadow-lg transition-shadow cursor-pointer">
                      <div className="text-4xl font-black text-pink-600 mb-2">88</div>
                      <div className="text-sm text-gray-600 font-medium">Total Likes</div>
                      <div className="text-xs text-green-600 mt-1">+12 today</div>
                    </Card>
                    <Card className="p-4 text-center hover:shadow-lg transition-shadow cursor-pointer">
                      <div className="text-4xl font-black text-purple-600 mb-2">23</div>
                      <div className="text-sm text-gray-600 font-medium">Mutual Matches</div>
                      <div className="text-xs text-green-600 mt-1">+3 new</div>
                    </Card>
                  </div>

                  {photos.length > 0 && (
                    <Card className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold">Your Photos ({photos.length})</h3>
                        <Button variant="outline" size="sm" asChild>
                          <Link href="/upload-photos">
                            <Camera size={16} className="mr-2" />
                            Manage
                          </Link>
                        </Button>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        {photos.map((photo, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={photo}
                              alt={`Photo ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg"
                            />
                            {index === 0 && (
                              <Badge className="absolute top-2 left-2 bg-pink-600 border-0 text-xs">
                                Profile
                              </Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    </Card>
                  )}
                </>
              )}

              {activeTab === "stats" && <ProfileStats />}

              {activeTab === "visitors" && <RecentVisitors />}

              {activeTab === "matches" && <MutualMatches />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}