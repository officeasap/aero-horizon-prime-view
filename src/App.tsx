
import { StrictMode } from "react";
import "./App.css";
import "./index.css";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import WorldClock from "./pages/WorldClock";
import GlobalWeather from "./pages/GlobalWeather";
import NotFound from "./pages/NotFound";
import Contact from "./pages/Contact";
import AirportsAirlinesPage from "./pages/AirportsAirlinesPage";
import FlightSchedulePage from "./pages/FlightSchedulePage";
import LiveFlightTracker from "./pages/LiveFlightTracker";
import FlightStatusDetailPage from "./pages/FlightStatusDetailPage";
import FlightAlertsSignup from "./pages/FlightAlertsSignup";
import AviationInfo from "./pages/AviationInfo";
import AirportInfoPage from "./pages/AirportInfoPage";
import FlightStatus from "./pages/FlightStatus";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import CookiePolicy from "./pages/CookiePolicy";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { registerServiceWorker } from "./services/notificationService";
import ASAPAgentButton from "./components/ASAPAgent/ASAPAgentButton";
import RouteMappingPage from "./pages/RouteMappingPage";

// Define global Headers if not already defined (for browser compatibility)
if (typeof window !== 'undefined' && !window.Headers) {
  // Simple Headers polyfill for environments where it might be missing
  window.Headers = class Headers {
    constructor(init?: HeadersInit) {
      this._headers = {};
      if (init) {
        if (Array.isArray(init)) {
          init.forEach(([name, value]) => this.append(name, value));
        } else if (init instanceof Headers || init instanceof this.constructor) {
          Array.from(init.entries()).forEach(([name, value]) => this.append(name, value));
        } else {
          Object.entries(init).forEach(([name, value]) => this.append(name, value));
        }
      }
    }

    _headers: Record<string, string>;

    append(name: string, value: string) {
      const key = name.toLowerCase();
      if (this._headers[key]) {
        this._headers[key] += `, ${value}`;
      } else {
        this._headers[key] = value;
      }
    }

    delete(name: string) {
      delete this._headers[name.toLowerCase()];
    }

    get(name: string) {
      return this._headers[name.toLowerCase()] || null;
    }

    has(name: string) {
      return name.toLowerCase() in this._headers;
    }

    set(name: string, value: string) {
      this._headers[name.toLowerCase()] = value;
    }

    forEach(callback: (value: string, name: string, parent: Headers) => void) {
      Object.entries(this._headers).forEach(([name, value]) => {
        callback(value, name, this as unknown as Headers);
      });
    }

    *entries() {
      for (const name in this._headers) {
        yield [name, this._headers[name]];
      }
    }

    *keys() {
      for (const name in this._headers) {
        yield name;
      }
    }

    *values() {
      for (const name in this._headers) {
        yield this._headers[name];
      }
    }
  };
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
    errorElement: <NotFound />
  },
  {
    path: "/world-clock",
    element: <WorldClock />
  },
  {
    path: "/global-weather",
    element: <GlobalWeather />
  },
  {
    path: "/weather",
    element: <Navigate to="/global-weather" replace />
  },
  {
    path: "/flight-schedule",
    element: <FlightSchedulePage />
  },
  {
    path: "/airports-airlines",
    element: <AirportsAirlinesPage />
  },
  {
    path: "/live-flight-tracker",
    element: <LiveFlightTracker />
  },
  {
    path: "/live-tracker",
    element: <Navigate to="/live-flight-tracker" replace />
  },
  {
    path: "/flight/:flightId",
    element: <FlightStatusDetailPage />
  },
  {
    path: "/contact",
    element: <Contact />
  },
  {
    path: "/flight-alerts",
    element: <FlightAlertsSignup />
  },
  {
    path: "/aviation-info",
    element: <AviationInfo />
  },
  {
    path: "/airport-info",
    element: <AirportInfoPage />
  },
  {
    path: "/flight-status",
    element: <FlightStatus />
  },
  {
    path: "/route-mapping",
    element: <RouteMappingPage />
  },
  {
    path: "/privacy",
    element: <PrivacyPolicy />
  },
  {
    path: "/terms",
    element: <TermsOfService />
  },
  {
    path: "/cookies",
    element: <CookiePolicy />
  },
  {
    path: "*",
    element: <NotFound />
  }
]);

function App() {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        retry: 2,
        retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
        staleTime: 30000,
      },
    },
  }));

  useEffect(() => {
    // Register service worker on app load
    if ('serviceWorker' in navigator) {
      registerServiceWorker().catch(error => {
        console.error('Service worker registration failed:', error);
      });
    }
    
    // Update the document title
    document.title = "ASAP Tracker - Real-Time Flight Services";
  }, []);

  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster position="top-right" richColors closeButton />
        <ASAPAgentButton />
      </QueryClientProvider>
    </StrictMode>
  );
}

export default App;
