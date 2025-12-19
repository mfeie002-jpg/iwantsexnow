import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Heart, AlertCircle, CheckCircle2, Loader2, Eye, EyeOff, Shield, Lock, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Register() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    accountType: "client",
    gender: "",
    age: "",
    city: "",
    phone: "",
    agreeToTerms: false,
    agreeToPrivacy: false,
    newsletter: true
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

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePassword = (password: string) => {
    if (password.length < 8) return "Password must be at least 8 characters";
    if (!/[A-Z]/.test(password)) return "Password must contain uppercase letter";
    if (!/[a-z]/.test(password)) return "Password must contain lowercase letter";
    if (!/[0-9]/.test(password)) return "Password must contain a number";
    return "";
  };

  const validateUsername = (username: string) => {
    if (username.length < 3) return "Username must be at least 3 characters";
    if (!/^[a-zA-Z0-9_]+$/.test(username)) return "Username can only contain letters, numbers, and underscores";
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: {[key: string]: string} = {};

    // Username validation
    const usernameError = validateUsername(formData.username);
    if (usernameError) newErrors.username = usernameError;

    // Check if username exists
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    if (users.some((u: any) => u.username === formData.username)) {
      newErrors.username = "Username already taken";
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Invalid email format";
    } else if (users.some((u: any) => u.email === formData.email)) {
      newErrors.email = "Email already registered";
    }

    // Password validation
    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      newErrors.password = passwordError;
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match";
    }

    // Age validation
    if (!formData.age) {
      newErrors.age = "Age is required";
    } else if (parseInt(formData.age) < 18) {
      newErrors.age = "You must be at least 18 years old";
    } else if (parseInt(formData.age) > 99) {
      newErrors.age = "Please enter a valid age";
    }

    // Required fields
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.city) newErrors.city = "City is required";

    // Terms agreement
    if (!formData.agreeToTerms) {
      newErrors.terms = "You must agree to the Terms of Service";
    }
    if (!formData.agreeToPrivacy) {
      newErrors.privacy = "You must agree to the Privacy Policy";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      const newUser = {
        id: Date.now(),
        username: formData.username,
        email: formData.email,
        password: formData.password, // In production: hash this!
        accountType: formData.accountType,
        gender: formData.gender,
        age: parseInt(formData.age),
        city: formData.city,
        phone: formData.phone,
        verified: false,
        emailVerified: false,
        online: true,
        premium: false,
        membershipStatus: "trial", // "trial", "active", "expired"
        trialEndsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
        createdAt: new Date().toISOString(),
        lastActive: new Date().toISOString(),
        newsletter: formData.newsletter,
        promoCredits: 0,
        activityLog: [],
        paymentHistory: [],
        favorites: [],
        viewedProfiles: []
      };

      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));
      localStorage.setItem("currentUser", formData.username);
      localStorage.setItem("userSession", JSON.stringify({
        username: formData.username,
        loginTime: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
      }));

      // Log registration activity
      const activity = {
        id: Date.now(),
        type: "registration",
        description: "Account created",
        timestamp: new Date().toISOString(),
        metadata: {
          accountType: formData.accountType,
          source: "web"
        }
      };
      localStorage.setItem(`activity_${formData.username}`, JSON.stringify([activity]));

      setLoading(false);
      router.push("/profile");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0D1B2A] sticky top-0 z-50 backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90">
        <div className="container mx-auto px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold tracking-tight">
              <span className="text-[#0D1B2A] dark:text-white">iWant</span>
              <span className="text-[#C69C6D] dark:text-[#D5A021]">Sex</span>
              <span className="text-[#0D1B2A] dark:text-white">Now</span>
              <span className="text-gray-500 dark:text-gray-400 text-lg">.ch</span>
            </span>
          </Link>
        </div>
      </header>

      {/* Add padding to account for fixed header */}
      <div className="pt-20">
        <div className="flex items-center justify-center p-4">
          <Card className="w-full max-w-3xl p-6 md:p-8 shadow-2xl">
            <div className="text-center mb-6 md:mb-8">
              <Link href="/" className="inline-flex items-center gap-2 mb-4">
                <span className="text-2xl font-bold tracking-tight">
                  <span className="text-[#0D1B2A] dark:text-white">iWant</span>
                  <span className="text-[#C69C6D] dark:text-[#D5A021]">Sex</span>
                  <span className="text-[#0D1B2A] dark:text-white">Now</span>
                  <span className="text-gray-500 dark:text-gray-400 text-lg">.ch</span>
                </span>
              </Link>
              <h1 className="text-3xl md:text-4xl font-black mb-2">Create Your Account</h1>
              <p className="text-base md:text-xl text-gray-600">Join thousands of singles in Switzerland</p>
            </div>

            {/* Trust Badges - Mobile Optimized */}
            <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-6 md:mb-8 pb-6 md:pb-8 border-b">
              <Badge variant="outline" className="text-xs md:text-sm">
                <Shield size={14} className="mr-1" />
                100% Secure
              </Badge>
              <Badge variant="outline" className="text-xs md:text-sm">
                <Lock size={14} className="mr-1" />
                Private & Discreet
              </Badge>
              <Badge variant="outline" className="text-xs md:text-sm">
                <CheckCircle size={14} className="mr-1" />
                Verified Profiles
              </Badge>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
              {/* Account Type Selection */}
              <div className="space-y-2">
                <Label>I want to *</Label>
                <div className="grid grid-cols-2 gap-4">
                  <label className={`flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    formData.accountType === "client" ? "border-pink-600 bg-pink-50" : "border-gray-300 hover:border-pink-300"
                  }`}>
                    <input
                      type="radio"
                      name="accountType"
                      value="client"
                      checked={formData.accountType === "client"}
                      onChange={(e) => setFormData({ ...formData, accountType: e.target.value })}
                      className="mr-3 w-5 h-5 accent-pink-600"
                    />
                    <div className="text-center">
                      <div className="font-bold">Browse & Meet</div>
                      <div className="text-sm text-gray-600">Find companions</div>
                    </div>
                  </label>
                  <label className={`flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    formData.accountType === "escort" ? "border-pink-600 bg-pink-50" : "border-gray-300 hover:border-pink-300"
                  }`}>
                    <input
                      type="radio"
                      name="accountType"
                      value="escort"
                      checked={formData.accountType === "escort"}
                      onChange={(e) => setFormData({ ...formData, accountType: e.target.value })}
                      className="mr-3 w-5 h-5 accent-pink-600"
                    />
                    <div className="text-center">
                      <div className="font-bold">Offer Services</div>
                      <div className="text-sm text-gray-600">Become an escort</div>
                    </div>
                  </label>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {/* Username */}
                <div className="space-y-2">
                  <Label htmlFor="username">Username *</Label>
                  <Input
                    id="username"
                    placeholder="Choose a unique username"
                    value={formData.username}
                    onChange={(e) => {
                      setFormData({ ...formData, username: e.target.value });
                      setErrors({ ...errors, username: "" });
                    }}
                    className={errors.username ? "border-red-500" : ""}
                  />
                  {errors.username && (
                    <p className="text-red-600 text-sm flex items-center gap-1">
                      <AlertCircle size={14} />
                      {errors.username}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      setErrors({ ...errors, email: "" });
                    }}
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && (
                    <p className="text-red-600 text-sm flex items-center gap-1">
                      <AlertCircle size={14} />
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Min. 8 characters"
                      value={formData.password}
                      onChange={(e) => {
                        setFormData({ ...formData, password: e.target.value });
                        setErrors({ ...errors, password: "" });
                      }}
                      className={errors.password ? "border-red-500" : ""}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-600 text-sm flex items-center gap-1">
                      <AlertCircle size={14} />
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Re-enter password"
                      value={formData.confirmPassword}
                      onChange={(e) => {
                        setFormData({ ...formData, confirmPassword: e.target.value });
                        setErrors({ ...errors, confirmPassword: "" });
                      }}
                      className={errors.confirmPassword ? "border-red-500" : ""}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-600 text-sm flex items-center gap-1">
                      <AlertCircle size={14} />
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                {/* Gender */}
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender *</Label>
                  <Select 
                    value={formData.gender} 
                    onValueChange={(value) => {
                      setFormData({ ...formData, gender: value });
                      setErrors({ ...errors, gender: "" });
                    }}
                  >
                    <SelectTrigger className={errors.gender ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="trans">Trans</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.gender && (
                    <p className="text-red-600 text-sm flex items-center gap-1">
                      <AlertCircle size={14} />
                      {errors.gender}
                    </p>
                  )}
                </div>

                {/* Age */}
                <div className="space-y-2">
                  <Label htmlFor="age">Age *</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="18+"
                    min="18"
                    max="99"
                    value={formData.age}
                    onChange={(e) => {
                      setFormData({ ...formData, age: e.target.value });
                      setErrors({ ...errors, age: "" });
                    }}
                    className={errors.age ? "border-red-500" : ""}
                  />
                  {errors.age && (
                    <p className="text-red-600 text-sm flex items-center gap-1">
                      <AlertCircle size={14} />
                      {errors.age}
                    </p>
                  )}
                </div>

                {/* City */}
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    placeholder="Your city"
                    value={formData.city}
                    onChange={(e) => {
                      setFormData({ ...formData, city: e.target.value });
                      setErrors({ ...errors, city: "" });
                    }}
                    className={errors.city ? "border-red-500" : ""}
                  />
                  {errors.city && (
                    <p className="text-red-600 text-sm flex items-center gap-1">
                      <AlertCircle size={14} />
                      {errors.city}
                    </p>
                  )}
                </div>
              </div>

              {/* Phone (Optional) */}
              <div className="space-y-2">
                <Label htmlFor="phone">Phone (Optional)</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+41 XX XXX XX XX"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              {/* Terms & Conditions */}
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <Checkbox
                    id="terms"
                    checked={formData.agreeToTerms}
                    onCheckedChange={(checked) => {
                      setFormData({ ...formData, agreeToTerms: checked as boolean });
                      setErrors({ ...errors, terms: "" });
                    }}
                    className={errors.terms ? "border-red-500" : ""}
                  />
                  <Label htmlFor="terms" className="text-sm leading-relaxed cursor-pointer">
                    I am at least 18 years old and agree to the{" "}
                    <Link href="/terms" className="text-pink-600 hover:underline font-semibold">
                      Terms of Service
                    </Link>
                  </Label>
                </div>
                {errors.terms && (
                  <p className="text-red-600 text-sm flex items-center gap-1 ml-6">
                    <AlertCircle size={14} />
                    {errors.terms}
                  </p>
                )}

                <div className="flex items-start gap-2">
                  <Checkbox
                    id="privacy"
                    checked={formData.agreeToPrivacy}
                    onCheckedChange={(checked) => {
                      setFormData({ ...formData, agreeToPrivacy: checked as boolean });
                      setErrors({ ...errors, privacy: "" });
                    }}
                    className={errors.privacy ? "border-red-500" : ""}
                  />
                  <Label htmlFor="privacy" className="text-sm leading-relaxed cursor-pointer">
                    I agree to the{" "}
                    <Link href="/privacy" className="text-pink-600 hover:underline font-semibold">
                      Privacy Policy
                    </Link>
                  </Label>
                </div>
                {errors.privacy && (
                  <p className="text-red-600 text-sm flex items-center gap-1 ml-6">
                    <AlertCircle size={14} />
                    {errors.privacy}
                  </p>
                )}

                <div className="flex items-start gap-2">
                  <Checkbox
                    id="newsletter"
                    checked={formData.newsletter}
                    onCheckedChange={(checked) => setFormData({ ...formData, newsletter: checked as boolean })}
                  />
                  <Label htmlFor="newsletter" className="text-sm leading-relaxed cursor-pointer">
                    Send me exclusive offers and updates (optional)
                  </Label>
                </div>
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
                    Creating Account...
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={20} className="mr-2" />
                    Create Account
                  </>
                )}
              </Button>

              <p className="text-center text-sm text-gray-600">
                Already have an account?{" "}
                <Link href="/login" className="text-pink-600 hover:underline font-semibold">
                  Login here
                </Link>
              </p>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}