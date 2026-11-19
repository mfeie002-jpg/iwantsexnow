import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Lock, Mail, AlertCircle, Loader2 } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Initialize Supabase client only on client side
  const getSupabaseClient = () => {
    if (typeof window === "undefined") return null;
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) return null;
    
    return createClient(supabaseUrl, supabaseAnonKey);
  };

  useEffect(() => {
    // Check if already logged in
    const checkAuth = async () => {
      const supabase = getSupabaseClient();
      if (!supabase) return;

      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // Check if user has admin role
        const { data: roles } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", session.user.id)
          .eq("role", "admin")
          .single();

        if (roles) {
          router.push("/admin/tools");
        }
      }
    };
    checkAuth();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = getSupabaseClient();
    if (!supabase) {
      setError("Supabase configuration missing");
      setLoading(false);
      return;
    }

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      if (data.session) {
        // Check if user has admin role
        const { data: roles, error: roleError } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", data.session.user.id)
          .eq("role", "admin")
          .single();

        if (roleError || !roles) {
          await supabase.auth.signOut();
          throw new Error("Access denied. Admin role required.");
        }

        router.push("/admin/tools");
      }
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = getSupabaseClient();
    if (!supabase) {
      setError("Supabase configuration missing");
      setLoading(false);
      return;
    }

    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/admin/login`,
        },
      });

      if (authError) throw authError;

      if (data.user) {
        setError("Account created! Please check your email for confirmation. Then contact an admin to grant you admin role.");
      }
    } catch (err: any) {
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Admin Login - Web Analyzer Suite</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <LuxuryHeader />
      <div className="min-h-screen bg-papier text-tinte">
        <main className="form-sheet">
          <div className="mb-8">
            <p className="kicker">Verwaltung</p>
            <h1>
              Admin Login
            </h1>
            <p className="text-gray-500 dark:text-gray-600 mt-2">
              Web Analyzer Suite
            </p>
          </div>

          {error && (
            <Alert className="mb-6 border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <AlertDescription className="text-red-900 dark:text-red-200">
                {error}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2 pt-4">
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-dusk-600 to-glow-600 hover:from-dusk-700 hover:to-glow-700"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleSignup}
                disabled={loading}
              >
                Create Account
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-600">
            <p>
              After signup, contact an admin to grant you admin role:
            </p>
            <code className="block mt-2 p-2 bg-gray-900 dark:bg-gray-200 rounded text-[13px]">
              Insert Into user_roles (user_id, role) VALUES ('your-id', 'admin');
            </code>
          </div>
        </main>
      </div>
    </>
  );
}