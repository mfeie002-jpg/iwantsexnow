import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Heart, ChevronDown, Phone, MapPin, Sparkles, Shield, Users, MessageCircle, Star, Calendar, Gift, Lock, Image as ImageIcon, Bell, Settings, HelpCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";

interface DropdownSection {
  title: string;
  icon: any;
  items: { label: string; href: string; description?: string; badge?: string }[];
}

export function Navigation() {
  const router = useRouter();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const dropdownSections: Record<string, DropdownSection[]> = {
    browse: [
      {
        title: "Browse by Gender",
        icon: Users,
        items: [
          { label: "Female Escorts", href: "/browse/female", description: "Women seeking clients", badge: "Popular" },
          { label: "Male Escorts", href: "/browse/male", description: "Men seeking clients" },
          { label: "Trans Escorts", href: "/browse/trans", description: "Transgender companions" },
          { label: "Non-Binary", href: "/browse/non-binary", description: "Non-binary companions" },
          { label: "Couples", href: "/browse/couples", description: "Couple services", badge: "New" },
        ]
      },
      {
        title: "Browse by Orientation",
        icon: Heart,
        items: [
          { label: "For Men", href: "/for/men", description: "Services for male clients" },
          { label: "For Women", href: "/for/women", description: "Services for female clients" },
          { label: "For Couples", href: "/for/couples", description: "Services for couples" },
          { label: "LGBTQ+ Friendly", href: "/lgbtq", description: "Inclusive services", badge: "🏳️‍🌈" },
        ]
      }
    ],
    services: [
      {
        title: "Major Cities",
        icon: MapPin,
        items: [
          { label: "Zürich", href: "/escort-zurich", description: "127 companions" },
          { label: "Geneva", href: "/escort-geneva", description: "89 companions" },
          { label: "Basel", href: "/escort-basel", description: "76 companions" },
          { label: "Bern", href: "/escort-bern", description: "54 companions" },
          { label: "Lausanne", href: "/escort-lausanne", description: "63 companions" },
        ]
      },
      {
        title: "Service Types",
        icon: Sparkles,
        items: [
          { label: "GFE/BFE Experience", href: "/services/gfe", badge: "Popular" },
          { label: "Dinner Dates", href: "/services/dinner" },
          { label: "Travel Companion", href: "/services/travel" },
          { label: "Events & Parties", href: "/services/events" },
          { label: "Massage Services", href: "/services/massage" },
        ]
      }
    ],
    locations: [
      {
        title: "Popular Regions",
        icon: MapPin,
        items: [
          { label: "Canton Zürich", href: "/regions/zurich", description: "Most active area" },
          { label: "Lake Geneva Region", href: "/regions/lake-geneva", description: "Luxury destinations" },
          { label: "Central Switzerland", href: "/regions/central" },
          { label: "Ticino", href: "/regions/ticino", description: "Italian-speaking region" },
          { label: "View All Locations", href: "/locations", badge: "300+" },
        ]
      },
      {
        title: "Quick Access",
        icon: Star,
        items: [
          { label: "Near Me", href: "/nearby", badge: "GPS" },
          { label: "Available Now", href: "/available-now", badge: "Live" },
          { label: "Virtual Services", href: "/virtual", badge: "Online" },
        ]
      }
    ],
    community: [
      {
        title: "Connect",
        icon: Users,
        items: [
          { label: "Browse Members", href: "/members", description: "Discover new connections" },
          { label: "Messages", href: "/messages", badge: "3 new" },
          { label: "Matches", href: "/matches", description: "Your mutual interests" },
          { label: "Stories", href: "/stories", badge: "12 new" },
        ]
      },
      {
        title: "Features",
        icon: Sparkles,
        items: [
          { label: "Events", href: "/events", description: "Upcoming gatherings" },
          { label: "Virtual Gifts", href: "/gifts" },
          { label: "Premium Content", href: "/content-feed", badge: "VIP" },
          { label: "Notifications", href: "/notifications" },
        ]
      }
    ],
    account: [
      {
        title: "Your Account",
        icon: Settings,
        items: [
          { label: "Profile", href: "/profile", description: "View and edit your profile" },
          { label: "Account Settings", href: "/account-settings", description: "Manage your preferences" },
          { label: "Favorites", href: "/favorites" },
          { label: "Boost Profile", href: "/boost", badge: "Popular" },
        ]
      },
      {
        title: "Help & Safety",
        icon: Shield,
        items: [
          { label: "Safety Center", href: "/safety", description: "Stay safe online" },
          { label: "Help Center", href: "/faq" },
          { label: "Verify Account", href: "/verify", badge: "Recommended" },
        ]
      }
    ]
  };

  const renderDropdown = (key: string) => {
    const sections = dropdownSections[key];
    if (!sections) return null;

    return (
      <div className="absolute top-full left-0 mt-2 w-[600px] bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2 z-50">
        <div className="grid grid-cols-2 gap-0">
          {sections.map((section, idx) => {
            const Icon = section.icon;
            return (
              <div key={idx} className={`p-6 ${idx % 2 === 1 ? 'bg-gray-50' : 'bg-white'}`}>
                <div className="flex items-center gap-2 mb-4">
                  <Icon size={18} className="text-pink-600" />
                  <h3 className="font-bold text-gray-900">{section.title}</h3>
                </div>
                <ul className="space-y-2">
                  {section.items.map((item, itemIdx) => (
                    <li key={itemIdx}>
                      <Link
                        href={item.href}
                        className="block px-3 py-2 rounded-lg hover:bg-pink-50 transition-colors group/item"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-gray-900 group-hover/item:text-pink-600 transition-colors text-sm">
                              {item.label}
                            </div>
                            {item.description && (
                              <div className="text-xs text-gray-500 mt-0.5 truncate">
                                {item.description}
                              </div>
                            )}
                          </div>
                          {item.badge && (
                            <span className="text-xs bg-pink-600 text-white px-2 py-0.5 rounded-full font-bold whitespace-nowrap">
                              {item.badge}
                            </span>
                          )}
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <nav className="hidden md:flex items-center gap-1" ref={dropdownRef}>
      {/* Browse Dropdown */}
      <div className="relative group">
        <Button
          variant="ghost"
          className="text-white hover:text-pink-400 hover:bg-white/10 gap-1 font-semibold"
        >
          Browse
          <ChevronDown size={16} className="group-hover:rotate-180 transition-transform duration-300" />
        </Button>
        {renderDropdown('browse')}
      </div>

      {/* Services Dropdown */}
      <div className="relative group">
        <Button
          variant="ghost"
          className="text-white hover:text-pink-400 hover:bg-white/10 gap-1 font-semibold"
        >
          Services
          <ChevronDown size={16} className="group-hover:rotate-180 transition-transform duration-300" />
        </Button>
        {renderDropdown('services')}
      </div>

      {/* Locations Dropdown */}
      <div className="relative group">
        <Button
          variant="ghost"
          className="text-white hover:text-pink-400 hover:bg-white/10 gap-1 font-semibold"
        >
          Locations
          <ChevronDown size={16} className="group-hover:rotate-180 transition-transform duration-300" />
        </Button>
        {renderDropdown('locations')}
      </div>

      {/* Community Dropdown */}
      <div className="relative group">
        <Button
          variant="ghost"
          className="text-white hover:text-pink-400 hover:bg-white/10 gap-1 font-semibold"
        >
          Community
          <ChevronDown size={16} className="group-hover:rotate-180 transition-transform duration-300" />
        </Button>
        {renderDropdown('community')}
      </div>

      {/* Account Dropdown */}
      <div className="relative group">
        <Button
          variant="ghost"
          className="text-white hover:text-pink-400 hover:bg-white/10 gap-1 font-semibold"
        >
          Account
          <ChevronDown size={16} className="group-hover:rotate-180 transition-transform duration-300" />
        </Button>
        {renderDropdown('account')}
      </div>

      {/* CTA Button */}
      <Button className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-bold shadow-lg shadow-pink-500/30 ml-2" asChild>
        <Link href="/register">
          <Phone size={18} className="mr-2" />
          Join Free
        </Link>
      </Button>

      {/* New Elegant Logo */}
      <Link href="/" className="flex items-center gap-3 group">
        <div className="relative">
          <img 
            src="/logo_128x128.png" 
            alt="iWantSexNow.ch Logo" 
            className="w-10 h-10 transition-all group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-rose-400/10 blur-xl group-hover:bg-rose-400/20 transition-all rounded-lg" />
        </div>
        <div>
          <span className="text-xl font-black text-white tracking-tight">
            iWantSexNow.ch
          </span>
          <div className="text-[10px] text-gray-400 font-semibold tracking-wider">WHERE DESIRE MEETS DISCRETION</div>
        </div>
      </Link>
    </nav>
  );
}