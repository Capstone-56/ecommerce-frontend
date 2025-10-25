import { OrderModel, OrderStatusModel } from "@/domain/models/OrderModel";
import { OrderService } from "@/services/order-service";
import {
  Box,
  Drawer,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography
} from "@mui/material";
import { useEffect, useState } from "react";
import { determineBackgroundColor, displayOrderDate } from "../util/Utils";
import VisibilityIcon from '@mui/icons-material/Visibility';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import EditIcon from '@mui/icons-material/Edit';
import { OrderStatus } from "@/domain/enum/orderStatus";

const orderService = new OrderService();

/**
 * Order history page for admins to see their latest orders.
 */
export default function OrderHistory() {
  const [orders, setOrders] = useState<OrderModel[]>();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [open, setOpen] = useState(false);
  const [drawerOrder, setDrawerOrder] = useState<OrderModel>();
  const [paymentIntent, setPaymentIntent] = useState<OrderStatusModel>();
  const [editOrderStatus, setEditOrderStatus] = useState(false);

  /**
   * Toggles the drawer to be open.
   * @param open  A boolean determining whether to open the drawer or not.
   * @param order The order to open the drawer with. 
   */
  const toggleDrawer = (open: boolean, order?: OrderModel) => () => {
    if (order) {
      setDrawerOrder(order);
      fetchPaymentGatewayDetails(order.paymentIntentId);
    };
    setEditOrderStatus(false);
    setOpen(open);
  };

  /**
   * A useEffect required to get orders.
   */
  useEffect(() => {
    fetchOrders();
  }, []);

  /**
   * Sets list of orders.
   */
  const fetchOrders = async () => {
    setOrders(await orderService.getLatestOrders());
  }

  /**
   * Gets the payment gateway details, i.e. details from STRIPE.
   * @param paymentIntent The ID from the payment gateway.
   */
  const fetchPaymentGatewayDetails = async (paymentIntent: string) => {
    const response = await orderService.getStripeDetails(paymentIntent);
    setPaymentIntent(response);
  }

  /**
   * Handles page change for the table.
   * @param event   The triggered event from user interaction.
   * @param newPage The new page the user wishes to travel to.
   */
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  /**
   * Handles row size changes for user display.
   * @param event The triggered event from user interaction.
   */
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <Typography variant={"h4"} sx={{ minWidth: "75%" }} pb={2}>Order History</Typography>
      <Paper sx={{ borderRadius: 4 }}>
        <TableContainer sx={{ maxHeight: "70vh", minHeight: "70vh", borderRadius: 4 }}>
          <Table stickyHeader sx={{ minWidth: 650, tableLayout: "fixed" }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    backgroundColor: "#212E4A",
                    color: "#8EB5C0",
                    fontWeight: "bold"
                  }}>
                  Order Number
                </TableCell>
                <TableCell
                  sx={{
                    backgroundColor: "#212E4A",
                    color: "#8EB5C0",
                    fontWeight: "bold"
                  }}>
                  Purchase Date
                </TableCell>
                <TableCell
                  sx={{
                    backgroundColor: "#212E4A",
                    color: "#8EB5C0",
                    fontWeight: "bold"
                  }}>
                  Customer Name
                </TableCell>
                <TableCell
                  sx={{
                    backgroundColor: "#212E4A",
                    color: "#8EB5C0",
                    fontWeight: "bold"
                  }}>
                  Price Total
                </TableCell>
                <TableCell
                  sx={{
                    backgroundColor: "#212E4A",
                    color: "#8EB5C0",
                    fontWeight: "bold"
                  }}>
                  Order Status
                </TableCell>
                <TableCell
                  sx={{
                    backgroundColor: "#212E4A",
                    color: "#8EB5C0",
                    fontWeight: "bold"
                  }}>
                  Controls
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders ? orders.map((order) =>
                <TableRow>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{displayOrderDate(order.createdAt)}</TableCell>
                  <TableCell>{order.user ? order.user.username : order.guestUser.email}</TableCell>
                  <TableCell>{order.totalPrice}</TableCell>
                  <TableCell>
                    <Typography
                      variant={"subtitle2"}
                      fontWeight="500"
                      bgcolor={determineBackgroundColor(order.status)} color={"white"}
                      p={0.5}
                      borderRadius={10}
                      maxWidth={"50%"}
                      textAlign={"center"}
                    >
                      {order.status[0].toUpperCase() + order.status.slice(1)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={toggleDrawer(true, order)}>
                      <VisibilityIcon></VisibilityIcon>
                    </IconButton>
                  </TableCell>
                </TableRow>
              )
                :
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Typography variant={"body1"} color={"textDisabled"}>No orders present</Typography>
                  </TableCell>
                </TableRow>
              }
            </TableBody>
          </Table>
        </TableContainer >
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={orders ? orders.length : 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
        <Drawer open={open} onClose={toggleDrawer(false)} anchor={"right"}>
          <Box width={"500px"}>
            <Grid container>
              <Grid size={1} p={2}>
                <IconButton onClick={() => {
                  setOpen(false);
                }}>
                  <KeyboardDoubleArrowLeftIcon color={"info"} />
                </IconButton>
              </Grid>
              <Grid size={11}>
                <Typography textAlign={"center"} p={2} variant={"h5"}>{drawerOrder?.id} Breakdown</Typography>
              </Grid>
            </Grid>
            {drawerOrder ?
              <Box>
                <Typography variant={"h6"} fontSize={18} p={2}>Purchased Products</Typography>
                {drawerOrder.items && drawerOrder.items.map((item) => {
                  return (
                    <Box maxHeight={"250px"} overflow={"auto"}>
                      <Grid container pl={2}>
                        <Grid size={4}>
                          <Box
                            component="img"
                            src={item.productItem.product.images![0]}
                            alt={item.productItem.product.name}
                            sx={{
                              width: 128,
                              height: 128,
                              borderRadius: 2,
                              objectFit: "cover",
                              mr: 2,
                            }}
                          />
                        </Grid>
                        <Grid size={8}>
                          <Typography>
                            {item.productItem.product.name}
                          </Typography>
                          <Typography>
                            {item.productItem.sku}
                          </Typography>
                          <Typography pt={2}>
                            Price Per Unit: {item.productItem.price}
                          </Typography>
                          <Typography>
                            Amount Purchased: {item.quantity}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Box>
                  )
                })}
                <Typography variant={"h6"} fontSize={18} pl={2} pt={2}>Payment details</Typography>
                {paymentIntent &&
                  <Box pl={2}>
                    <Typography>Payment Status: {paymentIntent.status.charAt(0).toUpperCase() + paymentIntent.status.slice(1)}</Typography>
                    <Typography>Amount: {paymentIntent.amount ? (paymentIntent.amount / 100).toFixed(2) : "Not Available"}</Typography>
                    <Typography>Currency Type: {paymentIntent.currency?.toUpperCase()}</Typography>
                  </Box>
                }
                <Typography variant={"h6"} fontSize={18} pl={2} pt={2}>Shipping details</Typography>
                <Box pl={2}>
                  <Typography>Billing Name: {
                    drawerOrder.user ? drawerOrder.user.firstName + " " + drawerOrder.user.lastName :
                      drawerOrder.guestUser.firstName + " " + drawerOrder.guestUser.lastName}</Typography>
                  <Typography>Address: {drawerOrder.address.addressLine}</Typography>
                  <Typography>City: {drawerOrder.address.city}</Typography>
                  <Typography>Postcode: {drawerOrder.address.postcode}</Typography>
                  <Typography>State: {drawerOrder.address.state}</Typography>
                  <Typography>Country: {drawerOrder.address.country}</Typography>
                  {/* <Typography>Shipping Vendor: {drawerOrder.shippingVendor.name}</Typography> */}
                </Box>
                <Box display="flex" alignItems="center" pl={2} pt={2}>
                  <Typography variant="h6" fontSize={18}>Order Status</Typography>
                  <IconButton onClick={() => setEditOrderStatus(!editOrderStatus)}>
                    <EditIcon />
                  </IconButton>
                </Box>
                <Box pl={2}>
                  {editOrderStatus ?
                    <TextField
                      select
                      defaultValue={"initial"}
                      onChange={(e) => {
                        const requestBody = {
                          id: drawerOrder.id,
                          updatedStatus: e.target.value
                        }
                        orderService.updateOrderStatus(requestBody).finally(() => {
                          setEditOrderStatus(false);
                          fetchOrders();
                          setDrawerOrder(prev =>
                            prev ? { ...prev, status: e.target.value as OrderStatus } : prev
                          );
                        })
                      }}
                      sx={{ pb: 2, minWidth: "60%", mr: "10px" }}
                    >
                      <MenuItem key={"initial"} value={"initial"} disabled>
                        Choose new order status...
                      </MenuItem>
                      {Object.values(OrderStatus)?.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </TextField> :
                    <Typography>
                      Current Status: {drawerOrder.status.charAt(0).toUpperCase() + drawerOrder.status.slice(1)}
                    </Typography>
                  }
                </Box>
              </Box>

              : ""}
          </Box>
        </Drawer>
      </Paper >
    </>
  );
};
