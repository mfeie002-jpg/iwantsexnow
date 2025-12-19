import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import SEO from "@/components/SEO";
import { MobileNav } from "@/components/MobileNav";
import { Heart, CheckCircle, Clock, Phone, Mail, MessageCircle, Calendar, Shield, AlertCircle, Sparkles, ArrowRight, ArrowLeft, Send, Bell, Smartphone } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import { AvailabilityCalendar } from "@/components/AvailabilityCalendar";

export default function BookingConfirmation() {
  const router = useRouter();
  const { escortId, escortName } = router.query;
  
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    duration: "",
    service: "",
    location: "",
    specialRequests: "",
    notifyEmail: true,
    notifySMS: false,
    agreeTerms: false
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState("");

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone: string) => /^[\+]?[(]?[0-9]{2,4}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(phone);

  const validateStep1 = () => {
    const newErrors: {[key: string]: string} = {};
    if (!bookingData.name.trim()) newErrors.name = "Name is required";
    if (!bookingData.email.trim()) newErrors.email = "Email is required";
    else if (!validateEmail(bookingData.email)) newErrors.email = "Invalid email format";
    if (!bookingData.phone.trim()) newErrors.phone = "Phone is required";
    else if (!validatePhone(bookingData.phone)) newErrors.phone = "Invalid phone format";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: {[key: string]: string} = {};
    if (!bookingData.date) newErrors.date = "Date is required";
    if (!bookingData.time) newErrors.time = "Time is required";
    if (!bookingData.duration) newErrors.duration = "Duration is required";
    if (!bookingData.service) newErrors.service = "Service type is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors: {[key: string]: string} = {};
    if (!bookingData.location.trim()) newErrors.location = "Meeting location is required";
    if (!bookingData.agreeTerms) newErrors.agreeTerms = "You must agree to terms and conditions";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    let isValid = false;
    if (currentStep === 1) isValid = validateStep1();
    else if (currentStep === 2) isValid = validateStep2();
    else if (currentStep === 3) isValid = validateStep3();
    
    if (isValid) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    if (!validateStep3()) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate confirmation code
    const code = "BK-" + Math.random().toString(36).substr(2, 9).toUpperCase();
    setConfirmationCode(code);
    
    // Store booking in localStorage (demo)
    const booking = {
      ...bookingData,
      escortId,
      escortName,
      confirmationCode: code,
      status: "pending",
      createdAt: new Date().toISOString()
    };
    
    const existingBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    localStorage.setItem('bookings', JSON.stringify([...existingBookings, booking]));
    
    setIsSubmitting(false);
    setBookingComplete(true);
  };

  const steps = [
    { number: 1, title: "Contact Info", icon: Phone },
    { number: 2, title: "Booking Details", icon: Calendar },
    { number: 3, title: "Location & Terms", icon: Shield },
    { number: 4, title: "Confirmation", icon: CheckCircle }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <SEO 
        title="Complete Your Booking - Escort Services Zürich | iWantSexNow.ch"
        description="Secure and discreet booking process for premium escort services in Switzerland."
      />

      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-md bg-black/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <Heart className="text-pink-600 fill-pink-600" size={36} />
              <span className="text-2xl font-black text-white">iWantSexNow.ch</span>
            </Link>
            <MobileNav />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Progress Steps */}
          <div className="mb-12">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = currentStep === step.number;
                const isCompleted = currentStep > step.number;
                
                return (
                  <div key={step.number} className="flex items-center flex-1">
                    <div className="flex flex-col items-center flex-1">
                      <motion.div
                        initial={false}
                        animate={{
                          scale: isActive ? 1.1 : 1,
                          backgroundColor: isCompleted ? "#10b981" : isActive ? "#ec4899" : "#374151"
                        }}
                        className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                          isCompleted ? "bg-green-500" : isActive ? "bg-pink-600" : "bg-gray-700"
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle className="text-white" size={24} />
                        ) : (
                          <Icon className="text-white" size={24} />
                        )}
                      </motion.div>
                      <span className={`text-sm font-medium ${isActive ? "text-white" : "text-gray-400"}`}>
                        {step.title}
                      </span>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`h-0.5 flex-1 mx-4 ${isCompleted ? "bg-green-500" : "bg-gray-700"}`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {!bookingComplete ? (
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Optional: Show calendar before starting booking */}
                {currentStep === 1 && escortName && (
                  <div className="mb-8">
                    <AvailabilityCalendar escortName={Array.isArray(escortName) ? escortName[0] : escortName} />
                  </div>
                )}

                <Card className="p-8 bg-white/10 backdrop-blur-md border-white/20">
                  {/* Step 1: Contact Information */}
                  {currentStep === 1 && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-3xl font-black text-white mb-2">Contact Information</h2>
                        <p className="text-gray-300">Please provide your contact details for booking confirmation</p>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <Label className="text-white mb-2 block">Full Name *</Label>
                          <Input
                            value={bookingData.name}
                            onChange={(e) => {
                              setBookingData({...bookingData, name: e.target.value});
                              setErrors({...errors, name: ""});
                            }}
                            placeholder="John Doe"
                            className={`bg-white/10 border-white/20 text-white ${errors.name ? "border-red-500" : ""}`}
                          />
                          {errors.name && (
                            <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                              <AlertCircle size={14} /> {errors.name}
                            </p>
                          )}
                        </div>

                        <div>
                          <Label className="text-white mb-2 block">Email Address *</Label>
                          <Input
                            type="email"
                            value={bookingData.email}
                            onChange={(e) => {
                              setBookingData({...bookingData, email: e.target.value});
                              setErrors({...errors, email: ""});
                            }}
                            placeholder="john@example.com"
                            className={`bg-white/10 border-white/20 text-white ${errors.email ? "border-red-500" : ""}`}
                          />
                          {errors.email && (
                            <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                              <AlertCircle size={14} /> {errors.email}
                            </p>
                          )}
                        </div>

                        <div>
                          <Label className="text-white mb-2 block">Phone Number *</Label>
                          <Input
                            type="tel"
                            value={bookingData.phone}
                            onChange={(e) => {
                              setBookingData({...bookingData, phone: e.target.value});
                              setErrors({...errors, phone: ""});
                            }}
                            placeholder="+41 XX XXX XX XX"
                            className={`bg-white/10 border-white/20 text-white ${errors.phone ? "border-red-500" : ""}`}
                          />
                          {errors.phone && (
                            <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                              <AlertCircle size={14} /> {errors.phone}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Booking Details */}
                  {currentStep === 2 && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-3xl font-black text-white mb-2">Booking Details</h2>
                        <p className="text-gray-300">When would you like to meet {escortName || "your companion"}?</p>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-white mb-2 block">Preferred Date *</Label>
                          <Input
                            type="date"
                            value={bookingData.date}
                            onChange={(e) => {
                              setBookingData({...bookingData, date: e.target.value});
                              setErrors({...errors, date: ""});
                            }}
                            min={new Date().toISOString().split('T')[0]}
                            className={`bg-white/10 border-white/20 text-white ${errors.date ? "border-red-500" : ""}`}
                          />
                          {errors.date && (
                            <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                              <AlertCircle size={14} /> {errors.date}
                            </p>
                          )}
                        </div>

                        <div>
                          <Label className="text-white mb-2 block">Preferred Time *</Label>
                          <Select value={bookingData.time} onValueChange={(value) => {
                            setBookingData({...bookingData, time: value});
                            setErrors({...errors, time: ""});
                          }}>
                            <SelectTrigger className={`bg-white/10 border-white/20 text-white ${errors.time ? "border-red-500" : ""}`}>
                              <SelectValue placeholder="Select time" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="morning">Morning (9:00 - 12:00)</SelectItem>
                              <SelectItem value="afternoon">Afternoon (12:00 - 18:00)</SelectItem>
                              <SelectItem value="evening">Evening (18:00 - 22:00)</SelectItem>
                              <SelectItem value="night">Night (22:00 - 02:00)</SelectItem>
                            </SelectContent>
                          </Select>
                          {errors.time && (
                            <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                              <AlertCircle size={14} /> {errors.time}
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <Label className="text-white mb-2 block">Duration *</Label>
                        <Select value={bookingData.duration} onValueChange={(value) => {
                          setBookingData({...bookingData, duration: value});
                          setErrors({...errors, duration: ""});
                        }}>
                          <SelectTrigger className={`bg-white/10 border-white/20 text-white ${errors.duration ? "border-red-500" : ""}`}>
                            <SelectValue placeholder="Select duration" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1h">1 hour</SelectItem>
                            <SelectItem value="2h">2 hours</SelectItem>
                            <SelectItem value="3h">3 hours</SelectItem>
                            <SelectItem value="dinner">Dinner date (4+ hours)</SelectItem>
                            <SelectItem value="overnight">Overnight</SelectItem>
                            <SelectItem value="weekend">Weekend</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.duration && (
                          <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                            <AlertCircle size={14} /> {errors.duration}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label className="text-white mb-2 block">Service Type *</Label>
                        <Select value={bookingData.service} onValueChange={(value) => {
                          setBookingData({...bookingData, service: value});
                          setErrors({...errors, service: ""});
                        }}>
                          <SelectTrigger className={`bg-white/10 border-white/20 text-white ${errors.service ? "border-red-500" : ""}`}>
                            <SelectValue placeholder="Select service" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="gfe">GFE (Girlfriend Experience)</SelectItem>
                            <SelectItem value="pse">PSE (Porn Star Experience)</SelectItem>
                            <SelectItem value="massage">Erotic Massage</SelectItem>
                            <SelectItem value="dinner">Dinner Date</SelectItem>
                            <SelectItem value="travel">Travel Companion</SelectItem>
                            <SelectItem value="events">Events & Parties</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.service && (
                          <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                            <AlertCircle size={14} /> {errors.service}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Step 3: Location & Terms */}
                  {currentStep === 3 && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-3xl font-black text-white mb-2">Location & Terms</h2>
                        <p className="text-gray-300">Final details before confirmation</p>
                      </div>

                      <div>
                        <Label className="text-white mb-2 block">Meeting Location *</Label>
                        <Input
                          value={bookingData.location}
                          onChange={(e) => {
                            setBookingData({...bookingData, location: e.target.value});
                            setErrors({...errors, location: ""});
                          }}
                          placeholder="Hotel name or address"
                          className={`bg-white/10 border-white/20 text-white ${errors.location ? "border-red-500" : ""}`}
                        />
                        {errors.location && (
                          <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                            <AlertCircle size={14} /> {errors.location}
                          </p>
                        )}
                        <p className="text-gray-400 text-sm mt-1">
                          Please specify your hotel or preferred meeting location in Zürich
                        </p>
                      </div>

                      <div>
                        <Label className="text-white mb-2 block">Special Requests (Optional)</Label>
                        <Textarea
                          value={bookingData.specialRequests}
                          onChange={(e) => setBookingData({...bookingData, specialRequests: e.target.value})}
                          placeholder="Any special preferences or requests..."
                          rows={4}
                          className="bg-white/10 border-white/20 text-white resize-none"
                        />
                      </div>

                      <Card className="p-4 bg-blue-500/10 border-blue-500/30">
                        <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                          <Bell size={20} className="text-blue-400" />
                          Notification Preferences
                        </h3>
                        <div className="space-y-3">
                          <label className="flex items-center gap-3 cursor-pointer text-white">
                            <Checkbox
                              checked={bookingData.notifyEmail}
                              onCheckedChange={(checked) => setBookingData({...bookingData, notifyEmail: checked as boolean})}
                            />
                            <Mail size={18} className="text-blue-400" />
                            <span className="text-sm">Email confirmation & updates</span>
                          </label>
                          <label className="flex items-center gap-3 cursor-pointer text-white">
                            <Checkbox
                              checked={bookingData.notifySMS}
                              onCheckedChange={(checked) => setBookingData({...bookingData, notifySMS: checked as boolean})}
                            />
                            <Smartphone size={18} className="text-green-400" />
                            <span className="text-sm">SMS notifications (recommended)</span>
                          </label>
                        </div>
                      </Card>

                      <div className="space-y-3">
                        <label className={`flex items-start gap-3 cursor-pointer ${errors.agreeTerms ? "text-red-400" : "text-white"}`}>
                          <Checkbox
                            checked={bookingData.agreeTerms}
                            onCheckedChange={(checked) => {
                              setBookingData({...bookingData, agreeTerms: checked as boolean});
                              setErrors({...errors, agreeTerms: ""});
                            }}
                            className={errors.agreeTerms ? "border-red-500" : ""}
                          />
                          <span className="text-sm leading-relaxed">
                            I agree to the <Link href="/terms" className="text-pink-500 hover:underline">Terms & Conditions</Link> and confirm that I am 18+ years old. I understand this is a booking request and final confirmation depends on escort availability.
                          </span>
                        </label>
                        {errors.agreeTerms && (
                          <p className="text-red-400 text-sm flex items-center gap-1 ml-7">
                            <AlertCircle size={14} /> {errors.agreeTerms}
                          </p>
                        )}
                      </div>

                      <Card className="p-4 bg-yellow-500/10 border-yellow-500/30">
                        <div className="flex items-start gap-3 text-yellow-400">
                          <Shield size={20} className="flex-shrink-0 mt-0.5" />
                          <div className="text-sm">
                            <p className="font-semibold mb-1">Privacy & Security</p>
                            <p className="text-yellow-300/80">
                              Your information is encrypted and never shared. All bookings are handled with complete discretion.
                            </p>
                          </div>
                        </div>
                      </Card>
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
                    {currentStep > 1 && (
                      <Button
                        onClick={handleBack}
                        variant="outline"
                        className="border-white/30 text-white hover:bg-white/10"
                      >
                        <ArrowLeft size={18} className="mr-2" />
                        Back
                      </Button>
                    )}
                    
                    {currentStep < 3 ? (
                      <Button
                        onClick={handleNext}
                        className="ml-auto bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-bold"
                      >
                        Continue
                        <ArrowRight size={18} className="ml-2" />
                      </Button>
                    ) : (
                      <Button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="ml-auto bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <Send size={18} className="mr-2" />
                            Confirm Booking
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="p-12 bg-white/10 backdrop-blur-md border-white/20 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                    className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center mb-6 shadow-2xl shadow-green-500/50"
                  >
                    <CheckCircle size={48} className="text-white" />
                  </motion.div>

                  <h2 className="text-4xl font-black text-white mb-4">Booking Request Sent!</h2>
                  
                  <div className="inline-block bg-black/40 px-6 py-3 rounded-lg mb-6">
                    <p className="text-gray-300 text-sm mb-1">Your Confirmation Code</p>
                    <p className="text-3xl font-black text-yellow-500 tracking-wider">{confirmationCode}</p>
                  </div>

                  <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                    Your booking request has been sent to <strong className="text-white">{escortName || "the escort"}</strong>. You will receive a confirmation within 24 hours.
                  </p>

                  <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto mb-8">
                    <Card className="p-6 bg-blue-500/10 border-blue-500/30">
                      <Mail size={32} className="text-blue-400 mx-auto mb-3" />
                      <h3 className="text-white font-bold mb-2">Email Confirmation</h3>
                      <p className="text-gray-300 text-sm">
                        Check your inbox at <strong className="text-white">{bookingData.email}</strong>
                      </p>
                    </Card>

                    <Card className="p-6 bg-green-500/10 border-green-500/30">
                      <Smartphone size={32} className="text-green-400 mx-auto mb-3" />
                      <h3 className="text-white font-bold mb-2">SMS Notification</h3>
                      <p className="text-gray-300 text-sm">
                        {bookingData.notifySMS ? `Updates sent to ${bookingData.phone}` : "Not enabled"}
                      </p>
                    </Card>
                  </div>

                  <div className="flex flex-wrap gap-4 justify-center">
                    <Button
                      className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-bold"
                      asChild
                    >
                      <Link href="/escort-zurich">
                        Browse More Escorts
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      className="border-white/30 text-white hover:bg-white/10"
                      asChild
                    >
                      <Link href="/">
                        Return Home
                      </Link>
                    </Button>
                  </div>

                  <Card className="mt-8 p-6 bg-purple-500/10 border-purple-500/30 text-left">
                    <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                      <Sparkles className="text-yellow-500" />
                      What Happens Next?
                    </h3>
                    <ul className="space-y-2 text-gray-300 text-sm">
                      <li className="flex items-start gap-2">
                        <CheckCircle size={16} className="text-green-400 mt-0.5 flex-shrink-0" />
                        <span>The escort will review your request within 24 hours</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle size={16} className="text-green-400 mt-0.5 flex-shrink-0" />
                        <span>You'll receive confirmation via your selected notification method</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle size={16} className="text-green-400 mt-0.5 flex-shrink-0" />
                        <span>Final details and meeting arrangements will be confirmed directly</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle size={16} className="text-green-400 mt-0.5 flex-shrink-0" />
                        <span>All communications are encrypted and completely discreet</span>
                      </li>
                    </ul>
                  </Card>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}