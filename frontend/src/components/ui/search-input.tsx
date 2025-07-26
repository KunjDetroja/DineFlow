import * as React from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface SearchInputProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
    value?: string;
    onChange?: (value: string) => void;
    onClear?: () => void;
    placeholder?: string;
    showClearButton?: boolean;
    debounceMs?: number;
    className?: string;
    containerClassName?: string;
    icon?: React.ReactNode;
    loading?: boolean;
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
    (
        {
            value = "",
            onChange,
            onClear,
            placeholder = "Search...",
            showClearButton = true,
            debounceMs = 300,
            className,
            containerClassName,
            icon,
            loading = false,
            ...props
        },
        ref
    ) => {
        const [internalValue, setInternalValue] = React.useState(value);
        const debounceRef = React.useRef<NodeJS.Timeout | null>(null);

        // Sync internal value with external value
        React.useEffect(() => {
            setInternalValue(value);
        }, [value]);

        // Debounced onChange handler
        const handleChange = React.useCallback(
            (newValue: string) => {
                setInternalValue(newValue);

                if (debounceRef.current) {
                    clearTimeout(debounceRef.current);
                }

                debounceRef.current = setTimeout(() => {
                    onChange?.(newValue);
                }, debounceMs);
            },
            [onChange, debounceMs]
        );

        // Clear handler
        const handleClear = React.useCallback(() => {
            setInternalValue("");
            onChange?.("");
            onClear?.();

            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
        }, [onChange, onClear]);

        // Cleanup timeout on unmount
        React.useEffect(() => {
            return () => {
                if (debounceRef.current) {
                    clearTimeout(debounceRef.current);
                }
            };
        }, []);

        const searchIcon = icon || <Search className="h-4 w-4 text-muted-foreground" />;
        const hasValue = internalValue.length > 0;

        return (
            <div className={cn("relative", containerClassName)}>
                {/* Search Icon */}
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    {loading ? (
                        <div className="animate-spin h-4 w-4 border-2 border-muted-foreground border-t-transparent rounded-full" />
                    ) : (
                        searchIcon
                    )}
                </div>

                {/* Input Field */}
                <Input
                    ref={ref}
                    type="text"
                    value={internalValue}
                    onChange={(e) => handleChange(e.target.value)}
                    placeholder={placeholder}
                    className={cn(
                        "pl-9",
                        showClearButton && hasValue && "pr-9",
                        className
                    )}
                    {...props}
                />

                {/* Clear Button */}
                {showClearButton && hasValue && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleClear}
                        className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0 hover:bg-muted"
                    >
                        <X className="h-3 w-3" />
                        <span className="sr-only">Clear search</span>
                    </Button>
                )}
            </div>
        );
    }
);

SearchInput.displayName = "SearchInput";

export { SearchInput };