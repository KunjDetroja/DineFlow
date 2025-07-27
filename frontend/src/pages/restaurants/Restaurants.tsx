import { useState } from "react";
import { useGetAllRestaurantsQuery } from "@/store/services/restaurant.service";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/search-input";
import {
  SortableTable,
  ColumnDef,
  SortConfig,
  SortDirection,
} from "@/components/ui/sortable-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Building2, Edit } from "lucide-react";
import MainLayout from "@/layouts/MainLayout";
import CustomPagination from "@/components/common/Pagination";
import { IRestaurant } from "@/types";

interface RestaurantFilter {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: SortDirection;
  search?: string;
  status?: string;
}

const Restaurants = () => {
  const [filter, setFilter] = useState<RestaurantFilter>({});

  const { data, isLoading, error } = useGetAllRestaurantsQuery(filter);

  const restaurants = data?.data?.data || [];

  // Derive sortConfig from filter state for UI display
  const sortConfig: SortConfig = {
    key: filter.sortBy || "",
    direction: filter.sortOrder || null,
  };

  const handleSort = (config: SortConfig) => {
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

  const hasActiveFilters = Boolean(filter.search || filter.status);

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

  const handleEditRestaurant = (restaurantId: string) => {
    // TODO: Navigate to restaurant edit page
    console.log("Edit restaurant:", restaurantId);
  };

  if (isLoading) {
    return (
      <MainLayout title="Restaurants">
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

  const pagination = data?.data?.pagination;

  const columns: ColumnDef<IRestaurant>[] = [
    {
      key: "name",
      header: "Restaurant Name",
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-3">
          {item.logo ? (
            <img
              src={item.logo}
              alt={item.name}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Building2 className="w-4 h-4 text-primary" />
            </div>
          )}
          <span className="font-medium">{item.name}</span>
        </div>
      ),
    },
    {
      key: "isActive",
      header: "Status",
      sortable: true,
      render: (item) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            item.isActive
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
          }`}
        >
          {item.isActive ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: "Created Date",
      sortable: true,
      render: (item) => new Date(item.createdAt).toLocaleDateString(),
    },
    {
      key: "action",
      header: "Actions",
      sortable: false,
      render: (item) => (
        <div className="flex items-center gap-2">
          <Button
            onClick={() => handleEditRestaurant(item._id)}
            size="sm"
            variant="outline"
            className="h-8 w-8 p-0"
          >
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <MainLayout
      title="Restaurants"
      buttonTitle="Create Restaurant"
      buttonKey="create-restaurant"
    >
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
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
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
                  placeholder="Search restaurants..."
                  value={filter.search || ""}
                  onChange={handleSearchChange}
                  onClear={() => handleSearchChange("")}
                  className="min-w-72 h-8"
                />
              </div>
            </div>
          </div>
          {!error ? (
            <>
              {/* Desktop Table View */}
              <div className="hidden lg:block">
                <SortableTable
                  data={restaurants}
                  columns={columns}
                  sortConfig={sortConfig}
                  onSort={handleSort}
                />
              </div>

              {/* Mobile Card View */}
              <div className="lg:hidden space-y-4 p-4">
                {restaurants.map((restaurant) => (
                  <Card key={restaurant._id} className="p-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          {restaurant.logo ? (
                            <img
                              src={restaurant.logo}
                              alt={restaurant.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <Building2 className="w-5 h-5 text-primary" />
                            </div>
                          )}
                          <div>
                            <h3 className="font-semibold text-lg">
                              {restaurant.name}
                            </h3>
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                restaurant.isActive
                                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                  : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                              }`}
                            >
                              {restaurant.isActive ? "Active" : "Inactive"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-2 text-sm">
                        <div>
                          <span className="font-medium">Created: </span>
                          {new Date(restaurant.createdAt).toLocaleDateString()}
                        </div>
                      </div>

                      <div className="flex gap-2 pt-3 border-t">
                        <Button
                          onClick={() => handleEditRestaurant(restaurant._id)}
                          size="sm"
                          variant="outline"
                          className="flex-1"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </>
          ) : (
            <div className="p-4">
              <p className="text-center text-muted-foreground">
                No restaurants found for the given criteria.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      {pagination && (
        <CustomPagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
          limit={pagination.limit}
          totalItems={pagination.totalItems}
          handleLimitChange={handleLimitChange}
        />
      )}
    </MainLayout>
  );
};

export default Restaurants;
