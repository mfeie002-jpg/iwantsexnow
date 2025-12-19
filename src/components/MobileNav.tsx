import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart, Menu, X, Home, Users, MessageCircle, Star, Settings, Search, Calendar, Gift, Lock, Image as ImageIcon, Bell, Shield, MapPin, Sparkles, ChevronDown, ChevronRight, Phone, HelpCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";

interface MenuItem {
  label: string;
  href?: string;
  icon: any;
  badge?: string;
  featured?: boolean;
  children?: { label: string; href: string; badge?: string; description?: string }[];
}

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const router = useRouter();

  const navigationItems: MenuItem[] = [
    { label: "Home", href: "/", icon: Home },
    {
      label: "Browse",
      icon: Users,
      featured: true,
      children: [
        { label: "Female Escorts", href: "/browse/female", description: "Women seeking clients", badge: "Popular" },
        { label: "Male Escorts", href: "/browse/male", description: "Men seeking clients" },
        { label: "Trans Escorts", href: "/browse/trans", description: "Transgender companions" },
        { label: "Non-Binary", href: "/browse/non-binary", description: "Non-binary companions" },
        { label: "Couples", href: "/browse/couples", description: "Couple services", badge: "New" },
        { label: "For Men", href: "/for/men", description: "Services for male clients" },
        { label: "For Women", href: "/for/women", description: "Services for female clients" },
        { label: "For Couples", href: "/for/couples", description: "Services for couples" },
        { label: "LGBTQ+ Friendly", href: "/lgbtq", description: "Inclusive services", badge: "🏳️‍🌈" },
      ]
    },
    {
      label: "Services",
      icon: Star,
      children: [
        { label: "Zürich", href: "/escort-zurich", description: "127 companions" },
        { label: "Geneva", href: "/escort-geneva", description: "89 companions" },
        { label: "Basel", href: "/escort-basel", description: "76 companions" },
        { label: "Bern", href: "/escort-bern", description: "54 companions" },
        { label: "Lausanne", href: "/escort-lausanne", description: "63 companions" },
        { label: "GFE/BFE Experience", href: "/services/gfe", badge: "Popular" },
        { label: "Dinner Dates", href: "/services/dinner" },
        { label: "Travel Companion", href: "/services/travel" },
        { label: "Massage Services", href: "/services/massage" },
      ]
    },
    {
      label: "Locations",
      icon: MapPin,
      children: [
        { label: "All Swiss Cities", href: "/locations", badge: "300+" },
        { label: "Canton Zürich", href: "/regions/zurich" },
        { label: "Lake Geneva Region", href: "/regions/lake-geneva" },
        { label: "Central Switzerland", href: "/regions/central" },
        { label: "Ticino", href: "/regions/ticino" },
        { label: "Near Me", href: "/nearby", badge: "GPS" },
        { label: "Available Now", href: "/available-now", badge: "Live" },
      ]
    },
    {
      label: "Community",
      icon: Users,
      children: [
        { label: "Browse Members", href: "/members" },
        { label: "Messages", href: "/messages", badge: "3" },
        { label: "Matches", href: "/matches" },
        { label: "Stories", href: "/stories", badge: "12" },
        { label: "Events", href: "/events" },
        { label: "Virtual Gifts", href: "/gifts" },
      ]
    },
    { label: "Premium Content", href: "/content-feed", icon: Lock, badge: "VIP" },
    { label: "Notifications", href: "/notifications", icon: Bell },
    {
      label: "Account",
      icon: Settings,
      children: [
        { label: "My Profile", href: "/profile" },
        { label: "Account Settings", href: "/account-settings" },
        { label: "Favorites", href: "/favorites" },
        { label: "Boost Profile", href: "/boost", badge: "Hot" },
        { label: "Verify Account", href: "/verify", badge: "Recommended" },
      ]
    },
    {
      label: "Help & Safety",
      icon: Shield,
      children: [
        { label: "Safety Center", href: "/safety" },
        { label: "Help Center", href: "/faq" },
        { label: "Contact Support", href: "/contact" },
      ]
    },
  ];

  const closeMenu = () => {
    setIsOpen(false);
    setExpandedSection(null);
  };

  const toggleSection = (label: string) => {
    setExpandedSection(expandedSection === label ? null : label);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden text-white hover:bg-white/10"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </Button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden"
          onClick={closeMenu}
        />
      )}

      {/* Mobile Menu Sidebar */}
      <div
        className={`fixed top-0 right-0 bottom-0 w-[85vw] max-w-sm bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header with New Typographic Logo */}
          <div className="flex items-center justify-between p-4 border-b border-white/20 bg-black/30 backdrop-blur-sm">
            <Link href="/" onClick={closeMenu} className="flex items-center gap-3 group">
              <div className="text-xl font-bold tracking-tight">
                <span className="text-white">iWant</span>
                <span className="text-[#D5A021]">Sex</span>
                <span className="text-white">Now</span>
                <span className="text-gray-400 text-base">.ch</span>
              </div>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={closeMenu}
              aria-label="Close menu"
              className="text-white hover:bg-white/10"
            >
              <X size={24} />
            </Button>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 overflow-y-auto py-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = router.pathname === item.href;
              const isExpanded = expandedSection === item.label;
              const hasChildren = item.children && item.children.length > 0;

              return (
                <div key={item.label}>
                  {hasChildren ? (
                    <>
                      <button
                        onClick={() => toggleSection(item.label)}
                        className={`flex items-center justify-between w-full px-5 py-3 hover:bg-white/10 transition-all ${
                          isExpanded ? "bg-white/10" : ""
                        } ${item.featured ? "bg-gradient-to-r from-pink-900/30 to-purple-900/30 border-l-4 border-pink-500" : ""}`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon size={20} className={item.featured ? "text-pink-400" : "text-pink-400"} />
                          <span className={`font-semibold ${item.featured ? "text-pink-400" : "text-white"}`}>
                            {item.label}
                          </span>
                          {item.badge && (
                            <span className="bg-pink-600 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <ChevronDown
                          size={18}
                          className={`text-white transition-transform duration-300 ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {/* Expandable Children */}
                      <div
                        className={`overflow-hidden transition-all duration-300 ${
                          isExpanded ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"
                        }`}
                      >
                        <div className="bg-black/30 border-l-2 border-pink-500/30">
                          {item.children?.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              onClick={closeMenu}
                              className="flex items-center justify-between px-5 pl-14 py-2.5 hover:bg-white/10 transition-colors group"
                            >
                              <div className="flex-1">
                                <div className="text-sm font-medium text-gray-200 group-hover:text-pink-400 transition-colors">
                                  {child.label}
                                </div>
                                {child.description && (
                                  <div className="text-xs text-gray-400 mt-0.5">
                                    {child.description}
                                  </div>
                                )}
                              </div>
                              {child.badge && (
                                <span className="bg-pink-600 text-white text-xs px-2 py-0.5 rounded-full font-bold ml-2">
                                  {child.badge}
                                </span>
                              )}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <Link
                      href={item.href!}
                      onClick={closeMenu}
                      className={`flex items-center justify-between px-5 py-3 hover:bg-white/10 transition-all ${
                        isActive ? "bg-white/10 border-l-4 border-pink-500" : ""
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon size={20} className={isActive ? "text-pink-400" : "text-gray-300"} />
                        <span className={`font-semibold ${isActive ? "text-pink-400" : "text-white"}`}>
                          {item.label}
                        </span>
                      </div>
                      {item.badge && (
                        <span className="bg-pink-600 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Footer Actions */}
          <div className="border-t border-white/20 p-4 space-y-2 bg-black/30">
            <Button className="w-full bg-[#C69C6D] hover:bg-[#B88C5D] text-white font-bold shadow-lg" asChild>
              <Link href="/premium" onClick={closeMenu}>
                <Sparkles size={18} className="mr-2" />
                Upgrade to Premium
              </Link>
            </Button>
            <Button variant="outline" className="w-full border-white/30 text-white hover:bg-white/10" asChild>
              <Link href="/register" onClick={closeMenu}>
                <Phone size={18} className="mr-2" />
                Register Free
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}