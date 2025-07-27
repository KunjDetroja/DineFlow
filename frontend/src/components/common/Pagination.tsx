import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface CustomPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  limit?: number;
  handleLimitChange: (limit: number) => void;
  totalItems?: number;
  className?: string;
  isShowLimitSelector?: boolean;
}

const CustomPagination = ({
  currentPage,
  totalPages,
  onPageChange,
  limit = 10,
  handleLimitChange,
  totalItems = 0,
  className = "",
  isShowLimitSelector = true,
}: CustomPaginationProps) => {
  const pageSizeOptions = [5, 10, 20, 50, 100];
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push("...");
        pages.push(totalPages);
      }
    }
    return pages;
  };

  // Calculate the range of items being displayed
  const startItem = (currentPage - 1) * limit + 1;
  const endItem = Math.min(currentPage * limit, totalItems);

  // if (totalPages <= 1 && totalItems <= limit) {
  //   return null;
  // }

  return (
    <div className={`mt-6 ${className}`}>
      {/* Single line layout with all elements */}
      <div className="flex items-center justify-between w-full">
        {/* Left side - Entry count display */}
        <div className="flex-shrink-0 text-sm text-gray-600 font-medium">
          {totalItems > 0 ? (
            <>
              {startItem}-{endItem} of {totalItems}
            </>
          ) : (
            "0 of 0"
          )}
        </div>

        {/* Center - Pagination Controls */}
        <div className="flex items-center space-x-2 mx-4">
          {totalPages > 1 && totalItems > limit && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="h-9 w-9 p-0 border-gray-300 hover:border-[#9b87f5] hover:bg-[#9b87f5]/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              {getPageNumbers().map((page, index) =>
                page === "..." ? (
                  <span
                    key={`ellipsis-${index}`}
                    className="px-2 text-gray-500 select-none"
                  >
                    ...
                  </span>
                ) : (
                  <Button
                    key={`page-${page}`}
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(page)}
                    className={`h-9 w-9 p-0 border-gray-300 transition-all duration-200 ${
                      currentPage === page
                        ? "bg-[#9b87f5] border-[#9b87f5] text-white hover:bg-[#8b77f0] shadow-md"
                        : "hover:border-[#9b87f5] hover:bg-[#9b87f5]/10 hover:text-[#9b87f5]"
                    }`}
                  >
                    {page}
                  </Button>
                )
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="h-9 w-9 p-0 border-gray-300 hover:border-[#9b87f5] hover:bg-[#9b87f5]/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>

        {/* Right side - Limit selector */}
        {isShowLimitSelector && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Show:</span>
            <Select
              value={limit.toString()}
              onValueChange={(value) => handleLimitChange(Number(value))}
            >
              <SelectTrigger className="w-18 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {pageSizeOptions.map((size) => (
                  <SelectItem key={size} value={size.toString()}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomPagination;
