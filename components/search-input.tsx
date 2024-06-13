"use client"
import React, { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import { useDebounce } from 'use-debounce';
import qs from 'query-string'
import { Input } from './ui/input'
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export const SearchInput = () => {
    const [value, setvalue] = useState("")    
  const [debouncedValue] = useDebounce(value, 500);

  const searchParams=useSearchParams();
  const router=useRouter()
  const pathname=usePathname()

  const currentCategoryId=searchParams.get("categoryId")

  useEffect(()=>{
    const url=qs.stringifyUrl({
        url:pathname,
        query:{
            categoryId:currentCategoryId,
            title:debouncedValue
        }
    },{skipEmptyString:true,skipNull:true})
    router.push(url)

  },[debouncedValue,currentCategoryId,router,pathname])

  return (
    <div className="relative">
        <Search className="h-4 w-4 absolute top-3 left-3 text-slate-600"/>
        <Input
        className="w-full md:w-[300px] pl-9 rounded-full bg-slate-100 focus-visible:ring-slate-200"
        placeholder='Search for a course'
        value={value}
        onChange={(e)=>setvalue(e.target.value)}
        />
    </div>
  )
}
