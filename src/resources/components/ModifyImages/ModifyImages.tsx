import { ProductModel } from "@/domain/models/ProductModel";
import { ProductService } from "@/services/product-service";
import { Box, Button, CardMedia, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Typography } from "@mui/material";
import { StatusCodes } from "http-status-codes";
import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import { VisuallyHiddenInput } from "../AdminPage/ProductManagement/AddProduct/ProductInformation";

const productService = new ProductService();

export interface ModifyImagesProps {
  product: ProductModel
  onImagesUpdated: () => void;
}

export default function ModifyImages(props: ModifyImagesProps) {
  const [open, setOpen] = useState(false);

  const removeImage = useCallback(async (imageToRemove: string) => {
    if (!props.product.images) return;
    const updatedImageList = props.product.images.filter((image) => image !== imageToRemove);

    const requestBody = {
      images: updatedImageList
    };

    const response = await productService.updateProductPartial(props.product.id, requestBody);

    if (response == StatusCodes.OK) {
      toast.success("Successfully removed image")
      setOpen(false);
      props.onImagesUpdated?.();
    } else {
      toast.error("Failed to remove image try again later")
    }

  }, [props.product.images])

  const uploadImage = useCallback(async (uploadedImage: FileList | null) => {
    if (!uploadedImage) return;
    const uploadImageResponse = await productService.uploadImage(uploadedImage[0], props.product.id);

    if (uploadImageResponse.status == StatusCodes.OK) {
      const updatedImageList = props.product.images?.concat(uploadImageResponse.imageURL[0]);
      const requestBody = {
        images: updatedImageList
      };

      const updateProductResponse = await productService.updateProductPartial(props.product.id, requestBody);

      if (updateProductResponse != StatusCodes.OK) {
        toast.error("Failed to remove image try again later")
      }

      toast.success("Successfully removed image");
      setOpen(false);
      props.onImagesUpdated?.();
    } else {
      toast.error("Failed to remove image try again later")
    }

  }, [props.product.id])

  return (
    <Box p={1}>
      <Button
        fullWidth
        color="primary"
        variant={"contained"}
        onClick={() => setOpen(true)}
      >
        Modify Image List
      </Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Current Product Images
        </DialogTitle>
        <DialogContent>
          {props.product.images ?
            props.product.images.map((image) => {
              return (
                <Grid container spacing={4}>
                  <Grid size={6}>
                    <CardMedia
                      component="img"
                      image={image}
                      sx={{
                        width: "150px",
                        height: "150px",
                        objectFit: "cover",
                        aspectRatio: 1 / 1,
                        p: 1
                      }}
                    />
                  </Grid>
                  <Grid size={6} container justifyContent={"center"} alignItems={"center"}>
                    <Button onClick={() => removeImage(image)}>Remove</Button>
                  </Grid>
                </Grid>
              )
            })
            :
            <Typography>No images to display</Typography>
          }
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            component="label"
            role={undefined}
            variant="text"
            tabIndex={-1}
          >
            <VisuallyHiddenInput
              type="file"
              onChange={(uploadEvent) => { uploadImage(uploadEvent.target.files) }}
              multiple={false}
            />
            Upload Image
          </Button>
        </DialogActions>
      </Dialog>
    </Box >
  )
}
