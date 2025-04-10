
import React from 'react';
import { Mail, MapPin, Phone, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const ContactForm: React.FC = () => {
  return (
    <section id="contact" className="py-12 w-full max-w-6xl mx-auto">
      <div className="px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold font-space mb-4">Contact Us</h2>
          <p className="text-gray-light max-w-2xl mx-auto">
            Have questions or need assistance? Our team is here to help. Reach out to us using the form below or through our contact information.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="glass-panel p-6">
            <h3 className="text-xl font-semibold mb-4 font-space">Get in Touch</h3>
            
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input 
                    id="name" 
                    placeholder="Your name" 
                    className="bg-gray-dark/50 border-gray-dark text-white placeholder:text-gray-light focus:border-purple"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="Your email" 
                    className="bg-gray-dark/50 border-gray-dark text-white placeholder:text-gray-light focus:border-purple"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input 
                  id="subject" 
                  placeholder="Subject of your message" 
                  className="bg-gray-dark/50 border-gray-dark text-white placeholder:text-gray-light focus:border-purple"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea 
                  id="message" 
                  placeholder="Your message" 
                  rows={5}
                  className="bg-gray-dark/50 border-gray-dark text-white placeholder:text-gray-light focus:border-purple resize-none"
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-purple hover:bg-purple-600 text-white purple-glow"
              >
                <Send size={16} className="mr-2" />
                Send Message
              </Button>
            </form>
          </div>
          
          <div className="space-y-6">
            <div className="glass-panel p-6">
              <h3 className="text-xl font-semibold mb-4 font-space">Contact Information</h3>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <MapPin className="text-purple h-5 w-5 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">Our Location</h4>
                    <p className="text-sm text-gray-light">123 Aviation Boulevard, Skyline Center, New York, NY 10001</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Mail className="text-purple h-5 w-5 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">Email Us</h4>
                    <p className="text-sm text-gray-light">info@forwardflights.com</p>
                    <p className="text-sm text-gray-light">support@forwardflights.com</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Phone className="text-purple h-5 w-5 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">Call Us</h4>
                    <p className="text-sm text-gray-light">+1 (555) 123-4567</p>
                    <p className="text-sm text-gray-light">+1 (555) 987-6543</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="glass-panel p-0 overflow-hidden rounded-2xl h-[300px]">
              {/* This would be a map in a real implementation */}
              <div className="h-full w-full bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80')] bg-cover bg-center opacity-50 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-dark/70 px-4 py-2 rounded-lg backdrop-blur-sm">
                    <p className="text-white font-medium">Interactive Map</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
