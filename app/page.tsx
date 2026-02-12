'use client';

import { useState, useMemo } from 'react';
import { creators, filterCreators, sortCreators, calculateMetrics, SortConfig } from '@/lib/creators';
import { SummaryCards } from '@/components/features/dashboard/summaryCards';
import { FilterBar } from '@/components/features/dashboard/filterBar';
import { CreatorTable } from '@/components/features/dashboard/creatorTable';
import { LayoutDashboard } from "lucide-react";

export default function DashboardPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeOnly, setActiveOnly] = useState(false);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: 'asc',
  });

  // 1. Filter
  const filteredCreators = useMemo(() => {
    return filterCreators(creators, searchTerm, activeOnly);
  }, [searchTerm, activeOnly]);

  // 2. Sort
  const sortedCreators = useMemo(() => {
    return sortCreators(filteredCreators, sortConfig);
  }, [filteredCreators, sortConfig]);

  // 3. Metrics (Calculated on current view)
  const metrics = useMemo(() => {
    return calculateMetrics(filteredCreators);
  }, [filteredCreators]);

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-8 space-y-8 font-sans">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
            <LayoutDashboard className="h-8 w-8 text-emerald-600" />
            Dashboard
          </h1>
          <p className="text-slate-500">
            Manage your creators and view performance metrics.
          </p>
        </div>
       
      </div>

      {/* Metrics Cards */}
      <section>
        <SummaryCards metrics={metrics} />
      </section>

      {/* Main Content Area */}
      <section className="space-y-4">
        {/* Filters */}
        <FilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          showActiveOnly={activeOnly}
          onActiveChange={setActiveOnly}
        />

        {/* Table */}
        <CreatorTable
          creators={sortedCreators}
          sortConfig={sortConfig}
          onSortChange={setSortConfig}
        />

        {/* Footer / Caption */}
        <div className="text-xs text-center text-slate-400 mt-8">
          Showing {sortedCreators.length} of {creators.length} total records
        </div>
      </section>
    </div>
  );
}
