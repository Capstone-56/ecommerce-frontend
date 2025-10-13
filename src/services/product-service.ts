import api from "@/api";

import { PagedList } from "@/domain/abstract-models/PagedList";
import { ProductModel } from "@/domain/models/ProductModel";
import { FileWithPreview } from "@/resources/components/AdminPage/ProductManagement/AddProduct/AddProduct";

export class ProductService {
  /**
   * An endpoint to retrieve products stored in the database.
   * @param page     The page number to retrieve.
   * @param pageSize Size of the page / number of products to be returned.
   * @param priceMin Minimum price filter.
   * @param priceMax Maximum price filter.
   * @param sort Sorting option (e.g., 'priceAsc', 'priceDesc').
   * @param colour Colour filter.
   * @param categories Comma-separated string of category UUIDs.
   * @returns A paged result of products.
   */
  async listProducts(
    page?: number,
    pageSize?: number,
    priceMin?: number,
    priceMax?: number,
    sort?: string,
    colour?: string,
    categories?: string,
    search?: string,
    userLocation?: string | null
  ): Promise<PagedList<ProductModel>> {
    try {
      const params = new URLSearchParams();
      if (page) params.append("page", page.toString());
      if (pageSize) params.append("pageSize", pageSize.toString());
      if (priceMin) params.append("priceMin", priceMin.toString());
      if (priceMax) params.append("priceMax", priceMax.toString());
      if (sort) params.append("sort", sort);
      if (colour) params.append("colour", colour);
      if (categories) params.append("categories", categories);
      if (search) params.append("search", search);
      if (userLocation) params.append("location", userLocation);

      const baseUrl = `/api/product?${params.toString()}`;

      const products = await api.get(baseUrl);
      return products.data;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * An endpoint to retrieve a particular product based on an ID.
   * @param productId An ID of a product to be retrieved.
   * @returns A product's related information.
   */
  async getProduct(productId: string): Promise<ProductModel> {
    try {
      const baseUrl = `/api/product/${productId}`;
      const products = await api.get(baseUrl);

      return products.data;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * An endpoint to retrieve a set of featured products.
   * @param userLocation Optional location filter for products.
   * @returns A set of featured products.
   */
  async getFeaturedProducts(userLocation?: string | null): Promise<ProductModel[]> {
    try {
      const params = new URLSearchParams();
      if (userLocation) params.append("location", userLocation);

      const baseUrl = `/api/product/featured${params.toString() ? `?${params.toString()}` : ''}`;
      const products = await api.get(baseUrl);

      return products.data;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * An endpoint to retrieve a set of related products.
   * @param productId The ID of the product to get related products for.
   * @param userLocation Optional location filter for products.
   * @returns A set of related products.
   */
  async getRelatedProducts(productId?: string, userLocation?: string | null): Promise<ProductModel[]> {
    try {
      const params = new URLSearchParams();
      if (userLocation) params.append("location", userLocation);

      const baseUrl = `/api/product/${productId}/related${params.toString() ? `?${params.toString()}` : ''}`;
      const relatedProducts = await api.get(baseUrl);

      return relatedProducts.data;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * An endpoint to create a product with a set of variations.
   * @returns A status code.
   */
  async addProduct(
    productName: string,
    productDescription: string,
    category: string,
    featured: string,
    images: FileWithPreview[],
    locations: string[],
    permutations: Record<string, string>[],
    variations: Record<string, string>[][],
    locationPricing?: {country_code: string, price: number}[],
  ): Promise<{ errorMessage?: string, status: number }> {
    try {
      const baseUrl = "/api/product";
      const formattedPermutations = permutations.map((permutation, idx) => ({
        location: permutation.location,
        sku: permutation.sku,
        stock: permutation.stock,
        variations: variations[idx]
      }))

      const formData = new FormData();

      // Normal fields.
      formData.append("name", productName);
      formData.append("description", productDescription);
      formData.append("featured", String(featured));
      formData.append("category", category);

      locations.forEach((location) => {
        formData.append("locations", location);
    })

      // Images (append each file separately).
      images.forEach((file) => {
        formData.append("images", file.file);
      });

      // Nested objects.
      formData.append("product_items", JSON.stringify(formattedPermutations));
    
    // Append location_pricing
    formData.append("location_pricing", JSON.stringify(locationPricing));

      const response = await api.post(baseUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return { status: response.status };

    } catch (error: any) {
      const status = error.response?.status ?? 500; // fallback to 500 if undefined
      const message = error.response?.data?.message ?? "Failed to create product";

      return { status, errorMessage: message };
    }
  }

  /**
   * An endpoint to partially update a particular product.
   * @param productId   The ID of the product to be updated.
   * @param requestBody A JSON object containing the appropriate fields to create
  *                     a new product item.
   * @returns A HTTP status.
   */
  async updateProductPartial(productId: string, requestBody: object): Promise<number> {
    try {
      const baseUrl = `/api/product/${productId}`;

      const productItems = await api.patch(baseUrl, requestBody);

      return productItems.status;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * An endpoint to upload an for a product.
   * @param image     The Image to be uploaded.   
   * @param productId The ID of the product for which the image is intended for.
   * @returns An image URL along with a HTTP status.
   */
  async uploadImage(image: File, productId: string): Promise<{ imageURL: string, status: number }> {
    try {
      const baseUrl = `/api/product/${productId}/upload/image`;
      const formData = new FormData();

      formData.append("images", image);

      const response = await api.post(baseUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return { imageURL: response.data, status: response.status };
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
