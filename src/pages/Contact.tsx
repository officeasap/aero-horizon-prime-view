
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send,
  User,
  MessageSquare,
  HelpCircle
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const Contact: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Mock form submission
    setTimeout(() => {
      toast.success("Message sent! We'll get back to you soon.");
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-dark text-white">
      <Header />
      
      <section className="pt-32 pb-12 relative">
        <div className="absolute inset-0 bg-radial-gradient from-[#4c2a90]/10 via-transparent to-transparent z-0"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold font-space mb-4 animate-fade-in">
              Contact <span className="text-purple animate-text-glow">Us</span>
            </h1>
            <p className="text-xl text-gray-light mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Get in touch with our team for support or inquiries
            </p>
          </div>
        </div>
      </section>
      
      <section className="py-10 container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <div>
            <div className="border-2 border-[#8B0000] rounded-xl p-6 bg-gray-dark/30">
              <h2 className="text-2xl font-semibold mb-6">Contact Information</h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-[#8B0000]/20 p-3 rounded-lg">
                    <Mail className="h-6 w-6 text-[#8B0000]" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">Email</h3>
                    <p className="text-gray-light">info@asaptracker.com</p>
                    <p className="text-gray-light">support@asaptracker.com</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-[#8B0000]/20 p-3 rounded-lg">
                    <Phone className="h-6 w-6 text-[#8B0000]" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">Phone</h3>
                    <p className="text-gray-light">+62 857 1853 0703</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-[#8B0000]/20 p-3 rounded-lg">
                    <MapPin className="h-6 w-6 text-[#8B0000]" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">Location</h3>
                    <p className="text-gray-light">
                      PT. Asap World Secure Point Indonesia,<br />
                      Gedung Menara Global Lantai 3 Suite A,<br />
                      Jalan Jenderal Gatot Subroto Kavling 27
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-[#8B0000]/20 p-3 rounded-lg">
                    <HelpCircle className="h-6 w-6 text-[#8B0000]" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">Support Hours</h3>
                    <p className="text-gray-light">
                      Monday - Friday: 8:00 AM - 8:00 PM<br />
                      Saturday: 9:00 AM - 5:00 PM<br />
                      Sunday: 10:00 AM - 3:00 PM<br />
                      (Indonesia Time / GMT+7)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <div className="border-2 border-[#8B0000] rounded-xl p-6 bg-gray-dark/30">
              <h2 className="text-2xl font-semibold mb-6">Send us a Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Your Name</Label>
                  <div className="relative">
                    <Input 
                      id="name"
                      type="text" 
                      placeholder="John Doe" 
                      className="bg-gray-dark pl-10 border-gray-dark/50 focus:border-[#8B0000]" 
                      required 
                      value={formData.name}
                      onChange={handleChange}
                    />
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-light" />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Input 
                      id="email"
                      type="email" 
                      placeholder="your.email@example.com" 
                      className="bg-gray-dark pl-10 border-gray-dark/50 focus:border-[#8B0000]" 
                      required 
                      value={formData.email}
                      onChange={handleChange}
                    />
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-light" />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <div className="relative">
                    <Input 
                      id="subject"
                      type="text" 
                      placeholder="How can we help you?" 
                      className="bg-gray-dark pl-10 border-gray-dark/50 focus:border-[#8B0000]" 
                      required 
                      value={formData.subject}
                      onChange={handleChange}
                    />
                    <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-light" />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea 
                    id="message"
                    placeholder="Please describe your question or concern in detail..." 
                    className="bg-gray-dark border-gray-dark/50 focus:border-[#8B0000] min-h-[150px]" 
                    required 
                    value={formData.message}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="pt-2">
                  <Button 
                    type="submit" 
                    className="w-full bg-[#8B0000] hover:bg-[#A80000] text-white"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin inline-block"></span>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Send Message
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Contact;
