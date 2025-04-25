
// Interface for translation dictionaries
export interface TranslationDictionary {
  [key: string]: {
    [key: string]: string;
  };
}

// Base translations dictionary
export const translations: TranslationDictionary = {
  en: {
    "home.title": "Real-Time Flight Services",
    "home.subtitle": "Track flights, check schedules, monitor delays, and stay updated with global weather forecasts - all in one place.",
    "nav.home": "Home",
    "nav.flightSchedule": "Flight Schedule",
    "nav.liveTracker": "Live Tracker",
    "nav.flightStatus": "Flight Status",
    "nav.weather": "Weather",
    "nav.worldClock": "World Clock",
    "nav.contact": "Contact",
    "common.loading": "Loading...",
    "common.error": "An error occurred",
    "common.try-again": "Try Again",
    "flight.status": "Flight Status",
    "flight.schedule": "Flight Schedule",
    "flight.tracker": "Flight Tracker",
    "weather.title": "Global Weather",
    "contact.title": "Contact Us",
    "contact.submit": "Submit",
    // Add more translations as needed
  },
  es: {
    "home.title": "Servicios de Vuelos en Tiempo Real",
    "home.subtitle": "Rastree vuelos, consulte horarios, controle retrasos y manténgase actualizado con pronósticos meteorológicos globales, todo en un solo lugar.",
    "nav.home": "Inicio",
    "nav.flightSchedule": "Horario de Vuelos",
    "nav.liveTracker": "Rastreador en Vivo",
    "nav.flightStatus": "Estado del Vuelo",
    "nav.weather": "Clima",
    "nav.worldClock": "Reloj Mundial",
    "nav.contact": "Contacto",
    "common.loading": "Cargando...",
    "common.error": "Ocurrió un error",
    "common.try-again": "Intentar de nuevo",
    "flight.status": "Estado del Vuelo",
    "flight.schedule": "Horario de Vuelos",
    "flight.tracker": "Rastreador de Vuelos",
    "weather.title": "Clima Global",
    "contact.title": "Contáctenos",
    "contact.submit": "Enviar",
  },
  // Add more languages as needed
};

export const getCountryLanguage = (countryCode: string): string => {
  // Map country codes to language codes
  const countryToLanguage: { [key: string]: string } = {
    'es': 'es',
    'mx': 'es',
    'ar': 'es',
    'co': 'es',
    'pe': 'es',
    'cl': 'es',
    // Add more country to language mappings as needed
    'en': 'en',
    'us': 'en',
    'gb': 'en',
    'au': 'en',
    'ca': 'en',
  };

  return countryToLanguage[countryCode.toLowerCase()] || 'en';
};
