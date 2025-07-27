import * as React from "react";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type SortDirection = "asc" | "desc" | null;

export interface SortConfig {
  key: string;
  direction: SortDirection;
}

export interface ColumnDef<T> {
  key: string;
  header: string;
  sortable?: boolean;
  render?: (item: T) => React.ReactNode;
  className?: string;
}

interface SortableTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  sortConfig?: SortConfig;
  onSort?: (config: SortConfig) => void;
  className?: string;
}

const SortIcon = ({ direction }: { direction: SortDirection }) => {
  if (direction === "asc") return <ArrowUp className="h-4 w-4" />;
  if (direction === "desc") return <ArrowDown className="h-4 w-4" />;
  return <ArrowUpDown className="h-4 w-4" />;
};

export function SortableTable<T extends Record<string, any>>({
  data,
  columns,
  sortConfig,
  onSort,
  className,
}: SortableTableProps<T>) {
  const handleSort = (key: string, direction: SortDirection) => {
    onSort?.({ key, direction });
  };

  return (
    <div className={cn("relative w-full overflow-auto p-2", className)}>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.key} className={column.className}>
                {column.sortable ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="font-medium h-auto py-1.5 px-2 text-left focus:outline-none focus-visible:ring-0 justify-start hover:text-gray-700 dark:hover:text-[#cecece] hover:bg-gray-600/5 dark:hover:bg-white/5"
                      >
                        <div className="flex items-center text-sm gap-2 w-fit">
                          <span>{column.header}</span>
                          <SortIcon
                            direction={
                              sortConfig?.key === column.key
                                ? sortConfig.direction
                                : null
                            }
                          />
                        </div>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleSort(column.key, "asc")}
                      >
                        <ArrowUp className="mr-2 h-4 w-4" />
                        Sort Ascending
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleSort(column.key, "desc")}
                      >
                        <ArrowDown className="mr-2 h-4 w-4" />
                        Sort Descending
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleSort(column.key, null)}
                      >
                        <ArrowUpDown className="mr-2 h-4 w-4" />
                        Remove Sort
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <span>{column.header}</span>
                )}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => (
            <TableRow key={index}>
              {columns.map((column) => (
                <TableCell key={column.key} className={column.className}>
                  {column.render ? column.render(item) : String(item[column.key] ?? "")}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}