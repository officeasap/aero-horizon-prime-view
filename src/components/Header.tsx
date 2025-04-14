
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X, Menu, Plane, MapPin, Cloud, AlertTriangle, Building2, Phone, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

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
    { name: 'Airports & Airlines', path: '/airports-airlines', icon: <MapPin className="h-4 w-4" /> },
    { name: 'Weather', path: '/weather', icon: <Cloud className="h-4 w-4" /> },
    { name: 'World Clock', path: '/world-clock', icon: <Clock className="h-4 w-4" /> },
    { name: 'Contact', path: '/contact', icon: <Phone className="h-4 w-4" /> }
  ];
  
  return (
    <header 
      className="fixed top-0 left-0 right-0 z-50 transition-colors duration-300" 
      ref={headerRef}
    >
      <div className={cn(
        "container flex items-center justify-between",
        isScrolled ? "bg-dark/90 backdrop-blur-md border-b border-red/20" : "bg-dark",
        isMobile ? "py-3 px-4" : "py-4 px-4"
      )}>
        <Link to="/" className="flex items-center font-bold font-space text-xl md:text-2xl text-white mr-8">
          ASAP<span className="text-red">Tracker</span>
        </Link>

        {/* Mobile Menu Button */}
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={toggleMenu} className="lg:hidden text-white hover:text-red hover:bg-red/10">
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        )}

        {/* Navigation Links */}
        <nav className={cn(
          "lg:flex items-center gap-2 flex-grow justify-center",
          isMobile && "fixed top-0 left-0 h-full w-screen bg-dark p-8 flex-col items-start space-y-4 z-50 border-r border-red/20",
          isMenuOpen ? "flex" : "hidden"
        )}>
          <div className={cn(
            "flex",
            isMobile ? "flex-col w-full space-y-2" : "items-center space-x-2"
          )}>
            {nav.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={cn(
                  "flex items-center justify-center gap-1.5 text-sm font-medium text-white bg-red transition-all duration-200 border border-red rounded-[10px] px-3 py-1.5 hover:bg-red-600 red-glow",
                  location.pathname === link.path ? "border-red bg-red-600" : ""
                )}
                onClick={closeMenu}
              >
                {link.icon}
                <span className="text-[13px]">{link.name}</span>
              </Link>
            ))}
          </div>
        </nav>

        {/* Mobile Menu Items - Subscribe button has been removed as requested previously */}
        {isMobile && isMenuOpen && (
          <div className="fixed bottom-8 left-8 right-8 flex flex-col gap-4">
            {/* The Subscribe button has been removed here as requested previously */}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
