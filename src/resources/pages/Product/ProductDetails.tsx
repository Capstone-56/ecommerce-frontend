// A ProductDetails page component that displays the details of a product

import { Link, useLocation, useParams } from "react-router-dom";

import { ProductModel } from "@/domain/models/ProductModel";
import { useEffect, useState } from "react";
import { ProductService } from "@/services/product-service";
import {
  Box,
  Breadcrumbs,
  Container,
  Typography,
  ImageList,
  ImageListItem,
} from "@mui/material";

export default function ProductDetails() {
  const [productDetails, setProductDetails] = useState<ProductModel>();
  const [collection, setCollection] = useState<string[]>();
  const { id: productId = "null" } = useParams();
  const { name, description, images } = productDetails || {};

  useEffect(() => {
    fetchProductDetails(productId);
  }, []);

  // If surpassing 4 image links, the 4th image in list will be a collection
  if (images && images.length > 4) {
    setCollection(images.slice(3));
  }

  const fetchProductDetails = async (id: string) => {
    const productService = new ProductService();
    const result = await productService.getProduct(id);
    setProductDetails(result);
  };

  // Loading state - might look into this as a component in the future when APIs take longer to call
  if (!productDetails) {
    return <div>Loading...</div>;
  }

  // DEBUG
  console.log(productDetails);
  console.log(collection);
  console.log(location);

  return (
    <Container maxWidth="xl" sx={{ margin: "4rem" }}>
      {/* Breadcrumbs - needs to be dynamic */}
      <Breadcrumbs>
        <Link to="/">Home</Link>
        <Link to="/products">Products</Link>
        {/* Category should be here if coming from that route */}
        <Link to={`/products/${productId}/details`}>{name}</Link>
      </Breadcrumbs>

      <Box>
        {/* img list */}
        <Box>
          <ImageList
            variant="quilted"
            cols={3}
            rowHeight={150}
            gap={4}
            sx={{ width: "50%", height: "50%" }}
          >
            {images.length > 0 ? (
              images.map((link, index) =>
                index === 0 ? (
                  <ImageListItem key={`image-${index}`} cols={3}>
                    <img
                      src={`${link}`}
                      alt="image alt text"
                      style={{ objectFit: "cover" }}
                    />
                  </ImageListItem>
                ) : (
                  <ImageListItem>
                    <img src={`${link}`} alt="image alt text" />
                  </ImageListItem>
                )
              )
            ) : (
              <Box>
                <Typography>No images available</Typography>
              </Box>
            )}
          </ImageList>

          {/* Dialog or modal for extra images? */}
        </Box>

        {/* item desc & variants etc */}
        <Box>
          <Typography variant="h2" sx={{ color: "black" }}>
            {name}
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}
