import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Shield, CheckCircle, Upload, Camera, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function Verify() {
  const [step, setStep] = useState(1);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
        setStep(2);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitVerification = () => {
    setStep(3);
    // In real app, this would submit to backend
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
              <Link href="/profile">Back to Profile</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-blue-500 border-0 text-lg px-6 py-2">
              <Shield size={18} className="mr-2" />
              Profile Verification
            </Badge>
            <h1 className="text-5xl font-black mb-4">Get Verified</h1>
            <p className="text-xl text-gray-600">
              Verified profiles get 3x more views and messages!
            </p>
          </div>

          {/* Benefits */}
          <Card className="p-8 mb-8 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
            <h2 className="text-2xl font-bold mb-6 text-center">Why Get Verified?</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-blue-500 flex items-center justify-center mb-4">
                  <Shield className="text-white" size={32} />
                </div>
                <h3 className="font-bold mb-2">Build Trust</h3>
                <p className="text-sm text-gray-700">Show others you're a real person</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-green-500 flex items-center justify-center mb-4">
                  <CheckCircle className="text-white" size={32} />
                </div>
                <h3 className="font-bold mb-2">Get More Matches</h3>
                <p className="text-sm text-gray-700">3x more views and messages</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-purple-500 flex items-center justify-center mb-4">
                  <Badge className="text-white text-2xl">★</Badge>
                </div>
                <h3 className="font-bold mb-2">Exclusive Badge</h3>
                <p className="text-sm text-gray-700">Stand out with verified badge</p>
              </div>
            </div>
          </Card>

          {/* Verification Steps */}
          {step === 1 && (
            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-6">Step 1: Upload Verification Photo</h2>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex gap-3">
                  <AlertCircle className="text-yellow-600 flex-shrink-0" size={24} />
                  <div>
                    <h3 className="font-bold text-yellow-900 mb-2">Photo Requirements:</h3>
                    <ul className="text-sm text-yellow-800 space-y-1">
                      <li>• Take a selfie holding a piece of paper with today's date</li>
                      <li>• Make sure your face is clearly visible</li>
                      <li>• Ensure good lighting and image quality</li>
                      <li>• Photo should match your profile pictures</li>
                      <li>• No filters or editing allowed</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="verification-upload"
                />
                <label htmlFor="verification-upload" className="cursor-pointer">
                  <Camera size={64} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-bold mb-2">Upload Your Verification Photo</h3>
                  <p className="text-gray-600 mb-4">
                    Click to take a photo or upload from your device
                  </p>
                  <Button type="button" size="lg" className="bg-blue-600 hover:bg-blue-700">
                    <Upload size={20} className="mr-2" />
                    Choose Photo
                  </Button>
                </label>
              </div>
            </Card>
          )}

          {step === 2 && uploadedImage && (
            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-6">Step 2: Review Your Photo</h2>
              
              <div className="mb-6">
                <img
                  src={uploadedImage}
                  alt="Verification"
                  className="w-full max-w-md mx-auto rounded-lg shadow-lg"
                />
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex gap-3">
                  <CheckCircle className="text-green-600 flex-shrink-0" size={24} />
                  <div>
                    <h3 className="font-bold text-green-900 mb-1">Photo looks good!</h3>
                    <p className="text-sm text-green-800">
                      Your photo meets all requirements. Submit for review and we'll verify your profile within 24 hours.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  variant="outline"
                  size="lg"
                  className="flex-1"
                  onClick={() => {
                    setUploadedImage(null);
                    setStep(1);
                  }}
                >
                  Take Another Photo
                </Button>
                <Button
                  size="lg"
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  onClick={handleSubmitVerification}
                >
                  Submit for Verification
                </Button>
              </div>
            </Card>
          )}

          {step === 3 && (
            <Card className="p-12 text-center">
              <div className="w-24 h-24 mx-auto rounded-full bg-green-500 flex items-center justify-center mb-6">
                <CheckCircle className="text-white" size={48} />
              </div>
              <h2 className="text-3xl font-black mb-4">Verification Submitted!</h2>
              <p className="text-xl text-gray-600 mb-8">
                We'll review your photo within 24 hours. You'll receive a notification once approved.
              </p>
              <div className="flex gap-4 justify-center">
                <Button size="lg" className="bg-pink-600 hover:bg-pink-700" asChild>
                  <Link href="/profile">Back to Profile</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/members">Browse Members</Link>
                </Button>
              </div>
            </Card>
          )}

          {/* FAQ */}
          <Card className="p-8 mt-8">
            <h2 className="text-2xl font-bold mb-6">Verification FAQ</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-bold mb-2">How long does verification take?</h3>
                <p className="text-gray-700">Most verifications are completed within 24 hours. You'll receive a notification once approved.</p>
              </div>
              <div>
                <h3 className="font-bold mb-2">What if my verification is rejected?</h3>
                <p className="text-gray-700">We'll send you feedback on why it was rejected and you can submit a new photo that meets our requirements.</p>
              </div>
              <div>
                <h3 className="font-bold mb-2">Is verification mandatory?</h3>
                <p className="text-gray-700">No, but verified profiles get significantly more views and matches. It shows you're genuine and trustworthy.</p>
              </div>
              <div>
                <h3 className="font-bold mb-2">Is my verification photo visible to others?</h3>
                <p className="text-gray-700">No, verification photos are only used for verification purposes and are never shown publicly.</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}