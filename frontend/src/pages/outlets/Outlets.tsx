import { useState } from "react";
import {
  useGetAllOutletsQuery,
  useDeleteOutletMutation,
} from "@/store/services/outlet.service";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { X, Building, Edit, Trash2, MapPin, Phone } from "lucide-react";
import { toast } from "sonner";
import MainLayout from "@/layouts/MainLayout";
import CustomPagination from "@/components/common/Pagination";
import UpdateOutletDialog from "./UpdateOutletDialog";
import { IOutlet } from "@/types";

interface OutletFilter {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: SortDirection;
  search?: string;
  status?: string;
}

const Outlets = () => {
  const [filter, setFilter] = useState<OutletFilter>({});
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [selectedOutletId, setSelectedOutletId] = useState<string>("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [outletToDelete, setOutletToDelete] = useState<IOutlet | null>(null);

  const { data, isLoading, error } = useGetAllOutletsQuery(filter);
  const [deleteOutlet, { isLoading: isDeleting }] = useDeleteOutletMutation();

  const outlets = data?.data?.data || [];

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

  const handleEditOutlet = (outletId: string) => {
    setSelectedOutletId(outletId);
    setUpdateDialogOpen(true);
  };

  const handleCloseUpdateDialog = () => {
    setUpdateDialogOpen(false);
    setSelectedOutletId("");
  };

  const handleDeleteOutlet = (outlet: IOutlet) => {
    setOutletToDelete(outlet);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!outletToDelete) return;

    try {
      await deleteOutlet(outletToDelete._id).unwrap();
      toast.success(`Outlet "${outletToDelete.name}" deleted successfully`);
      setDeleteDialogOpen(false);
      setOutletToDelete(null);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete outlet");
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setOutletToDelete(null);
  };

  if (isLoading) {
    return (
      <MainLayout title="Outlets">
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

  const columns: ColumnDef<IOutlet>[] = [
    {
      key: "name",
      header: "Outlet Name",
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <Building className="w-4 h-4 text-primary" />
          </div>
          <div>
            <span className="font-medium">{item.name}</span>
            <div className="text-xs text-gray-500">
              {typeof item.restaurantId === "object"
                ? item.restaurantId.name
                : "Unknown Restaurant"}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "address",
      header: "Location",
      sortable: false,
      render: (item) => (
        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <div>{item.address}</div>
            <div className="text-gray-500">
              {item.city}, {item.state} {item.pincode}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "phone",
      header: "Contact",
      sortable: false,
      render: (item) => (
        <div className="flex items-center gap-2">
          {item.phone ? (
            <>
              <Phone className="w-4 h-4 text-gray-400" />
              <span className="text-sm">{item.phone}</span>
            </>
          ) : (
            <span className="text-sm text-gray-400">No phone</span>
          )}
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
            onClick={() => handleEditOutlet(item._id)}
            size="sm"
            variant="outline"
            className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-950"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => handleDeleteOutlet(item)}
            size="sm"
            variant="outline"
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <MainLayout
      title="Outlets"
      buttonTitle="Create Outlet"
      buttonKey="create-outlet"
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
                      <SelectItem value="true">Active</SelectItem>
                      <SelectItem value="false">Inactive</SelectItem>
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
                  placeholder="Search outlets..."
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
                  data={outlets}
                  columns={columns}
                  sortConfig={sortConfig}
                  onSort={handleSort}
                />
              </div>

              {/* Mobile Card View */}
              <div className="lg:hidden space-y-4 p-4">
                {outlets.map((outlet) => (
                  <Card key={outlet._id} className="p-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Building className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">
                              {outlet.name}
                            </h3>
                            <div className="text-sm text-gray-500">
                              {typeof outlet.restaurantId === "object"
                                ? outlet.restaurantId.name
                                : "Unknown Restaurant"}
                            </div>
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${
                                outlet.isActive
                                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                  : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                              }`}
                            >
                              {outlet.isActive ? "Active" : "Inactive"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-2 text-sm">
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <div>{outlet.address}</div>
                            <div className="text-gray-500">
                              {outlet.city}, {outlet.state} {outlet.pincode}
                            </div>
                          </div>
                        </div>
                        {outlet.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span>{outlet.phone}</span>
                          </div>
                        )}
                        <div>
                          <span className="font-medium">Created: </span>
                          {new Date(outlet.createdAt).toLocaleDateString()}
                        </div>
                      </div>

                      <div className="flex gap-2 pt-3 border-t">
                        <Button
                          onClick={() => handleEditOutlet(outlet._id)}
                          size="sm"
                          variant="outline"
                          className="flex-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-950"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDeleteOutlet(outlet)}
                          size="sm"
                          variant="outline"
                          className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
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
                No outlets found for the given criteria.
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

      {/* Update Outlet Dialog */}
      <Dialog open={updateDialogOpen} onOpenChange={setUpdateDialogOpen}>
        <DialogContent className="max-w-2xl">
          {selectedOutletId && (
            <UpdateOutletDialog
              outletId={selectedOutletId}
              onClose={handleCloseUpdateDialog}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Outlet</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{outletToDelete?.name}"? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleCancelDelete}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Outlets;
