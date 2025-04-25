
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft, Home, Map, Building } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  // Check if the user tried to access the old /live-tracker URL
  const isLiveTrackerAttempt = location.pathname.includes("live-tracker") && 
    !location.pathname.includes("live-flight-tracker");

  // Check if user attempted to access incorrect airports URL
  const isAirportsAttempt = location.pathname.includes("airports") && 
    !location.pathname.includes("airports-airlines");

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark text-white p-4">
      <div className="text-center p-6 max-w-md w-full bg-gray-dark/30 rounded-xl border border-gray-light/10 shadow-lg">
        <h1 className="text-6xl font-bold mb-4 text-purple">404</h1>
        <p className="text-2xl text-gray-light mb-6">Oops! Page not found</p>
        
        {isLiveTrackerAttempt && (
          <div className="mb-6 p-4 bg-purple/10 rounded-lg">
            <p className="mb-2">Looking for the flight tracker?</p>
            <p className="text-sm mb-4">The correct URL is <span className="font-mono text-purple">/live-flight-tracker</span></p>
            <Button 
              onClick={() => navigate("/live-flight-tracker")}
              className="inline-flex items-center px-4 py-2 bg-purple hover:bg-purple/80 text-white rounded-md transition-colors w-full sm:w-auto"
            >
              <Map className="h-4 w-4 mr-2" />
              Go to Flight Tracker
            </Button>
          </div>
        )}
        
        {isAirportsAttempt && (
          <div className="mb-6 p-4 bg-purple/10 rounded-lg">
            <p className="mb-2">Looking for airports information?</p>
            <p className="text-sm mb-4">The correct URL is <span className="font-mono text-purple">/airports-airlines</span></p>
            <Button 
              onClick={() => navigate("/airports-airlines")}
              className="inline-flex items-center px-4 py-2 bg-purple hover:bg-purple/80 text-white rounded-md transition-colors w-full sm:w-auto"
            >
              <Building className="h-4 w-4 mr-2" />
              Go to Airports & Airlines
            </Button>
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={() => navigate(-1)}
            variant="outline"
            className="inline-flex items-center justify-center bg-gray-dark/50 border-gray-dark text-white hover:bg-purple/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
          
          <Button 
            onClick={() => navigate("/")}
            className="inline-flex items-center justify-center bg-[#8B0000] hover:bg-[#A80000] text-white"
          >
            <Home className="h-4 w-4 mr-2" />
            Return to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
