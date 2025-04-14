import React, { useEffect } from "react";
import { Pagination, Stack } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";

export interface PagedList<T> {
  count: number;
  pageSize: number;
  next: string | null;
  previous: string | null;
  results: Array<T>;
}

interface ServerPaginationProps<T> {
  pagedData?: PagedList<T>;
  currentPage: number;
  isLoading?: boolean;
  onPageChange: (page: number) => void;
  size?: "small" | "medium" | "large";
  showFirstButton?: boolean;
  showLastButton?: boolean;
  updateUrl?: boolean;
}

const ServerPagination = <T,>({
  pagedData,
  currentPage,
  isLoading = false,
  onPageChange,
  size = "medium",
  showFirstButton = true,
  showLastButton = true,
  updateUrl = true,
}: ServerPaginationProps<T>) => {
    const navigate = useNavigate();
    const location = useLocation();
  // calculate page count from PagedList model if available
  const pageCount = pagedData
    ? Math.ceil(pagedData.count / pagedData.pageSize)
    : 0;

  // update URL with current page
  useEffect(() => {
    if (updateUrl && pageCount > 0) {
      const searchParams = new URLSearchParams(location.search);

      if (currentPage === 1) {
        searchParams.delete("page");
      } else {
        searchParams.set("page", currentPage.toString());
      }

      const newSearch = searchParams.toString();
      const newUrl = location.pathname + (newSearch ? `?${newSearch}` : "");

      // replace = true to avoid filling browser history with pagination changes
      navigate(newUrl, { replace: true });
    }
  }, [currentPage, updateUrl, location, navigate, pageCount]);
  const handleChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    if (value !== currentPage) {
      onPageChange(value);
    }
  };

  if (pageCount <= 1) {
    return null; // don't show pagination if there is only one page
  }

  return (
    <Stack
      spacing={2}
      alignItems="center"
      sx={{
        my: 4,
        position: "relative",
      }}
    >
      <Pagination
        count={pageCount}
        page={currentPage}
        onChange={handleChange}
        color="primary"
        size={size}
        showFirstButton={showFirstButton}
        showLastButton={showLastButton}
        disabled={isLoading}
        sx={{
          "& .MuiPaginationItem-root": {
            "&.Mui-selected": {
              fontWeight: "bold",
            },
          },
          "@media (max-width: 600px)": {
            "& .MuiPaginationItem-icon": {
              fontSize: "1rem",
            },
          },
        }}
      />
    </Stack>
  );
};

export default ServerPagination;