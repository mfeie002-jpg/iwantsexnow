import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Users, Shield, Target, Zap, Globe } from "lucide-react";
import Link from "next/link";

export default function About() {
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
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-pink-600 border-0 text-lg px-6 py-2">
              About Us
            </Badge>
            <h1 className="text-5xl md:text-6xl font-black mb-6">
              Switzerland's Leading<br />Adult Dating Platform
            </h1>
            <p className="text-xl text-gray-600">
              Connecting adventurous singles since 2020
            </p>
          </div>

          {/* Mission Statement */}
          <Card className="p-12 mb-12 text-center bg-gradient-to-r from-pink-600 to-purple-600 text-white">
            <h2 className="text-3xl font-black mb-4">Our Mission</h2>
            <p className="text-xl leading-relaxed text-white/95">
              To provide a safe, discreet, and exciting platform where adults can connect authentically, 
              explore their desires, and build meaningful connections on their own terms.
            </p>
          </Card>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-16">
            <Card className="p-6 text-center">
              <div className="text-4xl font-black text-pink-600 mb-2">50K+</div>
              <div className="text-sm text-gray-600 font-medium">Active Members</div>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-4xl font-black text-purple-600 mb-2">15K+</div>
              <div className="text-sm text-gray-600 font-medium">Daily Active Users</div>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-4xl font-black text-pink-600 mb-2">100K+</div>
              <div className="text-sm text-gray-600 font-medium">Messages Per Day</div>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-4xl font-black text-purple-600 mb-2">4.8★</div>
              <div className="text-sm text-gray-600 font-medium">User Rating</div>
            </Card>
          </div>

          {/* Our Story */}
          <Card className="p-8 mb-12">
            <h2 className="text-3xl font-black mb-6">Our Story</h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                Founded in 2020, iWantSexNow.ch was born from a simple observation: traditional dating 
                apps weren't serving the needs of adults looking for genuine connections without judgment. 
                We believed there had to be a better way.
              </p>
              <p>
                What started as a small platform in Zürich has grown into Switzerland's premier adult 
                dating community, with over 50,000 active members across all cantons. Our success comes 
                from our unwavering commitment to three core principles: safety, authenticity, and discretion.
              </p>
              <p>
                Today, thousands of singles and couples use our platform daily to explore connections, 
                share experiences, and meet like-minded individuals in a judgment-free environment. 
                We're proud to have facilitated countless meaningful connections and continue to innovate 
                in the online dating space.
              </p>
            </div>
          </Card>

          {/* Core Values */}
          <div className="mb-12">
            <h2 className="text-3xl font-black mb-8 text-center">What Sets Us Apart</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Shield className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Safety First</h3>
                    <p className="text-gray-700">
                      Advanced verification, profile moderation, and 24/7 support team to ensure 
                      your safety and security.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0">
                    <Users className="text-pink-600" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Real People</h3>
                    <p className="text-gray-700">
                      Strict verification process ensures you're connecting with genuine, verified 
                      members - no bots or fake profiles.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <Target className="text-purple-600" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Precise Matching</h3>
                    <p className="text-gray-700">
                      Advanced filters and algorithms help you find exactly what you're looking 
                      for, saving time and frustration.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <Zap className="text-green-600" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Instant Connections</h3>
                    <p className="text-gray-700">
                      With thousands of members online at any time, you can start chatting and 
                      making connections instantly.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Privacy Commitment */}
          <Card className="p-8 mb-12 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                <Shield className="text-white" size={32} />
              </div>
              <div>
                <h2 className="text-2xl font-black mb-3">Your Privacy is Sacred</h2>
                <p className="text-gray-700 mb-4">
                  We understand the importance of discretion. Your data is encrypted, never shared 
                  with third parties, and you have complete control over your visibility and profile 
                  information. Premium members can browse completely anonymously.
                </p>
                <Button variant="outline" asChild>
                  <Link href="/privacy">Read Privacy Policy</Link>
                </Button>
              </div>
            </div>
          </Card>

          {/* Swiss Made */}
          <Card className="p-8 mb-12 text-center border-2 border-red-500">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 rounded-full bg-red-500 flex items-center justify-center">
                <Globe className="text-white" size={40} />
              </div>
            </div>
            <h2 className="text-3xl font-black mb-3">Proudly Swiss Made</h2>
            <p className="text-gray-700 text-lg max-w-2xl mx-auto">
              Founded and operated in Switzerland, we bring Swiss values of quality, precision, 
              and privacy to online dating. All data is stored on Swiss servers under strict 
              Swiss privacy laws.
            </p>
          </Card>

          {/* CTA */}
          <Card className="p-12 bg-gradient-to-r from-pink-600 to-purple-600 text-white text-center">
            <h2 className="text-4xl font-black mb-4">Ready to Join Our Community?</h2>
            <p className="text-xl mb-8 text-white/95">
              Over 50,000 members are already exploring connections. Start your journey today!
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-8">
                <Link href="/register">Create Free Account</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 text-lg px-8">
                <Link href="/members">Browse Members</Link>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}