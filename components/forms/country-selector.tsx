'use client';

import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import axios from 'axios';
import { Check, ChevronsUpDown } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';

const RenderCountryFlag: React.FC<{ country: Country | undefined }> = ({ country }) => {
  if (!country?.flags.svg) return null;
  return (
    <figure className="m-0 relative w-5 h-3">
      <Image
        src={country?.flags.svg}
        alt={`${country?.name.common} flag`}
        className="object-fill"
        loading='lazy'
        placeholder='blur'
        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
        fill
      />
    </figure>
  );
}

export function CountrySelector({onSelect, isValid = true}: {onSelect: (value: string) => void, isValid?: boolean}) {
  const [open, setOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if countries are already in local storage
    // If so, use them instead of fetching from API
    const countryListCache = localStorage.getItem('countries');
    const countryList =
      countryListCache && countryListCache !== null ? (JSON.parse(countryListCache) as Country[]) : [];
    if (countryList.length > 0) {
      setCountries(countryList);
      setLoading(false);
      return;
    }

    const fetchCountries = async () => {
      try {
        const response = await axios.get<Country[]>('https://restcountries.com/v3.1/all?fields=name,flags');
        const sortedCountries = response.data.sort((a, b) => a.name.common.localeCompare(b.name.common));

        //save to local storage
        localStorage.setItem('countries', JSON.stringify(sortedCountries));
        setCountries(sortedCountries);
      } catch (error) {
        console.error('Error fetching countries:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  const filteredCountry: Country | undefined = useMemo(() => {
    return countries.find((country) => country.name.common === selectedCountry);
  }, [countries, selectedCountry]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button type='button' variant="outline" role="combobox" aria-expanded={open} className={cn({
          'w-full justify-between': true,
          'cursor-not-allowed': loading,
          'border-destructive': !isValid,
        })}>
          {loading
            ? 'Loading countries...'
            : selectedCountry && filteredCountry?.name.common
              ? <div className='flex items-center gap-x-2'><RenderCountryFlag country={filteredCountry} /> {filteredCountry?.name.common}</div>
              : <span className='text-muted-foreground font-normal'>Country of Citizenship</span>}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Country of Citizenship" />
          <CommandList>
            <CommandEmpty>No country found.</CommandEmpty>
            <CommandGroup>
              {countries.map((country) => (
                <CommandItem
                  key={country.name.common}
                  value={country.name.common}
                  onSelect={(currentValue) => {
                    setSelectedCountry(currentValue);
                    onSelect(currentValue);
                    setOpen(false);
                  }}>
                  <div className="flex items-center gap-x-2">
                    <div className='flex items-center gap-x-2'><RenderCountryFlag country={country} /> {country?.name.common}</div>
                    <Check className={cn('h-4 w-4', selectedCountry === country.name.common ? 'opacity-100' : 'opacity-0')} />
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
