import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Heart, AlertCircle, Loader2, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Login() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    emailOrUsername: "",
    password: "",
    rememberMe: false
  });

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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 shadow-2xl">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <Heart className="text-pink-600 fill-pink-600" size={32} />
            <span className="text-2xl font-black bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              iWantSexNow.ch
            </span>
          </Link>
          <h1 className="text-4xl font-black mb-2">Welcome Back</h1>
          <p className="text-gray-600">Login to your account</p>
        </div>

        {error && (
          <Card className="p-4 mb-6 bg-red-50 border-2 border-red-200">
            <div className="flex items-center gap-2 text-red-800">
              <AlertCircle size={20} />
              <p className="font-semibold">{error}</p>
            </div>
          </Card>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
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
            className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-lg h-14"
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
  );
}