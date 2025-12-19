import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import SEO from "@/components/SEO";
import { MobileNav } from "@/components/MobileNav";
import { Heart, Users, TrendingUp, DollarSign, Edit, Trash2, Plus, Eye, Star, Shield, Video, Calendar, Bell, Settings } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface Escort {
  id: number;
  name: string;
  age: number;
  city: string;
  district: string;
  rate: number;
  rating: number;
  reviews: number;
  verified: boolean;
  premium: boolean;
  available: boolean;
  image: string;
  totalBookings: number;
  revenue: number;
}

export default function AdminDashboard() {
  const [escorts, setEscorts] = useState<Escort[]>([
    {
      id: 1,
      name: "Sophia",
      age: 26,
      city: "Zürich",
      district: "City Center",
      rate: 500,
      rating: 5.0,
      reviews: 127,
      verified: true,
      premium: true,
      available: true,
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
      totalBookings: 342,
      revenue: 171000
    },
    {
      id: 2,
      name: "Isabella",
      age: 24,
      city: "Zürich",
      district: "Zürich West",
      rate: 600,
      rating: 4.9,
      reviews: 203,
      verified: true,
      premium: true,
      available: true,
      image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&h=200&fit=crop",
      totalBookings: 456,
      revenue: 273600
    },
    {
      id: 3,
      name: "Isabelle",
      age: 25,
      city: "Geneva",
      district: "City Center",
      rate: 600,
      rating: 5.0,
      reviews: 143,
      verified: true,
      premium: true,
      available: true,
      image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&h=200&fit=crop",
      totalBookings: 287,
      revenue: 172200
    }
  ]);

  const [editingEscort, setEditingEscort] = useState<Escort | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [newEscortModalOpen, setNewEscortModalOpen] = useState(false);

  const stats = {
    totalEscorts: escorts.length,
    activeEscorts: escorts.filter(e => e.available).length,
    totalBookings: escorts.reduce((sum, e) => sum + e.totalBookings, 0),
    totalRevenue: escorts.reduce((sum, e) => sum + e.revenue, 0),
    averageRating: (escorts.reduce((sum, e) => sum + e.rating, 0) / escorts.length).toFixed(1),
    premiumEscorts: escorts.filter(e => e.premium).length
  };

  const handleEditEscort = (escort: Escort) => {
    setEditingEscort(escort);
    setEditModalOpen(true);
  };

  const handleSaveEscort = () => {
    if (editingEscort) {
      setEscorts(prev => prev.map(e => e.id === editingEscort.id ? editingEscort : e));
      setEditModalOpen(false);
      setEditingEscort(null);
    }
  };

  const handleDeleteEscort = (id: number) => {
    if (confirm("Are you sure you want to delete this escort profile?")) {
      setEscorts(prev => prev.filter(e => e.id !== id));
    }
  };

  const handleToggleAvailability = (id: number) => {
    setEscorts(prev => prev.map(e => 
      e.id === id ? { ...e, available: !e.available } : e
    ));
  };

  const handleTogglePremium = (id: number) => {
    setEscorts(prev => prev.map(e => 
      e.id === id ? { ...e, premium: !e.premium } : e
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <SEO 
        title="Admin Dashboard - Manage Escorts | iWantSexNow.ch"
        description="Administrative dashboard for managing escort profiles and bookings."
      />

      <header className="border-b border-white/10 backdrop-blur-md bg-black/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <Heart className="text-pink-600 fill-pink-600" size={36} />
                <div className="absolute inset-0 bg-pink-600/20 blur-xl group-hover:bg-pink-600/40 transition-all" />
              </div>
              <div>
                <span className="text-2xl font-black text-white tracking-tight">iWantSexNow.ch</span>
                <div className="text-xs text-pink-500 font-semibold tracking-wider">ADMIN DASHBOARD</div>
              </div>
            </Link>
            <nav className="hidden md:flex items-center gap-4">
              <Button variant="ghost" className="text-white hover:text-yellow-500" asChild>
                <Link href="/">Public Site</Link>
              </Button>
              <Button variant="ghost" className="text-white hover:text-yellow-500" asChild>
                <Link href="/account-settings">Account</Link>
              </Button>
            </nav>
            <MobileNav />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-black text-white mb-2">Admin Dashboard</h1>
            <p className="text-gray-300">Manage escort profiles, bookings, and platform analytics</p>
          </motion.div>

          {/* Stats Overview */}
          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
            <Card className="p-6 bg-white/10 backdrop-blur-sm border-white/20">
              <Users className="text-pink-500 mb-3" size={32} />
              <div className="text-3xl font-black text-white">{stats.totalEscorts}</div>
              <div className="text-gray-400 text-sm">Total Escorts</div>
            </Card>
            <Card className="p-6 bg-white/10 backdrop-blur-sm border-white/20">
              <div className="w-8 h-8 rounded-full bg-green-500 mb-3 flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-full animate-pulse" />
              </div>
              <div className="text-3xl font-black text-white">{stats.activeEscorts}</div>
              <div className="text-gray-400 text-sm">Available Now</div>
            </Card>
            <Card className="p-6 bg-white/10 backdrop-blur-sm border-white/20">
              <Calendar className="text-blue-500 mb-3" size={32} />
              <div className="text-3xl font-black text-white">{stats.totalBookings}</div>
              <div className="text-gray-400 text-sm">Total Bookings</div>
            </Card>
            <Card className="p-6 bg-white/10 backdrop-blur-sm border-white/20">
              <DollarSign className="text-yellow-500 mb-3" size={32} />
              <div className="text-3xl font-black text-white">CHF {(stats.totalRevenue / 1000).toFixed(0)}K</div>
              <div className="text-gray-400 text-sm">Total Revenue</div>
            </Card>
            <Card className="p-6 bg-white/10 backdrop-blur-sm border-white/20">
              <Star className="text-yellow-500 mb-3" size={32} />
              <div className="text-3xl font-black text-white">{stats.averageRating}</div>
              <div className="text-gray-400 text-sm">Avg Rating</div>
            </Card>
            <Card className="p-6 bg-white/10 backdrop-blur-sm border-white/20">
              <Shield className="text-purple-500 mb-3" size={32} />
              <div className="text-3xl font-black text-white">{stats.premiumEscorts}</div>
              <div className="text-gray-400 text-sm">Premium</div>
            </Card>
          </div>

          <Tabs defaultValue="escorts" className="space-y-6">
            <TabsList className="bg-white/10 border border-white/20 p-1">
              <TabsTrigger value="escorts" className="data-[state=active]:bg-pink-600 data-[state=active]:text-white">
                <Users size={18} className="mr-2" />
                Escort Profiles
              </TabsTrigger>
              <TabsTrigger value="analytics" className="data-[state=active]:bg-pink-600 data-[state=active]:text-white">
                <TrendingUp size={18} className="mr-2" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="settings" className="data-[state=active]:bg-pink-600 data-[state=active]:text-white">
                <Settings size={18} className="mr-2" />
                Settings
              </TabsTrigger>
            </TabsList>

            {/* Escort Management Tab */}
            <TabsContent value="escorts">
              <Card className="p-6 bg-white/10 backdrop-blur-md border-white/20">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Manage Escorts</h2>
                  <Button
                    onClick={() => setNewEscortModalOpen(true)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Plus size={18} className="mr-2" />
                    Add New Escort
                  </Button>
                </div>

                <div className="space-y-4">
                  {escorts.map((escort) => (
                    <motion.div
                      key={escort.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <Card className="p-4 bg-white/5 border-white/10 hover:border-pink-500 transition-all">
                        <div className="flex items-center gap-4">
                          <img
                            src={escort.image}
                            alt={escort.name}
                            className="w-20 h-20 rounded-lg object-cover"
                          />
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-bold text-white">
                                {escort.name}, {escort.age}
                              </h3>
                              {escort.verified && (
                                <Badge className="bg-blue-500 border-0">
                                  <Shield size={12} className="mr-1" />
                                  Verified
                                </Badge>
                              )}
                              {escort.premium && (
                                <Badge className="bg-yellow-500 border-0 text-black">
                                  Premium
                                </Badge>
                              )}
                              {escort.available && (
                                <Badge className="bg-green-500 border-0 animate-pulse">
                                  Available
                                </Badge>
                              )}
                            </div>
                            <div className="text-gray-400 text-sm">
                              {escort.city} • {escort.district} • CHF {escort.rate}/hr
                            </div>
                            <div className="flex items-center gap-4 mt-2 text-sm">
                              <span className="flex items-center gap-1 text-yellow-500">
                                <Star size={14} fill="currentColor" />
                                {escort.rating} ({escort.reviews})
                              </span>
                              <span className="text-gray-400">
                                {escort.totalBookings} bookings
                              </span>
                              <span className="text-green-400">
                                CHF {(escort.revenue / 1000).toFixed(0)}K revenue
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                              <Label className="text-white text-xs">Available:</Label>
                              <Switch
                                checked={escort.available}
                                onCheckedChange={() => handleToggleAvailability(escort.id)}
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <Label className="text-white text-xs">Premium:</Label>
                              <Switch
                                checked={escort.premium}
                                onCheckedChange={() => handleTogglePremium(escort.id)}
                              />
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-white/30 text-white hover:bg-white/10"
                              onClick={() => handleEditEscort(escort)}
                            >
                              <Edit size={16} />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-red-500 text-red-500 hover:bg-red-500/10"
                              onClick={() => handleDeleteEscort(escort.id)}
                            >
                              <Trash2 size={16} />
                            </Button>
                            <Button
                              size="sm"
                              className="bg-pink-600 hover:bg-pink-700"
                              asChild
                            >
                              <Link href={`/profile/${escort.id}`}>
                                <Eye size={16} />
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics">
              <Card className="p-8 bg-white/10 backdrop-blur-md border-white/20">
                <h2 className="text-2xl font-bold text-white mb-6">Platform Analytics</h2>
                
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <Card className="p-6 bg-white/5 border-white/10">
                    <h3 className="text-xl font-bold text-white mb-4">Top Performers</h3>
                    <div className="space-y-3">
                      {escorts.sort((a, b) => b.revenue - a.revenue).slice(0, 5).map((escort, idx) => (
                        <div key={escort.id} className="flex items-center gap-3">
                          <div className="text-2xl font-black text-yellow-500">#{idx + 1}</div>
                          <img src={escort.image} alt={escort.name} className="w-12 h-12 rounded-lg object-cover" />
                          <div className="flex-1">
                            <div className="text-white font-bold">{escort.name}</div>
                            <div className="text-gray-400 text-sm">CHF {(escort.revenue / 1000).toFixed(0)}K revenue</div>
                          </div>
                          <div className="text-green-400 font-bold">{escort.totalBookings} bookings</div>
                        </div>
                      ))}
                    </div>
                  </Card>

                  <Card className="p-6 bg-white/5 border-white/10">
                    <h3 className="text-xl font-bold text-white mb-4">City Distribution</h3>
                    <div className="space-y-3">
                      {["Zürich", "Geneva", "Basel", "Bern", "Lausanne"].map(city => {
                        const count = escorts.filter(e => e.city === city).length;
                        const percentage = ((count / escorts.length) * 100).toFixed(0);
                        return (
                          <div key={city}>
                            <div className="flex justify-between text-white mb-1">
                              <span>{city}</span>
                              <span className="font-bold">{count} escorts</span>
                            </div>
                            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-pink-600 to-purple-600"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </Card>
                </div>

                <Card className="p-6 bg-white/5 border-white/10">
                  <h3 className="text-xl font-bold text-white mb-4">Revenue Breakdown</h3>
                  <div className="grid md:grid-cols-4 gap-4">
                    <div>
                      <div className="text-gray-400 text-sm mb-1">This Month</div>
                      <div className="text-3xl font-black text-white">CHF 45K</div>
                      <div className="text-green-400 text-sm">+12% vs last month</div>
                    </div>
                    <div>
                      <div className="text-gray-400 text-sm mb-1">Last Month</div>
                      <div className="text-3xl font-black text-white">CHF 40K</div>
                      <div className="text-gray-400 text-sm">Previous period</div>
                    </div>
                    <div>
                      <div className="text-gray-400 text-sm mb-1">Avg Per Booking</div>
                      <div className="text-3xl font-black text-white">CHF 520</div>
                      <div className="text-gray-400 text-sm">Across all services</div>
                    </div>
                    <div>
                      <div className="text-gray-400 text-sm mb-1">Premium %</div>
                      <div className="text-3xl font-black text-white">65%</div>
                      <div className="text-yellow-400 text-sm">Premium bookings</div>
                    </div>
                  </div>
                </Card>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings">
              <Card className="p-8 bg-white/10 backdrop-blur-md border-white/20">
                <h2 className="text-2xl font-bold text-white mb-6">Platform Settings</h2>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div>
                      <h3 className="text-white font-bold mb-1">New Registrations</h3>
                      <p className="text-gray-400 text-sm">Allow new escorts to register</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div>
                      <h3 className="text-white font-bold mb-1">Auto-Verification</h3>
                      <p className="text-gray-400 text-sm">Automatically verify new profiles</p>
                    </div>
                    <Switch />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div>
                      <h3 className="text-white font-bold mb-1">Email Notifications</h3>
                      <p className="text-gray-400 text-sm">Send booking notifications to escorts</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div>
                      <h3 className="text-white font-bold mb-1">Maintenance Mode</h3>
                      <p className="text-gray-400 text-sm">Temporarily disable public access</p>
                    </div>
                    <Switch />
                  </div>
                </div>

                <div className="mt-8 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                  <div className="flex items-start gap-3 text-yellow-400">
                    <Bell size={20} className="flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-semibold mb-1">Admin Notice</p>
                      <p className="text-yellow-300/80">
                        Changes to platform settings take effect immediately. Use caution when modifying verification and registration settings.
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Edit Escort Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="bg-gray-900 border-white/20 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black">Edit Escort Profile</DialogTitle>
          </DialogHeader>
          {editingEscort && (
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-white mb-2 block">Name</Label>
                  <Input
                    value={editingEscort.name}
                    onChange={(e) => setEditingEscort({...editingEscort, name: e.target.value})}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div>
                  <Label className="text-white mb-2 block">Age</Label>
                  <Input
                    type="number"
                    value={editingEscort.age}
                    onChange={(e) => setEditingEscort({...editingEscort, age: parseInt(e.target.value)})}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-white mb-2 block">City</Label>
                  <Select value={editingEscort.city} onValueChange={(val) => setEditingEscort({...editingEscort, city: val})}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Zürich">Zürich</SelectItem>
                      <SelectItem value="Geneva">Geneva</SelectItem>
                      <SelectItem value="Basel">Basel</SelectItem>
                      <SelectItem value="Bern">Bern</SelectItem>
                      <SelectItem value="Lausanne">Lausanne</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-white mb-2 block">Rate (CHF/hr)</Label>
                  <Input
                    type="number"
                    value={editingEscort.rate}
                    onChange={(e) => setEditingEscort({...editingEscort, rate: parseInt(e.target.value)})}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <Button
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10"
                  onClick={() => setEditModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-green-600 hover:bg-green-700"
                  onClick={handleSaveEscort}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* New Escort Modal */}
      <Dialog open={newEscortModalOpen} onOpenChange={setNewEscortModalOpen}>
        <DialogContent className="bg-gray-900 border-white/20 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black">Add New Escort</DialogTitle>
          </DialogHeader>
          <div className="text-center py-8">
            <Plus size={64} className="mx-auto text-gray-500 mb-4" />
            <p className="text-gray-400">New escort form would be implemented here with full profile creation fields.</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}