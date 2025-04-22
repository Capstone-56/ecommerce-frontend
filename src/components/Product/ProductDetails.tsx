// A ProductDetails page component that displays the details of a product

import { useParams } from "react-router-dom";

import { ProductModel } from "@/domain/models/ProductModel";
import { useEffect, useState } from "react";
import { ProductService } from "@/services/product-service";

export default function ProductDetails() {
  const [productDetails, setProductDetails] = useState<ProductModel>();
  const { id: productId = "null" } = useParams();
  const { name, description, images } = productDetails || {};

  useEffect(() => {
    fetchProductDetails(productId);
  }, []);

  const fetchProductDetails = async (id: string) => {
    const productService = new ProductService();
    const result = await productService.getProduct(id);
    setProductDetails(result);
  };

  if (!productDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{name}</h1>
      <ul>
        {description && <li>{description}</li>}
        {images && images.length > 0 && <img src={images[0]} />}
      </ul>
    </div>
  );
}
