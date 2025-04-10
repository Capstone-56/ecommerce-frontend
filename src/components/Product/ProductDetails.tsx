import { ProductModel } from "@/models/ProductModel";

interface ProductDetailsProps {
  productId: string;
}

// My (Dan's) propose of how to approach this page: When clicking on a product card on the
// Products page, the product ID will be bound either directly to this component's props,
// or the URL (/products/:id/details) and this component would fetch the ID itself.
// then it will call the API to get the product details from the server to display on the UI
export default function ProductDetails({ productId } : ProductDetailsProps) {
  return (
    <>
    </>
  );
};
