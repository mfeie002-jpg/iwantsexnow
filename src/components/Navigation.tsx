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
    services: [
      {
        title: "Browse Services",
        icon: Star,
        items: [
          { label: "Zürich Escorts", href: "/escort-zurich", description: "Premium companions in Switzerland's largest city" },
          { label: "Geneva Escorts", href: "/escort-geneva", description: "International city elegance" },
          { label: "Basel Escorts", href: "/escort-basel", description: "Cultural capital experiences" },
          { label: "Bern Escorts", href: "/escort-bern", description: "UNESCO heritage companions" },
          { label: "Lausanne Escorts", href: "/escort-lausanne", description: "Lake Geneva sophistication" },
        ]
      },
      {
        title: "Service Types",
        icon: Sparkles,
        items: [
          { label: "GFE Experience", href: "/services/gfe", badge: "Popular" },
          { label: "Dinner Dates", href: "/services/dinner" },
          { label: "Travel Companion", href: "/services/travel" },
          { label: "Events & Parties", href: "/services/events" },
          { label: "Overnight Stays", href: "/services/overnight" },
        ]
      }
    ],
    locations: [
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
        title: "Regions",
        icon: MapPin,
        items: [
          { label: "Canton Zürich", href: "/regions/zurich" },
          { label: "Lake Geneva", href: "/regions/lake-geneva" },
          { label: "Central Switzerland", href: "/regions/central" },
          { label: "Ticino", href: "/regions/ticino" },
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
      <div className="absolute top-full left-0 mt-2 w-[600px] bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2">
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
    </nav>
  );
}