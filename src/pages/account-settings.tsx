import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Heart, User, MapPin, Phone, Mail, Lock, CreditCard, Bell, Eye, Shield, Camera, Save, X, CheckCircle, AlertCircle, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function AccountSettings() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("profile");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const [profileData, setProfileData] = useState({
    username: "SophiaZH",
    email: "sophia@example.com",
    phone: "+41 76 123 45 67",
    displayName: "Sophia",
    age: 26,
    location: "Zürich",
    bio: "Professional companion offering unforgettable experiences",
    services: ["GFE", "Dinner Dates", "Events"],
    languages: ["German", "English", "French"],
    rate: 500,
    bodyType: "Athletic",
    height: "168 cm",
    ethnicity: "European",
    availability: "Available today 6PM-11PM"
  });

  const [securityData, setSecurityData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailMessages: true,
    emailBookings: true,
    emailPromotions: false,
    pushMessages: true,
    pushBookings: true,
    smsBookings: false
  });

  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: "public",
    showLastActive: true,
    showOnlineStatus: true,
    allowMessages: true,
    requireVerification: false
  });

  const handleSaveProfile = async () => {
    const newErrors: typeof errors = {};
    
    if (!profileData.displayName) newErrors.displayName = "Display name is required";
    if (!profileData.email) newErrors.email = "Email is required";
    if (profileData.age < 18 || profileData.age > 99) newErrors.age = "Age must be between 18-99";
    if (profileData.rate < 100) newErrors.rate = "Rate must be at least CHF 100";
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      setSaving(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      localStorage.setItem("userProfile", JSON.stringify(profileData));
      
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  const handleChangePassword = async () => {
    const newErrors: typeof errors = {};
    
    if (!securityData.currentPassword) newErrors.currentPassword = "Current password required";
    if (!securityData.newPassword) newErrors.newPassword = "New password required";
    if (securityData.newPassword.length < 8) newErrors.newPassword = "Password must be at least 8 characters";
    if (securityData.newPassword !== securityData.confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match";
    }
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      setSaving(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSaving(false);
      setSaved(true);
      setSecurityData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setTimeout(() => setSaved(false), 3000);
    }
  };

  const handleSaveSettings = async (type: string) => {
    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (type === "notifications") {
      localStorage.setItem("notificationSettings", JSON.stringify(notificationSettings));
    } else if (type === "privacy") {
      localStorage.setItem("privacySettings", JSON.stringify(privacySettings));
    }
    
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  useEffect(() => {
    const stored = localStorage.getItem("userProfile");
    if (stored) {
      setProfileData(JSON.parse(stored));
    }
  }, []);

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
              <Link href="/profile">Back to Profile</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-black mb-2">Account Settings</h1>
            <p className="text-gray-600">Manage your profile and preferences</p>
          </div>

          {saved && (
            <Card className="p-4 mb-6 bg-green-50 border-2 border-green-200 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center gap-3">
                <CheckCircle className="text-green-600" size={24} />
                <p className="text-green-900 font-semibold">Settings saved successfully!</p>
              </div>
            </Card>
          )}

          <div className="grid lg:grid-cols-4 gap-6">
            {/* Sidebar Navigation */}
            <Card className="p-6 h-fit sticky top-24">
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === "profile" ? "bg-pink-600 text-white" : "hover:bg-gray-100"
                  }`}
                >
                  <User size={20} />
                  <span className="font-medium">Profile Info</span>
                </button>
                <button
                  onClick={() => setActiveTab("security")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === "security" ? "bg-pink-600 text-white" : "hover:bg-gray-100"
                  }`}
                >
                  <Lock size={20} />
                  <span className="font-medium">Security</span>
                </button>
                <button
                  onClick={() => setActiveTab("notifications")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === "notifications" ? "bg-pink-600 text-white" : "hover:bg-gray-100"
                  }`}
                >
                  <Bell size={20} />
                  <span className="font-medium">Notifications</span>
                </button>
                <button
                  onClick={() => setActiveTab("privacy")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === "privacy" ? "bg-pink-600 text-white" : "hover:bg-gray-100"
                  }`}
                >
                  <Shield size={20} />
                  <span className="font-medium">Privacy</span>
                </button>
                <button
                  onClick={() => setActiveTab("billing")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === "billing" ? "bg-pink-600 text-white" : "hover:bg-gray-100"
                  }`}
                >
                  <CreditCard size={20} />
                  <span className="font-medium">Billing</span>
                </button>
              </nav>
            </Card>

            {/* Content Area */}
            <div className="lg:col-span-3 space-y-6">
              {/* Profile Info Tab */}
              {activeTab === "profile" && (
                <>
                  <Card className="p-6">
                    <h2 className="text-2xl font-bold mb-6">Profile Information</h2>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label>Username *</Label>
                        <Input
                          value={profileData.username}
                          onChange={(e) => setProfileData({...profileData, username: e.target.value})}
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <Label>Display Name *</Label>
                        <Input
                          value={profileData.displayName}
                          onChange={(e) => {
                            setProfileData({...profileData, displayName: e.target.value});
                            setErrors({...errors, displayName: ""});
                          }}
                          className={`mt-2 ${errors.displayName ? "border-red-500" : ""}`}
                        />
                        {errors.displayName && (
                          <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                            <AlertCircle size={14} />
                            {errors.displayName}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label>Email *</Label>
                        <Input
                          type="email"
                          value={profileData.email}
                          onChange={(e) => {
                            setProfileData({...profileData, email: e.target.value});
                            setErrors({...errors, email: ""});
                          }}
                          className={`mt-2 ${errors.email ? "border-red-500" : ""}`}
                        />
                        {errors.email && (
                          <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                            <AlertCircle size={14} />
                            {errors.email}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label>Phone</Label>
                        <Input
                          type="tel"
                          value={profileData.phone}
                          onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <Label>Age *</Label>
                        <Input
                          type="number"
                          value={profileData.age}
                          onChange={(e) => {
                            setProfileData({...profileData, age: parseInt(e.target.value) || 0});
                            setErrors({...errors, age: ""});
                          }}
                          min="18"
                          max="99"
                          className={`mt-2 ${errors.age ? "border-red-500" : ""}`}
                        />
                        {errors.age && (
                          <p className="text-red-600 text-sm mt-1">{errors.age}</p>
                        )}
                      </div>

                      <div>
                        <Label>Location *</Label>
                        <Input
                          value={profileData.location}
                          onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <Label>Hourly Rate (CHF) *</Label>
                        <Input
                          type="number"
                          value={profileData.rate}
                          onChange={(e) => {
                            setProfileData({...profileData, rate: parseInt(e.target.value) || 0});
                            setErrors({...errors, rate: ""});
                          }}
                          min="100"
                          className={`mt-2 ${errors.rate ? "border-red-500" : ""}`}
                        />
                        {errors.rate && (
                          <p className="text-red-600 text-sm mt-1">{errors.rate}</p>
                        )}
                      </div>

                      <div>
                        <Label>Body Type</Label>
                        <Select value={profileData.bodyType} onValueChange={(value) => setProfileData({...profileData, bodyType: value})}>
                          <SelectTrigger className="mt-2">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Slim">Slim</SelectItem>
                            <SelectItem value="Athletic">Athletic</SelectItem>
                            <SelectItem value="Average">Average</SelectItem>
                            <SelectItem value="Curvy">Curvy</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Height</Label>
                        <Input
                          value={profileData.height}
                          onChange={(e) => setProfileData({...profileData, height: e.target.value})}
                          placeholder="e.g. 168 cm"
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <Label>Ethnicity</Label>
                        <Input
                          value={profileData.ethnicity}
                          onChange={(e) => setProfileData({...profileData, ethnicity: e.target.value})}
                          className="mt-2"
                        />
                      </div>
                    </div>

                    <div className="mt-6">
                      <Label>Bio / About Me</Label>
                      <Textarea
                        value={profileData.bio}
                        onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                        rows={4}
                        className="mt-2 resize-none"
                        maxLength={500}
                      />
                      <p className="text-sm text-gray-600 mt-1">{profileData.bio.length}/500 characters</p>
                    </div>

                    <div className="mt-6">
                      <Label>Availability Status</Label>
                      <Input
                        value={profileData.availability}
                        onChange={(e) => setProfileData({...profileData, availability: e.target.value})}
                        placeholder="e.g. Available today 6PM-11PM"
                        className="mt-2"
                      />
                    </div>

                    <div className="flex gap-4 mt-8 pt-6 border-t">
                      <Button
                        size="lg"
                        onClick={handleSaveProfile}
                        disabled={saving}
                        className="bg-pink-600 hover:bg-pink-700"
                      >
                        {saving ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save size={20} className="mr-2" />
                            Save Changes
                          </>
                        )}
                      </Button>
                      <Button variant="outline" size="lg" onClick={() => router.push("/profile")}>
                        Cancel
                      </Button>
                    </div>
                  </Card>
                </>
              )}

              {/* Security Tab */}
              {activeTab === "security" && (
                <Card className="p-6">
                  <h2 className="text-2xl font-bold mb-6">Security Settings</h2>
                  
                  <div className="space-y-6 max-w-md">
                    <div>
                      <Label>Current Password *</Label>
                      <Input
                        type="password"
                        value={securityData.currentPassword}
                        onChange={(e) => {
                          setSecurityData({...securityData, currentPassword: e.target.value});
                          setErrors({...errors, currentPassword: ""});
                        }}
                        className={`mt-2 ${errors.currentPassword ? "border-red-500" : ""}`}
                      />
                      {errors.currentPassword && (
                        <p className="text-red-600 text-sm mt-1">{errors.currentPassword}</p>
                      )}
                    </div>

                    <div>
                      <Label>New Password *</Label>
                      <Input
                        type="password"
                        value={securityData.newPassword}
                        onChange={(e) => {
                          setSecurityData({...securityData, newPassword: e.target.value});
                          setErrors({...errors, newPassword: ""});
                        }}
                        className={`mt-2 ${errors.newPassword ? "border-red-500" : ""}`}
                      />
                      {errors.newPassword && (
                        <p className="text-red-600 text-sm mt-1">{errors.newPassword}</p>
                      )}
                    </div>

                    <div>
                      <Label>Confirm New Password *</Label>
                      <Input
                        type="password"
                        value={securityData.confirmPassword}
                        onChange={(e) => {
                          setSecurityData({...securityData, confirmPassword: e.target.value});
                          setErrors({...errors, confirmPassword: ""});
                        }}
                        className={`mt-2 ${errors.confirmPassword ? "border-red-500" : ""}`}
                      />
                      {errors.confirmPassword && (
                        <p className="text-red-600 text-sm mt-1">{errors.confirmPassword}</p>
                      )}
                    </div>

                    <Button
                      size="lg"
                      onClick={handleChangePassword}
                      disabled={saving}
                      className="w-full bg-pink-600 hover:bg-pink-700"
                    >
                      {saving ? "Changing Password..." : "Change Password"}
                    </Button>
                  </div>
                </Card>
              )}

              {/* Notifications Tab */}
              {activeTab === "notifications" && (
                <Card className="p-6">
                  <h2 className="text-2xl font-bold mb-6">Notification Preferences</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-bold text-lg mb-4">Email Notifications</h3>
                      <div className="space-y-3">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <Checkbox
                            checked={notificationSettings.emailMessages}
                            onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, emailMessages: checked as boolean})}
                          />
                          <div>
                            <p className="font-medium">New Messages</p>
                            <p className="text-sm text-gray-600">Get notified when someone sends you a message</p>
                          </div>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                          <Checkbox
                            checked={notificationSettings.emailBookings}
                            onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, emailBookings: checked as boolean})}
                          />
                          <div>
                            <p className="font-medium">Booking Requests</p>
                            <p className="text-sm text-gray-600">Get notified about new booking inquiries</p>
                          </div>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                          <Checkbox
                            checked={notificationSettings.emailPromotions}
                            onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, emailPromotions: checked as boolean})}
                          />
                          <div>
                            <p className="font-medium">Promotions & Updates</p>
                            <p className="text-sm text-gray-600">Receive newsletters and promotional offers</p>
                          </div>
                        </label>
                      </div>
                    </div>

                    <div className="pt-6 border-t">
                      <h3 className="font-bold text-lg mb-4">Push Notifications</h3>
                      <div className="space-y-3">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <Checkbox
                            checked={notificationSettings.pushMessages}
                            onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, pushMessages: checked as boolean})}
                          />
                          <div>
                            <p className="font-medium">New Messages</p>
                            <p className="text-sm text-gray-600">Browser push notifications for messages</p>
                          </div>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                          <Checkbox
                            checked={notificationSettings.pushBookings}
                            onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, pushBookings: checked as boolean})}
                          />
                          <div>
                            <p className="font-medium">Booking Requests</p>
                            <p className="text-sm text-gray-600">Browser push notifications for bookings</p>
                          </div>
                        </label>
                      </div>
                    </div>

                    <div className="pt-6 border-t">
                      <h3 className="font-bold text-lg mb-4">SMS Notifications</h3>
                      <div className="space-y-3">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <Checkbox
                            checked={notificationSettings.smsBookings}
                            onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, smsBookings: checked as boolean})}
                          />
                          <div>
                            <p className="font-medium">Urgent Bookings</p>
                            <p className="text-sm text-gray-600">SMS alerts for high-priority booking requests</p>
                          </div>
                        </label>
                      </div>
                    </div>

                    <Button
                      size="lg"
                      onClick={() => handleSaveSettings("notifications")}
                      disabled={saving}
                      className="bg-pink-600 hover:bg-pink-700"
                    >
                      {saving ? "Saving..." : "Save Notification Settings"}
                    </Button>
                  </div>
                </Card>
              )}

              {/* Privacy Tab */}
              {activeTab === "privacy" && (
                <Card className="p-6">
                  <h2 className="text-2xl font-bold mb-6">Privacy Settings</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <Label>Profile Visibility</Label>
                      <Select value={privacySettings.profileVisibility} onValueChange={(value) => setPrivacySettings({...privacySettings, profileVisibility: value})}>
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">Public - Anyone can see my profile</SelectItem>
                          <SelectItem value="members">Members Only - Only registered users</SelectItem>
                          <SelectItem value="private">Private - Hidden from search</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="pt-6 border-t space-y-4">
                      <label className="flex items-center justify-between cursor-pointer">
                        <div>
                          <p className="font-medium">Show Last Active</p>
                          <p className="text-sm text-gray-600">Display when you were last online</p>
                        </div>
                        <Checkbox
                          checked={privacySettings.showLastActive}
                          onCheckedChange={(checked) => setPrivacySettings({...privacySettings, showLastActive: checked as boolean})}
                        />
                      </label>
                      <label className="flex items-center justify-between cursor-pointer">
                        <div>
                          <p className="font-medium">Show Online Status</p>
                          <p className="text-sm text-gray-600">Let others see when you're online</p>
                        </div>
                        <Checkbox
                          checked={privacySettings.showOnlineStatus}
                          onCheckedChange={(checked) => setPrivacySettings({...privacySettings, showOnlineStatus: checked as boolean})}
                        />
                      </label>
                      <label className="flex items-center justify-between cursor-pointer">
                        <div>
                          <p className="font-medium">Allow Messages</p>
                          <p className="text-sm text-gray-600">Users can send you direct messages</p>
                        </div>
                        <Checkbox
                          checked={privacySettings.allowMessages}
                          onCheckedChange={(checked) => setPrivacySettings({...privacySettings, allowMessages: checked as boolean})}
                        />
                      </label>
                      <label className="flex items-center justify-between cursor-pointer">
                        <div>
                          <p className="font-medium">Require Verification</p>
                          <p className="text-sm text-gray-600">Only verified users can contact you</p>
                        </div>
                        <Checkbox
                          checked={privacySettings.requireVerification}
                          onCheckedChange={(checked) => setPrivacySettings({...privacySettings, requireVerification: checked as boolean})}
                        />
                      </label>
                    </div>

                    <Button
                      size="lg"
                      onClick={() => handleSaveSettings("privacy")}
                      disabled={saving}
                      className="bg-pink-600 hover:bg-pink-700"
                    >
                      {saving ? "Saving..." : "Save Privacy Settings"}
                    </Button>
                  </div>
                </Card>
              )}

              {/* Billing Tab */}
              {activeTab === "billing" && (
                <Card className="p-6">
                  <h2 className="text-2xl font-bold mb-6">Billing & Subscription</h2>
                  <div className="text-center py-12">
                    <CreditCard size={64} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-xl font-bold mb-2">Billing Management Coming Soon</h3>
                    <p className="text-gray-600 mb-6">
                      Manage your subscription, payment methods, and promotion credits
                    </p>
                    <Button className="bg-pink-600 hover:bg-pink-700" asChild>
                      <Link href="/pricing">View Pricing Plans</Link>
                    </Button>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}