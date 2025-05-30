/** Constants for global usages */
export class Constants {
  // Caching
  public static readonly LOCAL_STORAGE_EXAMPLE: string = "cache-example";

  /** Storage name to be used in browser for cart state.  */
  public static readonly LOCAL_STORAGE_CART_STORAGE: string = "cart-storage";
  /** Storage name to be used in browser for authentication state.  */
  public static readonly LOCAL_STORAGE_AUTHENTICATION_STORAGE: string = "authenticated";
  /** Storage name to be used in browser for location state. */
  public static readonly LOCAL_STORAGE_LOCATION_STORAGE: string = "location-storage";

  // routes for navigation
  public static readonly CART_ROUTE: string = "/cart";
  public static readonly ADMIN_DASHBOARD_ROUTE: string = "/admin";
}
