import { Box, Button, Tab, Tabs, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import ProductInformation from "./ProductInformation";
import StockInformation from "./StockInformation";

export interface FileWithPreview {
  file: File,
  previewImage: string;
}

/**
 * Add product page that presents a form to create a new product.
 */
export default function AddProduct() {
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [category, setCategory] = useState("initial");
  const [locations, setLocations] = useState<string[]>([]);
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [price, setPrice] = useState(0);
  const [featured, setFeatured] = useState<string>("");
  const [tabNumber, setTabNumber] = useState<number>(0);

  /**
   * A useEffect required to get product categories.
   */
  useEffect(() => {
  }, []);

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
      <Typography pb={2} variant={"h4"}>Add Product</Typography>
      <Tabs value={tabNumber} onChange={handleTabChange} aria-label="basic tabs example">
        <Tab label="Product Information" />
        <Tab label="Stock Information" disabled={category === "initial" ||
          productName === "" ||
          productDescription === "" ||
          locations.length === 0 ||
          price === 0} />
      </Tabs>
      {tabNumber == 0 && (
        <Box>
          <ProductInformation
            productName={productName}
            setProductName={setProductName}
            productDescription={productDescription}
            setProductDescription={setProductDescription}
            category={category}
            setCategory={setCategory}
            price={price}
            setPrice={setPrice}
            locations={locations}
            setLocations={setLocations}
            files={files}
            setFiles={setFiles}
            featured={featured}
            setFeatured={setFeatured}
          />
          <Box display={"flex"} justifyContent={"right"} pt={1}>
            <Button
              variant={"contained"}
              onClick={() => setTabNumber(1)}
              disabled={
                category === "initial" ||
                productName === "" ||
                productDescription === "" ||
                locations.length === 0 ||
                price === 0 ||
                featured === ""
              }
            >
              Next →
            </Button>
          </Box>
        </Box>
      )}
      {tabNumber == 1 && (
        <Box>
          <StockInformation
            category={category}
            productName={productName}
            productDescription={productDescription}
            price={price}
            locations={locations}
            images={files}
            featured={featured}
          />
        </Box>
      )}
    </Box >
  );
};
