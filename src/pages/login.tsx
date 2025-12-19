import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Heart, AlertCircle, Loader2, Eye, EyeOff, Gift } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Login() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    emailOrUsername: "",
    password: "",
    rememberMe: false
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!formData.emailOrUsername || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find(
      (u: any) => 
        (u.email === formData.emailOrUsername || u.username === formData.emailOrUsername) && 
        u.password === formData.password
    );

    if (user) {
      // Update user's last active
      user.lastActive = new Date().toISOString();
      user.online = true;
      
      const updatedUsers = users.map((u: any) => u.id === user.id ? user : u);
      localStorage.setItem("users", JSON.stringify(updatedUsers));
      
      // Set current user
      localStorage.setItem("currentUser", user.username);
      
      // Create session
      const session = {
        username: user.username,
        loginTime: new Date().toISOString(),
        expiresAt: formData.rememberMe 
          ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
          : new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
      };
      localStorage.setItem("userSession", JSON.stringify(session));

      // Log login activity
      const activityKey = `activity_${user.username}`;
      const activities = JSON.parse(localStorage.getItem(activityKey) || "[]");
      activities.unshift({
        id: Date.now(),
        type: "login",
        description: "Logged in",
        timestamp: new Date().toISOString(),
        metadata: {
          rememberMe: formData.rememberMe,
          device: navigator.userAgent
        }
      });
      localStorage.setItem(activityKey, JSON.stringify(activities));

      setLoading(false);
      router.push("/profile");
    } else {
      setLoading(false);
      setError("Invalid email/username or password");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* Header with scroll behavior */}
      <header className={`border-b border-gray-200 bg-white/80 backdrop-blur-md fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'py-3 shadow-lg' : 'py-4'
      } ${
        headerVisible ? 'translate-y-0' : '-translate-y-full'
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <span className={`font-bold tracking-tight transition-all duration-300 ${
                scrolled ? 'text-lg' : 'text-xl'
              }`}>
                <span className="text-[#0D1B2A] dark:text-white">iWant</span>
                <span className="text-[#C69C6D] dark:text-[#D5A021]">Sex</span>
                <span className="text-[#0D1B2A] dark:text-white">Now</span>
                <span className="text-gray-500 dark:text-gray-400 text-base">.ch</span>
              </span>
            </Link>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600 hidden sm:inline">New here?</span>
              <Button variant="outline" size="sm" asChild>
                <Link href="/register">Register Free</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Add padding to account for fixed header */}
      <div className="pt-20 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-6 md:p-8 shadow-2xl">
          <div className="text-center mb-6 md:mb-8">
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="text-2xl font-bold tracking-tight">
                <span className="text-[#0D1B2A] dark:text-white">iWant</span>
                <span className="text-[#C69C6D] dark:text-[#D5A021]">Sex</span>
                <span className="text-[#0D1B2A] dark:text-white">Now</span>
                <span className="text-gray-500 dark:text-gray-400 text-lg">.ch</span>
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black mb-2">Welcome Back</h1>
            <p className="text-sm md:text-base text-gray-600">Login to your account</p>
          </div>

          {/* Promo Banner */}
          <Card className="p-4 mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200">
            <div className="flex items-center gap-3">
              <Gift className="text-green-600 flex-shrink-0" size={24} />
              <div>
                <p className="font-bold text-green-900 text-sm">New members get 7 days free!</p>
                <p className="text-xs text-green-700">Try premium features risk-free</p>
              </div>
            </div>
          </Card>

          {error && (
            <Card className="p-4 mb-6 bg-red-50 border-2 border-red-200">
              <div className="flex items-center gap-2 text-red-800">
                <AlertCircle size={20} />
                <p className="font-semibold text-sm">{error}</p>
              </div>
            </Card>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            <div className="space-y-2">
              <Label htmlFor="emailOrUsername">Email or Username</Label>
              <Input
                id="emailOrUsername"
                placeholder="your@email.com or username"
                value={formData.emailOrUsername}
                onChange={(e) => {
                  setFormData({ ...formData, emailOrUsername: e.target.value });
                  setError("");
                }}
                autoComplete="username"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="/forgot-password" className="text-sm text-pink-600 hover:underline font-semibold">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                    setError("");
                  }}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="rememberMe"
                checked={formData.rememberMe}
                onCheckedChange={(checked) => setFormData({ ...formData, rememberMe: checked as boolean })}
              />
              <Label htmlFor="rememberMe" className="text-sm cursor-pointer">
                Remember me for 30 days
              </Label>
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={loading}
              className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-base md:text-lg h-12 md:h-14"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={20} />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </Button>

            <p className="text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <Link href="/register" className="text-pink-600 hover:underline font-semibold">
                Register free
              </Link>
            </p>
          </form>
        </Card>
      </div>
    </div>
  );
}