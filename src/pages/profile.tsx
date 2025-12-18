import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, MapPin, MessageCircle, Settings, LogOut, Camera, Star, Eye } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [photos, setPhotos] = useState<string[]>([]);

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
      router.push("/login");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const userData = users.find((u: any) => u.username === currentUser);
    setUser(userData);

    // Load user photos
    const userPhotos = JSON.parse(localStorage.getItem("userPhotos") || "[]");
    setPhotos(userPhotos);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    router.push("/");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Heart className="text-pink-600 fill-pink-600" size={32} />
            <span className="text-2xl font-black bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
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
              <Link href="/search">
                <Eye size={20} />
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

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <Card className="p-6 space-y-6">
                <div className="text-center">
                  {photos.length > 0 ? (
                    <img
                      src={photos[0]}
                      alt="Profile"
                      className="w-32 h-32 mx-auto rounded-full object-cover border-4 border-pink-200 mb-4"
                    />
                  ) : (
                    <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-pink-400 to-purple-400 flex items-center justify-center text-white text-5xl font-bold mb-4">
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
                  <Button className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700">
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

              <Card className="p-6 mt-6">
                <h3 className="font-bold text-lg mb-4">Profile Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Profile Views:</span>
                    <span className="font-bold text-pink-600">127</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Likes Received:</span>
                    <span className="font-bold text-purple-600">43</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Messages:</span>
                    <span className="font-bold text-blue-600">12</span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="p-6">
                <h3 className="text-2xl font-bold mb-4">Welcome to iWantSexNow.ch!</h3>
                <p className="text-gray-600 mb-6">
                  Your profile is now active. Start browsing members and making connections. Complete your profile to increase your visibility and get more matches.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <Button size="lg" className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700" asChild>
                    <Link href="/search">Browse Members</Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="/upload-photos">Upload Photos</Link>
                  </Button>
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center flex-shrink-0">
                    <Star className="text-white" size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">Upgrade to Premium</h3>
                    <p className="text-gray-700 mb-4">
                      Get unlimited messages, advanced filters, and exclusive features. Stand out from the crowd!
                    </p>
                    <Button className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700" asChild>
                      <Link href="/premium">View Plans</Link>
                    </Button>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-bold mb-4">Recent Visitors</h3>
                <p className="text-gray-600">No visitors yet. Share your profile to get more views!</p>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-bold mb-4">Your Matches</h3>
                <p className="text-gray-600">Start browsing to find your matches!</p>
              </Card>

              {photos.length > 0 && (
                <Card className="p-6">
                  <h3 className="text-xl font-bold mb-4">Your Photos ({photos.length})</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {photos.map((photo, index) => (
                      <img
                        key={index}
                        src={photo}
                        alt={`Photo ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4" asChild>
                    <Link href="/upload-photos">
                      <Camera size={18} className="mr-2" />
                      Manage Photos
                    </Link>
                  </Button>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}