
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X, Menu, Plane, Cloud, MapPin, AlertTriangle, Building2, Phone } from 'lucide-react';
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
    { name: 'Home', path: '/', icon: <Plane className="h-5 w-5 lg:h-4 lg:w-4" /> },
    { name: 'Live Flight Tracker', path: '/live-tracker', icon: <MapPin className="h-5 w-5 lg:h-4 lg:w-4" /> },
    { name: 'Flight Status', path: '/flight-status', icon: <AlertTriangle className="h-5 w-5 lg:h-4 lg:w-4" /> },
    { name: 'Airports & Airlines', path: '/airports-airlines', icon: <Building2 className="h-5 w-5 lg:h-4 lg:w-4" /> },
    { name: 'Weather', path: '/weather', icon: <Cloud className="h-5 w-5 lg:h-4 lg:w-4" /> },
    { name: 'Contact', path: '/contact', icon: <Phone className="h-5 w-5 lg:h-4 lg:w-4" /> },
  ];
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-colors duration-300" ref={headerRef}>
      <div className={cn(
        "container flex items-center justify-between py-4 px-4",
        isScrolled ? "bg-dark/70 backdrop-blur-md border-b border-purple/20" : "bg-transparent",
        isMobile ? "py-3" : "py-4"
      )}>
        <Link to="/" className="flex items-center font-bold font-space text-xl md:text-2xl text-white">
          ASAP<span className="text-purple">Tracker</span>
        </Link>

        {/* Mobile Menu Button */}
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={toggleMenu} className="lg:hidden text-white hover:text-purple hover:bg-purple/10">
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        )}

        {/* Navigation Links */}
        <nav className={cn(
          "lg:flex items-center space-x-6 hidden",
          isMobile && "fixed top-0 left-0 h-full w-screen bg-dark p-8 flex-col items-start space-y-6 z-50 border-r border-purple/20",
          isMenuOpen ? "flex" : "hidden"
        )}>
          {nav.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={cn(
                "flex items-center text-gray-light hover:text-purple transition-colors duration-200",
                location.pathname === link.path && "text-purple font-medium"
              )}
              onClick={closeMenu}
            >
              {link.icon}
              <span className="ml-2">{link.name}</span>
            </Link>
          ))}
          {/* Subscribe Button - Hide on Mobile Menu */}
          {!isMobile && (
            <a href="https://app.asaptracker.com/signup" target="_blank" rel="noopener noreferrer">
              <Button className="bg-purple hover:bg-purple-600 text-white purple-glow border border-purple/50">
                Subscribe
              </Button>
            </a>
          )}
        </nav>

        {/* Subscribe Button - Show on Mobile Menu */}
        {isMobile && isMenuOpen && (
          <a href="https://app.asaptracker.com/signup" target="_blank" rel="noopener noreferrer">
            <Button className="bg-purple hover:bg-purple-600 text-white purple-glow border border-purple/50">
              Subscribe
            </Button>
          </a>
        )}
      </div>
    </header>
  );
};

export default Header;
