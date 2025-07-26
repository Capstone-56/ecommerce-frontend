/** Constants for global usages */
export class Constants {
  // Caching
  public static readonly LOCAL_STORAGE_EXAMPLE: string = "cache-example";

  /** Storage name to be used in browser for cart state, only for un-authenticated users.  */
  public static readonly LOCAL_STORAGE_CART_STORAGE: string = "cart-storage";
  /** Storage name to be used in browser for authentication state.  */
  public static readonly LOCAL_STORAGE_AUTHENTICATION_STORAGE: string = "authenticated";
  /** Storage name to be used in browser for user state. */
  public static readonly LOCAL_STORAGE_USER_STORAGE: string = "user-storage";
  /** Storage name to be used in browser for location state. */
  public static readonly LOCAL_STORAGE_LOCATION_STORAGE: string = "location-storage";

  // routes for navigation
  public static readonly CART_ROUTE: string = "/cart";
  public static readonly ADMIN_DASHBOARD_ROUTE: string = "/admin";
  public static readonly HOME_ROUTE: string = "/";
  public static readonly PRODUCTS_ROUTE: string = "/products";
  public static readonly CATEGORIES_ROUTE: string = "/categories";
  public static readonly ABOUT_ROUTE: string = "/about";
  public static readonly CHECKOUT_ROUTE: string = "/checkout";
  public static readonly LOGIN_ROUTE: string = "/login";
  public static readonly SIGNUP_ROUTE: string = "/signup";
  public static readonly PROFILE_ROUTE: string = "/profile";

  // events
  public static readonly EVENT_CART_UPDATED: string = "event-cart-updated";
}
