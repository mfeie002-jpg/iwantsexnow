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
import { useToast } from "@/hooks/use-toast";
import { MobileNav } from "@/components/MobileNav";

export default function Profile() {
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"overview" | "stats" | "visitors" | "matches" | "activity" | "payments">("overview");
  const [scrolled, setScrolled] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setHeaderVisible(false);
      } else {
        setHeaderVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
      router.push("/login");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const userData = users.find((u: any) => u.username === currentUser);
    
    // Initialize user with default data if needed
    if (userData) {
      // Ensure activity log exists
      if (!userData.activityLog) {
        userData.activityLog = [];
      }
      
      // Ensure payment history exists
      if (!userData.paymentHistory) {
        userData.paymentHistory = [];
      }
      
      // Add some sample data for demo
      if (userData.activityLog.length === 0) {
        userData.activityLog = [
          {
            id: Date.now(),
            type: "profile_view",
            description: "Your profile was viewed by Sarah",
            timestamp: new Date().toISOString(),
            metadata: { viewer: "Sarah", location: "Zürich" }
          },
          {
            id: Date.now() - 1000,
            type: "message_sent",
            description: "You sent a message to Emma",
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            metadata: { recipient: "Emma" }
          },
          {
            id: Date.now() - 2000,
            type: "profile_like",
            description: "Mia liked your profile",
            timestamp: new Date(Date.now() - 7200000).toISOString(),
            metadata: { liker: "Mia" }
          }
        ];
      }
      
      if (userData.paymentHistory.length === 0) {
        userData.paymentHistory = [
          {
            id: Date.now(),
            type: "membership",
            description: "Monthly Membership - Gold",
            amount: 29.90,
            currency: "CHF",
            status: "completed",
            timestamp: new Date().toISOString(),
            method: "credit_card"
          },
          {
            id: Date.now() - 1000,
            type: "promotion",
            description: "Profile Boost - 100 views",
            amount: 10.00,
            currency: "CHF",
            status: "completed",
            timestamp: new Date(Date.now() - 86400000).toISOString(),
            method: "credit_card"
          },
          {
            id: Date.now() - 2000,
            type: "gift",
            description: "Virtual Gift sent to Nina",
            amount: 5.00,
            currency: "CHF",
            status: "completed",
            timestamp: new Date(Date.now() - 172800000).toISOString(),
            method: "credit_card"
          }
        ];
      }
      
      setUser(userData);
    }

    const userPhotos = JSON.parse(localStorage.getItem("userPhotos") || "[]");
    setPhotos(userPhotos);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("userSession");
    router.push("/");
  };

  if (!user) return null;

  const completionPercentage = 60;

  // Activity tab content
  const ActivityLog = () => (
    <Card className="p-6">
      <h3 className="text-2xl font-bold mb-6">Recent Activity</h3>
      <div className="space-y-4">
        {user.activityLog.slice(0, 10).map((activity: any) => {
          const getIcon = () => {
            switch(activity.type) {
              case "profile_view": return <Eye size={20} className="text-blue-600" />;
              case "message_sent": return <MessageCircle size={20} className="text-purple-600" />;
              case "profile_like": return <Heart size={20} className="text-pink-600 fill-pink-600" />;
              case "login": return <LogOut size={20} className="text-green-600 rotate-180" />;
              case "registration": return <Star size={20} className="text-yellow-600 fill-yellow-600" />;
              default: return <Award size={20} className="text-gray-600" />;
            }
          };

          return (
            <div key={activity.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                {getIcon()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900">{activity.description}</p>
                <p className="text-sm text-gray-600">{new Date(activity.timestamp).toLocaleString()}</p>
                {activity.metadata && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {Object.entries(activity.metadata).map(([key, value]) => (
                      <Badge key={key} variant="outline" className="text-xs">
                        {key}: {value as string}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );

  // Payment history tab content
  const PaymentHistory = () => {
    const totalSpent = user.paymentHistory.reduce((sum: number, payment: any) => sum + payment.amount, 0);
    
    return (
      <div className="space-y-6">
        <Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-green-900 mb-1">Total Spent</h3>
              <p className="text-4xl font-black text-green-600">CHF {totalSpent.toFixed(2)}</p>
              <p className="text-sm text-green-700 mt-1">All time</p>
            </div>
            <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center">
              <TrendingUp className="text-white" size={40} />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold">Payment History</h3>
            <Button variant="outline" size="sm">
              Download Statement
            </Button>
          </div>
          
          <div className="space-y-3">
            {user.paymentHistory.map((payment: any) => {
              const getTypeColor = () => {
                switch(payment.type) {
                  case "membership": return "text-purple-600 bg-purple-100";
                  case "promotion": return "text-orange-600 bg-orange-100";
                  case "gift": return "text-pink-600 bg-pink-100";
                  case "content": return "text-blue-600 bg-blue-100";
                  default: return "text-gray-600 bg-gray-100";
                }
              };

              return (
                <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${getTypeColor()}`}>
                      {payment.type === "membership" && <Award size={24} />}
                      {payment.type === "promotion" && <Zap size={24} />}
                      {payment.type === "gift" && <Gift size={24} />}
                      {payment.type === "content" && <Star size={24} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900">{payment.description}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <p className="text-sm text-gray-600">
                          {new Date(payment.timestamp).toLocaleDateString()}
                        </p>
                        <Badge 
                          className={payment.status === "completed" ? "bg-green-500" : "bg-yellow-500"} 
                        >
                          {payment.status}
                        </Badge>
                        <span className="text-xs text-gray-500">{payment.method.replace("_", " ")}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-gray-900">CHF {payment.amount.toFixed(2)}</p>
                    <p className="text-xs text-gray-500">{payment.currency}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    );
  };

  // Add auto-save functionality
  useEffect(() => {
    if (user) {
      const autoSaveTimer = setTimeout(() => {
        localStorage.setItem("users", JSON.stringify([user]));
      }, 1000);
      
      return () => clearTimeout(autoSaveTimer);
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-50">
      <header className={`border-b bg-white/80 backdrop-blur-sm fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'py-3 shadow-lg' : 'py-4'
      } ${
        headerVisible ? 'translate-y-0' : '-translate-y-full'
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-2">
              <span className={`font-bold tracking-tight transition-all duration-300 ${
                scrolled ? 'text-lg' : 'text-xl md:text-2xl'
              }`}>
                <span className="text-[#0D1B2A] dark:text-white">iWant</span>
                <span className="text-[#C69C6D] dark:text-[#D5A021]">Sex</span>
                <span className="text-[#0D1B2A] dark:text-white">Now</span>
                <span className="text-gray-500 dark:text-gray-400 text-base">.ch</span>
              </span>
            </Link>
            <div className="flex items-center gap-2 md:gap-3">
              <Button variant="ghost" size="icon" asChild className="hidden sm:flex">
                <Link href="/messages">
                  <MessageCircle size={20} />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild className="hidden sm:flex">
                <Link href="/members">
                  <Eye size={20} />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild className="hidden md:flex">
                <Link href="/favorites">
                  <Heart size={20} />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link href="/account-settings">
                  <Settings size={20} />
                </Link>
              </Button>
              <Button variant="ghost" onClick={handleLogout} size="sm" className="hidden sm:flex">
                <LogOut size={18} className="mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 md:py-8 pt-24">
        <div className="max-w-7xl mx-auto">
          {/* Premium Upgrade Banner - Mobile Optimized */}
          <Card className="p-4 md:p-6 mb-6 md:mb-8 bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3 md:gap-4 flex-1">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center flex-shrink-0">
                  <Zap className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-lg md:text-2xl font-black mb-1">Unlock Premium Features!</h3>
                  <p className="text-sm md:text-base text-gray-700">Get 10x more matches with unlimited messaging & advanced filters</p>
                </div>
              </div>
              <Button size="sm" className="w-full sm:w-auto bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 whitespace-nowrap" asChild>
                <Link href="/premium">
                  <Gift size={16} className="mr-2" />
                  Upgrade Now
                </Link>
              </Button>
            </div>
          </Card>

          {/* Tab Navigation - Mobile Scrollable */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
            <Button
              variant={activeTab === "overview" ? "default" : "outline"}
              onClick={() => setActiveTab("overview")}
              className={`${activeTab === "overview" ? "bg-pink-600 hover:bg-pink-700" : ""} whitespace-nowrap text-sm`}
              size="sm"
            >
              Overview
            </Button>
            <Button
              variant={activeTab === "stats" ? "default" : "outline"}
              onClick={() => setActiveTab("stats")}
              className={`${activeTab === "stats" ? "bg-pink-600 hover:bg-pink-700" : ""} whitespace-nowrap text-sm`}
              size="sm"
            >
              <TrendingUp size={14} className="mr-1" />
              Statistics
            </Button>
            <Button
              variant={activeTab === "visitors" ? "default" : "outline"}
              onClick={() => setActiveTab("visitors")}
              className={`${activeTab === "visitors" ? "bg-pink-600 hover:bg-pink-700" : ""} whitespace-nowrap text-sm`}
              size="sm"
            >
              <Eye size={14} className="mr-1" />
              Visitors
            </Button>
            <Button
              variant={activeTab === "matches" ? "default" : "outline"}
              onClick={() => setActiveTab("matches")}
              className={`${activeTab === "matches" ? "bg-pink-600 hover:bg-pink-700" : ""} whitespace-nowrap text-sm`}
              size="sm"
            >
              <Heart size={14} className="mr-1" />
              Matches
            </Button>
            <Button
              variant={activeTab === "activity" ? "default" : "outline"}
              onClick={() => setActiveTab("activity")}
              className={`${activeTab === "activity" ? "bg-pink-600 hover:bg-pink-700" : ""} whitespace-nowrap text-sm`}
              size="sm"
            >
              <Award size={14} className="mr-1" />
              Activity
            </Button>
            <Button
              variant={activeTab === "payments" ? "default" : "outline"}
              onClick={() => setActiveTab("payments")}
              className={`${activeTab === "payments" ? "bg-pink-600 hover:bg-pink-700" : ""} whitespace-nowrap text-sm`}
              size="sm"
            >
              <TrendingUp size={14} className="mr-1" />
              Payments
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
                  <div className="flex justify-between">
                    <span className="text-gray-600">Member Since:</span>
                    <span className="font-medium text-sm">{new Date(user.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button className="w-full bg-pink-600 hover:bg-pink-700" asChild>
                    <Link href="/account-settings">
                      Edit Profile
                    </Link>
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

              {activeTab === "activity" && <ActivityLog />}

              {activeTab === "payments" && <PaymentHistory />}
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}