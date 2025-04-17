
import { CACHE_DURATION } from './shared/apiUtils';

interface Currency {
  id: string;
  symbol: string;
  name: string;
  type: 'fiat' | 'crypto';
}

// Cache for currency data
const CURRENCY_CACHE_KEY = "currency_list_cache";
const RATES_CACHE_KEY_PREFIX = "currency_rate_";
const CURRENCY_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const RATE_CACHE_DURATION = 60 * 1000; // 1 minute

// Function to fetch all available currencies from CoinGecko
export async function fetchCurrencies(): Promise<Currency[]> {
  // Check cache first
  const cachedData = localStorage.getItem(CURRENCY_CACHE_KEY);
  
  if (cachedData) {
    try {
      const { data, timestamp } = JSON.parse(cachedData);
      const cacheAge = Date.now() - timestamp;
      
      // Use cache if it's not expired
      if (cacheAge < CURRENCY_CACHE_DURATION) {
        console.log('Using cached currency data');
        return data;
      }
    } catch (e) {
      console.error("Cache parsing error:", e);
      // Cache is corrupted, continue to fetch fresh data
    }
  }
  
  console.log('Fetching fresh currency data from CoinGecko');
  
  try {
    // Fetch cryptocurrencies
    const cryptoResponse = await fetch('https://api.coingecko.com/api/v3/coins/list?include_platform=false');
    
    if (!cryptoResponse.ok) {
      throw new Error(`CoinGecko API request failed with status ${cryptoResponse.status}`);
    }
    
    const cryptoData = await cryptoResponse.json();
    
    // Fetch supported VS currencies (fiat)
    const fiatResponse = await fetch('https://api.coingecko.com/api/v3/simple/supported_vs_currencies');
    
    if (!fiatResponse.ok) {
      throw new Error(`CoinGecko API request failed with status ${fiatResponse.status}`);
    }
    
    const fiatData = await fiatResponse.json();
    
    // Prepare the combined currency data
    // Limit to top 100 cryptos by market cap plus main fiats to avoid overwhelming the UI
    const cryptoCurrencies: Currency[] = cryptoData
      .slice(0, 100) // Limit to first 100 for better performance
      .map((crypto: any) => ({
        id: crypto.id,
        symbol: crypto.symbol,
        name: crypto.name,
        type: 'crypto'
      }));
    
    const fiatCurrencies: Currency[] = fiatData
      .map((fiat: string) => ({
        id: fiat,
        symbol: fiat,
        name: getFiatCurrencyName(fiat),
        type: 'fiat'
      }));
    
    const allCurrencies = [
      ...cryptoCurrencies,
      ...fiatCurrencies
    ];
    
    // Cache the data
    localStorage.setItem(CURRENCY_CACHE_KEY, JSON.stringify({
      data: allCurrencies,
      timestamp: Date.now()
    }));
    
    return allCurrencies;
  } catch (error) {
    console.error("Error fetching currencies:", error);
    throw error;
  }
}

// Function to convert amount from one currency to another
export async function convertCurrency(
  fromCurrency: string, 
  toCurrency: string, 
  amount: number
): Promise<number> {
  try {
    const cacheKey = `${RATES_CACHE_KEY_PREFIX}${fromCurrency}_${toCurrency}`;
    const cachedRate = localStorage.getItem(cacheKey);
    
    let rate: number;
    
    if (cachedRate) {
      try {
        const { data, timestamp } = JSON.parse(cachedRate);
        const cacheAge = Date.now() - timestamp;
        
        // Use cache if it's not expired
        if (cacheAge < RATE_CACHE_DURATION) {
          console.log(`Using cached rate for ${fromCurrency} to ${toCurrency}`);
          rate = data;
        } else {
          rate = await fetchExchangeRate(fromCurrency, toCurrency);
          cacheRate(fromCurrency, toCurrency, rate);
        }
      } catch (e) {
        console.error("Rate cache parsing error:", e);
        rate = await fetchExchangeRate(fromCurrency, toCurrency);
        cacheRate(fromCurrency, toCurrency, rate);
      }
    } else {
      rate = await fetchExchangeRate(fromCurrency, toCurrency);
      cacheRate(fromCurrency, toCurrency, rate);
    }
    
    return amount * rate;
  } catch (error) {
    console.error("Error converting currency:", error);
    throw error;
  }
}

