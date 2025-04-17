import React, { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X, Bell, Clock, Cloud, Mail, ChevronsUpDown } from "lucide-react";
import { useMobile } from "@/hooks/use-mobile";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button";

const NotificationBell = () => {
  return (
    <button className="relative rounded-full p-2 hover:bg-white/5">
      <Bell className="h-5 w-5 text-gray-400" />
      <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 border border-dark"></div>
    </button>
  );
};

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isMobile } = useMobile();
  const location = useLocation();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-dark/80 backdrop-blur-lg border-b border-white/5">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue to-purple rounded-lg flex items-center justify-center text-white font-bold">
                A
              </div>
              <span className="text-lg font-bold hidden sm:inline-block tracking-wide text-white">
                AviationInfo
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? "text-white bg-primary/10"
                    : "text-gray-300 hover:bg-white/5"
                }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/flight-schedule"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? "text-white bg-primary/10"
                    : "text-gray-300 hover:bg-white/5"
                }`
              }
            >
              Flight Schedule
            </NavLink>
            <NavLink
              to="/airports-airlines"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? "text-white bg-primary/10"
                    : "text-gray-300 hover:bg-white/5"
                }`
              }
            >
              Airports & Airlines
            </NavLink>
            <NavLink
              to="/live-flight-tracker"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? "text-white bg-primary/10"
                    : "text-gray-300 hover:bg-white/5"
                }`
              }
            >
              Live Tracker
            </NavLink>
            <NavLink
              to="/flight-alerts"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? "text-white bg-primary/10"
                    : "text-gray-300 hover:bg-white/5"
                }`
              }
            >
              Flight Alerts
            </NavLink>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center gap-0.5 text-gray-300 hover:bg-white/5 px-3 py-2">
                  <span>More</span>
                  <ChevronsUpDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-gray-dark border-gray-light/20">
                <DropdownMenuItem asChild>
                  <Link to="/world-clock" className="cursor-pointer">
                    <Clock className="mr-2 h-4 w-4" />
                    <span>World Clock</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/global-weather" className="cursor-pointer">
                    <Cloud className="mr-2 h-4 w-4" />
                    <span>Weather</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/contact" className="cursor-pointer">
                    <Mail className="mr-2 h-4 w-4" />
                    <span>Contact</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          {/* Mobile Navigation Menu Button */}
          <div className="flex md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className={isMobile ? "visible" : "hidden"}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>

            <NotificationBell className="ml-4" />
          </div>

          {/* Right side actions (desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            <NotificationBell />
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <div className={`md:hidden ${isOpen ? "block" : "hidden"}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-dark/90 shadow-lg border-y border-white/5">
          <Link
            to="/"
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              location.pathname === "/"
                ? "text-white bg-primary/10"
                : "text-gray-300 hover:bg-white/5"
            }`}
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/flight-schedule"
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              location.pathname === "/flight-schedule"
                ? "text-white bg-primary/10"
                : "text-gray-300 hover:bg-white/5"
            }`}
            onClick={() => setIsOpen(false)}
          >
            Flight Schedule
          </Link>
          <Link
            to="/airports-airlines"
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              location.pathname === "/airports-airlines"
                ? "text-white bg-primary/10"
                : "text-gray-300 hover:bg-white/5"
            }`}
            onClick={() => setIsOpen(false)}
          >
            Airports & Airlines
          </Link>
          <Link
            to="/live-flight-tracker"
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              location.pathname === "/live-flight-tracker"
                ? "text-white bg-primary/10"
                : "text-gray-300 hover:bg-white/5"
            }`}
            onClick={() => setIsOpen(false)}
          >
            Live Tracker
          </Link>
          <Link
            to="/flight-alerts"
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              location.pathname === "/flight-alerts"
                ? "text-white bg-primary/10"
                : "text-gray-300 hover:bg-white/5"
            }`}
            onClick={() => setIsOpen(false)}
          >
            Flight Alerts
          </Link>
          <Link
            to="/world-clock"
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              location.pathname === "/world-clock"
                ? "text-white bg-primary/10"
                : "text-gray-300 hover:bg-white/5"
            }`}
            onClick={() => setIsOpen(false)}
          >
            World Clock
          </Link>
          <Link
            to="/global-weather"
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              location.pathname === "/global-weather"
                ? "text-white bg-primary/10"
                : "text-gray-300 hover:bg-white/5"
            }`}
            onClick={() => setIsOpen(false)}
          >
            Weather
          </Link>
          <Link
            to="/contact"
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              location.pathname === "/contact"
                ? "text-white bg-primary/10"
                : "text-gray-300 hover:bg-white/5"
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
