import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, Upload, X, Camera, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function UploadPhotos() {
  const router = useRouter();
  const [photos, setPhotos] = useState<string[]>([
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop"
  ]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotos((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    // Save photos to localStorage
    localStorage.setItem("userPhotos", JSON.stringify(photos));
    alert("Photos saved successfully!");
    router.push("/profile");
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
              <Link href="/profile">Back to Profile</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-black mb-4">Upload Your Photos</h1>
            <p className="text-xl text-gray-600">
              Profiles with photos get 10x more views and messages!
            </p>
          </div>

          <Card className="p-8 mb-8">
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {photos.map((photo, index) => (
                <div key={index} className="relative group">
                  <img
                    src={photo}
                    alt={`Photo ${index + 1}`}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => removePhoto(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={20} />
                  </button>
                  {index === 0 && (
                    <div className="absolute bottom-2 left-2 bg-pink-600 text-white text-sm px-3 py-1 rounded-full font-medium">
                      Profile Photo
                    </div>
                  )}
                </div>
              ))}

              {photos.length < 6 && (
                <label className="relative border-2 border-dashed border-gray-300 rounded-lg h-64 flex flex-col items-center justify-center cursor-pointer hover:border-pink-600 hover:bg-pink-50 transition-all">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <Upload size={48} className="text-gray-400 mb-4" />
                  <p className="text-gray-600 font-medium mb-1">Upload Photos</p>
                  <p className="text-sm text-gray-400">PNG, JPG up to 10MB</p>
                </label>
              )}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex gap-3">
                <Camera className="text-blue-600 flex-shrink-0" size={24} />
                <div>
                  <h3 className="font-bold text-blue-900 mb-2">Photo Guidelines</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Use clear, well-lit photos showing your face</li>
                    <li>• Avoid group photos or photos with filters</li>
                    <li>• No nudity or inappropriate content</li>
                    <li>• Photos must be of you only</li>
                    <li>• Profile photo will be used as your main display picture</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                size="lg"
                onClick={handleSave}
                className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-lg"
                disabled={photos.length === 0}
              >
                <ImageIcon size={20} className="mr-2" />
                Save Photos
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => router.push("/profile")}
                className="text-lg"
              >
                Cancel
              </Button>
            </div>
          </Card>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-pink-100 flex items-center justify-center">
                <Camera className="text-pink-600" size={32} />
              </div>
              <h3 className="font-bold text-lg mb-2">Be Authentic</h3>
              <p className="text-sm text-gray-600">
                Use recent photos that accurately represent you
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-100 flex items-center justify-center">
                <ImageIcon className="text-purple-600" size={32} />
              </div>
              <h3 className="font-bold text-lg mb-2">Quality Matters</h3>
              <p className="text-sm text-gray-600">
                High-quality images get better engagement
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
                <Upload className="text-blue-600" size={32} />
              </div>
              <h3 className="font-bold text-lg mb-2">More is Better</h3>
              <p className="text-sm text-gray-600">
                Upload multiple photos to increase profile views
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}