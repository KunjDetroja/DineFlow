import { useState } from "react";
import { useGetAllInquiryQuery } from "@/store/services/inquiry.service";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CommonPagination } from "@/components/ui/pagination";
import MainLayout from "@/layouts/MainLayout";

const Inquiry = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data, isLoading, error } = useGetAllInquiryQuery({
    page: currentPage,
    limit: pageSize,
  });

  if (isLoading) {
    return (
      <MainLayout title="Inquiries">
        <Card>
          <CardHeader>
            <CardTitle>All Inquiries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
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

  const inquiries = data?.data?.data || [];
  const pagination = data?.data?.pagination;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  return (
    <MainLayout title="Inquiries">
      {inquiries.length === 0 ? (
        <div className="w-full h-full flex items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">
            No inquiries available.
          </p>
        </div>
      ) : (
        <Card className="w-full">
          <CardHeader>
            <CardTitle>All Inquiries ({pagination?.totalItems || 0})</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {/* Desktop Table View */}
            <div className="hidden lg:block">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[120px]">Name</TableHead>
                      <TableHead className="min-w-[150px]">
                        Restaurant
                      </TableHead>
                      <TableHead className="min-w-[200px]">Email</TableHead>
                      <TableHead className="min-w-[120px]">Phone</TableHead>
                      <TableHead className="min-w-[80px]">Outlets</TableHead>
                      <TableHead className="min-w-[200px]">
                        Description
                      </TableHead>
                      <TableHead className="min-w-[100px]">Created</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inquiries.map((inquiry) => (
                      <TableRow key={inquiry._id}>
                        <TableCell className="font-medium">
                          {inquiry.name}
                        </TableCell>
                        <TableCell>{inquiry.restaurantName}</TableCell>
                        <TableCell className="break-all">
                          {inquiry.email}
                        </TableCell>
                        <TableCell>{inquiry.phone}</TableCell>
                        <TableCell>
                          {inquiry.numberOfOutlets || "N/A"}
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {inquiry.desc || "No description"}
                        </TableCell>
                        <TableCell>
                          {new Date(inquiry.createdAt).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
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
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      )}
    </MainLayout>
  );
};

export default Inquiry;
