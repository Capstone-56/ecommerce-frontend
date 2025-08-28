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
    search?: string
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
   * @returns A set of featured products.
   */
  async getFeaturedProducts(): Promise<ProductModel[]> {
    try {
      const baseUrl = `/api/product/featured`;
      const products = await api.get(baseUrl);

      return products.data;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * An endpoint to retrieve a set of related products.
   * @returns A set of related products.
   */
  async getRelatedProducts(productId?: string): Promise<ProductModel[]> {
    try {
      const baseUrl = `/api/product/${productId}/related`;
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
    price: number,
    locations: string,
    permutations: Record<string, string>[],
    variations: Record<string, string>[][]
  ): Promise<number> {
    try {
      const baseUrl = "/api/product";
      const formattedPermutations = permutations.map((permutation, idx) => ({
        sku: permutation.sku,
        stock: permutation.stock,
        price: price,
        imageUrls: [],
        variations: variations[idx]
      }))

      const dataToSend = {
        name: productName,
        description: productDescription,
        featured: featured,
        category: category,
        images: [],
        product_items: formattedPermutations,
        locations: locations
      }

      const response = await api.post(baseUrl, dataToSend);
      return response.status

    } catch (error) {
      return Promise.reject(error);
    }
  }
}
