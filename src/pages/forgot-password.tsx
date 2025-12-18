import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Heart, AlertCircle, CheckCircle2, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!email) {
      setError("Please enter your email address");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find((u: any) => u.email === email);

    if (user) {
      // In production: Send actual reset email
      // For now: Store reset token in localStorage
      const resetToken = Math.random().toString(36).substring(2, 15);
      const resetData = {
        email: email,
        token: resetToken,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString() // 1 hour
      };
      localStorage.setItem("passwordReset", JSON.stringify(resetData));

      // Log activity
      const activityKey = `activity_${user.username}`;
      const activities = JSON.parse(localStorage.getItem(activityKey) || "[]");
      activities.unshift({
        id: Date.now(),
        type: "password_reset_request",
        description: "Password reset requested",
        timestamp: new Date().toISOString(),
        metadata: { email }
      });
      localStorage.setItem(activityKey, JSON.stringify(activities));
    }

    // Always show success (don't reveal if email exists)
    setLoading(false);
    setSuccess(true);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 shadow-2xl text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-6">
            <CheckCircle2 className="text-green-600" size={40} />
          </div>
          <h1 className="text-3xl font-black mb-4">Check Your Email</h1>
          <p className="text-gray-700 mb-8 leading-relaxed">
            We've sent password reset instructions to <strong>{email}</strong>
          </p>
          <p className="text-sm text-gray-600 mb-6">
            Didn't receive the email? Check your spam folder or{" "}
            <button onClick={() => setSuccess(false)} className="text-pink-600 hover:underline font-semibold">
              try again
            </button>
          </p>
          <Button size="lg" className="w-full bg-pink-600 hover:bg-pink-700" asChild>
            <Link href="/login">
              <ArrowLeft size={18} className="mr-2" />
              Back to Login
            </Link>
          </Button>
        </Card>
      </div>
    );
  }

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
          <h1 className="text-4xl font-black mb-2">Forgot Password?</h1>
          <p className="text-gray-600">
            Enter your email and we'll send you reset instructions
          </p>
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
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              autoComplete="email"
            />
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
                Sending...
              </>
            ) : (
              "Send Reset Instructions"
            )}
          </Button>

          <div className="text-center">
            <Link href="/login" className="text-sm text-gray-600 hover:text-pink-600 inline-flex items-center gap-1">
              <ArrowLeft size={16} />
              Back to Login
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
}