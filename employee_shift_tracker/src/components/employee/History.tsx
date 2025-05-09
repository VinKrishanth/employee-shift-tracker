import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import HistoryDataTable from '@/components/HistoryDataTable';
import { useToast } from "@/hooks/use-toast";
import { CalendarDays, FilterIcon } from "lucide-react";

type TimeFilter = 'today' | 'yesterday' | 'week' | 'month' | 'all';

const History: React.FC = () => {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');
  const { toast } = useToast();
  const handleFilterChange = (filter: TimeFilter) => {
    setTimeFilter(filter);
    toast({
      title: "Filter Applied",
      description: `Showing data for ${filter}`,
    });
  };

  return (
    <div className="flex flex-col px-4">
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">History</h1>
          <p className="text-gray-600">View and filter your activity history</p>
        </div>

        <div className="flex flex-wrap gap-3 mb-6 items-center">
          <div className="flex items-center gap-2 mr-2">
            <FilterIcon className="h-4 w-4" />
            <span className="font-medium">Filter:</span>
          </div>
          <Button 
            variant={timeFilter === 'today' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => handleFilterChange('today')}
          >
            Today
          </Button>
          <Button 
            variant={timeFilter === 'yesterday' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => handleFilterChange('yesterday')}
          >
            Yesterday
          </Button>
          <Button 
            variant={timeFilter === 'week' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => handleFilterChange('week')}
          >
            This Week
          </Button>
          <Button 
            variant={timeFilter === 'month' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => handleFilterChange('month')}
          >
            This Month
          </Button>
          <Button 
            variant={timeFilter === 'all' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => handleFilterChange('all')}
            className="ml-auto"
          >
            <CalendarDays className="h-4 w-4 mr-1" />
            All Time
          </Button>
        </div>

        {/* Data Table */}
        <div className="mt-4">
          <HistoryDataTable timeFilter={timeFilter} />
        </div>
      </main>
    </div>
  );
};

export default History;