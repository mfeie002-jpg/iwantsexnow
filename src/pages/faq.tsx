import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, ChevronDown, ChevronUp, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState("");

  const faqs = [
    {
      category: "Getting Started",
      questions: [
        {
          q: "How do I create an account?",
          a: "Click 'Register Free' in the top right corner. Fill out the registration form with your basic information, verify your email, and you're ready to start browsing!"
        },
        {
          q: "Is registration really free?",
          a: "Yes! Creating an account and browsing profiles is completely free. We also offer premium memberships with additional features."
        },
        {
          q: "What age do I need to be to join?",
          a: "You must be at least 18 years old to create an account on iWantSexNow.ch."
        },
        {
          q: "How do I verify my profile?",
          a: "After registration, you can request verification by uploading a photo of yourself holding your ID. Our team will review within 24 hours."
        }
      ]
    },
    {
      category: "Using the Platform",
      questions: [
        {
          q: "How do I search for members?",
          a: "Use the 'Browse Members' page to search. You can filter by age, location, distance, body type, and more. Premium members get access to advanced filters."
        },
        {
          q: "How do I send a message?",
          a: "Free members can send up to 5 messages per day. Premium members have unlimited messaging. Click the message button on any profile to start chatting."
        },
        {
          q: "Can I see who viewed my profile?",
          a: "Yes! Premium members can see everyone who has viewed their profile. Free members see the most recent 3 visitors."
        },
        {
          q: "How do I add someone to favorites?",
          a: "Click the heart icon on any profile to add them to your favorites. Access your favorites list from the main navigation menu."
        }
      ]
    },
    {
      category: "Premium Membership",
      questions: [
        {
          q: "What are the benefits of premium membership?",
          a: "Premium members get unlimited messages, advanced search filters, see who viewed their profile, ad-free experience, read receipts, and priority listing in search results."
        },
        {
          q: "How much does premium cost?",
          a: "We offer Gold membership at CHF 29.90/month and Platinum at CHF 49.90/month. Both come with different feature sets."
        },
        {
          q: "Can I cancel my premium membership?",
          a: "Yes, you can cancel anytime. Your premium features will remain active until the end of your billing period."
        },
        {
          q: "Do you offer discounts?",
          a: "We frequently run promotions! Currently offering 3 months for the price of 2. Check our premium page for current offers."
        }
      ]
    },
    {
      category: "Privacy & Safety",
      questions: [
        {
          q: "How do you protect my privacy?",
          a: "We use industry-standard encryption, never share your data with third parties, and offer anonymous browsing options for premium members."
        },
        {
          q: "Can I hide my profile?",
          a: "Yes! Premium members can use 'Private Mode' to browse invisibly. You can also hide your profile from search results anytime."
        },
        {
          q: "How do I report someone?",
          a: "Click the 'Report' button on any profile or message. Our team reviews all reports within 24 hours and takes appropriate action."
        },
        {
          q: "What happens if someone violates the rules?",
          a: "Depending on severity, we may issue warnings, suspend, or permanently ban users who violate our terms of service."
        }
      ]
    },
    {
      category: "Photos & Profiles",
      questions: [
        {
          q: "How many photos can I upload?",
          a: "Free members can upload up to 6 photos. Premium members can upload up to 20 photos."
        },
        {
          q: "What photo guidelines should I follow?",
          a: "Photos must be clear, show your face, be recent, and appropriate. No nudity, group photos, or photos of others."
        },
        {
          q: "Can I delete my photos?",
          a: "Yes, you can manage and delete your photos anytime from your profile settings."
        },
        {
          q: "How do I make my profile stand out?",
          a: "Upload multiple high-quality photos, write a genuine bio, verify your profile, and keep your information updated."
        }
      ]
    },
    {
      category: "Account Management",
      questions: [
        {
          q: "How do I change my password?",
          a: "Go to Settings > Security > Change Password. You'll need to enter your current password and choose a new one."
        },
        {
          q: "Can I change my username?",
          a: "Yes, you can change your username once every 30 days from your profile settings."
        },
        {
          q: "How do I delete my account?",
          a: "Go to Settings > Account > Delete Account. Note: This action is permanent and cannot be undone."
        },
        {
          q: "I forgot my password. What do I do?",
          a: "Click 'Forgot Password' on the login page. We'll send a reset link to your registered email address."
        }
      ]
    }
  ];

  const filteredFaqs = faqs.map(category => ({
    ...category,
    questions: category.questions.filter(
      q => q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
           q.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Heart className="text-pink-600 fill-pink-600" size={32} />
            <span className="text-2xl font-black text-pink-600">
              iWantSexNow.ch
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link href="/safety">Safety Tips</Link>
            </Button>
            <Button className="bg-pink-600 hover:bg-pink-700" asChild>
              <Link href="/register">Join Free</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-pink-600 border-0 text-lg px-6 py-2">
              Help Center
            </Badge>
            <h1 className="text-5xl font-black mb-4">Frequently Asked Questions</h1>
            <p className="text-xl text-gray-600 mb-8">
              Find answers to common questions about iWantSexNow.ch
            </p>

            {/* Search */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  placeholder="Search for answers..."
                  className="pl-12 h-14 text-lg"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {filteredFaqs.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                <h2 className="text-2xl font-bold mb-4 text-pink-600">{category.category}</h2>
                <div className="space-y-3">
                  {category.questions.map((faq, faqIndex) => {
                    const globalIndex = categoryIndex * 100 + faqIndex;
                    const isOpen = openIndex === globalIndex;
                    
                    return (
                      <Card
                        key={faqIndex}
                        className="overflow-hidden cursor-pointer hover:shadow-lg transition-all"
                        onClick={() => setOpenIndex(isOpen ? null : globalIndex)}
                      >
                        <div className="p-6">
                          <div className="flex items-start justify-between gap-4">
                            <h3 className="font-bold text-lg flex-1">{faq.q}</h3>
                            {isOpen ? (
                              <ChevronUp className="text-pink-600 flex-shrink-0" size={24} />
                            ) : (
                              <ChevronDown className="text-gray-400 flex-shrink-0" size={24} />
                            )}
                          </div>
                          {isOpen && (
                            <div className="mt-4 pt-4 border-t">
                              <p className="text-gray-700 leading-relaxed">{faq.a}</p>
                            </div>
                          )}
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {filteredFaqs.length === 0 && (
            <Card className="p-12 text-center">
              <Search size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-2xl font-bold mb-2">No results found</h3>
              <p className="text-gray-600 mb-4">
                Try different keywords or browse all categories
              </p>
              <Button onClick={() => setSearchQuery("")}>
                Clear Search
              </Button>
            </Card>
          )}

          <Card className="p-8 mt-12 bg-gradient-to-r from-pink-600 to-purple-600 text-white text-center">
            <h2 className="text-3xl font-black mb-4">Still Have Questions?</h2>
            <p className="text-xl mb-6 text-white/90">
              Our support team is here to help!
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
                Contact Support
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10">
                <Link href="/safety">Safety Tips</Link>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}