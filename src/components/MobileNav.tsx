import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart, Menu, X, Home, Users, MessageCircle, Star, Settings, LogOut, Search, Calendar, Gift, Lock, Image as ImageIcon, Bell, Shield } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const navigationItems = [
    { label: "Home", href: "/", icon: Home },
    { label: "Browse Members", href: "/members", icon: Users },
    { label: "Messages", href: "/messages", icon: MessageCircle },
    { label: "Matches", href: "/matches", icon: Heart },
    { label: "Escort Services", href: "/escort-zurich", icon: Star, featured: true },
    { label: "Stories", href: "/stories", icon: ImageIcon },
    { label: "Events", href: "/events", icon: Calendar },
    { label: "Virtual Gifts", href: "/gifts", icon: Gift },
    { label: "Premium Content", href: "/content-feed", icon: Lock },
    { label: "Notifications", href: "/notifications", icon: Bell },
    { label: "Safety Center", href: "/safety", icon: Shield },
    { label: "Profile", href: "/profile", icon: Settings },
  ];

  const closeMenu = () => setIsOpen(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </Button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={closeMenu}
        />
      )}

      {/* Mobile Menu Sidebar */}
      <div
        className={`fixed top-0 right-0 bottom-0 w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <Link href="/" className="flex items-center gap-2" onClick={closeMenu}>
              <Heart className="text-pink-600 fill-pink-600" size={28} />
              <span className="text-xl font-black text-pink-600">
                iWantSexNow.ch
              </span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={closeMenu}
              aria-label="Close menu"
            >
              <X size={24} />
            </Button>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 overflow-y-auto py-4">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = router.pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMenu}
                  className={`flex items-center gap-3 px-6 py-3 hover:bg-pink-50 transition-colors ${
                    isActive ? "bg-pink-50 border-r-4 border-pink-600" : ""
                  } ${item.featured ? "bg-gradient-to-r from-yellow-50 to-orange-50" : ""}`}
                >
                  <Icon size={20} className={isActive ? "text-pink-600" : item.featured ? "text-orange-600" : "text-gray-600"} />
                  <span className={`font-medium ${isActive ? "text-pink-600" : item.featured ? "text-orange-600 font-bold" : "text-gray-900"}`}>
                    {item.label}
                  </span>
                  {item.featured && (
                    <span className="ml-auto bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                      NEW
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Footer Actions */}
          <div className="border-t p-4 space-y-2">
            <Button className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700" asChild>
              <Link href="/premium" onClick={closeMenu}>
                Upgrade to Premium
              </Link>
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/register" onClick={closeMenu}>
                Register Free
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}