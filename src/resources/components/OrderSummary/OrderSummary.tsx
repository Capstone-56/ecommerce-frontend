import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Divider,
  Button,
} from "@mui/material";
import { common } from "@mui/material/colors";
import { ShoppingCartItemModel, LocalShoppingCartItemModel } from "@/domain/models/ShoppingCartItemModel";
import { Constants } from "@/domain/constants";

interface ProductCardProps {
  cartState: Array<ShoppingCartItemModel | LocalShoppingCartItemModel>;
}

/**
 * OrderSummary component used to display the summary of a user's cart.
 * Calculates price, delivery and tax and presents a total to the user.
 * TODO: Implement tax and delivery.
 */
const OrderSummary: React.FC<ProductCardProps> = ({ cartState }) => {
  /**
   * A function to calculate the total price of all items within the cart.
   * @param productList The list of products in the user's cart.
   * @returns Total price.
   */
  function calculateTotalPrice(productList: Array<ShoppingCartItemModel | LocalShoppingCartItemModel>): string {
    let price: number = 0;

    productList.forEach((cartItem) => {
      const itemPrice = cartItem?.productItem?.price || 0;
      const itemQuantity = cartItem?.quantity || 0;
      price += itemPrice * itemQuantity;
    });
    
    return price.toFixed(2);
  }

  /**
   * Redirects user to products screen.
   */
  const handleContinueShopping = () => {
    window.location.href = Constants.PRODUCTS_ROUTE;
  };

  /**
   * Redirects user to checkout screen.
   */
  const handleCheckout = () => {
    window.location.href = Constants.CHECKOUT_ROUTE;
  };

  return (
    <Card
      sx={{
        width: "100%",
        minWidth: "50%",
        maxHeight: 500,
        minHeight: 300,
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.2s",
        cursor: "pointer",
        overflow: "hidden",
        border: "1px solid",
        borderRadius: "10px",
      }}
    >
      <CardContent>
        <Typography
          variant="h5"
          sx={{
            textAlign: "center",
            fontWeight: "bold",
            marginBottom: "30px",
          }}
        >
          Order Summary
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Typography
            variant="body1"
            sx={{
              textAlign: "left",
            }}
          >
            Items
          </Typography>
          <Typography
            variant="body1"
            sx={{
              textAlign: "right",
            }}
          >
            {cartState.length > 0 ? calculateTotalPrice(cartState) : "-"}
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "2px",
          }}
        >
          <Typography
            variant="body1"
            sx={{
              textAlign: "left",
            }}
          >
            GST
          </Typography>
          <Typography
            variant="body1"
            sx={{
              textAlign: "right",
            }}
          >
            0
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Typography
            variant="body1"
            sx={{
              textAlign: "left",
            }}
          >
            Delivery
          </Typography>
          <Typography
            variant="body1"
            sx={{
              textAlign: "right",
            }}
          >
            TBD
          </Typography>
        </Box>

        <Divider
          sx={{
            alignSelf: "center",
            borderBottomWidth: "1px",
            backgroundColor: common.black,
            marginTop: "10px",
            marginBottom: "10px",
          }}
        ></Divider>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "10px",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              textAlign: "left",
              fontWeight: "bold",
            }}
          >
            Total
          </Typography>
          <Typography
            variant="body1"
            sx={{
              textAlign: "right",
              fontWeight: "bold",
            }}
          >
            {calculateTotalPrice(cartState)}
          </Typography>
        </Box>

        <Button
          variant="contained"
          color="primary"
          disabled={cartState.length === 0}
          sx={{
            width: "100%",
            alignSelf: "center",
            marginBottom: "10px",
          }}
          onClick={() => handleCheckout()}
        >
          Checkout
        </Button>
        <Button
          variant="contained"
          sx={{
            backgroundColor: common.black,
            color: common.white,
            width: "100%",
            alignSelf: "center",
            marginBottom: "10px",
          }}
          onClick={() => handleContinueShopping()}
        >
          Continue shopping
        </Button>
      </CardContent>
    </Card>
  );
};

export default OrderSummary;
