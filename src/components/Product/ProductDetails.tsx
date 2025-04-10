import { useParams } from "react-router-dom";

import { ProductModel } from "@/models/ProductModel";

export default function ProductDetails() {
  const productId = useParams().id;
  console.log(productId);

  return (
    <>
    hello
    </>
  );
};
