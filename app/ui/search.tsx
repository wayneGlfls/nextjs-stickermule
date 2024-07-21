'use client';
import { useDebouncedCallback } from 'use-debounce';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useSearchParams,usePathname, useRouter } from 'next/navigation';
import { useState } from "react";


export default function Search({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [score, setScore] = useState(0);

  const handleSearch = useDebouncedCallback(function temp(term: string) {
    console.log(`search term is  ${term}`);
    
    let params;
    if(searchParams){
      params = new URLSearchParams(searchParams);
    }else{
      params = new Map();;
    }


    if (term) {
      setScore(score + 1);
      params.set('query', term);
    } else {
      params.delete('query');
    }
    replace(`${pathname}?${params.toString()}`);
  },300);

  function fetchData() {

  };


  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        placeholder={placeholder}
        onChange={(e) => {
          handleSearch(e.target.value);
          //debounce(handleSearchNodebounce(e.target.value),300);
        }}
        defaultValue={searchParams ? searchParams.get('query')?.toString(): ''}
      />
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    </div>
  );
}
