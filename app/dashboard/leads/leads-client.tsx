'use client';

import { DataTable } from '@/components/ui/data-table';
import { Input } from '@/components/ui/input';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLeads } from '@/hooks/use-leads';
import { Lead } from '@/types/Lead';
import { ColumnDef } from '@tanstack/react-table';
import { Loader2, SearchIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

interface LeadsClientProps {
  columns: ColumnDef<Lead>[];
}

export default function LeadsClient({columns}: LeadsClientProps) {
  const {leads, isLoading, error} = useLeads();
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const leadsPerPage = 10;
  const totalPages = Math.ceil(filteredLeads.length / leadsPerPage);
  const indexOfLastLead = currentPage * leadsPerPage;
  const indexOfFirstLead = indexOfLastLead - leadsPerPage;
  const currentLeads = filteredLeads.slice(indexOfFirstLead, indexOfLastLead);

  // Filter leads based on status and search query
  useEffect(() => {
    let result = [...leads];

    // Filter by status if not 'all'
    if (statusFilter !== 'all') {
      result = result.filter((lead) => lead.status === statusFilter);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (lead) =>
          lead.firstName.toLowerCase().includes(query) ||
          lead.lastName.toLowerCase().includes(query) ||
          lead.email.toLowerCase().includes(query)
      );
    }

    setFilteredLeads(result);
    // Reset to first page when filters change
    setCurrentPage(1);
  }, [leads, statusFilter, searchQuery]);

  useEffect(() => {
    // If no leads exist in storage, add some mock data for demonstration
    if (!isLoading && leads.length === 0) {
      const mockLeads = [
        {
          id: '1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          linkedInProfile: 'https://linkedin.com/in/johndoe',
          visasOfInterest: ['H-1B', 'O-1A'],
          resumeUrl: '/uploads/resume-1.pdf',
          additionalInfo: 'Looking for opportunities in tech',
          status: 'PENDING',
          country: 'Brazil',
          createdAt: '2025-05-10T12:00:00Z',
          updatedAt: '2025-05-10T12:00:00Z',
        },
        {
          id: '2',
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane.smith@example.com',
          linkedInProfile: 'https://linkedin.com/in/janesmith',
          visasOfInterest: ['EB-2', 'EB-3'],
          resumeUrl: '/uploads/resume-2.pdf',
          additionalInfo: 'Experience in healthcare',
          status: 'REACHED_OUT',
          country: 'Brazil',
          createdAt: '2025-05-09T10:30:00Z',
          updatedAt: '2025-05-11T14:45:00Z',
        },
        {
          id: '3',
          firstName: 'Michael',
          lastName: 'Johnson',
          email: 'michael.johnson@example.com',
          linkedInProfile: 'https://linkedin.com/in/michaeljohnson',
          visasOfInterest: ['L-1A', 'L-1B'],
          resumeUrl: '/uploads/resume-3.pdf',
          additionalInfo: 'Senior manager with 10+ years of experience',
          status: 'REACHED_OUT',
          country: 'Canada',
          createdAt: '2025-05-15T09:15:00Z',
          updatedAt: '2025-05-15T15:30:00Z',
        },
        {
          id: '4',
          firstName: 'Sarah',
          lastName: 'Williams',
          email: 'sarah.williams@example.com',
          linkedInProfile: 'https://linkedin.com/in/sarahwilliams',
          visasOfInterest: ['H-1B', 'O-1A'],
          resumeUrl: '/uploads/resume-4.pdf',
          additionalInfo: 'Recent graduate with internship experience',
          status: 'PENDING',
          country: 'India',
          createdAt: '2025-05-14T16:45:00Z',
          updatedAt: '2025-05-15T10:20:00Z',
        },
      ];

      // Save mock data to localStorage directly
      localStorage.setItem('leads', JSON.stringify(mockLeads));

      // Reload the page to reflect changes
      window.location.reload();
    }
  }, [isLoading, leads]);

  if (isLoading) {
    return <div className="py-8 text-center">
      <Loader2 className="animate-spin size-6 text-gray-500 mx-auto" />
    </div>;
  }

  if (error) {
    return <div className="py-8 text-center text-red-500">Error: {error}</div>;
  }

  if (leads.length === 0) {
    return (
      <div className="py-16 text-center">
        <h3 className="text-lg font-medium mb-2">No leads found</h3>
        <p className="text-gray-500 mb-6">Start by adding a new lead through the assessment form.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-center flex-wrap md:flex-nowrap">
        <div
          className='relative w-full md:w-auto'>
          <Input
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md pl-8"
          />
          <SearchIcon className="h-4 w-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px] flex-1 md:flex-none">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="REACHED_OUT">Reached Out</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="relative w-full overflow-auto grid grid-cols-1">
        <DataTable columns={columns} data={currentLeads} />
      </div>

      {totalPages > 1 && (
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                aria-disabled={currentPage === 1}
                className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>

            {Array.from({length: totalPages}).map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink onClick={() => setCurrentPage(i + 1)} isActive={currentPage === i + 1}>
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                aria-disabled={currentPage === totalPages}
                className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
