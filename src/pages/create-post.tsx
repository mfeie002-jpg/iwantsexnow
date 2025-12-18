import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Heart, Lock, Unlock, Image, Video, MessageCircle, DollarSign, Upload, Eye, Users, AlertCircle, CheckCircle2, Loader2, X, Bold, Italic, Link2, Hash, AtSign, Smile, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function CreatePost() {
  const router = useRouter();
  const captionRef = useRef<HTMLTextAreaElement>(null);
  
  const [postType, setPostType] = useState<"photo" | "video" | "text">("photo");
  const [isLocked, setIsLocked] = useState(true);
  const [pricing, setPricing] = useState<"free" | "subscription" | "ppv">("subscription");
  const [ppvPrice, setPpvPrice] = useState(9.90);
  const [caption, setCaption] = useState("");
  const [files, setFiles] = useState<string[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showFormattingHelp, setShowFormattingHelp] = useState(false);
  
  // Validation states
  const [errors, setErrors] = useState<{
    files?: string;
    caption?: string;
    ppvPrice?: string;
  }>({});
  
  // UI states
  const [isUploading, setIsUploading] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Common emojis for quick access
  const quickEmojis = [
    "😊", "😍", "🔥", "💕", "❤️", "😘", "🥰", "😈",
    "💋", "🌹", "💎", "✨", "🎉", "🎊", "🍑", "🍒",
    "🌶️", "💦", "👀", "🔒", "💰", "🎁", "⭐", "💫"
  ];

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};
    
    // Validate files for photo/video posts
    if (postType !== "text" && files.length === 0) {
      newErrors.files = `Please upload at least one ${postType === "photo" ? "photo" : "video"}`;
    }
    
    // Validate file count
    if (postType === "photo" && files.length > 10) {
      newErrors.files = "Maximum 10 photos allowed per post";
    }
    
    if (postType === "video" && files.length > 1) {
      newErrors.files = "Only one video allowed per post";
    }
    
    // Validate caption
    if (!caption.trim()) {
      newErrors.caption = "Caption is required";
    }
    
    if (caption.length > 1000) {
      newErrors.caption = "Caption must be 1000 characters or less";
    }
    
    // Validate PPV price
    if (isLocked && pricing === "ppv") {
      if (ppvPrice < 1) {
        newErrors.ppvPrice = "Minimum price is CHF 1.00";
      }
      if (ppvPrice > 100) {
        newErrors.ppvPrice = "Maximum price is CHF 100.00";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = e.target.files;
    if (!uploadedFiles) return;

    setIsUploading(true);
    setUploadProgress(0);
    setErrors({ ...errors, files: undefined });

    // Validate file types and sizes
    const maxSize = postType === "photo" ? 10 * 1024 * 1024 : 500 * 1024 * 1024;
    const allowedTypes = postType === "photo" 
      ? ["image/jpeg", "image/jpg", "image/png", "image/webp"]
      : ["video/mp4", "video/quicktime", "video/x-msvideo"];

    const validFiles: string[] = [];
    let hasError = false;

    for (let i = 0; i < uploadedFiles.length; i++) {
      const file = uploadedFiles[i];
      
      if (!allowedTypes.includes(file.type)) {
        setErrors({
          ...errors,
          files: `Invalid file type. Allowed: ${postType === "photo" ? "JPG, PNG, WEBP" : "MP4, MOV, AVI"}`
        });
        hasError = true;
        break;
      }
      
      if (file.size > maxSize) {
        setErrors({
          ...errors,
          files: `File too large. Maximum size: ${postType === "photo" ? "10MB" : "500MB"}`
        });
        hasError = true;
        break;
      }

      await new Promise(resolve => setTimeout(resolve, 300));
      setUploadProgress(((i + 1) / uploadedFiles.length) * 100);

      const reader = new FileReader();
      await new Promise<void>((resolve) => {
        reader.onloadend = () => {
          validFiles.push(reader.result as string);
          resolve();
        };
        reader.readAsDataURL(file);
      });
    }

    if (!hasError) {
      setFiles((prev) => [...prev, ...validFiles]);
    }

    setIsUploading(false);
    setUploadProgress(0);
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
    setErrors({ ...errors, files: undefined });
  };

  const handlePublish = async () => {
    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsPublishing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));

    const posts = JSON.parse(localStorage.getItem("creatorPosts") || "[]");
    const newPost = {
      id: Date.now(),
      type: postType,
      caption,
      files,
      isLocked,
      pricing,
      ppvPrice,
      createdAt: new Date().toISOString(),
      likes: 0,
      comments: 0,
      views: 0
    };
    posts.unshift(newPost);
    localStorage.setItem("creatorPosts", JSON.stringify(posts));

    setIsPublishing(false);
    setShowSuccess(true);

    setTimeout(() => {
      router.push("/creator-dashboard");
    }, 2000);
  };

  const isFormValid = () => {
    if (postType !== "text" && files.length === 0) return false;
    if (!caption.trim()) return false;
    if (isLocked && pricing === "ppv" && (ppvPrice < 1 || ppvPrice > 100)) return false;
    return true;
  };

  // Text formatting functions
  const insertFormatting = (prefix: string, suffix: string = prefix) => {
    if (!captionRef.current) return;
    
    const textarea = captionRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = caption.substring(start, end);
    const beforeText = caption.substring(0, start);
    const afterText = caption.substring(end);
    
    let newText;
    let newCursorPos;
    
    if (selectedText) {
      // Wrap selected text
      newText = beforeText + prefix + selectedText + suffix + afterText;
      newCursorPos = end + prefix.length + suffix.length;
    } else {
      // Insert markers and place cursor between them
      newText = beforeText + prefix + suffix + afterText;
      newCursorPos = start + prefix.length;
    }
    
    setCaption(newText);
    setErrors({ ...errors, caption: undefined });
    
    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const insertText = (text: string) => {
    if (!captionRef.current) return;
    
    const textarea = captionRef.current;
    const start = textarea.selectionStart;
    const beforeText = caption.substring(0, start);
    const afterText = caption.substring(start);
    
    const newText = beforeText + text + afterText;
    const newCursorPos = start + text.length;
    
    setCaption(newText);
    setErrors({ ...errors, caption: undefined });
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const insertEmoji = (emoji: string) => {
    insertText(emoji);
    setShowEmojiPicker(false);
  };

  // Parse caption for preview (convert markdown-style to HTML-like display)
  const parseCaption = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/#(\w+)/g, '<span class="text-blue-600">#$1</span>')
      .replace(/@(\w+)/g, '<span class="text-pink-600">@$1</span>')
      .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" class="text-blue-600 underline">$1</a>');
  };

  // Success Modal
  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center p-4">
        <Card className="p-12 max-w-md text-center animate-in fade-in zoom-in duration-300">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-green-500 flex items-center justify-center animate-in zoom-in duration-500">
            <CheckCircle2 className="text-white" size={48} />
          </div>
          <h2 className="text-3xl font-black mb-4">Post Published! 🎉</h2>
          <p className="text-gray-600 mb-6">
            Your content is now live and visible to your {isLocked ? (pricing === "subscription" ? "subscribers" : "audience") : "followers"}
          </p>
          <div className="flex gap-3">
            <Button 
              className="flex-1 bg-pink-600 hover:bg-pink-700"
              onClick={() => router.push("/content-feed")}
            >
              View in Feed
            </Button>
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => router.push("/creator-dashboard")}
            >
              Dashboard
            </Button>
          </div>
        </Card>
      </div>
    );
  }

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
              <Link href="/creator-dashboard">
                <X size={20} className="mr-2" />
                Cancel
              </Link>
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

          {/* Validation Summary */}
          {Object.keys(errors).length > 0 && (
            <Card className="p-4 mb-6 bg-red-50 border-2 border-red-200">
              <div className="flex items-start gap-3">
                <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                <div>
                  <h3 className="font-bold text-red-900 mb-2">Please fix the following errors:</h3>
                  <ul className="text-sm text-red-800 space-y-1">
                    {Object.values(errors).map((error, idx) => (
                      <li key={idx}>• {error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          )}

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-6">
              {/* Post Type Selection */}
              <Card className="p-6">
                <Label className="text-lg font-bold mb-4 block">Content Type *</Label>
                <div className="grid grid-cols-3 gap-3">
                  <Button
                    type="button"
                    variant={postType === "photo" ? "default" : "outline"}
                    onClick={() => {
                      setPostType("photo");
                      setFiles([]);
                      setErrors({});
                    }}
                    className={postType === "photo" ? "bg-pink-600 hover:bg-pink-700" : ""}
                  >
                    <Image size={20} className="mr-2" />
                    Photo
                  </Button>
                  <Button
                    type="button"
                    variant={postType === "video" ? "default" : "outline"}
                    onClick={() => {
                      setPostType("video");
                      setFiles([]);
                      setErrors({});
                    }}
                    className={postType === "video" ? "bg-pink-600 hover:bg-pink-700" : ""}
                  >
                    <Video size={20} className="mr-2" />
                    Video
                  </Button>
                  <Button
                    type="button"
                    variant={postType === "text" ? "default" : "outline"}
                    onClick={() => {
                      setPostType("text");
                      setFiles([]);
                      setErrors({});
                    }}
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
                    Upload {postType === "photo" ? "Photos" : "Video"} *
                  </Label>
                  
                  {isUploading && (
                    <div className="mb-4">
                      <div className="flex items-center gap-3 mb-2">
                        <Loader2 className="animate-spin text-pink-600" size={20} />
                        <span className="text-sm font-medium">Uploading... {Math.round(uploadProgress)}%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-pink-600 transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  )}
                  
                  {files.length > 0 ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        {files.map((file, idx) => (
                          <div key={idx} className="relative group">
                            <img src={file} alt={`Upload ${idx + 1}`} className="w-full h-48 object-cover rounded-lg" />
                            <button
                              type="button"
                              onClick={() => removeFile(idx)}
                              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                              disabled={isUploading}
                            >
                              <X size={16} />
                            </button>
                            <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                              {idx + 1} of {files.length}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {postType === "photo" && files.length < 10 && (
                        <div>
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleFileUpload}
                            className="hidden"
                            id="add-more"
                            disabled={isUploading}
                          />
                          <label htmlFor="add-more">
                            <Button 
                              variant="outline" 
                              className="w-full" 
                              type="button" 
                              disabled={isUploading}
                              asChild
                            >
                              <span>
                                <Upload size={16} className="mr-2" />
                                Add More Photos ({files.length}/10)
                              </span>
                            </Button>
                          </label>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className={`border-2 border-dashed rounded-lg p-12 text-center transition-all ${
                      errors.files 
                        ? "border-red-300 bg-red-50" 
                        : "border-gray-300 hover:border-pink-500 hover:bg-pink-50"
                    } ${isUploading ? "pointer-events-none opacity-50" : "cursor-pointer"}`}>
                      <input
                        type="file"
                        accept={postType === "photo" ? "image/*" : "video/*"}
                        multiple={postType === "photo"}
                        onChange={handleFileUpload}
                        className="hidden"
                        id="file-upload"
                        disabled={isUploading}
                      />
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <Upload size={48} className={`mx-auto mb-4 ${errors.files ? "text-red-400" : "text-gray-400"}`} />
                        <p className="text-lg font-semibold mb-2">
                          Click to upload {postType === "photo" ? "photos" : "video"}
                        </p>
                        <p className="text-sm text-gray-600">
                          {postType === "photo" 
                            ? "PNG, JPG, WEBP up to 10MB each (max 10 photos)" 
                            : "MP4, MOV, AVI up to 500MB"}
                        </p>
                      </label>
                    </div>
                  )}
                  
                  {errors.files && (
                    <div className="flex items-center gap-2 mt-3 text-red-600">
                      <AlertCircle size={16} />
                      <span className="text-sm font-medium">{errors.files}</span>
                    </div>
                  )}
                </Card>
              )}

              {/* Enhanced Caption with Formatting */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Label className="text-lg font-bold">Caption *</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowFormattingHelp(!showFormattingHelp)}
                  >
                    <Sparkles size={16} className="mr-2" />
                    Formatting Guide
                  </Button>
                </div>

                {/* Formatting Help */}
                {showFormattingHelp && (
                  <Card className="p-4 mb-4 bg-blue-50 border-blue-200">
                    <h4 className="font-bold mb-2 text-blue-900">Text Formatting Guide:</h4>
                    <div className="text-sm text-blue-800 space-y-1">
                      <p>• **bold text** → <strong>bold text</strong></p>
                      <p>• *italic text* → <em>italic text</em></p>
                      <p>• #hashtag → <span className="text-blue-600">#hashtag</span></p>
                      <p>• @username → <span className="text-pink-600">@username</span></p>
                      <p>• URLs are automatically detected</p>
                    </div>
                  </Card>
                )}

                {/* Formatting Toolbar */}
                <div className="flex flex-wrap gap-2 mb-3 pb-3 border-b">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => insertFormatting("**")}
                    title="Bold (Ctrl+B)"
                  >
                    <Bold size={16} />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => insertFormatting("*")}
                    title="Italic (Ctrl+I)"
                  >
                    <Italic size={16} />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => insertText("#")}
                    title="Add hashtag"
                  >
                    <Hash size={16} />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => insertText("@")}
                    title="Mention user"
                  >
                    <AtSign size={16} />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => insertText("https://")}
                    title="Add link"
                  >
                    <Link2 size={16} />
                  </Button>
                  <div className="relative">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      title="Add emoji"
                    >
                      <Smile size={16} />
                    </Button>
                    
                    {/* Emoji Picker */}
                    {showEmojiPicker && (
                      <Card className="absolute top-full left-0 mt-2 p-3 shadow-xl z-10 w-72">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-semibold">Quick Emojis</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowEmojiPicker(false)}
                          >
                            <X size={16} />
                          </Button>
                        </div>
                        <div className="grid grid-cols-8 gap-1">
                          {quickEmojis.map((emoji, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => insertEmoji(emoji)}
                              className="text-2xl hover:bg-gray-100 rounded p-1 transition-colors"
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </Card>
                    )}
                  </div>
                </div>

                {/* Caption Textarea */}
                <Textarea
                  ref={captionRef}
                  placeholder="Write your caption... Use **bold**, *italic*, #hashtags, @mentions"
                  value={caption}
                  onChange={(e) => {
                    setCaption(e.target.value);
                    setErrors({ ...errors, caption: undefined });
                  }}
                  rows={6}
                  className={`resize-none ${errors.caption ? "border-red-300 focus:border-red-500" : ""}`}
                  maxLength={1000}
                />

                {/* Character Count */}
                <div className="flex items-center justify-between mt-2">
                  <span className={`text-sm ${
                    caption.length > 900 
                      ? "text-orange-600 font-medium" 
                      : caption.length > 0 
                      ? "text-green-600" 
                      : "text-gray-600"
                  }`}>
                    {caption.length} / 1000 characters
                  </span>
                  {caption.length > 0 && caption.length <= 1000 && (
                    <CheckCircle2 size={16} className="text-green-600" />
                  )}
                </div>

                {/* Live Preview */}
                {caption.trim() && (
                  <div className="mt-4 pt-4 border-t">
                    <Label className="text-sm font-semibold mb-2 block">Preview:</Label>
                    <div 
                      className="p-3 bg-gray-50 rounded-lg text-sm"
                      dangerouslySetInnerHTML={{ __html: parseCaption(caption) }}
                    />
                  </div>
                )}

                {errors.caption && (
                  <div className="flex items-center gap-2 mt-2 text-red-600">
                    <AlertCircle size={16} />
                    <span className="text-sm font-medium">{errors.caption}</span>
                  </div>
                )}
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
                  <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors border-2 border-transparent data-[checked=true]:border-green-500">
                    <input
                      type="radio"
                      name="access"
                      checked={!isLocked}
                      onChange={() => {
                        setIsLocked(false);
                        setPricing("free");
                      }}
                      className="w-5 h-5 accent-green-600"
                    />
                    <div className="flex-1">
                      <div className="font-semibold flex items-center gap-2">
                        <Unlock size={16} />
                        Public Post
                      </div>
                      <p className="text-xs text-gray-600">Everyone can see this post</p>
                    </div>
                    {!isLocked && <CheckCircle2 size={20} className="text-green-600" />}
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors border-2 border-transparent data-[checked=true]:border-pink-500">
                    <input
                      type="radio"
                      name="access"
                      checked={isLocked}
                      onChange={() => setIsLocked(true)}
                      className="w-5 h-5 accent-pink-600"
                    />
                    <div className="flex-1">
                      <div className="font-semibold flex items-center gap-2">
                        <Lock size={16} />
                        Locked Content
                      </div>
                      <p className="text-xs text-gray-600">Subscribers or paying users only</p>
                    </div>
                    {isLocked && <CheckCircle2 size={20} className="text-pink-600" />}
                  </label>
                </div>
              </Card>

              {/* Pricing Options */}
              {isLocked && (
                <Card className="p-6">
                  <Label className="text-lg font-bold mb-4 block">Pricing Model</Label>
                  
                  <div className="space-y-3">
                    <label className={`flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors border-2 ${
                      pricing === "subscription" ? "border-purple-500 bg-purple-50" : "border-transparent"
                    }`}>
                      <input
                        type="radio"
                        name="pricing"
                        checked={pricing === "subscription"}
                        onChange={() => setPricing("subscription")}
                        className="w-5 h-5 accent-purple-600"
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

                    <label className={`flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors border-2 ${
                      pricing === "ppv" ? "border-pink-500 bg-pink-50" : "border-transparent"
                    }`}>
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
                      <Label>Price (CHF) *</Label>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xl font-bold">CHF</span>
                        <Input
                          type="number"
                          value={ppvPrice}
                          onChange={(e) => {
                            setPpvPrice(parseFloat(e.target.value) || 0);
                            setErrors({ ...errors, ppvPrice: undefined });
                          }}
                          step="0.10"
                          min="1"
                          max="100"
                          className={`text-xl font-bold ${errors.ppvPrice ? "border-red-300" : ""}`}
                        />
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        You earn: CHF {(ppvPrice * 0.8).toFixed(2)} (80%)
                      </p>
                      {errors.ppvPrice && (
                        <div className="flex items-center gap-2 mt-2 text-red-600">
                          <AlertCircle size={16} />
                          <span className="text-sm font-medium">{errors.ppvPrice}</span>
                        </div>
                      )}
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
                        {pricing === "subscription" ? "Subscribers" : `CHF ${ppvPrice.toFixed(2)}`}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Files:</span>
                    <span className="font-semibold">{files.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Caption:</span>
                    <span className="font-semibold">{caption.length > 0 ? "✓" : "✗"}</span>
                  </div>
                </div>
              </Card>

              {/* Publish Button */}
              <Button
                size="lg"
                className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handlePublish}
                disabled={!isFormValid() || isPublishing || isUploading}
              >
                {isPublishing ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={20} />
                    Publishing...
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={20} className="mr-2" />
                    Publish Post
                  </>
                )}
              </Button>

              {!isFormValid() && (
                <p className="text-sm text-center text-gray-600">
                  Complete all required fields to publish
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}