import AddIcon from "@mui/icons-material/Add";
import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Grid,
  Card,
  CardContent,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  Checkbox,
  ListItemText,
} from "@mui/material";
import { useState, useEffect } from "react";
import {
  listApartMent,
  createApartMent,
  detailApartMent,
  updateApartMent,
  listResident,
} from "../../service/apartment.service";
import ClassTable from "../../components/Table";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import HomeIcon from "@mui/icons-material/Home";
import { toast } from "react-toastify";

// aaaaâ
const Apartment = () => {
  // lấy dữ liệu hàng
  const [apartment, setApartment] = useState([]);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedApartment, setSelectedApartment] = useState(null);
  const [openCreateDialog, setOpenCreateDialog] = useState(false); // Thêm state cho dialog tạo mới
  const [loading, setLoading] = useState(false);
  const [residents, setResidents] = useState([]); // Danh sách tất cả residents

  // State cho form chỉnh sửa
  const [editForm, setEditForm] = useState({
    addressNumber: "",
    area: "",
    status: "",
    ownerId: "",
    ownerPhone: "",
    memberIds: [],
  });
  // State cho form tạo mới
  const [createForm, setCreateForm] = useState({
    addressNumber: "",
    area: "",
    status: "Residential",
    ownerId: "",
    ownerPhone: "",
    memberIds: [],
  });

  const fetchApi = async () => {
    const response = await listApartMent();
    setApartment(response.data.result);
  };

  const fetchResidents = async () => {
    try {
      const response = await listResident();
      setResidents(response.data.result || []);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách cư dân:", error);
    }
  };

  useEffect(() => {
    fetchApi();
    fetchResidents();
  }, []);

  // Xử lý xem chi tiết căn hộ
  const handleViewDetail = async (apartmentId) => {
    console.log("handleViewDetail called with ID:", apartmentId);

    if (!apartmentId) {
      toast.error("Không tìm thấy ID căn hộ");
      return;
    }

    setLoading(true);
    try {
      const response = await detailApartMent(apartmentId);
      console.log("API response:", response);

      if (response && response.data) {
        setSelectedApartment(response.data);
        setOpenDetailDialog(true);
      } else {
        toast.error("Không thể lấy thông tin chi tiết căn hộ");
      }
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết căn hộ:", error);
      toast.error("Lỗi khi lấy thông tin chi tiết căn hộ");
    } finally {
      setLoading(false);
    }
  };

  // Xử lý chỉnh sửa căn hộ
  const handleEditClick = async (apartmentId) => {
    if (!apartmentId) {
      toast.error("Không tìm thấy ID căn hộ");
      return;
    }

    try {
      const response = await detailApartMent(apartmentId);
      if (response && response.data) {
        const apartmentData = response.data;
        setEditForm({
          addressNumber: apartmentData.addressNumber,
          area: apartmentData.area,
          status: apartmentData.status,
          ownerId: apartmentData.owner?.id || "",
          ownerPhone: apartmentData.ownerPhone || "",
          memberIds:
            apartmentData.residentList?.map((resident) => resident.id) || [],
        });
        setOpenEditDialog(true);
      }
    } catch (error) {
      console.error("Lỗi khi lấy thông tin căn hộ:", error);
      toast.error("Lỗi khi lấy thông tin căn hộ");
    }
  };
  // Xử lý tạo căn hộ mới
  const handleCreate = async () => {
    if (
      !createForm.addressNumber ||
      !createForm.area ||
      !createForm.status ||
      !createForm.ownerId ||
      !createForm.ownerPhone
    ) {
      toast.warning("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    try {
      const createData = {
        addressNumber: createForm.addressNumber,
        area: createForm.area,
        status: createForm.status,
        ownerId: createForm.ownerId,
        ownerPhone: createForm.ownerPhone,
        memberIds: createForm.memberIds,
      };

      console.log("Create data:", createData);

      const response = await createApartMent(createData);
      if (response) {
        toast.success("Tạo căn hộ thành công!");
        setOpenCreateDialog(false);
        // Reset form
        setCreateForm({
          addressNumber: "",
          area: "",
          status: "Residential",
          ownerId: "",
          ownerPhone: "",
          memberIds: [],
        });
        fetchApi(); // Refresh data
      }
    } catch (error) {
      console.error("Lỗi khi tạo căn hộ:", error);
      toast.error("Tạo căn hộ thất bại!");
    }
  };

  // Xử lý cập nhật căn hộ
  const handleUpdate = async () => {
    if (!editForm.area || !editForm.status || !editForm.ownerPhone) {
      toast.warning("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    try {
      const updateData = {
        area: editForm.area,
        status: editForm.status,
        ownerId: editForm.ownerId,
        ownerPhone: editForm.ownerPhone,
        residents: editForm.memberIds, // Đổi từ memberIds thành residents
      };

      console.log("Update data:", updateData);
      console.log("Address number:", editForm.addressNumber);

      const response = await updateApartMent(
        editForm.addressNumber,
        updateData
      );
      if (response) {
        toast.success("Cập nhật căn hộ thành công!");
        setOpenEditDialog(false);
        fetchApi(); // Refresh data
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật căn hộ:", error);
      toast.error("Cập nhật căn hộ thất bại!");
    }
  };

  // Định dạng ngày
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  // Định dạng trạng thái
  const getStatusColor = (status) => {
    switch (status) {
      case "Residential":
        return "#1976D2";
      case "Vacant":
        return "#C02135";
      case "Business":
        return "#4CAF50";
      default:
        return "#757575";
    }
  };

  const getResidentStatusColor = (status) => {
    switch (status) {
      case "Resident":
        return "#4CAF50";
      case "Temporary":
        return "#FF9800";
      case "Absent":
        return "#F44336";
      case "Moved":
        return "#9E9E9E";
      default:
        return "#757575";
    }
  };

  //lấy dữ liệu cột
  const columns = [
    { field: "addressNumber", headerName: "Số nhà", disableSearch: "search" },
    {
      field: "owner",
      headerName: "Chủ hộ",
      renderCell: (row) => row.owner?.name || "Chưa có",
    },
    { field: "ownerPhone", headerName: "Liên hệ" },
    { field: "numberOfMembers", headerName: "Số thành viên" },
    {
      field: "status",
      headerName: "Tình trạng",
      renderCell: (row) => {
        const status = row.status;
        const color = getStatusColor(status);
        return (
          <Box
            sx={{
              padding: "2px 8px",
              backgroundColor: `${color}22`,
              color: color,
              borderRadius: "8px",
              display: "inline-block",
              fontWeight: 500,
              fontSize: "14px",
              textAlign: "center",
            }}
          >
            {status}
          </Box>
        );
      },
    },
    {
      field: "thaoTac",
      headerName: "Hành động",
      flex: 1,
      renderCell: (params) => {
        console.log("Params structure:", params);

        return (
          <Box
            display="flex"
            justifyContent="flex-start"
            gap="15px"
            sx={{ cursor: "pointer" }}
            alignItems="center"
          >
            <VisibilityIcon
              sx={{ color: "#1976D2" }}
              onClick={() => {
                console.log("VisibilityIcon clicked!");

                const apartmentId =
                  params.row?.addressNumber ||
                  params.addressNumber ||
                  params.id ||
                  params.data?.addressNumber;

                console.log("apartmentId found:", apartmentId);

                if (apartmentId) {
                  handleViewDetail(apartmentId);
                } else {
                  console.error("No apartment ID found!");
                  toast.error("Không tìm thấy ID căn hộ");
                }
              }}
            />
            <EditIcon
              sx={{ color: "#0D81ED" }}
              onClick={() => {
                const apartmentId =
                  params.row?.addressNumber ||
                  params.addressNumber ||
                  params.id ||
                  params.data?.addressNumber;

                if (apartmentId) {
                  handleEditClick(apartmentId);
                } else {
                  toast.error("Không tìm thấy ID căn hộ");
                }
              }}
            />
          </Box>
        );
      },
    },
  ];

  return (
    <>
      {/* Tiêu đề */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          padding: "12px",
          borderRadius: "8px",
          gap: "12px",
          backgroundColor: "#FFFF",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold", color: "#C01235" }}>
          Quản lý căn hộ
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px",
            borderRadius: "10px",
          }}
        >
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#0B57D0",
              textTransform: "none",
              borderRadius: "999px",
              paddingX: 2,
              fontWeight: 500,
            }}
            onClick={() => setOpenCreateDialog(true)} // Thêm onClick handler
          >
            <AddIcon sx={{ fontSize: 18, mr: 1 }} />
            Thêm căn hộ mới
          </Button>
        </Box>
      </Box>

      {/* Bảng danh sách căn hộ */}
      <Box
        padding="12px"
        gap="12px"
        borderRadius="8px"
        backgroundColor="#fff"
        marginTop="20px"
      >
        <ClassTable columns={columns} rows={apartment} allowSearching />
      </Box>
      {/* Dialog tạo căn hộ mới */}
      <Dialog
        open={openCreateDialog}
        onClose={() => setOpenCreateDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            position: "relative",
          },
        }}
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <AddIcon sx={{ color: "#1976D2" }} />
            <Typography variant="h6">Thêm căn hộ mới</Typography>
          </Box>
          <IconButton
            onClick={() => setOpenCreateDialog(false)}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 3 }}>
          <Grid container spacing={3}>
            {/* Thông tin cơ bản */}
            <Grid item xs={12} md={6}>
              <TextField
                label="Số nhà"
                fullWidth
                value={createForm.addressNumber}
                onChange={(e) =>
                  setCreateForm({
                    ...createForm,
                    addressNumber: e.target.value,
                  })
                }
                margin="normal"
                placeholder="Nhập số nhà/căn hộ"
              />
              <TextField
                label="Diện tích (m²)"
                fullWidth
                type="number"
                value={createForm.area}
                onChange={(e) =>
                  setCreateForm({ ...createForm, area: e.target.value })
                }
                margin="normal"
                placeholder="Nhập diện tích"
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Tình trạng</InputLabel>
                <Select
                  value={createForm.status}
                  label="Tình trạng"
                  onChange={(e) =>
                    setCreateForm({ ...createForm, status: e.target.value })
                  }
                >
                  <MenuItem value="Residential">Residential</MenuItem>
                  <MenuItem value="Vacant">Vacant</MenuItem>
                  <MenuItem value="Business">Business</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Thông tin chủ hộ */}
            <Grid item xs={12} md={6}>
              <Typography
                variant="subtitle1"
                fontWeight="bold"
                sx={{ mb: 2, color: "#1976D2" }}
              >
                <HomeIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                Thông tin chủ hộ
              </Typography>

              <Autocomplete
                options={residents}
                getOptionLabel={(option) => option.name}
                value={
                  residents.find((r) => r.id === createForm.ownerId) || null
                }
                onChange={(event, newValue) => {
                  setCreateForm({
                    ...createForm,
                    ownerId: newValue ? newValue.id : "",
                  });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Chọn chủ hộ"
                    placeholder="Tìm kiếm cư dân..."
                    variant="outlined"
                    margin="normal"
                  />
                )}
                renderOption={(props, option) => (
                  <Box
                    component="li"
                    {...props}
                    sx={{ p: 2, borderBottom: "1px solid #f0f0f0" }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        width: "100%",
                      }}
                    >
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: "50%",
                          backgroundColor:
                            option.gender === "Male" ? "#1976D2" : "#E91E63",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          fontWeight: "bold",
                          mr: 2,
                        }}
                      >
                        {option.name.charAt(0).toUpperCase()}
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          variant="body1"
                          fontWeight="bold"
                          color="text.primary"
                        >
                          {option.name}
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            gap: 1,
                            alignItems: "center",
                            mt: 0.5,
                          }}
                        >
                          <Chip
                            label={option.gender === "Male" ? "Nam" : "Nữ"}
                            size="small"
                            variant="outlined"
                            color={
                              option.gender === "Male" ? "primary" : "secondary"
                            }
                          />
                          <Typography variant="caption" color="text.secondary">
                            CCCD: {option.cic}
                          </Typography>
                          <Chip
                            label={option.status}
                            size="small"
                            sx={{
                              backgroundColor: `${getResidentStatusColor(
                                option.status
                              )}22`,
                              color: getResidentStatusColor(option.status),
                              fontSize: "10px",
                            }}
                          />
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                )}
                noOptionsText="Không tìm thấy cư dân nào"
                clearText="Xóa"
                closeText="Đóng"
              />

              <TextField
                label="Số điện thoại"
                fullWidth
                value={createForm.ownerPhone}
                onChange={(e) =>
                  setCreateForm({ ...createForm, ownerPhone: e.target.value })
                }
                margin="normal"
                variant="outlined"
                placeholder="Nhập số điện thoại liên hệ"
              />
            </Grid>

            {/* Thành viên */}
            <Grid item xs={12}>
              <Typography
                variant="subtitle1"
                fontWeight="bold"
                sx={{ mb: 2, color: "#1976D2" }}
              >
                <PersonIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                Danh sách thành viên
              </Typography>

              <Autocomplete
                multiple
                options={residents.filter((r) => r.id !== createForm.ownerId)} // Vẫn loại bỏ chủ hộ khỏi danh sách để chọn
                getOptionLabel={(option) => option.name}
                value={residents.filter((r) =>
                  createForm.memberIds.includes(r.id)
                )}
                onChange={(event, newValues) => {
                  setCreateForm({
                    ...createForm,
                    memberIds: newValues.map((v) => v.id),
                  });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Tìm kiếm và chọn thành viên"
                    placeholder="Nhập tên cư dân để tìm kiếm..."
                    variant="outlined"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        minHeight: "56px",
                      },
                    }}
                  />
                )}
                renderOption={(props, option, { selected }) => (
                  <Box
                    component="li"
                    {...props}
                    sx={{ p: 2, borderBottom: "1px solid #f0f0f0" }}
                  >
                    <Checkbox
                      style={{ marginRight: 12 }}
                      checked={selected}
                      color="primary"
                    />
                    <Box
                      sx={{ display: "flex", alignItems: "center", flex: 1 }}
                    >
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: "50%",
                          backgroundColor:
                            option.gender === "Male" ? "#1976D2" : "#E91E63",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          fontWeight: "bold",
                          mr: 2,
                        }}
                      >
                        {option.name.charAt(0).toUpperCase()}
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          variant="body1"
                          fontWeight="bold"
                          color="text.primary"
                        >
                          {option.name}
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            gap: 1,
                            alignItems: "center",
                            mt: 0.5,
                          }}
                        >
                          <Chip
                            label={option.gender === "Male" ? "Nam" : "Nữ"}
                            size="small"
                            variant="outlined"
                            color={
                              option.gender === "Male" ? "primary" : "secondary"
                            }
                          />
                          <Typography variant="caption" color="text.secondary">
                            CCCD: {option.cic}
                          </Typography>
                          <Chip
                            label={option.status}
                            size="small"
                            sx={{
                              backgroundColor: `${getResidentStatusColor(
                                option.status
                              )}22`,
                              color: getResidentStatusColor(option.status),
                              fontSize: "10px",
                            }}
                          />
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                )}
                renderTags={(tagValue, getTagProps) =>
                  tagValue.map((option, index) => (
                    <Chip
                      avatar={
                        <Box
                          sx={{
                            width: 24,
                            height: 24,
                            borderRadius: "50%",
                            backgroundColor:
                              option.gender === "Male" ? "#1976D2" : "#E91E63",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                            fontSize: "12px",
                            fontWeight: "bold",
                          }}
                        >
                          {option.name.charAt(0).toUpperCase()}
                        </Box>
                      }
                      label={
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <Typography variant="body2" fontWeight="500">
                            {option.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            ({option.gender === "Male" ? "Nam" : "Nữ"})
                          </Typography>
                        </Box>
                      }
                      {...getTagProps({ index })}
                      key={option.id}
                      variant="outlined"
                      color="primary"
                      sx={{
                        height: "auto",
                        py: 0.5,
                        "& .MuiChip-label": {
                          px: 1,
                        },
                      }}
                    />
                  ))
                }
                sx={{
                  "& .MuiAutocomplete-tag": {
                    margin: "2px",
                  },
                  "& .MuiOutlinedInput-root": {
                    padding: "8px",
                  },
                }}
                ChipProps={{
                  color: "primary",
                  variant: "outlined",
                }}
                popupIcon={<PersonIcon />}
                clearIcon={<CloseIcon />}
                disableCloseOnSelect
                filterSelectedOptions
                noOptionsText="Không tìm thấy cư dân nào"
                loadingText="Đang tải..."
              />

              {/* Hiển thị số lượng thành viên đã chọn */}
              <Box
                sx={{ mt: 1, display: "flex", alignItems: "center", gap: 1 }}
              >
                <Typography variant="caption" color="text.secondary">
                  Đã chọn: {createForm.memberIds.length} thành viên
                </Typography>
                {createForm.memberIds.length > 0 && (
                  <Button
                    size="small"
                    variant="text"
                    color="error"
                    onClick={() =>
                      setCreateForm({ ...createForm, memberIds: [] })
                    }
                    sx={{ fontSize: "12px", textTransform: "none" }}
                  >
                    Xóa tất cả
                  </Button>
                )}
              </Box>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenCreateDialog(false)}>Hủy</Button>
          <Button onClick={handleCreate} variant="contained" color="primary">
            Tạo căn hộ
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog chỉnh sửa căn hộ */}
      <Dialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            position: "relative",
          },
        }}
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <EditIcon sx={{ color: "#1976D2" }} />
            <Typography variant="h6">
              Chỉnh sửa căn hộ {editForm.addressNumber}
            </Typography>
          </Box>
          <IconButton
            onClick={() => setOpenEditDialog(false)}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 3 }}>
          <Grid container spacing={3}>
            {/* Thông tin cơ bản */}
            <Grid item xs={12} md={6}>
              <TextField
                label="Số nhà"
                fullWidth
                value={editForm.addressNumber}
                disabled
                margin="normal"
              />
              <TextField
                label="Diện tích (m²)"
                fullWidth
                type="number"
                value={editForm.area}
                onChange={(e) =>
                  setEditForm({ ...editForm, area: e.target.value })
                }
                margin="normal"
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Tình trạng</InputLabel>
                <Select
                  value={editForm.status}
                  label="Tình trạng"
                  onChange={(e) =>
                    setEditForm({ ...editForm, status: e.target.value })
                  }
                >
                  <MenuItem value="Residential">Residential</MenuItem>
                  <MenuItem value="Vacant">Vacant</MenuItem>
                  <MenuItem value="Business">Business</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Thông tin chủ hộ */}
            <Grid item xs={12} md={6}>
              <Autocomplete
                options={residents}
                getOptionLabel={(option) => `${option.name} - ${option.cic}`}
                value={residents.find((r) => r.id === editForm.ownerId) || null}
                onChange={(event, newValue) => {
                  setEditForm({
                    ...editForm,
                    ownerId: newValue ? newValue.id : "",
                  });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Chủ hộ"
                    margin="normal"
                    placeholder="Tìm kiếm cư dân..."
                  />
                )}
                renderOption={(props, option) => (
                  <Box component="li" {...props}>
                    <Box>
                      <Typography variant="body2" fontWeight="bold">
                        {option.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        CCCD: {option.cic} |{" "}
                        {option.gender === "Male" ? "Nam" : "Nữ"}
                      </Typography>
                    </Box>
                  </Box>
                )}
              />
              <TextField
                label="Số điện thoại"
                fullWidth
                value={editForm.ownerPhone}
                onChange={(e) =>
                  setEditForm({ ...editForm, ownerPhone: e.target.value })
                }
                margin="normal"
              />
            </Grid>

            {/* Thành viên */}
            <Grid item xs={12}>
              <Typography
                variant="subtitle1"
                fontWeight="bold"
                sx={{ mb: 2, color: "#1976D2" }}
              >
                <PersonIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                Danh sách thành viên
              </Typography>

              <Autocomplete
                multiple
                options={residents.filter((r) => r.id !== editForm.ownerId)} // Loại bỏ chủ hộ khỏi danh sách thành viên
                getOptionLabel={(option) => option.name}
                value={residents.filter((r) =>
                  editForm.memberIds.includes(r.id)
                )}
                onChange={(event, newValues) => {
                  setEditForm({
                    ...editForm,
                    memberIds: newValues.map((v) => v.id),
                  });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Tìm kiếm và chọn thành viên"
                    placeholder="Nhập tên cư dân để tìm kiếm..."
                    variant="outlined"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        minHeight: "56px",
                      },
                    }}
                  />
                )}
                renderOption={(props, option, { selected }) => (
                  <Box
                    component="li"
                    {...props}
                    sx={{ p: 2, borderBottom: "1px solid #f0f0f0" }}
                  >
                    <Checkbox
                      style={{ marginRight: 12 }}
                      checked={selected}
                      color="primary"
                    />
                    <Box
                      sx={{ display: "flex", alignItems: "center", flex: 1 }}
                    >
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: "50%",
                          backgroundColor:
                            option.gender === "Male" ? "#1976D2" : "#E91E63",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          fontWeight: "bold",
                          mr: 2,
                        }}
                      >
                        {option.name.charAt(0).toUpperCase()}
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          variant="body1"
                          fontWeight="bold"
                          color="text.primary"
                        >
                          {option.name}
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            gap: 1,
                            alignItems: "center",
                            mt: 0.5,
                          }}
                        >
                          <Chip
                            label={option.gender === "Male" ? "Nam" : "Nữ"}
                            size="small"
                            variant="outlined"
                            color={
                              option.gender === "Male" ? "primary" : "secondary"
                            }
                          />
                          <Typography variant="caption" color="text.secondary">
                            CCCD: {option.cic}
                          </Typography>
                          <Chip
                            label={option.status}
                            size="small"
                            sx={{
                              backgroundColor: `${getResidentStatusColor(
                                option.status
                              )}22`,
                              color: getResidentStatusColor(option.status),
                              fontSize: "10px",
                            }}
                          />
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                )}
                renderTags={(tagValue, getTagProps) =>
                  tagValue.map((option, index) => (
                    <Chip
                      avatar={
                        <Box
                          sx={{
                            width: 24,
                            height: 24,
                            borderRadius: "50%",
                            backgroundColor:
                              option.gender === "Male" ? "#1976D2" : "#E91E63",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                            fontSize: "12px",
                            fontWeight: "bold",
                          }}
                        >
                          {option.name.charAt(0).toUpperCase()}
                        </Box>
                      }
                      label={
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <Typography variant="body2" fontWeight="500">
                            {option.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            ({option.gender === "Male" ? "Nam" : "Nữ"})
                          </Typography>
                        </Box>
                      }
                      {...getTagProps({ index })}
                      key={option.id}
                      variant="outlined"
                      color="primary"
                      sx={{
                        height: "auto",
                        py: 0.5,
                        "& .MuiChip-label": {
                          px: 1,
                        },
                      }}
                    />
                  ))
                }
                sx={{
                  "& .MuiAutocomplete-tag": {
                    margin: "2px",
                  },
                  "& .MuiOutlinedInput-root": {
                    padding: "8px",
                  },
                }}
                ChipProps={{
                  color: "primary",
                  variant: "outlined",
                }}
                popupIcon={<PersonIcon />}
                clearIcon={<CloseIcon />}
                disableCloseOnSelect
                filterSelectedOptions
                noOptionsText="Không tìm thấy cư dân nào"
                loadingText="Đang tải..."
              />

              {/* Hiển thị số lượng thành viên đã chọn */}
              <Box
                sx={{ mt: 1, display: "flex", alignItems: "center", gap: 1 }}
              >
                <Typography variant="caption" color="text.secondary">
                  Đã chọn: {editForm.memberIds.length} thành viên
                </Typography>
                {editForm.memberIds.length > 0 && (
                  <Button
                    size="small"
                    variant="text"
                    color="error"
                    onClick={() => setEditForm({ ...editForm, memberIds: [] })}
                    sx={{ fontSize: "12px", textTransform: "none" }}
                  >
                    Xóa tất cả
                  </Button>
                )}
              </Box>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Hủy</Button>
          <Button onClick={handleUpdate} variant="contained" color="primary">
            Cập nhật
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog chi tiết căn hộ - giữ nguyên code cũ */}
      <Dialog
        open={openDetailDialog}
        onClose={() => setOpenDetailDialog(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            position: "relative",
          },
        }}
      >
        {/* Nội dung dialog chi tiết - giữ nguyên code cũ */}
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <HomeIcon sx={{ color: "#1976D2" }} />
            <Typography variant="h6">
              Chi tiết căn hộ {selectedApartment?.addressNumber}
            </Typography>
          </Box>
          <IconButton
            onClick={() => setOpenDetailDialog(false)}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 3 }}>
          {selectedApartment && (
            <Grid container spacing={3}>
              {/* Thông tin cơ bản */}
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom color="primary">
                      <HomeIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                      Thông tin căn hộ
                    </Typography>
                    <Box
                      sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                    >
                      <Typography>
                        <strong>Số nhà:</strong>{" "}
                        {selectedApartment.addressNumber}
                      </Typography>
                      <Typography>
                        <strong>Diện tích:</strong> {selectedApartment.area} m²
                      </Typography>
                      <Typography>
                        <strong>Tình trạng:</strong>
                        <Chip
                          label={selectedApartment.status}
                          sx={{
                            ml: 1,
                            backgroundColor: `${getStatusColor(
                              selectedApartment.status
                            )}22`,
                            color: getStatusColor(selectedApartment.status),
                          }}
                        />
                      </Typography>
                      <Typography>
                        <strong>Số thành viên:</strong>{" "}
                        {selectedApartment.numberOfMembers || 0}
                      </Typography>
                      <Typography>
                        <strong>Số xe máy:</strong>{" "}
                        {selectedApartment.numberOfMotorbikes || 0}
                      </Typography>
                      <Typography>
                        <strong>Số ô tô:</strong>{" "}
                        {selectedApartment.numberOfCars || 0}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Thông tin chủ hộ */}
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom color="primary">
                      <PersonIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                      Thông tin chủ hộ
                    </Typography>
                    {selectedApartment.owner ? (
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 1,
                        }}
                      >
                        <Typography>
                          <strong>Tên:</strong> {selectedApartment.owner.name}
                        </Typography>
                        <Typography>
                          <strong>Ngày sinh:</strong>{" "}
                          {formatDate(selectedApartment.owner.dob)}
                        </Typography>
                        <Typography>
                          <strong>Giới tính:</strong>{" "}
                          {selectedApartment.owner.gender === "Male"
                            ? "Nam"
                            : "Nữ"}
                        </Typography>
                        <Typography>
                          <strong>CCCD:</strong> {selectedApartment.owner.cic}
                        </Typography>
                        <Typography>
                          <strong>SĐT:</strong> {selectedApartment.ownerPhone}
                        </Typography>
                        <Typography>
                          <strong>Trạng thái:</strong>
                          <Chip
                            label={selectedApartment.owner.status}
                            sx={{
                              ml: 1,
                              backgroundColor: `${getResidentStatusColor(
                                selectedApartment.owner.status
                              )}22`,
                              color: getResidentStatusColor(
                                selectedApartment.owner.status
                              ),
                            }}
                          />
                        </Typography>
                      </Box>
                    ) : (
                      <Typography color="text.secondary">
                        Chưa có chủ hộ
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>

              {/* Danh sách cư dân */}
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom color="primary">
                      <PersonIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                      Danh sách cư dân (
                      {selectedApartment.residentList?.length || 0})
                    </Typography>
                    {selectedApartment.residentList &&
                    selectedApartment.residentList.length > 0 ? (
                      <TableContainer component={Paper} variant="outlined">
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>
                                <strong>Tên</strong>
                              </TableCell>
                              <TableCell>
                                <strong>Ngày sinh</strong>
                              </TableCell>
                              <TableCell>
                                <strong>Giới tính</strong>
                              </TableCell>
                              <TableCell>
                                <strong>CCCD</strong>
                              </TableCell>
                              <TableCell>
                                <strong>Trạng thái</strong>
                              </TableCell>
                              <TableCell>
                                <strong>Ngày cập nhật</strong>
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {selectedApartment.residentList.map((resident) => (
                              <TableRow key={resident.id}>
                                <TableCell>{resident.name}</TableCell>
                                <TableCell>
                                  {formatDate(resident.dob)}
                                </TableCell>
                                <TableCell>
                                  {resident.gender === "Male" ? "Nam" : "Nữ"}
                                </TableCell>
                                <TableCell>{resident.cic}</TableCell>
                                <TableCell>
                                  <Chip
                                    label={resident.status}
                                    size="small"
                                    sx={{
                                      backgroundColor: `${getResidentStatusColor(
                                        resident.status
                                      )}22`,
                                      color: getResidentStatusColor(
                                        resident.status
                                      ),
                                    }}
                                  />
                                </TableCell>
                                <TableCell>
                                  {formatDate(resident.statusDate)}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    ) : (
                      <Typography color="text.secondary">
                        Không có cư dân nào
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>

              {/* Danh sách phương tiện */}
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom color="primary">
                      <DirectionsCarIcon
                        sx={{ mr: 1, verticalAlign: "middle" }}
                      />
                      Danh sách phương tiện (
                      {selectedApartment.vehicleList?.length || 0})
                    </Typography>
                    {selectedApartment.vehicleList &&
                    selectedApartment.vehicleList.length > 0 ? (
                      <TableContainer component={Paper} variant="outlined">
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>
                                <strong>Biển số</strong>
                              </TableCell>
                              <TableCell>
                                <strong>Loại xe</strong>
                              </TableCell>
                              <TableCell>
                                <strong>Ngày đăng ký</strong>
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {selectedApartment.vehicleList.map(
                              (vehicle, index) => (
                                <TableRow key={index}>
                                  <TableCell>{vehicle.id}</TableCell>
                                  <TableCell>
                                    <Chip
                                      label={
                                        vehicle.category === "Car"
                                          ? "Ô tô"
                                          : "Xe máy"
                                      }
                                      size="small"
                                      color={
                                        vehicle.category === "Car"
                                          ? "primary"
                                          : "secondary"
                                      }
                                    />
                                  </TableCell>
                                  <TableCell>
                                    {formatDate(vehicle.registerDate)}
                                  </TableCell>
                                </TableRow>
                              )
                            )}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    ) : (
                      <Typography color="text.secondary">
                        Không có phương tiện nào
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Apartment;
