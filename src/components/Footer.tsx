
import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Footer = () => {
  return (
    <footer className="bg-gray-dark/50 pt-16 border-t border-white/5 w-full">
      <div className="w-full px-8 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Column 1 - About */}
          <div className="text-left">
            <a href="/" className="flex items-center mb-6">
              <img 
                src="/lovable-uploads/28f1aa86-908f-4a07-837d-7a69fa78941c.png" 
                alt="ASAP Tracker Logo" 
                className="h-10 mr-3" 
              />
              <div className="text-xl font-bold font-space tracking-wider">
                <span className="text-red">ASAP</span>
                <span className="text-white ml-2">TRACKER</span>
              </div>
            </a>
            <p className="text-red mb-6 text-sm">
              Comprehensive flight tracking and monitoring solutions for travelers, aviation professionals, and businesses.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-red">
                <Facebook size={18} />
              </a>
              <a href="#" className="text-red">
                <Twitter size={18} />
              </a>
              <a href="#" className="text-red">
                <Instagram size={18} />
              </a>
              <a href="#" className="text-red">
                <Linkedin size={18} />
              </a>
            </div>
          </div>
          
          {/* Column 2 - Quick Links */}
          <div className="text-left">
            <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <a href="/" className="text-red text-sm">
                  Home
                </a>
              </li>
              <li>
                <a href="/flight-schedule" target="_blank" rel="noopener noreferrer" className="text-red text-sm">
                  Flight Schedule
                </a>
              </li>
              <li>
                <a href="/live-tracker" target="_blank" rel="noopener noreferrer" className="text-red text-sm">
                  Live Flight Tracker
                </a>
              </li>
              <li>
                <a href="/flight-status" target="_blank" rel="noopener noreferrer" className="text-red text-sm">
                  Flight Status
                </a>
              </li>
              <li>
                <a href="/airports-airlines" target="_blank" rel="noopener noreferrer" className="text-red text-sm">
                  Airports & Airlines
                </a>
              </li>
              <li>
                <a href="/weather" target="_blank" rel="noopener noreferrer" className="text-red text-sm">
                  Global Weather
                </a>
              </li>
              <li>
                <a href="/world-clock" target="_blank" rel="noopener noreferrer" className="text-red text-sm">
                  World Clock
                </a>
              </li>
            </ul>
          </div>
          
          {/* Column 3 - Contact */}
          <div className="text-left">
            <h3 className="text-lg font-semibold mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin size={18} className="text-red mr-3 mt-1 flex-shrink-0" />
                <span className="text-red text-sm">
                  JL DMC 1 NO 29 BEKASI<br />
                  Indonesia
                </span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="text-red mr-3 flex-shrink-0" />
                <a href="tel:+6281315679012" className="text-red text-sm">
                  +62 813 1567 9012
                </a>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="text-red mr-3 flex-shrink-0" />
                <a href="mailto:info@asaptracker.com" className="text-red text-sm">
                  info@asaptracker.com
                </a>
              </li>
            </ul>
          </div>
          
          {/* Column 4 - Newsletter */}
          <div className="text-left">
            <h3 className="text-lg font-semibold mb-6">Newsletter</h3>
            <p className="text-red mb-4 text-sm">
              Subscribe to receive the latest updates and news about flights and weather conditions.
            </p>
            <div className="flex flex-col space-y-3">
              <Input 
                type="email" 
                placeholder="Your email" 
                className="bg-dark border-gray-dark text-white placeholder:text-red"
              />
              <a href="https://app.asaptracker.com/subscribe" target="_blank" rel="noopener noreferrer">
                <Button className="bg-red hover:bg-red-600 text-white red-glow w-full">
                  Subscribe
                </Button>
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/5 py-6">
          <div className="flex flex-col md:flex-row justify-between items-start">
            <p className="text-red text-sm mb-4 md:mb-0">
              © 2025 ASAP Tracker. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-red text-sm">
                Privacy Policy
              </a>
              <a href="#" className="text-red text-sm">
                Terms of Service
              </a>
              <a href="#" className="text-red text-sm">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
