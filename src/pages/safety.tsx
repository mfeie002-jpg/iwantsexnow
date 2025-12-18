import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Shield, Eye, Lock, AlertTriangle, Phone, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";

export default function Safety() {
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
              <Link href="/members">Browse</Link>
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
            <Badge className="mb-4 bg-blue-500 border-0 text-lg px-6 py-2">
              <Shield size={18} className="mr-2" />
              Safety Center
            </Badge>
            <h1 className="text-5xl font-black mb-4">Your Safety is Our Priority</h1>
            <p className="text-xl text-gray-600">
              Essential tips and guidelines for safe online dating
            </p>
          </div>

          {/* Quick Safety Tips */}
          <Card className="p-8 mb-8 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Shield className="text-blue-600" size={28} />
              Top Safety Rules
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={20} />
                <div>
                  <h3 className="font-bold mb-1">Meet in Public</h3>
                  <p className="text-sm text-gray-700">Always meet in a public place for first dates</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={20} />
                <div>
                  <h3 className="font-bold mb-1">Tell Someone</h3>
                  <p className="text-sm text-gray-700">Inform a friend or family member about your plans</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={20} />
                <div>
                  <h3 className="font-bold mb-1">Stay Sober</h3>
                  <p className="text-sm text-gray-700">Keep your wits about you on first meetings</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={20} />
                <div>
                  <h3 className="font-bold mb-1">Trust Your Gut</h3>
                  <p className="text-sm text-gray-700">If something feels off, it probably is</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Detailed Safety Sections */}
          <div className="space-y-6">
            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Lock className="text-pink-600" size={28} />
                Protect Your Personal Information
              </h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  <strong>Never share sensitive information early:</strong> Avoid sharing your home address, 
                  workplace, financial information, or other sensitive details until you've built trust.
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Use the platform's messaging system initially</li>
                  <li>Don't share your full name on your profile</li>
                  <li>Be cautious with social media links</li>
                  <li>Use a Google Voice number or similar service</li>
                  <li>Never send money to someone you haven't met</li>
                </ul>
              </div>
            </Card>

            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Eye className="text-purple-600" size={28} />
                Recognize Red Flags
              </h2>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 p-4 bg-red-50 rounded-lg border border-red-200">
                    <XCircle className="text-red-600 flex-shrink-0 mt-1" size={20} />
                    <div>
                      <h3 className="font-bold text-red-900 mb-1">Asking for money</h3>
                      <p className="text-sm text-red-800">Anyone asking for financial help is a scammer</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-red-50 rounded-lg border border-red-200">
                    <XCircle className="text-red-600 flex-shrink-0 mt-1" size={20} />
                    <div>
                      <h3 className="font-bold text-red-900 mb-1">Rushing intimacy</h3>
                      <p className="text-sm text-red-800">Professing love too quickly is suspicious</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-red-50 rounded-lg border border-red-200">
                    <XCircle className="text-red-600 flex-shrink-0 mt-1" size={20} />
                    <div>
                      <h3 className="font-bold text-red-900 mb-1">Avoiding video calls</h3>
                      <p className="text-sm text-red-800">Refusing to video chat may indicate catfishing</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-red-50 rounded-lg border border-red-200">
                    <XCircle className="text-red-600 flex-shrink-0 mt-1" size={20} />
                    <div>
                      <h3 className="font-bold text-red-900 mb-1">Moving off platform</h3>
                      <p className="text-sm text-red-800">Pushing to move to other apps immediately</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Phone className="text-green-600" size={28} />
                First Meeting Safety
              </h2>
              <div className="space-y-4 text-gray-700">
                <p className="font-semibold">Follow these guidelines for your first in-person meeting:</p>
                <ol className="list-decimal list-inside space-y-3 ml-4">
                  <li>
                    <strong>Choose a public location:</strong> Coffee shop, restaurant, or busy park during daylight hours
                  </li>
                  <li>
                    <strong>Arrange your own transportation:</strong> Don't let them pick you up or drive you home
                  </li>
                  <li>
                    <strong>Tell someone where you'll be:</strong> Share your location and expected return time
                  </li>
                  <li>
                    <strong>Stay sober:</strong> Limit alcohol consumption and never leave your drink unattended
                  </li>
                  <li>
                    <strong>Keep your phone charged:</strong> Ensure you can call for help if needed
                  </li>
                  <li>
                    <strong>Have an exit plan:</strong> Be prepared to leave if you feel uncomfortable
                  </li>
                </ol>
              </div>
            </Card>

            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <AlertTriangle className="text-orange-600" size={28} />
                Reporting and Blocking
              </h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  We take reports seriously and investigate all concerns. If you encounter inappropriate 
                  behavior, suspicious activity, or feel unsafe:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Use the "Report" button on any profile or message</li>
                  <li>Block users who make you uncomfortable</li>
                  <li>Contact our support team immediately for urgent concerns</li>
                  <li>Save evidence (screenshots) if reporting harassment</li>
                  <li>Don't engage with suspicious users - report and move on</li>
                </ul>
                <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <p className="font-semibold text-orange-900 mb-2">Emergency Contact:</p>
                  <p className="text-orange-800">
                    In case of immediate danger, contact local authorities (Police: 117) first, 
                    then report to our support team at support@iwantsexnow.ch
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-8 bg-gradient-to-r from-pink-600 to-purple-600 text-white">
              <h2 className="text-2xl font-bold mb-4">Safe Dating Starts with You</h2>
              <p className="mb-6">
                While we work hard to keep our platform safe, your safety is ultimately in your hands. 
                Stay alert, trust your instincts, and don't hesitate to report suspicious behavior.
              </p>
              <div className="flex gap-4">
                <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
                  <Link href="/report">Report a User</Link>
                </Button>
                <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10">
                  <Link href="/faq">View FAQ</Link>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}