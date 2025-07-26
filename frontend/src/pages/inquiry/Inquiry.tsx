import { useState } from "react";
import {
  useGetAllInquiryQuery,
  useCreateRestaurantFromInquiryMutation,
} from "@/store/services/inquiry.service";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/search-input";
import { CommonPagination } from "@/components/ui/pagination";
import { SortableTable, ColumnDef, SortConfig, SortDirection } from "@/components/ui/sortable-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import MainLayout from "@/layouts/MainLayout";

interface InquiryFilter {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: SortDirection;
  search?: string;
  status?: string;
  outletRange?: string;
  dateRange?: string;
}

const Inquiry = () => {
  const [filter, setFilter] = useState<InquiryFilter>({});

  const { data, isLoading, error } = useGetAllInquiryQuery(filter);

  const [createRestaurant, { isLoading: isCreatingRestaurant }] = useCreateRestaurantFromInquiryMutation();

  const inquiries = data?.data?.data || [];

  // Derive sortConfig from filter state for UI display
  const sortConfig: SortConfig = {
    key: filter.sortBy || "",
    direction: filter.sortOrder || null,
  };

  const handleSort = (config: SortConfig) => {
    console.log("Sort changed:", config);

    // Update filter to include sort for API call
    setFilter((prev) => ({
      ...prev,
      sortBy: config.key,
      sortOrder: config.direction,
    }));
  };

  const handleSearchChange = (value: string) => {
    setFilter((prev) => ({
      ...prev,
      search: value || undefined,
      page: undefined, // Reset to first page when searching
    }));
  };

  const handleStatusChange = (value: string) => {
    setFilter((prev) => ({
      ...prev,
      status: value === "all" ? undefined : value,
      page: undefined, // Reset to first page when filtering
    }));
  };

  const handleClearFilters = () => {
    setFilter({});
  };

  const hasActiveFilters = Boolean(
    filter.search || filter.status || filter.outletRange || filter.dateRange
  );

  const handlePageChange = async (pageNumber: number) => {
    if (pageNumber === 1) {
      setFilter((prev) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { page, ...rest } = prev;
        return rest;
      });
    } else {
      setFilter((prev) => ({ ...prev, page: pageNumber }));
    }
  };

  const handleLimitChange = async (limitNumber: number) => {
    handlePageChange(1);
    if (limitNumber === 10) {
      setFilter((prev) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { limit, ...rest } = prev;
        return rest;
      });
    } else {
      setFilter((prev) => ({ ...prev, limit: limitNumber }));
    }
  };

  const handleCreateRestaurant = async (inquiryId: string) => {
    try {
      await createRestaurant({ id: inquiryId }).unwrap();
      alert("Restaurant created successfully!");
    } catch (error) {
      console.error("Error creating restaurant:", error);
      alert("Failed to create restaurant. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <MainLayout title="Inquiries">
        <Card>
          <CardContent>
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-8 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout title="Inquiries">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-500">
              Error loading inquiries. Please try again.
            </div>
          </CardContent>
        </Card>
      </MainLayout>
    );
  }

  const pagination = data?.data?.pagination;

  const columns: ColumnDef<any>[] = [
    {
      key: "name",
      header: "Name",
      sortable: true,
    },
    {
      key: "restaurantName",
      header: "Restaurant",
      sortable: true,
    },
    {
      key: "email",
      header: "Email",
      sortable: true,
    },
    {
      key: "phone",
      header: "Phone",
      sortable: false,
    },
    {
      key: "numberOfOutlets",
      header: "Outlets",
      render: (item) => item.numberOfOutlets || "N/A",
    },
    {
      key: "desc",
      header: "Description",
      sortable: false,
      render: (item) => item.desc || "No description",
    },
    {
      key: "createdAt",
      header: "Created",
      sortable: true,
      render: (item) => new Date(item.createdAt).toLocaleDateString(),
    },
    {
      key: "action",
      header: "Action",
      sortable: false,
      render: (item) => (
        <Button
          onClick={() => handleCreateRestaurant(item._id)}
          disabled={isCreatingRestaurant}
          size="sm"
          variant="outline"
        >
          {isCreatingRestaurant ? "Creating..." : "Create Restaurant"}
        </Button>
      ),
    },
  ];

  return (
    <MainLayout title="Inquiries">
      {inquiries.length === 0 ? (
        <div className="w-full h-full flex items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">
            No inquiries available.
          </p>
        </div>
      ) : (
        <Card className="w-full p-2">
          <CardContent className="p-0">
            {/* Filters */}
            <div className="p-4">
              <div className="flex justify-between items-center">
                <div className="flex gap-4 items-center">
                  {/* Status Filter */}
                  <div className="flex gap-2 items-center">
                    <label>Status</label>
                    <Select
                      value={filter.status || "all"}
                      onValueChange={handleStatusChange}
                    >
                      <SelectTrigger className="h-8 dark:bg-accent">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                        <SelectItem value="contacted">Contacted</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex gap-4 items-center">
                  {hasActiveFilters && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleClearFilters}
                      className="text-xs"
                    >
                      <X className="h-3 w-3 mr-1" />
                      Clear Filters
                    </Button>
                  )}

                  {/* Search Filter */}
                  <SearchInput
                    placeholder="Search by name, email, or restaurant..."
                    value={filter.search || ""}
                    onChange={handleSearchChange}
                    onClear={() => handleSearchChange("")}
                    className="min-w-72 h-8"
                  />
                </div>
              </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block">
              <SortableTable
                data={inquiries}
                columns={columns}
                sortConfig={sortConfig}
                onSort={handleSort}
              />
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden space-y-4 p-4">
              {inquiries.map((inquiry) => (
                <Card key={inquiry._id} className="p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-lg">{inquiry.name}</h3>
                      <span className="text-sm text-muted-foreground">
                        {new Date(inquiry.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 gap-2 text-sm">
                      <div>
                        <span className="font-medium">Restaurant: </span>
                        {inquiry.restaurantName}
                      </div>
                      <div>
                        <span className="font-medium">Email: </span>
                        <span className="break-all">{inquiry.email}</span>
                      </div>
                      <div>
                        <span className="font-medium">Phone: </span>
                        {inquiry.phone}
                      </div>
                      <div>
                        <span className="font-medium">Outlets: </span>
                        {inquiry.numberOfOutlets || "N/A"}
                      </div>
                      {inquiry.desc && (
                        <div>
                          <span className="font-medium">Description: </span>
                          <p className="mt-1 text-muted-foreground">
                            {inquiry.desc}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="mt-3 pt-3 border-t">
                      <Button
                        onClick={() => handleCreateRestaurant(inquiry._id)}
                        disabled={isCreatingRestaurant}
                        size="sm"
                        variant="outline"
                        className="w-full"
                      >
                        {isCreatingRestaurant
                          ? "Creating..."
                          : "Create Restaurant"}
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      {pagination && (
        <CommonPagination
          pagination={pagination}
          currentPage={pagination.currentPage}
          pageSize={pagination.limit}
          onPageChange={handlePageChange}
          onPageSizeChange={handleLimitChange}
        />
      )}
    </MainLayout>
  );
};

export default Inquiry;
