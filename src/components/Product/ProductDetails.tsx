import { useParams } from "react-router-dom";

export default function ProductDetails() {
  const productId = useParams().id;
  console.log(productId);

  return (
    <></>
  );
};
