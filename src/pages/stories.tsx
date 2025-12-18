import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Plus, X, Play, Pause, ChevronLeft, ChevronRight, Eye, MessageCircle } from "lucide-react";
import Link from "next/link";

export default function Stories() {
  const [selectedStory, setSelectedStory] = useState<number | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const stories = [
    {
      id: 1,
      user: "Sarah",
      userImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
      slides: [
        { type: "image", url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&h=1200&fit=crop" },
        { type: "image", url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=1200&fit=crop" },
        { type: "text", content: "Weekend vibes 🌴", bgColor: "from-pink-500 to-purple-600" }
      ],
      timestamp: "2h ago",
      viewed: false
    },
    {
      id: 2,
      user: "Emma",
      userImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
      slides: [
        { type: "image", url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=1200&fit=crop" },
        { type: "text", content: "Dinner date anyone? 🍷", bgColor: "from-orange-500 to-red-600" }
      ],
      timestamp: "4h ago",
      viewed: false
    },
    {
      id: 3,
      user: "Mia",
      userImage: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&h=100&fit=crop",
      slides: [
        { type: "image", url: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&h=1200&fit=crop" }
      ],
      timestamp: "6h ago",
      viewed: true
    }
  ];

  const selectedStoryData = selectedStory !== null ? stories.find(s => s.id === selectedStory) : null;

  const nextSlide = () => {
    if (selectedStoryData && currentSlide < selectedStoryData.slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      nextStory();
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const nextStory = () => {
    const currentIndex = stories.findIndex(s => s.id === selectedStory);
    if (currentIndex < stories.length - 1) {
      setSelectedStory(stories[currentIndex + 1].id);
      setCurrentSlide(0);
    } else {
      setSelectedStory(null);
    }
  };

  const prevStory = () => {
    const currentIndex = stories.findIndex(s => s.id === selectedStory);
    if (currentIndex > 0) {
      setSelectedStory(stories[currentIndex - 1].id);
      setCurrentSlide(0);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-50">
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
            <Button variant="ghost" asChild>
              <Link href="/profile">Profile</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-black mb-2">Stories</h1>
              <p className="text-gray-600">See what members are up to right now</p>
            </div>
            <Button className="bg-pink-600 hover:bg-pink-700">
              <Plus size={20} className="mr-2" />
              Add Your Story
            </Button>
          </div>

          {/* Stories Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-12">
            {stories.map((story) => (
              <Card
                key={story.id}
                className={`cursor-pointer overflow-hidden hover:scale-105 transition-transform ${
                  story.viewed ? "opacity-60" : ""
                }`}
                onClick={() => {
                  setSelectedStory(story.id);
                  setCurrentSlide(0);
                }}
              >
                <div className="relative aspect-[3/4]">
                  <img
                    src={story.slides[0].type === "image" ? story.slides[0].url : story.userImage}
                    alt={story.user}
                    className="w-full h-full object-cover"
                  />
                  <div className={`absolute inset-0 ${story.viewed ? "" : "ring-4 ring-pink-600"}`} />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                    <div className="flex items-center gap-2">
                      <img
                        src={story.userImage}
                        alt={story.user}
                        className="w-8 h-8 rounded-full border-2 border-white"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-bold text-sm truncate">{story.user}</p>
                        <p className="text-white/80 text-xs">{story.timestamp}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Story Viewer Modal */}
          {selectedStoryData && (
            <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
              {/* Progress bars */}
              <div className="absolute top-4 left-0 right-0 flex gap-1 px-4">
                {selectedStoryData.slides.map((_, idx) => (
                  <div key={idx} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-white transition-all duration-300 ${
                        idx === currentSlide ? "w-full" : idx < currentSlide ? "w-full" : "w-0"
                      }`}
                    />
                  </div>
                ))}
              </div>

              {/* Header */}
              <div className="absolute top-8 left-0 right-0 flex items-center justify-between px-4 z-10">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedStoryData.userImage}
                    alt={selectedStoryData.user}
                    className="w-10 h-10 rounded-full border-2 border-white"
                  />
                  <div>
                    <p className="text-white font-bold">{selectedStoryData.user}</p>
                    <p className="text-white/80 text-sm">{selectedStoryData.timestamp}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20"
                  onClick={() => setSelectedStory(null)}
                >
                  <X size={24} />
                </Button>
              </div>

              {/* Story Content */}
              <div className="relative w-full max-w-md aspect-[9/16] bg-black">
                {selectedStoryData.slides[currentSlide].type === "image" ? (
                  <img
                    src={selectedStoryData.slides[currentSlide].url}
                    alt="Story"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className={`w-full h-full bg-gradient-to-br ${selectedStoryData.slides[currentSlide].bgColor} flex items-center justify-center p-8`}>
                    <p className="text-white text-3xl font-bold text-center">
                      {selectedStoryData.slides[currentSlide].content}
                    </p>
                  </div>
                )}

                {/* Navigation */}
                <button
                  onClick={prevSlide}
                  className="absolute left-0 top-0 bottom-0 w-1/3"
                />
                <button
                  onClick={nextSlide}
                  className="absolute right-0 top-0 bottom-0 w-1/3"
                />
              </div>

              {/* Story Navigation Arrows */}
              {stories.findIndex(s => s.id === selectedStory) > 0 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 text-white hover:bg-white/20"
                  onClick={prevStory}
                >
                  <ChevronLeft size={32} />
                </Button>
              )}
              {stories.findIndex(s => s.id === selectedStory) < stories.length - 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 text-white hover:bg-white/20"
                  onClick={nextStory}
                >
                  <ChevronRight size={32} />
                </Button>
              )}

              {/* Action buttons */}
              <div className="absolute bottom-8 left-0 right-0 px-4 flex gap-2">
                <input
                  type="text"
                  placeholder="Send a message..."
                  className="flex-1 px-4 py-3 rounded-full bg-white/20 text-white placeholder-white/60 backdrop-blur-sm border border-white/30"
                />
                <Button size="icon" className="bg-pink-600 hover:bg-pink-700 rounded-full h-12 w-12">
                  <Heart size={20} />
                </Button>
                <Button size="icon" className="bg-purple-600 hover:bg-purple-700 rounded-full h-12 w-12">
                  <MessageCircle size={20} />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}