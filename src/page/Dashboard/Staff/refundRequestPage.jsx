import React, { useState } from 'react';
import { useGetRefundRequestsQuery } from '@/redux/api/requestApi';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  RefreshCcw, 
  ChevronLeft, 
  ChevronRight,
  Eye,
  Phone,
  Mail
} from 'lucide-react';
import { format } from 'date-fns';

export default function RefundRequestsList() {
  const navigate = useNavigate();
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [status, setStatus] = useState('');

  const { data, isLoading, isFetching, refetch } = useGetRefundRequestsQuery({
    pageIndex,
    pageSize,
    search,
    status,
  });

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setPageIndex(1);
  };

  const handleStatusChange = (value) => {
    if (value === 'All') {
      setStatus('');
    } else {
      setStatus(value);
    }
    setPageIndex(1);
  };

  const handlePageChange = (newPage) => {
    setPageIndex(newPage);
  };

  const handleViewDetail = (requestId) => {
    navigate(`/dashboard/staff/refund-request/${requestId}`);
  };

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return format(new Date(dateString), 'MMM d, yyyy HH:mm');
  };

  // Format currency function
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <CardTitle className="text-xl">Refund Requests</CardTitle>
            <CardDescription>
              View and manage customer refund requests
            </CardDescription>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex gap-2">
              <Input
                placeholder="Search by customer..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full sm:w-[200px]"
              />
              <Button type="submit" size="icon" variant="ghost">
                <Search className="h-4 w-4" />
              </Button>
            </form>

            {/* Status Filter */}
            <Select value={status} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>

            {/* Refresh Button */}
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => refetch()}
              disabled={isLoading || isFetching}
            >
              <RefreshCcw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : data?.data?.items?.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No refund requests found
            {search && ` matching "${search}"`}
            {status && ` with status "${status}"`}
          </div>
        ) : (
          <>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Request ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Booking ID</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Resolution Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.data?.items.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">{request.id.substring(0, 8)}...</TableCell>
                      <TableCell>{request.customerName}</TableCell>
                      <TableCell>{request.bookingId.substring(0, 8)}...</TableCell>
                      <TableCell>{formatCurrency(request.totalPrice)}</TableCell>
                      <TableCell className="max-w-[150px] truncate">{request.reason}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusBadgeClass(request.status)}`}>
                          {request.status}
                        </span>
                      </TableCell>
                      <TableCell>{request.resolutionDate ? formatDate(request.resolutionDate) : 'Pending'}</TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          onClick={() => handleViewDetail(request.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {data?.data?.totalPages > 1 && (
              <div className="flex justify-between items-center mt-4">
                <div className="text-sm text-muted-foreground">
                  Showing {(pageIndex - 1) * pageSize + 1} to {Math.min(pageIndex * pageSize, data.data.totalCount)} of {data.data.totalCount} requests
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePageChange(pageIndex - 1)}
                    disabled={!data.data.hasPrevious}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm">
                    Page {pageIndex} of {data.data.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePageChange(pageIndex + 1)}
                    disabled={!data.data.hasNext}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}