
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X, Menu, Plane, Clock, AlertTriangle, Building2, Phone, Cloud, Radar, BellRing } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import NotificationBell from './NotificationBell';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const headerRef = useRef<HTMLElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleScroll = () => {
      if (headerRef.current) {
        const headerHeight = headerRef.current.offsetHeight;
        setIsScrolled(window.scrollY > headerHeight);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial scroll position on mount

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false); // Close the menu when the route changes
  }, [location]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const nav = [
    { name: 'Home', path: '/', icon: <Building2 className="h-4 w-4" /> },
    { name: 'Flight Schedule', path: '/flight-schedule', icon: <Clock className="h-4 w-4" /> },
    { name: 'Live Flight Tracker', path: '/live-flight-tracker', icon: <Plane className="h-4 w-4" /> },
    { name: 'Flight Status', path: '/flight-status', icon: <AlertTriangle className="h-4 w-4" /> },
    { name: 'Weather', path: '/global-weather', icon: <Cloud className="h-4 w-4" /> },
    { name: 'World Clock', path: '/world-clock', icon: <Clock className="h-4 w-4" /> },
    { name: 'Contact', path: '/contact', icon: <Phone className="h-4 w-4" /> },
    { name: 'Sign Up for Free Flight Alerts', path: '/flight-alerts', icon: <BellRing className="h-4 w-4" /> }
  ];
  
  return (
    <header 
      className="fixed top-0 left-0 right-0 z-50 transition-colors duration-300" 
      ref={headerRef}
    >
      <div className={cn(
        "container flex items-center justify-between",
        isScrolled ? "bg-dark/90 backdrop-blur-md border-b border-[#8B0000]/20" : "bg-dark",
        isMobile ? "py-3 px-4" : "py-4 px-4"
      )}>
        <Link to="/" className="flex items-center font-bold font-space text-xl md:text-2xl text-white mr-8">
          <Radar 
            className="mr-2" 
            size={28} 
            strokeWidth={2} 
            color="#8B0000"  // Dark red color
            stroke="#8B0000"  // Dark red stroke
          />
          ASAP<span className="text-[#8B0000]">Tracker</span>
        </Link>

        {/* Mobile Menu Button */}
        {isMobile && (
          <div className="flex items-center gap-2">
            <NotificationBell className="mr-1" />
            <Button variant="ghost" size="icon" onClick={toggleMenu} className="lg:hidden text-white hover:text-[#8B0000] hover:bg-[#8B0000]/10">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        )}

        {/* Navigation Links */}
        <nav className={cn(
          "lg:flex items-center gap-2 flex-grow justify-center",
          isMobile && "fixed top-0 left-0 h-full w-screen bg-dark p-8 flex-col items-start space-y-4 z-50 border-r border-[#8B0000]/20",
          isMenuOpen ? "flex" : "hidden"
        )}>
          <div className={cn(
            "flex",
            isMobile ? "flex-col w-full space-y-2" : "items-center space-x-2"
          )}>
            {nav.map((link, index) => (
              <Link
                key={link.name}
                to={link.path}
                className={cn(
                  "flex items-center justify-center gap-1.5 text-sm font-medium text-white bg-[#8B0000] transition-all duration-200 border border-[#8B0000] rounded-[15px] px-3 py-1.5 hover:bg-[#A80000] hover:shadow-[0_0_8px_#A80000]",
                  location.pathname === link.path ? "border-[#8B0000] bg-[#A80000] shadow-[0_0_8px_#A80000]" : "",
                  // Add special styling for the Flight Alerts button
                  link.name === "Sign Up for Free Flight Alerts" ? 
                    "border-2 bg-[#A80000] shadow-[0_0_4px_#A80000] hover:shadow-[0_0_12px_#A80000]" : ""
                )}
                onClick={closeMenu}
              >
                {link.icon}
                <span className="text-[13px]">{link.name}</span>
              </Link>
            ))}
          </div>
        </nav>
        
        {/* Notification Bell (desktop) */}
        {!isMobile && (
          <div className="flex items-center">
            <NotificationBell />
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
