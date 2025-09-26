import { OrderStatus } from "@/domain/enum/orderStatus";

/**
   * Turns the timestamp saved in database to a human readable format and
   * strips the time to return the date in a dd/mm/yyyy format.
   * @param createdDate The created date of the order.
   * @returns A human readable date in the format of dd/mm/yyyy.
   */
export function displayOrderDate(createdDate: string) {
  const dateObject = new Date(createdDate);
  return dateObject.toLocaleString().split(",")[0];
};

/**
   * Determines the background colour of the displayed order status.
   * Depending on the status of the order i.e. "SHIPPED" it will change colour
   * to a more representative colour.
   * @param orderStatus The current status the order is in.
   * @returns A colour based on the status.
   */
export function determineBackgroundColor(orderStatus: string) {
  switch (orderStatus) {
    case OrderStatus.PROCESSING.valueOf():
    case OrderStatus.PENDING.valueOf():
    case OrderStatus.SHIPPED.valueOf():
      return "#4254FB";
    case OrderStatus.CANCELLED.valueOf():
      return "red";
    case OrderStatus.DELIVERED.valueOf():
      return "green";
  };
};