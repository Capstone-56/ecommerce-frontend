import { useEffect, useMemo } from "react";
import { Pagination, Stack } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { PagedList } from "@/domain/abstract-models/PagedList";

interface PaginatorProps<T> {
  pagedData?: PagedList<T>;
  currentPage: number;
  isLoading?: boolean;
  onPageChange: (page: number) => void;
  size?: "small" | "medium" | "large";
  showFirstButton?: boolean;
  showLastButton?: boolean;
  updateUrl?: boolean;
}

const Paginator = <T,>({
  pagedData,
  currentPage,
  isLoading = false,
  onPageChange,
  size = "medium",
  showFirstButton = true,
  showLastButton = true,
  updateUrl = true,
}: PaginatorProps<T>) => {
    const navigate = useNavigate();
    const { search, pathname } = useLocation();
    // calculate page count from PagedList model if available
    const pageCount = useMemo(() => {
      return pagedData ? Math.ceil(pagedData.count / pagedData.pageSize) : 0;
    }, [pagedData]);

  // update URL with current page
  useEffect(() => {
    if (updateUrl && pageCount > 0) {
      const searchParams = new URLSearchParams(search);
  
      if (currentPage === 1) {
        searchParams.delete("page");
      } else {
        searchParams.set("page", currentPage.toString());
      }
  
      const newSearch = searchParams.toString();
      const newUrl = pathname + (newSearch ? `?${newSearch}` : "");
  
      // Only navigate if the URL would actually change
      if (`?${newSearch}` !== search) {
        navigate(newUrl, { replace: true });
      }
    }
  }, [currentPage, updateUrl, search, pathname, pageCount, navigate]);
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

export default Paginator;
