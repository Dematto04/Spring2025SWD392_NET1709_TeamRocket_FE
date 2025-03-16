import { useState } from "react";
import { useGetUsersQuery } from "@/redux/api/adminApi";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import debounce from "lodash/debounce";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function UserManagement() {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    includeStaff: true,
    includeCustomers: true,
    includeHousekeepers: true,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Using the query hook with proper parameters
  const { data: response, isLoading, isFetching } = useGetUsersQuery({
    search: search || "",
    includeStaff: filters.includeStaff,
    includeCustomers: filters.includeCustomers,
    includeHousekeepers: filters.includeHousekeepers,
    pageIndex: currentPage,
    pageSize,
  });

  const debouncedSearch = debounce((value) => {
    setSearch(value);
    setCurrentPage(1);
  }, 500);

  const handleFilterChange = (filterKey) => {
    setFilters((prev) => ({
      ...prev,
      [filterKey]: !prev[filterKey],
    }));
    setCurrentPage(1);
  };

  // Early return for loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Get the users data from the response
  const users = response?.data?.items || [];
  const totalPages = response?.data?.totalPages || 0;
  const hasNext = response?.data?.hasNext || false;
  const hasPrevious = response?.data?.hasPrevious || false;

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">User Management</CardTitle>
          
          {/* Search and Filters Section */}
          <div className="flex flex-col gap-4 mt-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by name, email or phone..."
                className="pl-9"
                onChange={(e) => debouncedSearch(e.target.value)}
              />
            </div>

            {/* Filter Checkboxes */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="customers"
                  checked={filters.includeCustomers}
                  onCheckedChange={() => handleFilterChange("includeCustomers")}
                />
                <label htmlFor="customers">Customers</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="staff"
                  checked={filters.includeStaff}
                  onCheckedChange={() => handleFilterChange("includeStaff")}
                />
                <label htmlFor="staff">Staff</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="housekeepers"
                  checked={filters.includeHousekeepers}
                  onCheckedChange={() => handleFilterChange("includeHousekeepers")}
                />
                <label htmlFor="housekeepers">Housekeepers</label>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="relative">
            {isFetching && (
              <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-50">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            )}

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Birthday</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={user.avatar} alt={user.fullName} />
                          <AvatarFallback>
                            {user.fullName.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="font-medium">{user.fullName}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm">{user.email}</span>
                        <span className="text-sm text-muted-foreground">
                          {user.phoneNumber}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {format(new Date(user.birthday), "MMM dd, yyyy")}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.status === "IsActive"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {user.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {users.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No users found</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => p - 1)}
                  disabled={!hasPrevious}
                >
                  Previous
                </Button>
                <span className="flex items-center px-4 text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => p + 1)}
                  disabled={!hasNext}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}