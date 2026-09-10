import React, { useState, useMemo } from "react";
import {
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  Search,
  Download,
  Eye,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  CheckSquare,
  Square,
  FileSpreadsheet,
} from "lucide-react";
import { Button } from "./Button";
import { Badge } from "./Badge";

export interface Column<T> {
  key: string;
  header: string;
  accessor: (row: T) => React.ReactNode;
  sortable?: boolean;
  priority?: "high" | "medium" | "low"; // high = always visible, low = hidden on mobile expandable
  searchValue?: (row: T) => string;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (row: T) => string;
  title?: string;
  description?: string;
  searchPlaceholder?: string;
  onRowClick?: (row: T) => void;
  bulkActions?: {
    label: string;
    icon?: React.ReactNode;
    onClick: (selectedRows: T[]) => void;
    variant?: "primary" | "danger" | "secondary";
  }[];
}

export function DataTable<T>({
  data,
  columns,
  keyExtractor,
  title,
  description,
  searchPlaceholder = "Cari data...",
  onRowClick,
  bulkActions,
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [density, setDensity] = useState<"comfortable" | "default" | "compact">("default");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const [expandedMobileKeys, setExpandedMobileKeys] = useState<Set<string>>(new Set());
  const [visibleColumnKeys, setVisibleColumnKeys] = useState<Set<string>>(
    new Set(columns.map((c) => c.key))
  );
  const [isColumnDropdownOpen, setIsColumnDropdownOpen] = useState(false);

  // Filter Data
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return data;
    const q = searchQuery.toLowerCase();
    return data.filter((row) =>
      columns.some((col) => {
        if (col.searchValue) {
          return col.searchValue(row).toLowerCase().includes(q);
        }
        const val = col.accessor(row);
        if (typeof val === "string" || typeof val === "number") {
          return String(val).toLowerCase().includes(q);
        }
        return false;
      })
    );
  }, [data, columns, searchQuery]);

  // Sort Data
  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;
    const col = columns.find((c) => c.key === sortKey);
    if (!col) return filteredData;

    return [...filteredData].sort((a, b) => {
      const valA = col.searchValue ? col.searchValue(a) : String(col.accessor(a) || "");
      const valB = col.searchValue ? col.searchValue(b) : String(col.accessor(b) || "");

      if (valA < valB) return sortDirection === "asc" ? -1 : 1;
      if (valA > valB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredData, columns, sortKey, sortDirection]);

  // Paginate Data
  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, page, pageSize]);

  // Sorting Handler
  const handleSort = (key: string) => {
    if (sortKey === key) {
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else {
        setSortKey(null);
      }
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  // Selection Handlers
  const toggleSelectAll = () => {
    if (selectedKeys.size === paginatedData.length) {
      setSelectedKeys(new Set());
    } else {
      setSelectedKeys(new Set(paginatedData.map(keyExtractor)));
    }
  };

  const toggleSelectRow = (key: string) => {
    const next = new Set(selectedKeys);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    setSelectedKeys(next);
  };

  // Export Handler
  const exportCSV = () => {
    const activeCols = columns.filter((c) => visibleColumnKeys.has(c.key));
    const headers = activeCols.map((c) => c.header).join(",");
    const rows = sortedData.map((row) =>
      activeCols
        .map((c) => {
          const val = c.searchValue ? c.searchValue(row) : String(c.accessor(row) || "");
          return `"${val.replace(/"/g, '""')}"`;
        })
        .join(",")
    );

    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Export_Data_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const densityPadding = {
    comfortable: "py-3.5 px-4",
    default: "py-2.5 px-3.5",
    compact: "py-1.5 px-2.5",
  }[density];

  const selectedRows = useMemo(
    () => data.filter((row) => selectedKeys.has(keyExtractor(row))),
    [data, selectedKeys, keyExtractor]
  );

  return (
    <div className="w-full space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-[#0F172A]">
      {/* Table Header Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
        <div>
          {title && (
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-xs text-slate-500 dark:text-slate-400">{description}</p>
          )}
        </div>

        {/* Global Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search Box */}
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              placeholder={searchPlaceholder}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-1.5 pl-9 pr-3 text-xs text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>

          {/* Density Toggle */}
          <div className="flex rounded-xl border border-slate-200 p-0.5 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
            {(["compact", "default", "comfortable"] as const).map((d) => (
              <button
                key={d}
                onClick={() => setDensity(d)}
                className={`rounded-lg px-2 py-1 text-[10px] font-bold uppercase transition-all ${
                  density === d
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
                }`}
              >
                {d.slice(0, 4)}
              </button>
            ))}
          </div>

          {/* Export CSV Button */}
          <Button variant="outline" size="sm" leftIcon={<Download className="h-3.5 w-3.5" />} onClick={exportCSV}>
            CSV
          </Button>
        </div>
      </div>

      {/* Bulk Action Bar */}
      {selectedKeys.size > 0 && bulkActions && (
        <div className="flex items-center justify-between rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-2.5 text-xs text-emerald-400">
          <span className="font-bold">
            {selectedKeys.size} baris terpilih
          </span>
          <div className="flex items-center gap-2">
            {bulkActions.map((action, idx) => (
              <Button
                key={idx}
                size="sm"
                variant={action.variant || "primary"}
                leftIcon={action.icon}
                onClick={() => action.onClick(selectedRows)}
              >
                {action.label}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Table Container */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-slate-100/80 text-slate-700 dark:bg-slate-800/80 dark:text-slate-300 font-bold uppercase tracking-wider">
            <tr>
              <th className={`w-10 ${densityPadding}`}>
                <button onClick={toggleSelectAll} className="text-slate-400 hover:text-white">
                  {selectedKeys.size > 0 && selectedKeys.size === paginatedData.length ? (
                    <CheckSquare className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <Square className="h-4 w-4" />
                  )}
                </button>
              </th>

              {columns
                .filter((c) => visibleColumnKeys.has(c.key))
                .map((col) => (
                  <th
                    key={col.key}
                    className={`${densityPadding} select-none ${
                      col.sortable ? "cursor-pointer hover:bg-slate-200/50 dark:hover:bg-slate-700/50" : ""
                    }`}
                    onClick={() => col.sortable && handleSort(col.key)}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>{col.header}</span>
                      {col.sortable && (
                        <ArrowUpDown className="h-3 w-3 opacity-60" />
                      )}
                    </div>
                  </th>
                ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="py-12 text-center text-xs text-slate-400"
                >
                  Tidak ada data yang cocok.
                </td>
              </tr>
            ) : (
              paginatedData.map((row) => {
                const key = keyExtractor(row);
                const isSelected = selectedKeys.has(key);

                return (
                  <tr
                    key={key}
                    onClick={() => onRowClick && onRowClick(row)}
                    className={`transition-colors ${
                      isSelected
                        ? "bg-emerald-500/10 dark:bg-emerald-950/20"
                        : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    } ${onRowClick ? "cursor-pointer" : ""}`}
                  >
                    <td className={`w-10 ${densityPadding}`} onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => toggleSelectRow(key)}
                        className="text-slate-400 hover:text-white"
                      >
                        {isSelected ? (
                          <CheckSquare className="h-4 w-4 text-emerald-500" />
                        ) : (
                          <Square className="h-4 w-4" />
                        )}
                      </button>
                    </td>

                    {columns
                      .filter((c) => visibleColumnKeys.has(c.key))
                      .map((col) => (
                        <td key={col.key} className={densityPadding}>
                          {col.accessor(row)}
                        </td>
                      ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between pt-2 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <span>Tampilkan</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
            className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 dark:border-slate-700 dark:bg-slate-900 text-slate-900 dark:text-slate-100"
          >
            {[5, 10, 20, 50].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <span>dari {sortedData.length} baris</span>
        </div>

        <div className="flex items-center gap-2">
          <span>
            Halaman {page} dari {totalPages}
          </span>
          <div className="flex gap-1">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="rounded-lg border border-slate-200 p-1.5 hover:bg-slate-100 disabled:opacity-40 dark:border-slate-700 dark:hover:bg-slate-800"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="rounded-lg border border-slate-200 p-1.5 hover:bg-slate-100 disabled:opacity-40 dark:border-slate-700 dark:hover:bg-slate-800"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
