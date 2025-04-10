
import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', href: '#hero' },
    { name: 'Flight Schedule', href: '#schedule' },
    { name: 'Flight Tracker', href: '#tracker' },
    { name: 'Delays', href: '#delays' },
    { name: 'Weather Forecast', href: '#weather' },
  ];

  return (
    <header 
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4 px-6 md:px-10',
        scrolled ? 'bg-dark/80 backdrop-blur-md shadow-lg' : 'bg-transparent'
      )}
    >
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <div className="text-xl md:text-2xl font-bold font-space tracking-wider">
            <span className="text-purple">FORWARD</span>
            <span className="text-white ml-2">FLIGHTS</span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <a 
              key={item.name} 
              href={item.href}
              className="text-white hover:text-purple transition-colors text-sm font-medium"
            >
              {item.name}
            </a>
          ))}
          <Button 
            variant="outline" 
            className="bg-transparent border-purple text-purple hover:bg-purple hover:text-white purple-glow"
          >
            Contact Us
          </Button>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMobile && isMenuOpen && (
        <nav className="absolute top-full left-0 right-0 bg-dark/95 backdrop-blur-md py-5 px-6 shadow-lg animate-fade-in">
          <div className="flex flex-col space-y-4">
            {navItems.map((item) => (
              <a 
                key={item.name} 
                href={item.href}
                className="text-white hover:text-purple transition-colors py-2 text-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </a>
            ))}
            <Button 
              variant="outline" 
              className="bg-transparent border-purple text-purple hover:bg-purple hover:text-white w-full mt-4 purple-glow"
            >
              Contact Us
            </Button>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;
