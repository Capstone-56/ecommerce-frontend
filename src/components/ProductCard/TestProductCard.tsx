import React from 'react';
import ProductCard from './ProductCard'; 
import placeholderImage from '/src/assets/ProductCard/product_card_placeholder.svg';

const TestProductCard: React.FC = () => {
  const sampleProduct = {
    id: '1',
    name: 'T-Shirt',
    price: 39.99,
    thumbnail: placeholderImage,
    brand: 'Brand1',
    category: 'Category1',
    inStock: true,
  };
  
  const sampleProduct1 = {
    id: '2',
    name: 'Jacket',
    price: 119.99,
    thumbnail: placeholderImage,
    brand: 'Brand2',
    category: 'Category2',
    inStock: false,
  };

  const sampleProduct2 = {
    id: '3',
    name: 'Pants',
    price: 239.99,
    thumbnail: placeholderImage,
    brand: 'Brand3',
    category: 'Category1',
    inStock: true,
  };

  const handleClick = (productId: string) => {
    console.log(`Clicked product with ID: ${productId}`);
  };

  return (
    <div
      style={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        boxSizing: 'border-box',
        padding: '20px',
      }}
    >
      <h1 style={{ marginBottom: '24px' }}>Product Card Test</h1>
      <div
        style={{
          display: 'flex',
          gap: '16px',
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}
      >
        <ProductCard product={sampleProduct} onClick={handleClick} />
        <ProductCard product={sampleProduct1} onClick={handleClick} />
        <ProductCard product={sampleProduct2} onClick={handleClick} />
      </div>
    </div>
  );
};

export default TestProductCard;