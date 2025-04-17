import React, { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X, Radar } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();
  const location = useLocation();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-dark/80 backdrop-blur-lg border-b border-white/5">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-[#8B0000] to-[#A80000] rounded-lg flex items-center justify-center">
              <Radar className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-wide">
              <span className="text-white">ASAP</span>{" "}
              <span className="text-[#8B0000]">Tracker</span>
            </span>
          </Link>

          {/* Desktop Navigation - Centered */}
          <nav className="hidden md:flex items-center justify-center flex-1 space-x-4 px-4 mx-4">
            <NavLink
              to="/aviation-info"
              className={({ isActive }) =>
                `px-4 py-2 rounded-[15px] text-sm font-medium transition-all ${
                  isActive
                    ? "bg-[#A80000] text-white shadow-[0_0_8px_#A80000]"
                    : "bg-[#8B0000] text-white hover:bg-[#A80000] hover:shadow-[0_0_8px_#A80000]"
                }`
              }
            >
              AviationInfo
            </NavLink>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `px-4 py-2 rounded-[15px] text-sm font-medium transition-all ${
                  isActive
                    ? "bg-[#A80000] text-white shadow-[0_0_8px_#A80000]"
                    : "bg-[#8B0000] text-white hover:bg-[#A80000] hover:shadow-[0_0_8px_#A80000]"
                }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/flight-schedule"
              className={({ isActive }) =>
                `px-4 py-2 rounded-[15px] text-sm font-medium transition-all ${
                  isActive
                    ? "bg-[#A80000] text-white shadow-[0_0_8px_#A80000]"
                    : "bg-[#8B0000] text-white hover:bg-[#A80000] hover:shadow-[0_0_8px_#A80000]"
                }`
              }
            >
              Flight Schedule
            </NavLink>
            <NavLink
              to="/airports-airlines"
              className={({ isActive }) =>
                `px-4 py-2 rounded-[15px] text-sm font-medium transition-all ${
                  isActive
                    ? "bg-[#A80000] text-white shadow-[0_0_8px_#A80000]"
                    : "bg-[#8B0000] text-white hover:bg-[#A80000] hover:shadow-[0_0_8px_#A80000]"
                }`
              }
            >
              Airports & Airlines
            </NavLink>
            <NavLink
              to="/live-flight-tracker"
              className={({ isActive }) =>
                `px-4 py-2 rounded-[15px] text-sm font-medium transition-all ${
                  isActive
                    ? "bg-[#A80000] text-white shadow-[0_0_8px_#A80000]"
                    : "bg-[#8B0000] text-white hover:bg-[#A80000] hover:shadow-[0_0_8px_#A80000]"
                }`
              }
            >
              Live Tracker
            </NavLink>
            <NavLink
              to="/flight-alerts"
              className={({ isActive }) =>
                `px-4 py-2 rounded-[15px] text-sm font-medium transition-all ${
                  isActive
                    ? "bg-[#A80000] text-white shadow-[0_0_8px_#A80000]"
                    : "bg-[#8B0000] text-white hover:bg-[#A80000] hover:shadow-[0_0_8px_#A80000]"
                }`
              }
            >
              Flight Alerts
            </NavLink>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              className={isMobile ? "visible" : "hidden"}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div className={`md:hidden ${isOpen ? "block" : "hidden"}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-dark/90 shadow-lg border-y border-white/5">
          <Link
            to="/aviation-info"
            className={`block px-4 py-2 rounded-[15px] text-base font-medium ${
              location.pathname === "/aviation-info"
                ? "bg-[#A80000] text-white shadow-[0_0_8px_#A80000]"
                : "bg-[#8B0000] text-white hover:bg-[#A80000] hover:shadow-[0_0_8px_#A80000]"
            }`}
            onClick={() => setIsOpen(false)}
          >
            AviationInfo
          </Link>
          <Link
            to="/"
            className={`block px-3 py-2 rounded-[14px] text-base font-medium ${
              location.pathname === "/"
                ? "bg-[#A80000] text-white shadow-[0_0_8px_#A80000]"
                : "bg-[#8B0000] text-white hover:bg-[#A80000] hover:shadow-[0_0_8px_#A80000]"
            }`}
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/flight-schedule"
            className={`block px-3 py-2 rounded-[14px] text-base font-medium ${
              location.pathname === "/flight-schedule"
                ? "bg-[#A80000] text-white shadow-[0_0_8px_#A80000]"
                : "bg-[#8B0000] text-white hover:bg-[#A80000] hover:shadow-[0_0_8px_#A80000]"
            }`}
            onClick={() => setIsOpen(false)}
          >
            Flight Schedule
          </Link>
          <Link
            to="/airports-airlines"
            className={`block px-3 py-2 rounded-[14px] text-base font-medium ${
              location.pathname === "/airports-airlines"
                ? "bg-[#A80000] text-white shadow-[0_0_8px_#A80000]"
                : "bg-[#8B0000] text-white hover:bg-[#A80000] hover:shadow-[0_0_8px_#A80000]"
            }`}
            onClick={() => setIsOpen(false)}
          >
            Airports & Airlines
          </Link>
          <Link
            to="/live-flight-tracker"
            className={`block px-3 py-2 rounded-[14px] text-base font-medium ${
              location.pathname === "/live-flight-tracker"
                ? "bg-[#A80000] text-white shadow-[0_0_8px_#A80000]"
                : "bg-[#8B0000] text-white hover:bg-[#A80000] hover:shadow-[0_0_8px_#A80000]"
            }`}
            onClick={() => setIsOpen(false)}
          >
            Live Tracker
          </Link>
          <Link
            to="/flight-alerts"
            className={`block px-3 py-2 rounded-[14px] text-base font-medium ${
              location.pathname === "/flight-alerts"
                ? "bg-[#A80000] text-white shadow-[0_0_8px_#A80000]"
                : "bg-[#8B0000] text-white hover:bg-[#A80000] hover:shadow-[0_0_8px_#A80000]"
            }`}
            onClick={() => setIsOpen(false)}
          >
            Flight Alerts
          </Link>
          <Link
            to="/world-clock"
            className={`block px-3 py-2 rounded-[14px] text-base font-medium ${
              location.pathname === "/world-clock"
                ? "bg-[#A80000] text-white shadow-[0_0_8px_#A80000]"
                : "bg-[#8B0000] text-white hover:bg-[#A80000] hover:shadow-[0_0_8px_#A80000]"
            }`}
            onClick={() => setIsOpen(false)}
          >
            World Clock
          </Link>
          <Link
            to="/global-weather"
            className={`block px-3 py-2 rounded-[14px] text-base font-medium ${
              location.pathname === "/global-weather"
                ? "bg-[#A80000] text-white shadow-[0_0_8px_#A80000]"
                : "bg-[#8B0000] text-white hover:bg-[#A80000] hover:shadow-[0_0_8px_#A80000]"
            }`}
            onClick={() => setIsOpen(false)}
          >
            Weather
          </Link>
          <Link
            to="/contact"
            className={`block px-3 py-2 rounded-[14px] text-base font-medium ${
              location.pathname === "/contact"
                ? "bg-[#A80000] text-white shadow-[0_0_8px_#A80000]"
                : "bg-[#8B0000] text-white hover:bg-[#A80000] hover:shadow-[0_0_8px_#A80000]"
            }`}
            onClick={() => setIsOpen(false)}
          >
            Contact
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
