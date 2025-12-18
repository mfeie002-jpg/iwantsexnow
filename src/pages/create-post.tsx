import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Heart, Lock, Unlock, Image, Video, MessageCircle, DollarSign, Upload, Eye, Users } from "lucide-react";
import Link from "next/link";

export default function CreatePost() {
  const [postType, setPostType] = useState<"photo" | "video" | "text">("photo");
  const [isLocked, setIsLocked] = useState(true);
  const [pricing, setPricing] = useState<"free" | "subscription" | "ppv">("subscription");
  const [ppvPrice, setPpvPrice] = useState(9.90);
  const [caption, setCaption] = useState("");
  const [files, setFiles] = useState<string[]>([]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = e.target.files;
    if (!uploadedFiles) return;

    Array.from(uploadedFiles).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFiles((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handlePublish = () => {
    alert("Post published successfully!");
    window.location.href = "/creator-dashboard";
  };

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
              <Link href="/creator-dashboard">Back to Dashboard</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-black mb-2">Create New Post</h1>
            <p className="text-gray-600">Share exclusive content with your subscribers</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-6">
              {/* Post Type Selection */}
              <Card className="p-6">
                <Label className="text-lg font-bold mb-4 block">Content Type</Label>
                <div className="grid grid-cols-3 gap-3">
                  <Button
                    variant={postType === "photo" ? "default" : "outline"}
                    onClick={() => setPostType("photo")}
                    className={postType === "photo" ? "bg-pink-600 hover:bg-pink-700" : ""}
                  >
                    <Image size={20} className="mr-2" />
                    Photo
                  </Button>
                  <Button
                    variant={postType === "video" ? "default" : "outline"}
                    onClick={() => setPostType("video")}
                    className={postType === "video" ? "bg-pink-600 hover:bg-pink-700" : ""}
                  >
                    <Video size={20} className="mr-2" />
                    Video
                  </Button>
                  <Button
                    variant={postType === "text" ? "default" : "outline"}
                    onClick={() => setPostType("text")}
                    className={postType === "text" ? "bg-pink-600 hover:bg-pink-700" : ""}
                  >
                    <MessageCircle size={20} className="mr-2" />
                    Text
                  </Button>
                </div>
              </Card>

              {/* Upload Area */}
              {(postType === "photo" || postType === "video") && (
                <Card className="p-6">
                  <Label className="text-lg font-bold mb-4 block">
                    Upload {postType === "photo" ? "Photos" : "Video"}
                  </Label>
                  
                  {files.length > 0 ? (
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      {files.map((file, idx) => (
                        <div key={idx} className="relative">
                          <img src={file} alt={`Upload ${idx + 1}`} className="w-full h-48 object-cover rounded-lg" />
                          <button
                            onClick={() => setFiles(files.filter((_, i) => i !== idx))}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-pink-500 hover:bg-pink-50 transition-all cursor-pointer">
                      <input
                        type="file"
                        accept={postType === "photo" ? "image/*" : "video/*"}
                        multiple={postType === "photo"}
                        onChange={handleFileUpload}
                        className="hidden"
                        id="file-upload"
                      />
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <Upload size={48} className="mx-auto text-gray-400 mb-4" />
                        <p className="text-lg font-semibold mb-2">
                          Click to upload {postType === "photo" ? "photos" : "video"}
                        </p>
                        <p className="text-sm text-gray-600">
                          {postType === "photo" ? "PNG, JPG up to 10MB each" : "MP4, MOV up to 500MB"}
                        </p>
                      </label>
                    </div>
                  )}
                  
                  {files.length > 0 && (
                    <div>
                      <input
                        type="file"
                        accept={postType === "photo" ? "image/*" : "video/*"}
                        multiple={postType === "photo"}
                        onChange={handleFileUpload}
                        className="hidden"
                        id="add-more"
                      />
                      <label htmlFor="add-more">
                        <Button variant="outline" className="w-full" type="button" asChild>
                          <span>
                            <Upload size={16} className="mr-2" />
                            Add More {postType === "photo" ? "Photos" : "Videos"}
                          </span>
                        </Button>
                      </label>
                    </div>
                  )}
                </Card>
              )}

              {/* Caption */}
              <Card className="p-6">
                <Label className="text-lg font-bold mb-4 block">Caption</Label>
                <Textarea
                  placeholder="Write a caption for your post..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  rows={5}
                  className="resize-none"
                />
                <p className="text-sm text-gray-600 mt-2">{caption.length} / 500 characters</p>
              </Card>
            </div>

            {/* Sidebar - Pricing & Settings */}
            <div className="space-y-6">
              {/* Lock Status */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Label className="text-lg font-bold">Content Access</Label>
                  {isLocked ? (
                    <Lock className="text-pink-600" size={24} />
                  ) : (
                    <Unlock className="text-green-600" size={24} />
                  )}
                </div>
                
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="access"
                      checked={!isLocked}
                      onChange={() => {
                        setIsLocked(false);
                        setPricing("free");
                      }}
                      className="w-5 h-5 accent-pink-600"
                    />
                    <div>
                      <div className="font-semibold flex items-center gap-2">
                        <Unlock size={16} />
                        Public Post
                      </div>
                      <p className="text-xs text-gray-600">Everyone can see this post</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="access"
                      checked={isLocked}
                      onChange={() => setIsLocked(true)}
                      className="w-5 h-5 accent-pink-600"
                    />
                    <div>
                      <div className="font-semibold flex items-center gap-2">
                        <Lock size={16} />
                        Locked Content
                      </div>
                      <p className="text-xs text-gray-600">Subscribers or paying users only</p>
                    </div>
                  </label>
                </div>
              </Card>

              {/* Pricing Options */}
              {isLocked && (
                <Card className="p-6">
                  <Label className="text-lg font-bold mb-4 block">Pricing Model</Label>
                  
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors border-2 border-transparent data-[checked=true]:border-pink-600">
                      <input
                        type="radio"
                        name="pricing"
                        checked={pricing === "subscription"}
                        onChange={() => setPricing("subscription")}
                        className="w-5 h-5 accent-pink-600"
                      />
                      <div className="flex-1">
                        <div className="font-semibold flex items-center gap-2">
                          <Users size={16} />
                          Subscribers Only
                        </div>
                        <p className="text-xs text-gray-600">Only your subscribers can view</p>
                      </div>
                      <Badge className="bg-purple-500 border-0">Free for subs</Badge>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors border-2 border-transparent data-[checked=true]:border-pink-600">
                      <input
                        type="radio"
                        name="pricing"
                        checked={pricing === "ppv"}
                        onChange={() => setPricing("ppv")}
                        className="w-5 h-5 accent-pink-600"
                      />
                      <div className="flex-1">
                        <div className="font-semibold flex items-center gap-2">
                          <DollarSign size={16} />
                          Pay-Per-View
                        </div>
                        <p className="text-xs text-gray-600">One-time purchase to unlock</p>
                      </div>
                    </label>
                  </div>

                  {pricing === "ppv" && (
                    <div className="mt-4 pt-4 border-t">
                      <Label>Price (CHF)</Label>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xl font-bold">CHF</span>
                        <Input
                          type="number"
                          value={ppvPrice}
                          onChange={(e) => setPpvPrice(parseFloat(e.target.value))}
                          step="0.10"
                          min="1"
                          className="text-xl font-bold"
                        />
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        You earn: CHF {(ppvPrice * 0.8).toFixed(2)} (80%)
                      </p>
                    </div>
                  )}
                </Card>
              )}

              {/* Preview */}
              <Card className="p-6 bg-gradient-to-r from-pink-50 to-purple-50">
                <Label className="text-lg font-bold mb-4 block flex items-center gap-2">
                  <Eye size={20} />
                  Preview
                </Label>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type:</span>
                    <span className="font-semibold capitalize">{postType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Access:</span>
                    <Badge variant={isLocked ? "default" : "secondary"} className={isLocked ? "bg-pink-600" : ""}>
                      {isLocked ? "Locked" : "Public"}
                    </Badge>
                  </div>
                  {isLocked && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Pricing:</span>
                      <span className="font-semibold">
                        {pricing === "subscription" ? "Subscribers" : `CHF ${ppvPrice}`}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Files:</span>
                    <span className="font-semibold">{files.length}</span>
                  </div>
                </div>
              </Card>

              {/* Publish Button */}
              <Button
                size="lg"
                className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-lg"
                onClick={handlePublish}
                disabled={files.length === 0 && postType !== "text"}
              >
                Publish Post
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}