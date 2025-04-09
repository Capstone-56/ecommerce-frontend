import React from 'react';
import ProductCard from './ProductCard'; 
import placeholderImage from '/src/assets/ProductCard/product_card_placeholder.svg';

const TestProductCard: React.FC = () => {
  const sampleProduct = {
    id: '1',
    name: 'Nice T-Shirt',
    price: 39.99,
    thumbnail: placeholderImage,
    brand: 'Brand1',
    category: 'Category1',
    inStock: true,
  };
  
  const sampleProduct1 = {
    id: '2',
    name: 'Bad T-Shirt',
    price: 119.99,
    thumbnail: placeholderImage,
    brand: 'Brand2',
    category: 'Category2',
    inStock: false,
  };

  const handleClick = (productId: string) => {
    console.log(`Clicked product with ID: ${productId}`);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Product Card Test</h1>
      <div
        style={{
          display: 'flex',
          gap: '16px',
          justifyContent: 'center'
        }}
      >
      <ProductCard product={sampleProduct} onClick={handleClick} />
      <ProductCard product={sampleProduct1} onClick={handleClick} />
      </div>
    </div>
  );
};

export default TestProductCard;