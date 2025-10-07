import { Box, CircularProgress, Dialog, DialogContent, DialogContentText, Typography } from "@mui/material";

interface ProcessingDialogProps {
  openDialog: boolean,
  dialogHeading: string
}

export default function ProcessingDialog(props: ProcessingDialogProps) {
  return (
    <Dialog
      open={props.openDialog}
    >
      <DialogContent>
        <DialogContentText>
          <Typography variant={"h5"} pr={3} pl={3} color="black">{props.dialogHeading}</Typography>
          <Box display={"flex"} justifyContent={"center"} p={3}>
            <CircularProgress />
          </Box>
        </DialogContentText>
      </DialogContent>
    </Dialog >
  )
}
