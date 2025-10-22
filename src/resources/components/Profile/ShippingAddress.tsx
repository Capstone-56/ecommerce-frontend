import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  Tooltip,
  Divider,
  CircularProgress,
  Grid,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";

import { AddressService } from "@/services/address-service";
import type {
  AddressModelData,
  AddressModel,
} from "@/domain/models/AddressModel";
import { toast } from "react-toastify";

const addressService = new AddressService();

/**
 * ShippingAddress
 * @description Page to allow users to view, add, update or delete their addresses
 */
const ShippingAddress: React.FC = () => {
  const [addresses, setAddresses] = useState<AddressModelData[]>([]);
  const [editing, setEditing] = useState<AddressModelData | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AddressModelData | null>(
    null
  );
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // used in both initial load and refetch after CRUD
  const refreshAddresses = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await addressService.listAddresses();
      setAddresses(data || []);
    } catch (err: any) {
      console.error("Failed to load addresses", err);
      setLoadError(err?.message || "Failed to load addresses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      if (!mounted) return;
      await refreshAddresses();
    };
    init();
    return () => {
      mounted = false;
    };
  }, []);

  const openAdd = () => {
    const empty: AddressModel = {
      addressLine: "",
      city: "",
      postcode: "",
      state: "",
      country: "",
    };

    setEditing({ id: "", address: empty, isDefault: false });
    setDialogOpen(true);
  };

  const openEdit = (addr: AddressModelData) => {
    setEditing(JSON.parse(JSON.stringify(addr)) as AddressModelData);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditing(null);
  };

  const handleChange = (key: keyof AddressModel, value: string) => {
    if (!editing) return;
    setEditing({
      ...editing,
      address: {
        ...editing.address,
        [key]: value,
      },
    });
  };

  const handleDefaultChange = (checked: boolean) => {
    if (!editing) return;
    setEditing({
      ...editing,
      isDefault: checked,
    });
  };

  const handleSave = async () => {
    if (!editing) return;
    if (
      !editing.address.addressLine.trim() ||
      !editing.address.city.trim() ||
      !editing.address.postcode.trim()
    ) {
      return;
    }

    setSaving(true);
    try {
      const payload = {
        addressLine: editing.address.addressLine,
        city: editing.address.city,
        state: editing.address.state,
        postcode: editing.address.postcode,
        country: editing.address.country,
        makeDefault: !!editing.isDefault,
      };

      // If id present -> update (PUT /api/address/{id})
      if (editing.id) {
        const res = await addressService.updateAddress(
          editing.id,
          payload as any
        );

        const returned: AddressModelData = (res &&
          (res.data ?? res)) as AddressModelData;

        if (returned && returned.id) {
          setAddresses((prev) =>
            prev.map((p) => (p.id === returned.id ? returned : p))
          );
        } else {
          await refreshAddresses();
        }
      } else {
        // create address instead - no id present
        const res = await addressService.addAddress(payload as any);
        const returned: AddressModelData = (res &&
          (res.data ?? res)) as AddressModelData;
        if (returned && returned.id) {
          setAddresses((prev) => [...prev, returned]);
        } else {
          // fallback: refresh
          await refreshAddresses();
        }
      }

      closeDialog();
    } catch (err) {
      console.error("Failed to save address", err);
      // optionally show toast / set error state
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = (addr: AddressModelData) => {
    setDeleteTarget(addr);
  };

  const cancelDelete = () => {
    setDeleteTarget(null);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await addressService.deleteAddress(deleteTarget.id);
      // backend returns 204 on success; service may return status or truthy value
      const ok =
        (typeof res === "number" && res >= 200 && res < 300) ||
        (res && (res.status ?? 0) >= 200 && (res.status ?? 0) < 300) ||
        res === true;
      if (!ok) throw new Error("Delete failed");

      toast.success("Successfully deleted address");
      await refreshAddresses();
      setDeleteTarget(null);
    } catch (err) {
      console.error("Failed to delete address", err);
    } finally {
      setDeleting(false);
    }
  };

  // Set an address as default (PUT /api/address/{id} with makeDefault: true)
  const handleSetDefault = async (addr: AddressModelData) => {
    if (addr.isDefault) return;
    setSaving(true);
    try {
      const payload = {
        addressLine: addr.address.addressLine,
        city: addr.address.city,
        state: addr.address.state,
        postcode: addr.address.postcode,
        country: addr.address.country,
        makeDefault: true,
      };
      await addressService.updateAddress(addr.id, payload as any);
      await refreshAddresses();
      toast.success("Default address updated");
    } catch (err) {
      console.error("Failed to set default address", err);
      toast.error("Failed to set default address");
    } finally {
      setSaving(false);
    }
  };

  const renderedRows = useMemo(() => addresses, [addresses]);

  return (
    <Box sx={{ width: "100%", maxWidth: 900, p: { xs: 1, md: 4 } }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 3 }}
      >
        <Typography variant="h5">Shipping Addresses</Typography>
        <Button startIcon={<AddIcon />} variant="contained" onClick={openAdd}>
          Add address
        </Button>
      </Stack>

      {loading ? (
        <Paper
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            py: 6,
          }}
        >
          <CircularProgress />
        </Paper>
      ) : loadError ? (
        <Paper sx={{ p: 4 }}>
          <Typography color="error">
            Failed to load addresses: {loadError}
          </Typography>
        </Paper>
      ) : (
        <Paper>
          <TableContainer>
            <Table aria-label="shipping addresses">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Default</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Address</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>City</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>State</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Postcode</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }} align="right">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {renderedRows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                      No saved addresses.
                    </TableCell>
                  </TableRow>
                ) : (
                  renderedRows.map((addr) => (
                    <TableRow key={addr.id} hover>
                      <TableCell>
                        {addr.isDefault ? (
                          <Tooltip title="Default address">
                            <StarIcon color="primary" fontSize="small" />
                          </Tooltip>
                        ) : (
                          <Tooltip title="Set as default">
                            <IconButton
                              size="small"
                              onClick={() => handleSetDefault(addr)}
                              disabled={saving}
                              sx={{ p: 0 }}
                            >
                              <StarBorderIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </TableCell>
                      <TableCell
                        sx={{
                          maxWidth: 320,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {addr.address.addressLine}
                      </TableCell>
                      <TableCell>{addr.address.city}</TableCell>
                      <TableCell>{addr.address.state}</TableCell>
                      <TableCell>{addr.address.postcode}</TableCell>
                      <TableCell align="right">
                        <Stack
                          direction="row"
                          spacing={1}
                          justifyContent="flex-end"
                        >
                          <Tooltip title="Edit">
                            <IconButton
                              size="small"
                              onClick={() => openEdit(addr)}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              onClick={() => confirmDelete(addr)}
                              disabled={addr.isDefault}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* edit / add form */}
      <Dialog open={dialogOpen} onClose={closeDialog} fullWidth maxWidth="sm">
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {editing && renderedRows.find((a) => a.id === editing.id)
            ? "Edit address"
            : "Add address"}
          <IconButton onClick={closeDialog} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={{ xs: 12 }}>
              <TextField
                label="Address line"
                placeholder="123 Example Street, Suburb"
                value={editing?.address.addressLine ?? ""}
                onChange={(e) => handleChange("addressLine", e.target.value)}
                required
                fullWidth
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="City"
                placeholder="Sydney"
                value={editing?.address.city ?? ""}
                onChange={(e) => handleChange("city", e.target.value)}
                required
                fullWidth
              />
            </Grid>

            <Grid size={{ xs: 6, sm: 3 }}>
              <TextField
                label="State"
                placeholder="NSW"
                value={editing?.address.state ?? ""}
                onChange={(e) => handleChange("state", e.target.value)}
                fullWidth
              />
            </Grid>

            <Grid size={{ xs: 6, sm: 3 }}>
              <TextField
                label="Postcode"
                placeholder="2000"
                value={editing?.address.postcode ?? ""}
                onChange={(e) => handleChange("postcode", e.target.value)}
                required
                fullWidth
                sx={{ minWidth: 120 }}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Country"
                placeholder="Australia"
                value={editing?.address.country ?? ""}
                onChange={(e) => handleChange("country", e.target.value)}
                fullWidth
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={!!editing?.isDefault}
                    onChange={(e) => handleDefaultChange(e.target.checked)}
                  />
                }
                label="Set as default address"
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={closeDialog} startIcon={<CloseIcon />}>
            Cancel
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* confirmation dialogue */}
      <Dialog open={!!deleteTarget} onClose={cancelDelete}>
        <DialogTitle>Delete address?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the address{" "}
            <strong>{deleteTarget?.address.addressLine}</strong>?
          </Typography>
        </DialogContent>
        <Divider />
        <DialogActions>
          <Button onClick={cancelDelete} startIcon={<CloseIcon />}>
            Cancel
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={handleDelete}
            disabled={deleting}
            startIcon={<DeleteIcon />}
          >
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ShippingAddress;
