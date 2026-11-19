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
      <div className="flex min-h-screen items-center justify-center bg-papier text-tinte">
        <p>Anmeldung wird geprüft…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-papier text-tinte">
      <header className="site-header">
        <div className="site-header-bar">
          <p className="wordmark">
            Verwaltung<span>.</span>
          </p>
          <span className="text-link">{userEmail}</span>
          <button type="button" className="brass-button" onClick={handleLogout}>
            Abmelden
          </button>
        </div>
      </header>
      <main className="cockpit">{children}</main>
    </div>
  );
}