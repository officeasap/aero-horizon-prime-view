
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X, Menu, Plane, Cloud, MapPin, AlertTriangle, Building2, Phone, ChevronDown } from 'lucide-react';
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
    { name: 'Home', path: '/' },
    { name: 'Live Flight Tracker', path: '/live-tracker' },
    { name: 'Flight Status', path: '/flight-status' },
    { name: 'Airports & Airlines', path: '/airports-airlines' },
    { name: 'Weather', path: '/weather' },
  ];
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-colors duration-300" ref={headerRef}>
      <div className={cn(
        "container flex items-center justify-between py-4 px-4",
        isScrolled ? "bg-dark/90 backdrop-blur-md border-b border-purple/20" : "bg-dark",
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
          "lg:flex items-center gap-8 hidden",
          isMobile && "fixed top-0 left-0 h-full w-screen bg-dark p-8 flex-col items-start space-y-6 z-50 border-r border-purple/20",
          isMenuOpen ? "flex" : "hidden"
        )}>
          {nav.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={cn(
                "flex items-center text-white hover:text-purple transition-colors duration-200 font-medium",
                location.pathname === link.path && "text-purple"
              )}
              onClick={closeMenu}
            >
              <span>{link.name}</span>
            </Link>
          ))}
          
          {/* More dropdown */}
          <div className="relative group">
            <button className="flex items-center text-white hover:text-purple transition-colors duration-200 font-medium gap-1">
              More <ChevronDown className="h-4 w-4" />
            </button>
          </div>
          
          {/* Contact Button */}
          <Link to="/contact">
            <Button className="bg-dark hover:bg-dark/80 text-white border border-purple rounded-full px-6">
              Contact Us
            </Button>
          </Link>
        </nav>

        {/* Mobile Menu Items */}
        {isMobile && isMenuOpen && (
          <div className="fixed bottom-8 left-8 right-8">
            <Link to="/contact" className="w-full block">
              <Button className="bg-dark hover:bg-dark/80 text-white border border-purple rounded-full px-6 w-full">
                Contact Us
              </Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
