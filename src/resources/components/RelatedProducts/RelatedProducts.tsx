import { ProductModel } from "@/domain/models/ProductModel";
import { ProductService } from "@/services/product-service";
import { useEffect, useState } from "react";
import ProductCard from "../ProductCard/ProductCard";
import { Box, Typography } from "@mui/material";
import { locationState } from "@/domain/state";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate } from "react-router-dom";

type RelatedProductsProps = {
  product: ProductModel;
};

/**
 * Related product component to be displayed to users when viewing a
 * particular product. Will show other products that the user may like
 * based on the currently viewed one.
 */
export default function ProductDetails(props: RelatedProductsProps) {
  const [relatedProducts, setRelatedProducts] = useState<Array<ProductModel>>(
    []
  );
  const userLocation = locationState((state) => state.userLocation);
  const userCurrency = locationState((state) => state.getUserCurrency());
  const navigate = useNavigate();

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 900,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 400,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  useEffect(() => {
    getRelatedProducts();
  }, [props.product, userLocation, userCurrency]);

  /**
   * Retrieves the related products.
   */
  const getRelatedProducts = async () => {
    const productService = new ProductService();
    const response = await productService.getRelatedProducts(props.product.id, userLocation, userCurrency);
    if (response) {
      setRelatedProducts(response);
    } else {
      console.log("Error retrieving related products, " + response);
    }
  };

  return (
    <>
      <Typography
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "center",
          textAlign: "center",
          margin: "2rem",
          paddingX: { xs: "2rem" },
          gap: "2rem",
        }}
        variant="h5"
        fontWeight="bold"
        gutterBottom
      >
        Related Products
      </Typography>
      <Box
        sx={{
          width: "90%",
          mx: "auto",
          position: "relative"
        }}
      >
        {/* 
          This style section is required to make the arrows appear on the screen.
          Did not want a separate css file just for this so it has been inlined
          into this file. 
        */}
        <style>
          {`
            .slick-prev:before,
            .slick-next:before {
              color: black;
              font-size: 20px;
            }
          `}
        </style>
        <Slider {...settings} arrows>
          {relatedProducts.length > 0 ? (
            relatedProducts.map((product) => (
              <Box key={product.id} sx={{
                display: "flex",
                justifyContent: "center",
                px: 1,
              }}>
                <ProductCard product={product} width="100%" height="350px" onClickCallback={() => {
                  navigate(`/products/${product.id}/details`);
                  window.scrollTo({ top: 0, behavior: "smooth" })
                }}
                />
              </Box>
            ))
          ) : (
            <Typography>Loading...</Typography>
          )}
        </Slider >
      </Box >
    </>
  );
}
