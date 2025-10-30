import { ProductModel } from "@/domain/models/ProductModel";
import { ProductService } from "@/services/product-service";
import { useEffect, useState } from "react";
import ProductCard from "../ProductCard/ProductCard";
import ProductCardSkeleton from "../ProductCard/ProductCardSkeleton";
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
  const [loading, setLoading] = useState<boolean>(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const userLocation = locationState((state) => state.userLocation);
  const userCurrency = locationState((state) => state.getUserCurrency());
  const navigate = useNavigate();

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    beforeChange: (current: number, next: number) => setCurrentSlide(next),
    responsive: [
      {
        breakpoint: 2100,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 1400,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 1000,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 700,
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
    setLoading(true);
    try {
      const productService = new ProductService();
      const response = await productService.getRelatedProducts(props.product.id, userLocation, userCurrency);
      if (response) {
        setRelatedProducts(response);
      } else {
        console.log("Error retrieving related products, " + response);
      }
    } catch (error) {
      console.error("Error retrieving related products", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Box
        sx={{
          width: "90%",
          maxWidth: "1680px",
          mx: "auto",
        }}
      >
        <Typography
          sx={{
            textAlign: { xs: "center", md: "left" },
            margin: "2rem 0",
            fontSize: { xs: "20px", sm: "20px", md: "24px" },
          }}
          variant="h5"
          fontWeight="bold"
          gutterBottom
        >
          Related Products
        </Typography>
      </Box>
      <Box
        sx={{
          width: "90%",
          maxWidth: "1680px",
          mx: "auto",
          position: "relative",
          mb: "100px"
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
              {loading ? (
                // Show skeleton cards while loading
                Array.from({ length: 5 }).map((_, index) => (
                  <Box key={`skeleton-${index}`} sx={{
                    display: "flex !important",
                    justifyContent: "center",
                    px: 1,
                  }}>
                    <ProductCardSkeleton />
                  </Box>
                ))
              ) : relatedProducts.length > 0 ? (
                relatedProducts.map((product) => (
                  <Box key={product.id} sx={{
                    display: "flex !important",
                    justifyContent: "center",
                    px: 1,
                  }}>
                    <ProductCard product={product} width="100%" height="auto" onClickCallback={() => {
                      navigate(`/products/${product.id}/details`);
                      window.scrollTo({ top: 0, behavior: "smooth" })
                    }}
                    />
                  </Box>
                ))
              ) : (
                <Typography>No related products available</Typography>
              )}
            </Slider >
            {/* Slide counter */}
            {!loading && relatedProducts.length > 0 && (
              <Typography
                variant="body2"
                sx={{
                  textAlign: "center",
                  mt: 2,
                  color: "text.secondary",
                  fontSize: "14px",
                }}
              >
                {currentSlide + 1}/{relatedProducts.length}
              </Typography>
            )}
      </Box >
    </>
  );
}
