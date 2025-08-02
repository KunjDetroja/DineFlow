import { useState } from "react";
import {
  useGetAllUsersQuery,
  useDeleteUserMutation,
} from "@/store/services/user.service";
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
import { X, User, Edit, Trash2, Building2, MapPin } from "lucide-react";
import { toast } from "sonner";
import MainLayout from "@/layouts/MainLayout";
import CustomPagination from "@/components/common/Pagination";
import CreateUpdateUserDialog from "./CreateUpdateUserDialog";
import { IUser } from "@/types";

interface UserFilter {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: SortDirection;
  search?: string;
  status?: string;
}

const Staff = () => {
  const [filter, setFilter] = useState<UserFilter>({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | undefined>(
    undefined
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<IUser | null>(null);

  const { data, isLoading, error } = useGetAllUsersQuery(filter);
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const users = data?.data?.data || [];

  // Derive sortConfig from filter state for UI display
  const sortConfig: SortConfig = {
    key: filter.sortBy || "",
    direction: filter.sortOrder || null,
  };

  const handleSort = (config: SortConfig) => {
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
      page: undefined,
    }));
  };

  const handleStatusChange = (value: string) => {
    setFilter((prev) => ({
      ...prev,
      status: value === "all" ? undefined : value,
      page: undefined,
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

  const handleEditUser = (userId: string) => {
    setSelectedUserId(userId);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedUserId(undefined);
  };

  const handleDeleteUser = (user: IUser) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;

    try {
      await deleteUser(userToDelete._id!).unwrap();
      toast.success(`User "${userToDelete.name}" deleted successfully`);
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete user");
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case "OWNER":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "MANAGER":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "CHEF":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
      case "WAITER":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  if (isLoading) {
    return (
      <MainLayout title="Staff Management">
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

  const columns: ColumnDef<IUser>[] = [
    {
      key: "name",
      header: "User Details",
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-4 h-4 text-primary" />
          </div>
          <div>
            <div className="font-medium">{item.name}</div>
            <div className="text-sm text-muted-foreground">{item.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      header: "Role",
      sortable: true,
      render: (item) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(
            item.role
          )}`}
        >
          {item.role}
        </span>
      ),
    },
    {
      key: "phone",
      header: "Phone",
      sortable: false,
      render: (item) => <span className="text-sm">{item.phone}</span>,
    },
    {
      key: "restaurantId",
      header: "Restaurant",
      sortable: false,
      render: (item) => (
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm">
            {typeof item.restaurantId === "object" && item.restaurantId
              ? item.restaurantId.name
              : "N/A"}
          </span>
        </div>
      ),
    },
    {
      key: "outletId",
      header: "Outlet",
      sortable: false,
      render: (item) => (
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm">
            {typeof item.outletId === "object" && item.outletId
              ? item.outletId.name
              : "N/A"}
          </span>
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
      key: "action",
      header: "Actions",
      sortable: false,
      render: (item) => (
        <div className="flex items-center gap-2">
          <Button
            onClick={() => handleEditUser(item._id!)}
            size="sm"
            variant="outline"
            className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-950"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => handleDeleteUser(item)}
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
      title="Staff Management"
      buttonTitle="Create Staff"
      buttonKey="create-staff"
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
                  placeholder="Search staff..."
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
                  data={users}
                  columns={columns}
                  sortConfig={sortConfig}
                  onSort={handleSort}
                />
              </div>

              {/* Mobile Card View */}
              <div className="lg:hidden space-y-4 p-4">
                {users.map((user) => (
                  <Card key={user._id} className="p-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">
                              {user.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {user.email}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(
                            user.role
                          )}`}
                        >
                          {user.role}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 gap-2 text-sm">
                        <div>
                          <span className="font-medium">Phone: </span>
                          {user.phone}
                        </div>
                        <div>
                          <span className="font-medium">Restaurant: </span>
                          {typeof user.restaurantId === "object" &&
                          user.restaurantId
                            ? user.restaurantId.name
                            : "N/A"}
                        </div>
                        <div>
                          <span className="font-medium">Outlet: </span>
                          {typeof user.outletId === "object" && user.outletId
                            ? user.outletId.name
                            : "N/A"}
                        </div>
                        <div>
                          <span className="font-medium">Status: </span>
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                              user.isActive
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                            }`}
                          >
                            {user.isActive ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-3 border-t">
                        <Button
                          onClick={() => handleEditUser(user._id!)}
                          size="sm"
                          variant="outline"
                          className="flex-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-950"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDeleteUser(user)}
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
                No staff members found for the given criteria.
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

      {/* Create/Update User Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <CreateUpdateUserDialog
            userId={selectedUserId}
            onClose={handleCloseDialog}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Staff Member</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{userToDelete?.name}"? This
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

export default Staff;
