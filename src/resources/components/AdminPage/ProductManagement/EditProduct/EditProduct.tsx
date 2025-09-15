import { Box, Tab, Tabs, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import EditGeneralInformation from "./EditGeneralInformation";
import EditStockInformation from "./EditStockInformation";
import { toast } from "react-toastify";
import { ProductModel } from "@/domain/models/ProductModel";
import { ProductService } from "@/services/product-service";
import { useLocation } from "react-router-dom";

const productService = new ProductService();

/**
 * Edit product page that presents a form to edit an existing product.
 */
export default function EditProduct() {
  const [tabNumber, setTabNumber] = useState<number>(0);
  const [value, setValue] = useState<string>("");
  const [draft, setDraft] = useState<Partial<ProductModel>>({});
  const [product, setProduct] = useState<ProductModel>();

  const location = useLocation();
  // Gets product ID in url.
  const { productId } = location.state;

  /**
   * A useEffect required to get required information.
   */
  useEffect(() => {
    fetchRequiredInformation();
  }, []);

  /**
   * A function that gets the required information to display product
   * information properly.
   */
  async function fetchRequiredInformation() {
    try {
      const response = await productService.getProduct(productId);
      setProduct(response);
      setValue(response.featured.toString());
      setDraft({
        name: response.name,
        description: response.description,
        price: response.price,
        featured: response.featured,
        category: response.category,
        locations: response.locations,
      });
    } catch (error) {
      toast.error("Failed to fetch products");
    }
  }

  /**
   * Handles the changing between tabs. Renders a different component
   * depending on the table value provided.
   * @param newValue The tab to show.
   */
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabNumber(newValue);
  };

  return (
    <Box>
      <Typography pb={2} variant={"h4"}>Edit Product</Typography>
      <Tabs value={tabNumber} onChange={handleTabChange} aria-label="basic tabs example">
        <Tab label="General Information" />
        <Tab label="Stock Information" />
      </Tabs>
      {tabNumber == 0 && (
        <Box>
          <EditGeneralInformation
            product={product!}
            setDraft={setDraft}
            setValue={setValue}
            value={value}
            draft={draft} />
        </Box>
      )}
      {tabNumber == 1 && (
        <Box>
          <EditStockInformation
            productId={productId}
            categoryId={product?.category}
            draft={draft}
            setDraft={setDraft}
          />
        </Box>
      )}
    </Box >
  );
};
