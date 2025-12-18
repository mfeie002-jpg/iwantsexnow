import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, MapPin, MessageCircle, Star, Shield, Calendar, Briefcase, GraduationCap, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function ProfileDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [liked, setLiked] = useState(false);

  // Mock detailed profile data
  const profile = {
    id: Number(id),
    name: "Sarah",
    age: 26,
    gender: "female",
    location: "Zürich",
    images: [
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&h=800&fit=crop"
    ],
    online: true,
    verified: true,
    about: "I'm a fun-loving person who enjoys traveling, trying new restaurants, and meeting interesting people. I value honesty, good conversations, and spontaneity. Looking to connect with someone who knows how to have a good time and isn't afraid to be themselves.",
    interests: ["Travel", "Food & Wine", "Fitness", "Music", "Photography"],
    lookingFor: "Casual dating, new friends",
    education: "University Graduate",
    occupation: "Marketing Manager",
    languages: ["German", "English", "French"],
    height: "168 cm",
    joinDate: "January 2025"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Heart className="text-pink-600 fill-pink-600" size={32} />
            <span className="text-2xl font-black bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              iWantSexNow.ch
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link href="/search">Browse</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/messages">Messages</Link>
            </Button>
            <Button className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700" asChild>
              <Link href="/premium">Go Premium</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => router.back()} className="mb-6">
          <ArrowLeft size={20} className="mr-2" />
          Back to Search
        </Button>

        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Left Column - Photos */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="overflow-hidden">
              <div className="relative">
                <img
                  src={profile.images[0]}
                  alt={profile.name}
                  className="w-full h-[600px] object-cover"
                />
                {profile.online && (
                  <Badge className="absolute top-4 right-4 bg-green-500 border-0 text-lg">
                    Online Now
                  </Badge>
                )}
                {profile.verified && (
                  <div className="absolute top-4 left-4 bg-blue-500 text-white rounded-full p-2">
                    <Star size={24} fill="white" />
                  </div>
                )}
              </div>
            </Card>

            <div className="grid grid-cols-2 gap-4">
              {profile.images.slice(1).map((image, index) => (
                <Card key={index} className="overflow-hidden">
                  <img
                    src={image}
                    alt={`${profile.name} ${index + 2}`}
                    className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
                  />
                </Card>
              ))}
            </div>

            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">About Me</h2>
              <p className="text-gray-700 leading-relaxed">{profile.about}</p>
            </Card>

            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">Interests</h2>
              <div className="flex flex-wrap gap-2">
                {profile.interests.map((interest, index) => (
                  <Badge key={index} variant="secondary" className="text-base py-2 px-4">
                    {interest}
                  </Badge>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Column - Info */}
          <div className="space-y-6">
            <Card className="p-6 sticky top-24">
              <div className="text-center mb-6">
                <h1 className="text-4xl font-black mb-2">{profile.name}, {profile.age}</h1>
                <div className="flex items-center justify-center gap-2 text-gray-600 mb-4">
                  <MapPin size={20} />
                  <span className="text-lg">{profile.location}</span>
                </div>
                {profile.verified && (
                  <Badge className="bg-blue-500 border-0 text-sm">
                    <Shield size={14} className="mr-1" />
                    Verified Profile
                  </Badge>
                )}
              </div>

              <div className="space-y-4 mb-6">
                <Button
                  className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-lg h-12"
                  asChild
                >
                  <Link href="/messages">
                    <MessageCircle size={20} className="mr-2" />
                    Send Message
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="w-full text-lg h-12"
                  onClick={() => setLiked(!liked)}
                >
                  <Heart size={20} className={`mr-2 ${liked ? "fill-pink-600 text-pink-600" : ""}`} />
                  {liked ? "Liked" : "Like Profile"}
                </Button>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <div className="flex items-center gap-3">
                  <Briefcase size={20} className="text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Occupation</p>
                    <p className="font-medium">{profile.occupation}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <GraduationCap size={20} className="text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Education</p>
                    <p className="font-medium">{profile.education}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar size={20} className="text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Member Since</p>
                    <p className="font-medium">{profile.joinDate}</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t mt-4">
                <p className="text-sm text-gray-600 mb-2">Looking For</p>
                <p className="font-medium mb-4">{profile.lookingFor}</p>

                <p className="text-sm text-gray-600 mb-2">Languages</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {profile.languages.map((lang, index) => (
                    <Badge key={index} variant="outline">{lang}</Badge>
                  ))}
                </div>

                <p className="text-sm text-gray-600 mb-2">Height</p>
                <p className="font-medium">{profile.height}</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}