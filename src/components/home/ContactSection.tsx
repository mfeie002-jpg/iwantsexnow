import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, Send, AlertCircle, Lock, CheckCircle } from "lucide-react";

export function ContactSection() {
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    date: "",
    duration: ""
  });
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  
  // Newsletter
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterError, setNewsletterError] = useState("");
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone: string) => {
    return /^[\+]?[(]?[0-9]{2,4}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(phone);
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: {[key: string]: string} = {};

    if (!contactForm.name.trim()) errors.name = "Name is required";
    if (!contactForm.email.trim()) errors.email = "Email is required";
    else if (!validateEmail(contactForm.email)) errors.email = "Invalid email format";
    if (contactForm.phone && !validatePhone(contactForm.phone)) errors.phone = "Invalid phone format";
    if (!contactForm.message.trim()) errors.message = "Message is required";

    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      setFormSubmitting(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
      setFormSubmitting(false);
      setFormSuccess(true);
      setContactForm({ name: "", email: "", phone: "", message: "", date: "", duration: "" });
      setTimeout(() => setFormSuccess(false), 5000);
    }
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNewsletterError("");
    
    if (!newsletterEmail.trim()) {
      setNewsletterError("Email is required");
      return;
    }
    if (!validateEmail(newsletterEmail)) {
      setNewsletterError("Invalid email format");
      return;
    }

    await new Promise(resolve => setTimeout(resolve, 1000));
    setNewsletterSuccess(true);
    setNewsletterEmail("");
    setTimeout(() => setNewsletterSuccess(false), 5000);
  };

  return (
    <section id="contact" className="py-20 bg-gradient-to-r from-purple-900/50 via-pink-900/50 to-orange-900/50 border-y border-white/10">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              Ready to Book Your Experience?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Contact us now for discreet, professional escort services
            </p>
          </div>

          <Card className="p-8 bg-white/10 backdrop-blur-md border-white/20 shadow-2xl">
            {formSuccess ? (
              <div className="text-center py-12 animate-fade-in">
                <div className="w-20 h-20 mx-auto rounded-full bg-green-500 flex items-center justify-center mb-6 shadow-lg shadow-green-500/30">
                  <Check size={40} className="text-white" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-4">Message Sent Successfully!</h3>
                <p className="text-gray-300 mb-8">
                  We've received your inquiry and will respond within 24 hours.
                </p>
                <Button
                  onClick={() => setFormSuccess(false)}
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold transform hover:scale-105 transition-all"
                >
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-white mb-2 block">Your Name *</Label>
                    <Input
                      value={contactForm.name}
                      onChange={(e) => {
                        setContactForm({...contactForm, name: e.target.value});
                        setFormErrors({...formErrors, name: ""});
                      }}
                      placeholder="John Doe"
                      className={`bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-pink-500 focus:ring-pink-500 transition-all ${
                        formErrors.name ? "border-red-500" : ""
                      }`}
                    />
                    {formErrors.name && (
                      <p className="text-red-400 text-sm mt-1 flex items-center gap-1 animate-shake">
                        <AlertCircle size={14} />
                        {formErrors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label className="text-white mb-2 block">Email *</Label>
                    <Input
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => {
                        setContactForm({...contactForm, email: e.target.value});
                        setFormErrors({...formErrors, email: ""});
                      }}
                      placeholder="your@email.com"
                      className={`bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-pink-500 focus:ring-pink-500 transition-all ${
                        formErrors.email ? "border-red-500" : ""
                      }`}
                    />
                    {formErrors.email && (
                      <p className="text-red-400 text-sm mt-1 flex items-center gap-1 animate-shake">
                        <AlertCircle size={14} />
                        {formErrors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-white mb-2 block">Phone</Label>
                    <Input
                      type="tel"
                      value={contactForm.phone}
                      onChange={(e) => {
                        setContactForm({...contactForm, phone: e.target.value});
                        setFormErrors({...formErrors, phone: ""});
                      }}
                      placeholder="+41 XX XXX XX XX"
                      className={`bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-pink-500 focus:ring-pink-500 transition-all ${
                        formErrors.phone ? "border-red-500" : ""
                      }`}
                    />
                    {formErrors.phone && (
                      <p className="text-red-400 text-sm mt-1 flex items-center gap-1 animate-shake">
                        <AlertCircle size={14} />
                        {formErrors.phone}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label className="text-white mb-2 block">Preferred Date</Label>
                    <Input
                      type="date"
                      value={contactForm.date}
                      onChange={(e) => setContactForm({...contactForm, date: e.target.value})}
                      className="bg-white/10 border-white/20 text-white focus:border-pink-500 focus:ring-pink-500 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-white mb-2 block">Duration</Label>
                  <Select value={contactForm.duration} onValueChange={(value) => setContactForm({...contactForm, duration: value})}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white focus:border-pink-500 focus:ring-pink-500 transition-all">
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1h">1 hour</SelectItem>
                      <SelectItem value="2h">2 hours</SelectItem>
                      <SelectItem value="3h">3 hours</SelectItem>
                      <SelectItem value="dinner">Dinner (4+ hours)</SelectItem>
                      <SelectItem value="overnight">Overnight</SelectItem>
                      <SelectItem value="weekend">Weekend</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-white mb-2 block">Message *</Label>
                  <Textarea
                    value={contactForm.message}
                    onChange={(e) => {
                      setContactForm({...contactForm, message: e.target.value});
                      setFormErrors({...formErrors, message: ""});
                    }}
                    rows={4}
                    placeholder="Tell us about your preferences..."
                    className={`bg-white/10 border-white/20 text-white placeholder:text-gray-400 resize-none focus:border-pink-500 focus:ring-pink-500 transition-all ${
                      formErrors.message ? "border-red-500" : ""
                    }`}
                  />
                  {formErrors.message && (
                    <p className="text-red-400 text-sm mt-1 flex items-center gap-1 animate-shake">
                      <AlertCircle size={14} />
                      {formErrors.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  size="lg"
                  disabled={formSubmitting}
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold text-lg h-14 disabled:opacity-50 hover:scale-105 transition-transform shadow-lg shadow-yellow-500/20"
                >
                  {formSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={20} className="mr-2" />
                      Send Booking Request
                    </>
                  )}
                </Button>

                <p className="text-center text-sm text-gray-400 mt-4 flex items-center justify-center gap-2">
                  <Lock size={14} />
                  All communications are encrypted and confidential
                </p>
              </form>
            )}
          </Card>

          {/* Newsletter Signup */}
          <Card className="p-6 mt-8 bg-white/5 backdrop-blur-sm border-white/10">
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold text-white mb-2">
                Get Exclusive Updates
              </h3>
              <p className="text-gray-300 text-sm">
                Subscribe to receive new escort profiles and special offers
              </p>
            </div>

            {newsletterSuccess ? (
              <div className="flex items-center justify-center gap-2 text-green-400 py-3 animate-fade-in">
                <CheckCircle size={20} />
                <span className="font-semibold">Successfully subscribed!</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                <div className="flex-1">
                  <Input
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => {
                      setNewsletterEmail(e.target.value);
                      setNewsletterError("");
                    }}
                    placeholder="your@email.com"
                    className={`bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-pink-500 focus:ring-pink-500 transition-all ${
                      newsletterError ? "border-red-500" : ""
                    }`}
                  />
                  {newsletterError && (
                    <p className="text-red-400 text-sm mt-1 animate-shake">{newsletterError}</p>
                  )}
                </div>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white hover:scale-105 transition-transform"
                >
                  Subscribe
                </Button>
              </form>
            )}
          </Card>
        </div>
      </div>
    </section>
  );
}