// Helper function to fetch the exchange rate
async function fetchExchangeRate(fromCurrency: string, toCurrency: string): Promise<number> {
  console.log(`Fetching exchange rate for ${fromCurrency} to ${toCurrency}`);
  
  try {
    let response;
    
    // If converting crypto to crypto or fiat to crypto, we need a different endpoint
    if (fromCurrency === toCurrency) {
      return 1; // Same currency, rate is 1:1
    }
    
    // Use different endpoints based on the currency types
    response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${fromCurrency}&vs_currencies=${toCurrency}`
    );
    
    if (!response.ok) {
      throw new Error(`CoinGecko API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    
    // Check if the data contains the rate we need
    if (data[fromCurrency] && data[fromCurrency][toCurrency]) {
      return data[fromCurrency][toCurrency];
    }
    
    // If we couldn't get the direct rate, we might need to use a two-step conversion via USD
    // This is a simplified fallback - in a real app, we might use a more sophisticated approach
    const usdResponse = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${fromCurrency}&vs_currencies=usd`
    );
    
    if (!usdResponse.ok) {
      throw new Error(`CoinGecko API request failed with status ${usdResponse.status}`);
    }
    
    const usdData = await usdResponse.json();
    
    const toUsdResponse = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=usd&vs_currencies=${toCurrency}`
    );
    
    if (!toUsdResponse.ok) {
      throw new Error(`CoinGecko API request failed with status ${toUsdResponse.status}`);
    }
    
    const toUsdData = await toUsdResponse.json();
    
    // Calculate the rate using USD as an intermediary
    if (usdData[fromCurrency] && usdData[fromCurrency].usd && 
        toUsdData.usd && toUsdData.usd[toCurrency]) {
      return usdData[fromCurrency].usd * toUsdData.usd[toCurrency];
    }
    
    throw new Error(`Could not get exchange rate for ${fromCurrency} to ${toCurrency}`);
  } catch (error) {
    console.error("Error fetching exchange rate:", error);
    throw error;
  }
}

// Helper to cache exchange rates
function cacheRate(fromCurrency: string, toCurrency: string, rate: number): void {
  const cacheKey = `${RATES_CACHE_KEY_PREFIX}${fromCurrency}_${toCurrency}`;
  
  localStorage.setItem(cacheKey, JSON.stringify({
    data: rate,
    timestamp: Date.now()
  }));
}

// Helper to get fiat currency names
function getFiatCurrencyName(code: string): string {
  const currencies: Record<string, string> = {
    usd: "US Dollar",
    eur: "Euro",
    jpy: "Japanese Yen",
    gbp: "British Pound",
    aud: "Australian Dollar",
    cad: "Canadian Dollar",
    chf: "Swiss Franc",
    cny: "Chinese Yuan",
    inr: "Indian Rupee",
    try: "Turkish Lira",
    rub: "Russian Ruble",
    brl: "Brazilian Real",
    krw: "South Korean Won",
    idr: "Indonesian Rupiah",
    sgd: "Singapore Dollar",
    myr: "Malaysian Ringgit",
    thb: "Thai Baht",
    php: "Philippine Peso",
    mxn: "Mexican Peso",
    zar: "South African Rand",
    hkd: "Hong Kong Dollar",
    dkk: "Danish Krone",
    pln: "Polish Złoty",
    // Add more currencies as needed
  };
  
  return currencies[code.toLowerCase()] || code.toUpperCase();
}
