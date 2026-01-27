"use client"

import { Card } from "@/components/ui/card"

export default function CoursesLoading() {
  return (
    <div className="space-y-6">
      {/* Header Loading */}
      <div>
        <div className="h-8 bg-muted rounded-md mb-2 w-48 animate-pulse" />
        <div className="h-4 bg-muted rounded-md w-96 animate-pulse" />
      </div>

      {/* Search and Filter Loading */}
      <div className="flex gap-4 flex-wrap">
        <div className="h-10 bg-muted rounded-md flex-1 min-w-xs animate-pulse" />
        <div className="h-10 bg-muted rounded-md w-24 animate-pulse" />
      </div>

      {/* Courses Grid Loading */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="overflow-hidden animate-pulse">
            <div className="bg-muted h-24" />
            <div className="p-6 space-y-4">
              <div className="h-5 bg-muted rounded-md w-40" />
              <div className="h-3 bg-muted rounded-md w-32" />
              <div className="h-2 bg-muted rounded-md w-full" />
              <div className="flex gap-2">
                <div className="h-20 bg-muted rounded-md flex-1" />
                <div className="h-20 bg-muted rounded-md flex-1" />
              </div>
              <div className="h-10 bg-muted rounded-md w-full" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
