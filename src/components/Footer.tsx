
import React from 'react';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Mail, 
  Phone, 
  MapPin, 
  Home, 
  Plane, 
  Calendar, 
  Info, 
  AlertTriangle, 
  Clock, 
  Cloud,
  Radar,
  Palette
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

const Footer = () => {
  return (
    <footer className="bg-dark pt-16 border-t border-[#8B0000]/20 w-full">
      <div className="w-full px-8 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Column 1 - About */}
          <div className="text-left">
            <div className="flex items-center mb-6">
              <Radar 
                className="text-[#8B0000] mr-2" 
                size={24} 
                strokeWidth={2} 
                color="#8B0000"
                stroke="#FFFFFF"
              />
              <div className="text-xl font-bold font-space tracking-wider">
                <span className="text-[#8B0000]">ASAP</span>
                <span className="text-white ml-2">TRACKER</span>
              </div>
            </div>
            <p className="text-white mb-6 text-sm">
              Comprehensive flight tracking and monitoring solutions for travelers, aviation professionals, and businesses.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-[#8B0000] hover:text-[#A80000] transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" className="text-[#8B0000] hover:text-[#A80000] transition-colors">
                <Twitter size={18} />
              </a>
              <a href="#" className="text-[#8B0000] hover:text-[#A80000] transition-colors">
                <Instagram size={18} />
              </a>
              <a href="#" className="text-[#8B0000] hover:text-[#A80000] transition-colors">
                <Linkedin size={18} />
              </a>
            </div>
          </div>
          
          {/* Column 2 - Quick Links */}
          <div className="text-left">
            <h3 className="text-lg font-semibold mb-6 text-[#8B0000]">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <a href="/" className="text-white text-sm flex items-center gap-2 hover:text-white/80 transition-colors">
                  <Home size={16} className="text-[#8B0000]" />
                  Home
                </a>
              </li>
              <li>
                <a href="/flight-schedule" target="_blank" rel="noopener noreferrer" className="text-white text-sm flex items-center gap-2 hover:text-white/80 transition-colors">
                  <Calendar size={16} className="text-[#8B0000]" />
                  Flight Schedule
                </a>
              </li>
              <li>
                <a href="/live-flight-tracker" target="_blank" rel="noopener noreferrer" className="text-white text-sm flex items-center gap-2 hover:text-white/80 transition-colors">
                  <Plane size={16} className="text-[#8B0000]" />
                  Live Flight Tracker
                </a>
              </li>
              <li>
                <a href="/flight-status" target="_blank" rel="noopener noreferrer" className="text-white text-sm flex items-center gap-2 hover:text-white/80 transition-colors">
                  <AlertTriangle size={16} className="text-[#8B0000]" />
                  Flight Status
                </a>
              </li>
              <li>
                <a href="/airports-airlines" target="_blank" rel="noopener noreferrer" className="text-white text-sm flex items-center gap-2 hover:text-white/80 transition-colors">
                  <Info size={16} className="text-[#8B0000]" />
                  Airports & Airlines
                </a>
              </li>
              <li>
                <a href="/global-weather" target="_blank" rel="noopener noreferrer" className="text-white text-sm flex items-center gap-2 hover:text-white/80 transition-colors">
                  <Cloud size={16} className="text-[#8B0000]" />
                  Weather
                </a>
              </li>
              <li>
                <a href="/world-clock" target="_blank" rel="noopener noreferrer" className="text-white text-sm flex items-center gap-2 hover:text-white/80 transition-colors">
                  <Clock size={16} className="text-[#8B0000]" />
                  World Clock
                </a>
              </li>
              <li>
                <a href="/site-elements" target="_blank" rel="noopener noreferrer" className="text-white text-sm flex items-center gap-2 hover:text-white/80 transition-colors">
                  <Palette size={16} className="text-[#8B0000]" />
                  Site Elements
                </a>
              </li>
            </ul>
          </div>
          
          {/* Column 3 - Contact */}
          <div className="text-left">
            <h3 className="text-lg font-semibold mb-6 text-[#8B0000]">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin size={18} className="text-[#8B0000] mr-3 mt-1 flex-shrink-0" />
                <span className="text-white text-sm">
                  PT. Asap World Secure Point Indonesia,<br />
                  Gedung Menara Global Lantai 3 Suite A,<br />
                  Jalan Jenderal Gatot Subroto Kavling 27
                </span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="text-[#8B0000] mr-3 flex-shrink-0" />
                <a href="tel:085718530703" className="text-white text-sm hover:text-white/80 transition-colors">
                  0857 1853 0703
                </a>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="text-[#8B0000] mr-3 flex-shrink-0" />
                <a href="mailto:info@asaptracker.com" className="text-white text-sm hover:text-white/80 transition-colors">
                  info@asaptracker.com
                </a>
              </li>
              <li className="mt-4">
                <a href="/contact" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm" className="bg-[#8B0000] hover:bg-[#A80000] text-white border-[#8B0000] rounded-[12px]">
                    <Phone className="h-4 w-4 mr-2" />
                    Contact Support
                  </Button>
                </a>
              </li>
            </ul>
          </div>
          
          {/* Column 4 - Newsletter */}
          <div className="text-left">
            <h3 className="text-lg font-semibold mb-6 text-[#8B0000]">Newsletter</h3>
            <p className="text-white mb-4 text-sm">
              Subscribe to receive the latest updates and news about flights and weather conditions.
            </p>
            <div className="flex flex-col space-y-3">
              <Input 
                type="email" 
                placeholder="Your email" 
                className="bg-[#2E2E2E] border-[#444444] text-white placeholder:text-[#B3B3B3]"
              />
              <a href="https://app.asaptracker.com/subscribe" target="_blank" rel="noopener noreferrer">
                <Button variant="subscribe" className="w-full">
                  Subscribe
                </Button>
              </a>
            </div>
          </div>
        </div>
        
        <Separator className="bg-[#8B0000]/20" />
        
        <div className="py-6">
          <div className="flex flex-col md:flex-row justify-between items-start">
            <p className="text-white text-xs mb-4 md:mb-0">
              © 2025 ASAP Tracker. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="/privacy" className="text-white text-xs hover:text-white/80 transition-colors">
                Privacy Policy
              </a>
              <a href="/terms" className="text-white text-xs hover:text-white/80 transition-colors">
                Terms of Service
              </a>
              <a href="/cookies" className="text-white text-xs hover:text-white/80 transition-colors">
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
