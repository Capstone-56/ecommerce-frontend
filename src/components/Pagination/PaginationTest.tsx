import React, { useState } from 'react';
import {
  Box,
  Typography,
} from '@mui/material';
import ServerPagination, { PagedList } from '../Pagination/Pagination';
import ProductCard from '../ProductCard/ProductCard';
import placeholderImage from '/src/assets/ProductCard/product_card_placeholder.svg';

// sample product type
interface Product {
  id: string;
  name: string;
  price: number;
  brand?: string;
  category: string;
  thumbnail?: string;
  inStock: boolean;
}

// sample products
const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'T-Shirt',
    price: 39.99,
    thumbnail: placeholderImage,
    brand: 'Brand1',
    category: 'Category1',
    inStock: true,
  },
  {
    id: '2',
    name: 'Jacket',
    price: 119.99,
    thumbnail: placeholderImage,
    brand: 'Brand2',
    category: 'Category2',
    inStock: false,
  },
  {
    id: '3',
    name: 'Pants',
    price: 239.99,
    thumbnail: placeholderImage,
    brand: 'Brand3',
    category: 'Category1',
    inStock: true,
  },
];

// 36 duplicated products
const allProducts: Product[] = Array.from({ length: 36 }, (_, i) => {
  const base = sampleProducts[i % 3];
  return {
    ...base,
    id: String(i + 1),
  };
});

const PRODUCTS_PER_PAGE = 12;

const ProductPaginationTest: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);

  // create paginated data manually
  const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const end = start + PRODUCTS_PER_PAGE;
  const pageProducts = allProducts.slice(start, end);

  const pagedData: PagedList<Product> = {
    count: allProducts.length,
    pageSize: PRODUCTS_PER_PAGE,
    next: currentPage < 3 ? `?page=${currentPage + 1}` : null,
    previous: currentPage > 1 ? `?page=${currentPage - 1}` : null,
    results: pageProducts,
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Typography variant="h4" textAlign="center" gutterBottom>
        Simple Product Pagination Test
      </Typography>

      <Box
        display="grid"
        gridTemplateColumns="repeat(auto-fill, minmax(300px, 1fr))"
        gap={3}
        justifyItems="center"
        mb={4}
      >
        {pageProducts.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onClick={() => console.log(`Clicked ${product.id}`)}
          />
        ))}
      </Box>

      <ServerPagination
        pagedData={pagedData}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        size="medium"
        showFirstButton
        showLastButton
        updateUrl={false}
      />
    </Box>
  );
};

export default ProductPaginationTest;
