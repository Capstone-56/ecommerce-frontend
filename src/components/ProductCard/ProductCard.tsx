import React from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box
} from '@mui/material';
import { Product } from '../../types/Product';

interface ProductCardProps {
    product: Product;
    onClick: (productId: string) => void; // callback to handle redirection
  }

    const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
    const { id, name, price, thumbnail, brand, category, inStock } = product;
  
    const handleClick = () => {
        onClick(id); // triggers navigation to product info page
    };
  
    return (
        <Card
            sx={{
            maxWidth: 300,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            transition: 'transform 0.2s',
            '&:hover': { transform: 'scale(1.009)' }, // tiny hover effect, may not use in final design
            cursor: 'pointer',
            }}
            onClick={handleClick}
        >
        {/* product image */}
        <CardMedia
            component="img"
            height="200"
            image={thumbnail}
            alt={name}
            sx={{ objectFit: 'cover' }}
        />
  
        {/* product details */}
        <CardContent sx={{ flexGrow: 1 }}>

            {/* brand & category */}
            {(brand || category) && (
                <Typography variant="body2" color="text.secondary">
                {brand && category ? `${brand} • ${category}` : brand || category}
                </Typography>
            )}

            {/* product name */}
            <Typography gutterBottom variant="h6" component="div" noWrap>
                {name}
            </Typography>

            {/* price and stock status */}
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <Typography
                    variant="h6"
                    sx={{
                    color: 'black',
                    fontWeight: 'bold',
                    textDecoration: inStock ? 'none' : 'line-through', // strikethrough if out of stock
                    }}
                >
                    ${price.toFixed(2)}
                </Typography>

                {!inStock && (
                    <Typography
                    variant="body2"
                    color="error"
                    sx={{ ml: 1 }} // margin-left for spacing
                    >
                    Out of Stock
                    </Typography>
                )}
            </Box>
        </CardContent>
      </Card>
    );
  };
  
  export default ProductCard;