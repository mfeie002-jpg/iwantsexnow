import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { SEO } from "@/components/SEO";
import { MobileNav } from "@/components/MobileNav";
import { Heart, User, Bell, Shield, CreditCard, History, Settings, Eye, MapPin, Calendar, Star, Trash2, Edit, Save, X } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface Favorite {
  id: number;
  name: string;
  age: number;
  location: string;
  image: string;
  rating: number;
  rate: number;
  available: boolean;
}

interface Booking {
  confirmationCode: string;
  escortName: string;
  date: string;
  time: string;
  duration: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  createdAt: string;
}

export default function AccountSettings() {
  const [user, setUser] = useState({
    name: "John Doe",
    email: "john@example.com",
    phone: "+41 79 123 45 67",
    city: "Zürich",
    bio: ""
  });

  const [notifications, setNotifications] = useState({
    emailUpdates: true,
    smsNotifications: false,
    newMatches: true,
    promotions: false
  });

  const [editMode, setEditMode] = useState(false);
  const [favorites, setFavorites] = useState<Favorite[]>([
    {
      id: 1,
      name: "Sophia",
      age: 26,
      location: "Zürich City Center",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
      rating: 5.0,
      rate: 500,
      available: true
    },
    {
      id: 4,
      name: "Mia",
      age: 25,
      location: "Oerlikon, Zürich",
      image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop",
      rating: 5.0,
      rate: 550,
      available: true
    }
  ]);

  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    // Load user data from localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    // Load bookings from localStorage
    const savedBookings = localStorage.getItem('bookings');
    if (savedBookings) {
      setBookings(JSON.parse(savedBookings));
    }
  }, []);

  const handleSaveProfile = () => {
    localStorage.setItem('user', JSON.stringify(user));
    setEditMode(false);
  };

  const removeFavorite = (id: number) => {
    setFavorites(prev => prev.filter(fav => fav.id !== id));
  };

  const cancelBooking = (code: string) => {
    const updatedBookings = bookings.map(booking => 
      booking.confirmationCode === code 
        ? { ...booking, status: "cancelled" as const }
        : booking
    );
    setBookings(updatedBookings);
    localStorage.setItem('bookings', JSON.stringify(updatedBookings));
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case "confirmed": return "bg-green-500";
      case "pending": return "bg-yellow-500";
      case "completed": return "bg-blue-500";
      case "cancelled": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <SEO 
        title="Account Settings - Manage Your Profile | iWantSexNow.ch"
        description="Manage your account settings, favorites, and booking history."
      />

      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-md bg-black/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div>
                <span className="text-2xl font-bold tracking-tight">
                  <span className="text-white">iWant</span>
                  <span className="text-[#D5A021]">Sex</span>
                  <span className="text-white">Now</span>
                  <span className="text-gray-400 text-xl">.ch</span>
                </span>
                <div className="text-xs text-pink-500 font-semibold tracking-wider">ACCOUNT SETTINGS</div>
              </div>
            </Link>
            <MobileNav />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-black text-white mb-2">Account Settings</h1>
            <p className="text-gray-300">Manage your profile, preferences, and bookings</p>
          </motion.div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="bg-white/10 border border-white/20 p-1">
              <TabsTrigger value="profile" className="data-[state=active]:bg-pink-600 data-[state=active]:text-white">
                <User size={18} className="mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="favorites" className="data-[state=active]:bg-pink-600 data-[state=active]:text-white">
                <Heart size={18} className="mr-2" />
                Favorites
              </TabsTrigger>
              <TabsTrigger value="bookings" className="data-[state=active]:bg-pink-600 data-[state=active]:text-white">
                <History size={18} className="mr-2" />
                Bookings
              </TabsTrigger>
              <TabsTrigger value="notifications" className="data-[state=active]:bg-pink-600 data-[state=active]:text-white">
                <Bell size={18} className="mr-2" />
                Notifications
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card className="p-8 bg-white/10 backdrop-blur-md border-white/20">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Profile Information</h2>
                  {!editMode ? (
                    <Button
                      onClick={() => setEditMode(true)}
                      className="bg-pink-600 hover:bg-pink-700"
                    >
                      <Edit size={18} className="mr-2" />
                      Edit Profile
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        onClick={handleSaveProfile}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Save size={18} className="mr-2" />
                        Save
                      </Button>
                      <Button
                        onClick={() => setEditMode(false)}
                        variant="outline"
                        className="border-white/30 text-white hover:bg-white/10"
                      >
                        <X size={18} className="mr-2" />
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label className="text-white mb-2 block">Full Name</Label>
                      <Input
                        value={user.name}
                        onChange={(e) => setUser({...user, name: e.target.value})}
                        disabled={!editMode}
                        className="bg-white/10 border-white/20 text-white disabled:opacity-50"
                      />
                    </div>

                    <div>
                      <Label className="text-white mb-2 block">Email</Label>
                      <Input
                        type="email"
                        value={user.email}
                        onChange={(e) => setUser({...user, email: e.target.value})}
                        disabled={!editMode}
                        className="bg-white/10 border-white/20 text-white disabled:opacity-50"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label className="text-white mb-2 block">Phone</Label>
                      <Input
                        type="tel"
                        value={user.phone}
                        onChange={(e) => setUser({...user, phone: e.target.value})}
                        disabled={!editMode}
                        className="bg-white/10 border-white/20 text-white disabled:opacity-50"
                      />
                    </div>

                    <div>
                      <Label className="text-white mb-2 block">City</Label>
                      <Input
                        value={user.city}
                        onChange={(e) => setUser({...user, city: e.target.value})}
                        disabled={!editMode}
                        className="bg-white/10 border-white/20 text-white disabled:opacity-50"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-white mb-2 block">Bio</Label>
                    <Textarea
                      value={user.bio}
                      onChange={(e) => setUser({...user, bio: e.target.value})}
                      disabled={!editMode}
                      rows={4}
                      placeholder="Tell us about yourself..."
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 disabled:opacity-50"
                    />
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Favorites Tab */}
            <TabsContent value="favorites">
              <Card className="p-8 bg-white/10 backdrop-blur-md border-white/20">
                <h2 className="text-2xl font-bold text-white mb-6">Your Favorites ({favorites.length})</h2>

                {favorites.length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-6">
                    {favorites.map((favorite) => (
                      <motion.div
                        key={favorite.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                      >
                        <Card className="overflow-hidden bg-white/5 border-white/10 hover:border-pink-500 transition-all">
                          <div className="flex gap-4 p-4">
                            <img
                              src={favorite.image}
                              alt={favorite.name}
                              className="w-24 h-24 rounded-lg object-cover"
                            />
                            <div className="flex-1">
                              <h3 className="text-xl font-bold text-white mb-1">
                                {favorite.name}, {favorite.age}
                              </h3>
                              <div className="flex items-center gap-2 text-blue-400 text-sm mb-2">
                                <MapPin size={14} />
                                <span>{favorite.location}</span>
                              </div>
                              <div className="flex items-center gap-2 mb-2">
                                <Star size={14} className="text-yellow-500 fill-yellow-500" />
                                <span className="text-white text-sm">{favorite.rating}</span>
                                {favorite.available && (
                                  <Badge className="bg-green-500 text-xs">Available</Badge>
                                )}
                              </div>
                              <div className="text-yellow-500 font-bold">CHF {favorite.rate}/hr</div>
                            </div>
                            <div className="flex flex-col gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-red-500 text-red-500 hover:bg-red-500/10"
                                onClick={() => removeFavorite(favorite.id)}
                              >
                                <Trash2 size={16} />
                              </Button>
                              <Button
                                size="sm"
                                className="bg-pink-600 hover:bg-pink-700"
                                asChild
                              >
                                <Link href={`/booking-confirmation?escortId=${favorite.id}&escortName=${favorite.name}`}>
                                  <Eye size={16} />
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Heart size={64} className="mx-auto text-gray-500 mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">No favorites yet</h3>
                    <p className="text-gray-400 mb-6">Start adding escorts to your favorites</p>
                    <Button className="bg-pink-600 hover:bg-pink-700" asChild>
                      <Link href="/escort-zurich">Browse Escorts</Link>
                    </Button>
                  </div>
                )}
              </Card>
            </TabsContent>

            {/* Bookings Tab */}
            <TabsContent value="bookings">
              <Card className="p-8 bg-white/10 backdrop-blur-md border-white/20">
                <h2 className="text-2xl font-bold text-white mb-6">Booking History ({bookings.length})</h2>

                {bookings.length > 0 ? (
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <Card key={booking.confirmationCode} className="p-6 bg-white/5 border-white/10">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-bold text-white">{booking.escortName}</h3>
                              <Badge className={`${getStatusColor(booking.status)} border-0`}>
                                {booking.status.toUpperCase()}
                              </Badge>
                            </div>
                            <div className="text-gray-400 text-sm">
                              Confirmation: <span className="text-yellow-500 font-mono">{booking.confirmationCode}</span>
                            </div>
                          </div>
                          {booking.status === "pending" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-red-500 text-red-500 hover:bg-red-500/10"
                              onClick={() => cancelBooking(booking.confirmationCode)}
                            >
                              Cancel
                            </Button>
                          )}
                        </div>

                        <div className="grid md:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center gap-2 text-gray-300">
                            <Calendar size={16} className="text-pink-500" />
                            <span>{booking.date}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-300">
                            <History size={16} className="text-pink-500" />
                            <span>{booking.time}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-300">
                            <Shield size={16} className="text-pink-500" />
                            <span>{booking.duration}</span>
                          </div>
                        </div>

                        <div className="mt-4 text-xs text-gray-500">
                          Booked on: {new Date(booking.createdAt).toLocaleString()}
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <History size={64} className="mx-auto text-gray-500 mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">No bookings yet</h3>
                    <p className="text-gray-400 mb-6">Your booking history will appear here</p>
                    <Button className="bg-pink-600 hover:bg-pink-700" asChild>
                      <Link href="/escort-zurich">Book an Escort</Link>
                    </Button>
                  </div>
                )}
              </Card>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications">
              <Card className="p-8 bg-white/10 backdrop-blur-md border-white/20">
                <h2 className="text-2xl font-bold text-white mb-6">Notification Preferences</h2>

                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div>
                      <h3 className="text-white font-bold mb-1">Email Updates</h3>
                      <p className="text-gray-400 text-sm">Receive booking confirmations via email</p>
                    </div>
                    <Switch
                      checked={notifications.emailUpdates}
                      onCheckedChange={(checked) => setNotifications({...notifications, emailUpdates: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div>
                      <h3 className="text-white font-bold mb-1">SMS Notifications</h3>
                      <p className="text-gray-400 text-sm">Get booking updates via text message</p>
                    </div>
                    <Switch
                      checked={notifications.smsNotifications}
                      onCheckedChange={(checked) => setNotifications({...notifications, smsNotifications: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div>
                      <h3 className="text-white font-bold mb-1">New Matches</h3>
                      <p className="text-gray-400 text-sm">Notify when new escorts match your preferences</p>
                    </div>
                    <Switch
                      checked={notifications.newMatches}
                      onCheckedChange={(checked) => setNotifications({...notifications, newMatches: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div>
                      <h3 className="text-white font-bold mb-1">Promotions</h3>
                      <p className="text-gray-400 text-sm">Receive special offers and promotions</p>
                    </div>
                    <Switch
                      checked={notifications.promotions}
                      onCheckedChange={(checked) => setNotifications({...notifications, promotions: checked})}
                    />
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                  <div className="flex items-start gap-3 text-blue-400">
                    <Shield size={20} className="flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-semibold mb-1">Privacy Notice</p>
                      <p className="text-blue-300/80">
                        Your notification preferences are private and secure. You can change these settings at any time.
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}