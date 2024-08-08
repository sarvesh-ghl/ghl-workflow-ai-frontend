"use client";

import React from 'react'
import { Document, columns } from "./documents/columns"
import { DataTable } from "./documents/data-table"
import { Input } from '@/components/ui/input'
import { searchDocuments } from '@/lib/elasticsearch';
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from '@/components/ui/button';
import { RefreshCcwIcon } from 'lucide-react';

export default function Search() {
  const [query, setQuery] = React.useState("")
  const [data, setData] = React.useState<Document[]>([])
  const [loading, setLoading] = React.useState(true)
    
    console.log("data",data)
    React.useEffect(() => {
      const fetchData = setTimeout(async () => {
        setLoading(true)
        const response = await searchDocuments(query)
        setData(response)
        setLoading(false)
      }, 2000)
  
      return () => clearTimeout(fetchData)
    }, [query])

    async function handleRefresh() {
      // refresh data while preserving the query
        setLoading(true)
        const response = await searchDocuments(query)
        setData(response)
        setLoading(false)
    }

    return (
      <div>
      <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Search Documents"
          value={query}
          onChange={(event) =>
            setQuery(event.target.value)
          }
          className="max-w-sm"
        />
        {/* refresh button */}
        <Button
          onClick={handleRefresh}
          className="ml-2"
        >
          <RefreshCcwIcon className="h-5 w-5" />
        </Button>
      </div>
      {loading ?
      <div className="flex flex-col space-y-5">
        <div className="flex items-center justify-between">
      <Skeleton className="h-5 w-[250px] rounded-md" />
      <Skeleton className="h-5 w-[250px] rounded-md" />
      <Skeleton className="h-5 w-[400px] rounded-md" />
      <Skeleton className="h-5 w-[400px] rounded-md" />
      </div>
      <div className="space-y-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="flex items-center justify-between">
        <Skeleton className="h-4 w-[250px] rounded-md" />
        <Skeleton className="h-4 w-[250px] rounded-md" />
        <Skeleton className="h-4 w-[400px] rounded-md" />
        <Skeleton className="h-4 w-[400px] rounded-md" />
        </div>
        ))}
      </div>
    </div>
        :
        <DataTable columns={columns} data={data} />
      }
      </div>
      </div>
    )
}



