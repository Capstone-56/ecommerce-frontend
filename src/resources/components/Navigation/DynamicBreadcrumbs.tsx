import React, { useState, useEffect } from 'react';
import { Breadcrumbs, Link, Typography } from '@mui/material';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import { CategoryService } from '@/services/category-service';

const DynamicBreadcrumbs: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [categoryBreadcrumbs, setCategoryBreadcrumbs] = useState<Array<{name: string; internalName: string}>>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategoryBreadcrumbs = async () => {
      const categoriesParam = searchParams.get('categories');
      
      if (!categoriesParam) {
        setCategoryBreadcrumbs([]);
        return;
      }

      // Get the first category from the comma-separated list
      const firstCategory = categoriesParam.split(',')[0];
      
      if (!firstCategory) {
        setCategoryBreadcrumbs([]);
        return;
      }

      try {
        setLoading(true);
        const categoryService = new CategoryService();
        const category = await categoryService.getCategory(firstCategory);
        
        if (category.breadcrumb) {
          setCategoryBreadcrumbs(category.breadcrumb);
        } else {
          // Fallback if breadcrumb is not provided
          setCategoryBreadcrumbs([{
            name: category.name,
            internalName: category.internalName
          }]);
        }
      } catch (error) {
        console.error('Failed to fetch category breadcrumbs:', error);
        setCategoryBreadcrumbs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryBreadcrumbs();
  }, [searchParams]);

  return (
    <Breadcrumbs>
      {/* Home link */}
      <Link 
        component={RouterLink} 
        to="/"
        color="inherit"
        underline="hover"
      >
        Home
      </Link>
      
      {/* Products link */}
      <Link 
        component={RouterLink} 
        to="/products"
        color="inherit"
        underline="hover"
      >
        Products
      </Link>
      
      {/* Category breadcrumbs */}
      {categoryBreadcrumbs.map((crumb, index) => {
        // style the last breadcrumb 
        const isLast = index === categoryBreadcrumbs.length - 1;
        
        if (isLast) {
          return (
            <Typography key={crumb.internalName} color="text.primary">
              {crumb.name}
            </Typography>
          );
        }
        
        return (
          <Link
            key={crumb.internalName}
            component={RouterLink}
            to={`/products?categories=${crumb.internalName}`}
            color="inherit"
            underline="hover"
          >
            {crumb.name}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
};

export default DynamicBreadcrumbs;