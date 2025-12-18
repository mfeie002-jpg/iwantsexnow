import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MobileNav } from "@/components/MobileNav";
import { Heart, Star, Shield, Clock, MapPin, Phone, Mail, CheckCircle, Award, Lock, Eye, MessageCircle, Calendar, DollarSign, Sparkles, Crown, Verified, Search } from "lucide-react";
import Link from "next/link";

export default function EscortZurich() {
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    date: "",
    duration: ""
  });

  const escorts = [
    {
      id: 1,
      name: "Sophia",
      age: 26,
      location: "Zürich City Center",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
      verified: true,
      premium: true,
      available: true,
      rating: 5.0,
      reviews: 127,
      languages: ["German", "English", "French"],
      services: ["Dinner Dates", "City Tours", "Events", "Travel Companion"],
      rate: "CHF 500/hour",
      description: "Sophisticated and elegant companion for discerning gentlemen"
    },
    {
      id: 2,
      name: "Isabella",
      age: 24,
      location: "Zürich Seefeld",
      image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop",
      verified: true,
      premium: true,
      available: false,
      rating: 4.9,
      reviews: 98,
      languages: ["German", "English", "Italian"],
      services: ["GFE", "Dinner Dates", "Overnight", "Weekend"],
      rate: "CHF 600/hour",
      description: "Beautiful Italian model available for exclusive encounters"
    },
    {
      id: 3,
      name: "Emma",
      age: 28,
      location: "Zürich Enge",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop",
      verified: true,
      premium: false,
      available: true,
      rating: 4.8,
      reviews: 156,
      languages: ["German", "English"],
      services: ["Massage", "Companionship", "Dinner Dates"],
      rate: "CHF 400/hour",
      description: "Warm and friendly companion with a genuine personality"
    },
    {
      id: 4,
      name: "Mia",
      age: 25,
      location: "Zürich Oerlikon",
      image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=400&fit=crop",
      verified: true,
      premium: true,
      available: true,
      rating: 5.0,
      reviews: 203,
      languages: ["German", "English", "Spanish"],
      services: ["GFE", "PSE", "Couples", "Travel"],
      rate: "CHF 700/hour",
      description: "Elite companion for unforgettable experiences"
    }
  ];

  const features = [
    {
      icon: Shield,
      title: "100% Verified Profiles",
      description: "All escorts are verified with ID and photo verification"
    },
    {
      icon: Lock,
      title: "Complete Discretion",
      description: "Your privacy is our priority. All bookings are confidential"
    },
    {
      icon: Award,
      title: "Premium Selection",
      description: "Handpicked elite companions in Zürich"
    },
    {
      icon: CheckCircle,
      title: "Safe & Secure",
      description: "Secure payment and booking system"
    },
    {
      icon: Clock,
      title: "24/7 Availability",
      description: "Book anytime, escorts available around the clock"
    },
    {
      icon: Star,
      title: "Top Rated",
      description: "Only the highest rated escorts in Switzerland"
    }
  ];

  const areas = [
    "Zürich City Center", "Seefeld", "Wiedikon", "Enge", "Altstetten",
    "Oerlikon", "Zürich Nord", "Zürich West", "Hottingen", "Wipkingen",
    "Schwamendingen", "Affoltern", "Höngg", "Albisrieden"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50">
      {/* Header with Mobile Nav */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Heart className="text-pink-600 fill-pink-600" size={32} />
              <span className="text-2xl font-black text-pink-600">
                iWantSexNow.ch
              </span>
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-3">
              <Button variant="ghost" asChild>
                <Link href="/members">Browse Members</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link href="/safety">Safety</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link href="/about">About</Link>
              </Button>
              <Button className="bg-pink-600 hover:bg-pink-700" asChild>
                <Link href="/register">Register Free</Link>
              </Button>
            </nav>

            {/* Mobile Navigation */}
            <MobileNav />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-600/10 to-purple-600/10" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <Badge className="bg-gradient-to-r from-pink-600 to-purple-600 border-0 text-lg px-6 py-2">
              <Crown size={18} className="mr-2" />
              Premium Escort Services in Zürich
            </Badge>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight">
              <span className="text-pink-600">Elite Escorts</span>
              <br />
              <span className="text-gray-900">in Zürich</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto font-medium">
              Meet verified, sophisticated companions for unforgettable experiences. 
              100% discreet, premium selection, available 24/7.
            </p>

            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center gap-8 pt-8">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-black text-pink-600">150+</div>
                <div className="text-sm text-gray-600 font-medium">Verified Escorts</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-black text-pink-600">24/7</div>
                <div className="text-sm text-gray-600 font-medium">Available</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-black text-pink-600">100%</div>
                <div className="text-sm text-gray-600 font-medium">Discreet</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Button size="lg" className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-lg px-8 h-14">
                <Search size={20} className="mr-2" />
                Browse Escorts
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 h-14 border-2">
                <Phone size={20} className="mr-2" />
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="py-12 bg-white border-y">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-6xl mx-auto">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div key={idx} className="text-center">
                  <div className="w-16 h-16 mx-auto rounded-full bg-pink-100 flex items-center justify-center mb-3">
                    <Icon className="text-pink-600" size={28} />
                  </div>
                  <h3 className="font-bold text-sm mb-1">{feature.title}</h3>
                  <p className="text-xs text-gray-600 hidden md:block">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Escorts */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black mb-4">Premium Escorts in Zürich</h2>
          <p className="text-xl text-gray-600">Verified, elite companions available now</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {escorts.map((escort) => (
            <Card key={escort.id} className="overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="relative">
                <img
                  src={escort.image}
                  alt={escort.name}
                  className="w-full h-80 object-cover"
                />
                {escort.available && (
                  <Badge className="absolute top-3 right-3 bg-green-500 border-0">
                    Available Now
                  </Badge>
                )}
                {escort.verified && (
                  <div className="absolute top-3 left-3 bg-blue-500 text-white rounded-full p-1.5">
                    <Shield size={16} />
                  </div>
                )}
                {escort.premium && (
                  <Badge className="absolute top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-500 to-orange-600 border-0">
                    <Crown size={12} className="mr-1" />
                    Premium
                  </Badge>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4">
                  <h3 className="text-white text-2xl font-bold">{escort.name}, {escort.age}</h3>
                  <div className="flex items-center gap-1 text-white/90 text-sm">
                    <MapPin size={14} />
                    <span>{escort.location}</span>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <Star size={14} className="text-yellow-400 fill-yellow-400" />
                    <span className="text-white text-sm font-medium">{escort.rating}</span>
                    <span className="text-white/70 text-xs">({escort.reviews} reviews)</span>
                  </div>
                </div>
              </div>
              <div className="p-4 space-y-3">
                <p className="text-sm text-gray-700">{escort.description}</p>
                
                <div>
                  <p className="text-xs font-semibold text-gray-700 mb-2">Languages:</p>
                  <div className="flex flex-wrap gap-1">
                    {escort.languages.map((lang, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {lang}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-700 mb-2">Services:</p>
                  <div className="flex flex-wrap gap-1">
                    {escort.services.slice(0, 2).map((service, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {service}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-gray-600">Starting from</span>
                    <span className="text-lg font-black text-pink-600">{escort.rate}</span>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700">
                    <MessageCircle size={18} className="mr-2" />
                    Contact Now
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button size="lg" variant="outline" className="text-lg px-8 border-2">
            View All {escorts.length * 10}+ Escorts in Zürich
          </Button>
        </div>
      </section>

      {/* Service Areas */}
      <section className="bg-gradient-to-r from-pink-50 to-purple-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-black text-center mb-4">
              We Cover All Areas in Zürich
            </h2>
            <p className="text-center text-gray-600 mb-8">
              Premium escort services available throughout the entire Zürich canton
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
              {areas.map((area, idx) => (
                <Link
                  key={idx}
                  href={`/escort-zurich/${area.toLowerCase().replace(/\s+/g, "-")}`}
                  className="text-center p-3 bg-white rounded-lg hover:shadow-lg transition-all hover:scale-105"
                >
                  <MapPin size={20} className="mx-auto text-pink-600 mb-2" />
                  <span className="text-sm font-medium">{area}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black text-center mb-12">
            Why Choose Our Zürich Escort Service?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 text-center hover:shadow-xl transition-all">
              <div className="w-20 h-20 mx-auto rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <Shield className="text-blue-600" size={40} />
              </div>
              <h3 className="text-xl font-bold mb-3">Verified & Safe</h3>
              <p className="text-gray-600">
                Every escort is thoroughly verified with ID checks and photo verification. 
                Your safety and security are guaranteed.
              </p>
            </Card>

            <Card className="p-8 text-center hover:shadow-xl transition-all">
              <div className="w-20 h-20 mx-auto rounded-full bg-purple-100 flex items-center justify-center mb-4">
                <Crown className="text-purple-600" size={40} />
              </div>
              <h3 className="text-xl font-bold mb-3">Elite Selection</h3>
              <p className="text-gray-600">
                Only the most sophisticated, educated, and beautiful companions. 
                Premium quality guaranteed.
              </p>
            </Card>

            <Card className="p-8 text-center hover:shadow-xl transition-all">
              <div className="w-20 h-20 mx-auto rounded-full bg-pink-100 flex items-center justify-center mb-4">
                <Lock className="text-pink-600" size={40} />
              </div>
              <h3 className="text-xl font-bold mb-3">100% Discreet</h3>
              <p className="text-gray-600">
                Complete confidentiality guaranteed. Anonymous booking, secure payments, 
                and absolute discretion.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="bg-gradient-to-r from-pink-600 to-purple-600 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12 text-white">
              <h2 className="text-3xl md:text-4xl font-black mb-4">Book Your Experience</h2>
              <p className="text-xl text-white/90">
                Contact us for exclusive escort services in Zürich
              </p>
            </div>

            <Card className="p-8">
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Your Name *</label>
                    <Input
                      placeholder="John Doe"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Email *</label>
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Phone (Optional)</label>
                    <Input
                      type="tel"
                      placeholder="+41 XX XXX XX XX"
                      value={contactForm.phone}
                      onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Preferred Date</label>
                    <Input
                      type="date"
                      value={contactForm.date}
                      onChange={(e) => setContactForm({ ...contactForm, date: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Duration</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={contactForm.duration}
                    onChange={(e) => setContactForm({ ...contactForm, duration: e.target.value })}
                  >
                    <option value="">Select duration</option>
                    <option value="1">1 hour</option>
                    <option value="2">2 hours</option>
                    <option value="3">3 hours</option>
                    <option value="dinner">Dinner date (4+ hours)</option>
                    <option value="overnight">Overnight</option>
                    <option value="weekend">Weekend</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Message *</label>
                  <Textarea
                    rows={4}
                    placeholder="Tell us about your preferences, special requests, or any questions..."
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-lg h-14"
                >
                  <MessageCircle size={20} className="mr-2" />
                  Send Inquiry
                </Button>

                <p className="text-sm text-center text-gray-600">
                  <Lock size={14} className="inline mr-1" />
                  All inquiries are 100% confidential and encrypted
                </p>
              </form>
            </Card>
          </div>
        </div>
      </section>

      {/* SEO Content */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto prose prose-lg">
          <h2 className="text-3xl font-black mb-6">Premium Escort Services in Zürich</h2>
          
          <p className="text-gray-700 leading-relaxed mb-6">
            Welcome to Zürich's most exclusive escort service. We provide verified, elite companions 
            for discerning gentlemen seeking sophisticated company in Switzerland's financial capital. 
            Our premium selection features educated, multilingual escorts who excel in providing 
            unforgettable experiences.
          </p>

          <h3 className="text-2xl font-bold mb-4">Why Zürich Escort Services?</h3>
          <p className="text-gray-700 leading-relaxed mb-6">
            Zürich is renowned for its high-quality lifestyle, and our escort services match this standard. 
            Whether you need a companion for business events, dinner dates, city tours, or private encounters, 
            our escorts provide professional, discreet services tailored to your needs.
          </p>

          <h3 className="text-2xl font-bold mb-4">What We Offer</h3>
          <ul className="space-y-2 mb-6">
            <li>✓ <strong>Verified Profiles:</strong> 100% real photos and verified identities</li>
            <li>✓ <strong>Elite Selection:</strong> Sophisticated, educated companions</li>
            <li>✓ <strong>Complete Discretion:</strong> Anonymous booking and confidential service</li>
            <li>✓ <strong>24/7 Availability:</strong> Escorts available around the clock</li>
            <li>✓ <strong>All Areas Covered:</strong> Service throughout Zürich canton</li>
            <li>✓ <strong>Multiple Languages:</strong> German, English, French, Italian and more</li>
          </ul>

          <h3 className="text-2xl font-bold mb-4">Areas We Serve in Zürich</h3>
          <p className="text-gray-700 leading-relaxed mb-6">
            Our escort services cover all areas of Zürich including City Center, Seefeld, Wiedikon, 
            Enge, Oerlikon, and surrounding districts. Outcall services available to hotels, private 
            residences, and business locations throughout the canton.
          </p>

          <h3 className="text-2xl font-bold mb-4">Booking Process</h3>
          <p className="text-gray-700 leading-relaxed mb-6">
            Booking is simple and discreet. Browse our verified profiles, select your preferred companion, 
            and contact us via phone, email, or our secure booking form. All communications are encrypted 
            and confidential. We offer flexible arrangements from one-hour encounters to overnight and 
            travel companionship.
          </p>

          <h3 className="text-2xl font-bold mb-4">Safety & Privacy</h3>
          <p className="text-gray-700 leading-relaxed mb-6">
            Your safety and privacy are our top priorities. All escorts are regularly health-checked, 
            verified, and screened. We use secure payment methods and never share client information. 
            Every booking is handled with complete discretion and professionalism.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Heart className="text-pink-600 fill-pink-600" size={24} />
                <span className="text-xl font-bold">iWantSexNow.ch</span>
              </div>
              <p className="text-gray-400 text-sm">
                Switzerland's premier escort service platform
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Escort Services</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/escort-zurich" className="hover:text-white">Zürich Escorts</Link></li>
                <li><Link href="/escort-geneva" className="hover:text-white">Geneva Escorts</Link></li>
                <li><Link href="/escort-basel" className="hover:text-white">Basel Escorts</Link></li>
                <li><Link href="/escort-bern" className="hover:text-white">Bern Escorts</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Information</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/about" className="hover:text-white">About Us</Link></li>
                <li><Link href="/safety" className="hover:text-white">Safety & Privacy</Link></li>
                <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
                <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
                <li><Link href="/disclaimer" className="hover:text-white">Disclaimer</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>© 2025 iWantSexNow.ch. All rights reserved. | 18+ Only</p>
            <p className="mt-2">Professional escort services in Switzerland. Licensed and legal.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}