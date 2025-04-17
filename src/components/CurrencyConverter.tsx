import React, { useState, useEffect } from 'react';
import { fetchCurrencies, convertCurrency } from '@/services/currencyService';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Coins, ArrowRightLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

interface Currency {
  id: string;
  symbol: string;
  name: string;
  type: 'fiat' | 'crypto';
}

interface ConversionFormValues {
  amount: string;
  fromCurrency: string;
  toCurrency: string;
}

const CurrencyConverter = () => {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [convertedValue, setConvertedValue] = useState<number | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [convertedAnimation, setConvertedAnimation] = useState(false);

  const form = useForm<ConversionFormValues>({
    defaultValues: {
      amount: "1",
      fromCurrency: "bitcoin",
      toCurrency: "usd"
    }
  });

  const { watch, setValue } = form;
  const formValues = watch();

  useEffect(() => {
    const loadCurrencies = async () => {
      try {
        setIsLoading(true);
        const data = await fetchCurrencies();
        setCurrencies(data);
      } catch (error) {
        toast.error("Could not load currencies. Please try again later.");
        console.error("Error loading currencies:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCurrencies();
  }, []);

  useEffect(() => {
    const { amount, fromCurrency, toCurrency } = formValues;
    
    if (!amount || !fromCurrency || !toCurrency) return;
    
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) return;

    const timer = setTimeout(async () => {
      try {
        setIsConverting(true);
        const result = await convertCurrency(fromCurrency, toCurrency, parsedAmount);
        setConvertedValue(result);
        setConvertedAnimation(true);
        setTimeout(() => setConvertedAnimation(false), 600);
      } catch (error) {
        toast.error("Conversion failed. Please try again.");
        console.error("Error converting currency:", error);
      } finally {
        setIsConverting(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [formValues]);

  const handleSwapCurrencies = () => {
    const { fromCurrency, toCurrency } = formValues;
    setValue("fromCurrency", toCurrency);
    setValue("toCurrency", fromCurrency);
  };

  const getCurrencyLabel = (currencyId: string) => {
    const currency = currencies.find(c => c.id === currencyId);
    if (!currency) return currencyId.toUpperCase();
    return `${currency.symbol.toUpperCase()} - ${currency.name}`;
  };

  const groupedCurrencies = {
    crypto: currencies.filter(c => c.type === 'crypto'),
    fiat: currencies.filter(c => c.type === 'fiat')
  };

  return (
    <section className="py-8 w-full">
      <div className="container px-4 mx-auto">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold font-space mb-3 mt-4">
              Convert Your <span className="text-[#8B0000] animate-text-glow">Currency</span> Instantly
            </h2>
          </div>

          <div className="bg-[#1A1A1A] rounded-[12px] border-2 border-[#8B0000] shadow-lg p-5 transition-all hover:shadow-[0_0_15px_rgba(139,0,0,0.3)]">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center p-8">
                <Loader2 className="h-10 w-10 text-[#8B0000] animate-spin mb-4" />
                <p className="text-white">Loading currency data...</p>
              </div>
            ) : (
              <Form {...form}>
                <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-4 items-center">
                  <div>
                    <FormField
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Amount</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                {...field}
                                type="number"
                                min="0"
                                step="0.01"
                                placeholder="Enter amount"
                                className="bg-gray-dark border-gray-dark text-white"
                              />
                              <Coins className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#8B0000] h-4 w-4" />
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="hidden md:flex justify-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleSwapCurrencies}
                      className="h-10 w-10 rounded-full bg-[#8B0000]/20 hover:bg-[#8B0000]/30 hover:text-white text-white mt-6"
                    >
                      <ArrowRightLeft className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="md:hidden flex justify-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleSwapCurrencies}
                      className="h-10 w-10 rounded-full bg-[#8B0000]/20 hover:bg-[#8B0000]/30 hover:text-white text-white"
                    >
                      <ArrowRightLeft className="h-4 w-4 rotate-90" />
                    </Button>
                  </div>

                  <div>
                    <FormField
                      name="fromCurrency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">From</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="bg-gray-dark border-gray-dark text-white">
                                <SelectValue placeholder="Select currency" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-gray-dark border-gray-dark text-white max-h-[300px]">
                              <div className="p-2 font-semibold text-[#8B0000]">Cryptocurrencies</div>
                              {groupedCurrencies.crypto.map((currency) => (
                                <SelectItem 
                                  key={currency.id} 
                                  value={currency.id}
                                  className="hover:bg-[#8B0000]/20 focus:bg-[#8B0000]/20"
                                >
                                  {currency.symbol.toUpperCase()} - {currency.name}
                                </SelectItem>
                              ))}
                              <div className="p-2 font-semibold text-[#8B0000]">Fiat Currencies</div>
                              {groupedCurrencies.fiat.map((currency) => (
                                <SelectItem 
                                  key={currency.id} 
                                  value={currency.id}
                                  className="hover:bg-[#8B0000]/20 focus:bg-[#8B0000]/20"
                                >
                                  {currency.symbol.toUpperCase()} - {currency.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="md:hidden"></div>

                  <div>
                    <FormField
                      name="toCurrency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">To</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="bg-gray-dark border-gray-dark text-white">
                                <SelectValue placeholder="Select currency" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-gray-dark border-gray-dark text-white max-h-[300px]">
                              <div className="p-2 font-semibold text-[#8B0000]">Cryptocurrencies</div>
                              {groupedCurrencies.crypto.map((currency) => (
                                <SelectItem 
                                  key={currency.id} 
                                  value={currency.id}
                                  className="hover:bg-[#8B0000]/20 focus:bg-[#8B0000]/20"
                                >
                                  {currency.symbol.toUpperCase()} - {currency.name}
                                </SelectItem>
                              ))}
                              <div className="p-2 font-semibold text-[#8B0000]">Fiat Currencies</div>
                              {groupedCurrencies.fiat.map((currency) => (
                                <SelectItem 
                                  key={currency.id} 
                                  value={currency.id}
                                  className="hover:bg-[#8B0000]/20 focus:bg-[#8B0000]/20"
                                >
                                  {currency.symbol.toUpperCase()} - {currency.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="mt-8 p-4 bg-[#8B0000]/10 rounded-md border border-[#8B0000]/20">
                  <div className="text-center">
                    <h3 className="text-white text-lg mb-2">Conversion Result</h3>
                    <div className="flex justify-center items-center h-16">
                      {isConverting ? (
                        <Loader2 className="h-6 w-6 text-[#8B0000] animate-spin" />
                      ) : (
                        <div 
                          className={cn(
                            "text-2xl font-bold text-white transition-all",
                            convertedAnimation && "animate-fade-in"
                          )}
                        >
                          {convertedValue !== null ? (
                            <>
                              <span className="text-sm text-gray-light mr-2">
                                {formValues.amount} {getCurrencyLabel(formValues.fromCurrency)} =
                              </span>
                              <span className="text-[#8B0000]">
                                {convertedValue.toLocaleString(undefined, { 
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 8 
                                })}
                              </span>
                              <span className="text-white ml-2">
                                {getCurrencyLabel(formValues.toCurrency)}
                              </span>
                            </>
                          ) : (
                            <span className="text-gray-light">Enter values to convert</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-4 text-center text-xs text-gray-light">
                  <p>Currency data refreshed every 60 seconds</p>
                </div>
              </Form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CurrencyConverter;
