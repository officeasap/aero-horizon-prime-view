
import React from 'react';
import { Facebook, Instagram, Twitter, Linkedin, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-dark py-12 border-t border-white/10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="text-xl font-bold font-space tracking-wider mb-4">
              <span className="text-purple">ASAP</span>
              <span className="text-white ml-2">TRACKER</span>
            </div>
            <p className="text-gray-light text-sm mb-6">
              Your trusted source for real-time flight information, tracking, and global weather forecasts.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-light hover:text-purple transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-light hover:text-purple transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-light hover:text-purple transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-light hover:text-purple transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-white font-medium mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#hero" className="text-gray-light hover:text-purple transition-colors text-sm">Home</a></li>
              <li><a href="#schedule" className="text-gray-light hover:text-purple transition-colors text-sm">Flight Schedule</a></li>
              <li><a href="#tracker" className="text-gray-light hover:text-purple transition-colors text-sm">Flight Tracker</a></li>
              <li><a href="#delays" className="text-gray-light hover:text-purple transition-colors text-sm">Delays</a></li>
              <li><a href="#weather" className="text-gray-light hover:text-purple transition-colors text-sm">Weather Forecast</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-medium mb-4">Services</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-light hover:text-purple transition-colors text-sm">Flight Alerts</a></li>
              <li><a href="#" className="text-gray-light hover:text-purple transition-colors text-sm">Travel Planning</a></li>
              <li><a href="#" className="text-gray-light hover:text-purple transition-colors text-sm">Airport Information</a></li>
              <li><a href="#" className="text-gray-light hover:text-purple transition-colors text-sm">API Access</a></li>
              <li><a href="#" className="text-gray-light hover:text-purple transition-colors text-sm">Mobile App</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-medium mb-4">Subscribe</h3>
            <p className="text-gray-light text-sm mb-4">
              Subscribe to our newsletter to receive updates on flight information and travel tips.
            </p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="bg-white/10 border-white/10 focus:border-purple text-white placeholder:text-gray-light text-sm py-2 px-3 rounded-l-lg w-full"
              />
              <button className="bg-purple hover:bg-purple-600 text-white rounded-r-lg px-3 py-2 transition-colors">
                <Mail size={16} />
              </button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-light text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} ASAP Tracker. All rights reserved.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-light hover:text-purple transition-colors text-sm">Privacy Policy</a>
            <a href="#" className="text-gray-light hover:text-purple transition-colors text-sm">Terms of Service</a>
            <a href="#" className="text-gray-light hover:text-purple transition-colors text-sm">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
