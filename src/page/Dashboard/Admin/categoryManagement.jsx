import { useState } from "react";
import { useGetServiceCategoriesQuery } from "@/redux/api/adminApi";
import { Input } from "@/components/ui/input";
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
import { Search, Calendar, X } from "lucide-react";
import debounce from "lodash/debounce";
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useNavigate } from "react-router-dom";

const FALLBACK_IMAGE = "https://via.placeholder.com/100x100?text=No+Image";

export function CategoryManagement() {
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const navigate = useNavigate();

  const { data: response, isLoading, isFetching } = useGetServiceCategoriesQuery({
    search,
    pageIndex: currentPage,
    pageSize,
    ...(selectedDate && {
      day: selectedDate.getDate(),
      month: selectedDate.getMonth() + 1,
      year: selectedDate.getFullYear(),
    }),
  });
  const handleViewDetails = (categoryId) => {
    navigate(`/dashboard/admin/bookings/${categoryId}`, {
      state: { isService: false, isCategory: true }
    });
  };

  const debouncedSearch = debounce((value) => {
    setSearch(value);
    setCurrentPage(1);
  }, 500);

  const handleClearDate = () => {
    setSelectedDate(null);
  };

  const handleImageError = (e) => {
    e.target.src = FALLBACK_IMAGE;
    e.target.onerror = null;
  };

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Category Management</CardTitle>
          
          <div className="flex flex-col md:flex-row gap-4 mt-4">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search categories..."
                className="pl-9"
                onChange={(e) => debouncedSearch(e.target.value)}
              />
            </div>

            {/* Date Filter */}
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full md:w-auto">
                    <Calendar className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              
              {selectedDate && (
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={handleClearDate}
                  className="h-10 w-10"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              <div className="relative">
                {isFetching && (
                  <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-50">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                )}

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Created At</TableHead>
                      <TableHead>Updated At</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {response?.data?.items.map((category) => (
                      <TableRow key={category.categoryId}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <img
                              src={category.pictureUrl}
                              alt={category.categoryName}
                              className="h-10 w-10 rounded-md object-cover"
                              onError={handleImageError}
                              loading="lazy"
                            />
                            <div className="font-medium">
                              {category.categoryName}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {category.description || "No description"}
                        </TableCell>
                        <TableCell>
                          {format(new Date(category.createdAt), "PPP")}
                        </TableCell>
                        <TableCell>
                          {format(new Date(category.updatedAt), "PPP")}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" onClick={() => handleViewDetails(category.categoryId)}>
                            View bookings
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {response?.data?.items.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No categories found</p>
                  </div>
                )}
              </div>

              {/* Pagination */}
              {response?.data?.totalPages > 1 && (
                <div className="flex justify-center mt-6">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => p - 1)}
                      disabled={!response.data.hasPrevious}
                    >
                      Previous
                    </Button>
                    <span className="flex items-center px-4 text-sm">
                      Page {currentPage} of {response.data.totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => p + 1)}
                      disabled={!response.data.hasNext}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default CategoryManagement;
