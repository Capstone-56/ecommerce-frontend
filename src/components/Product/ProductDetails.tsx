// A ProductDetails page component that displays the details of a product

import { useParams } from "react-router-dom";

import { ProductModel } from "@/domain/models/ProductModel";

export default function ProductDetails() {
  const productId = useParams().id;
  console.log(productId);

  return (
    <>
    hello
    </>
  );
};
