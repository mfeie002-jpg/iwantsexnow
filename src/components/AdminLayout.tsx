import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { createClient } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { LogOut, Shield, Loader2 } from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");

  // Initialize Supabase client only on client side
  const getSupabaseClient = () => {
    if (typeof window === "undefined") return null;
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) return null;
    
    return createClient(supabaseUrl, supabaseAnonKey);
  };

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = getSupabaseClient();
      if (!supabase) {
        router.push("/admin/login");
        return;
      }

      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          router.push("/admin/login");
          return;
        }

        // Check if user has admin role
        const { data: roles, error } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", session.user.id)
          .eq("role", "admin")
          .single();

        if (error || !roles) {
          await supabase.auth.signOut();
          router.push("/admin/login");
          return;
        }

        setUserEmail(session.user.email || "");
        setLoading(false);
      } catch (error) {
        console.error("Auth check error:", error);
        router.push("/admin/login");
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    const supabase = getSupabaseClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    router.push("/admin/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-red-50 dark:from-gray-900 dark:via-purple-950 dark:to-pink-950">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-red-50 dark:from-gray-900 dark:via-purple-950 dark:to-pink-950">
      {/* Admin Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-purple-600" />
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Admin Panel
              </h1>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {userEmail}
            </span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </header>

      {/* Content */}
      <main>
        {children}
      </main>
    </div>
  );
}