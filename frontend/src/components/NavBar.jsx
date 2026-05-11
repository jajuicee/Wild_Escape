import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Link,
  IconButton,
  Drawer,
  Collapse,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Menu,
  MenuItem,
  Container,
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import {
  Menu as MenuIcon,
  X as CloseIcon,
  ChevronDown,
  User,
  PhilippinePeso,
  MessageSquareMore,
  Tent,
  LogOut,
  NotebookPen,
  Hotel,
  LayoutDashboard,
  DoorClosed,
  SquareChartGantt,
} from "lucide-react";

const NavBar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);

  const navigate = useNavigate();
  const { user, isAuthenticated, logout, isAdmin } = useAuth();

  const open = Boolean(anchorEl);
  const userMenuOpen = Boolean(anchorElUser);

  // Scroll Listener for Glassmorphism Effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out Successfully!");
      handleUserMenuClose();
      navigate("/");
    } catch (error) {
      console.error("Logout failed", error);
      toast.error("Failed to logout");
    }
  };

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleUserMenuOpen = (event) => setAnchorElUser(event.currentTarget);
  const handleUserMenuClose = () => setAnchorElUser(null);

  // Helper for navigation + closing menus
  const navTo = (path) => {
    handleMenuClose();
    handleUserMenuClose();
    setMobileOpen(false); // Close mobile drawer if open
    navigate(path);
  };

  // --- STYLES ---
  // Dynamic Navbar Style (Glassmorphism)
  const navbarStyle = {
    backgroundColor: scrolled ? "rgba(255, 255, 255, 0.8)" : "transparent",
    backdropFilter: scrolled ? "blur(12px)" : "none",
    boxShadow: scrolled ? "0 4px 30px rgba(0, 0, 0, 0.05)" : "none",
    borderBottom: scrolled ? "1px solid rgba(255, 255, 255, 0.3)" : "none",
    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
    paddingTop: scrolled ? "0px" : "12px",
    paddingBottom: scrolled ? "0px" : "12px",
  };

  // Animated Underline Link Style
  const linkStyle = {
    color: "#1e293b",
    fontWeight: 500,
    fontSize: "0.95rem",
    position: "relative",
    cursor: "pointer",
    textDecoration: "none",
    padding: "4px 0",
    "&::after": {
      content: '""',
      position: "absolute",
      width: "0%",
      height: "2px",
      bottom: "0px",
      left: "0",
      backgroundColor: "#2563eb",
      transition: "width 0.3s ease-in-out",
    },
    "&:hover::after": {
      width: "100%",
    },
    "&:hover": {
      color: "#2563eb",
    },
  };

  const menuItemStyles = {
    px: 2.5,
    py: 1.5,
    borderRadius: 2,
    mx: 1,
    mb: 0.5,
    transition: "all 0.2s ease",
    "&:hover": {
      backgroundColor: "rgba(37, 99, 235, 0.08)",
      color: "#2563eb",
      transform: "translateX(4px)",
      "& .icon": { color: "#2563eb" },
    },
  };

  return (
    <>
      <AppBar position="sticky" elevation={0} sx={navbarStyle}>
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
            {/* LOGO AREA */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                cursor: "pointer",
              }}
              onClick={() => navigate("/")}
            >
              {/* Gradient Logo Container */}
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "12px",
                  background:
                    "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)",
                }}
              >
                <Tent size={22} color="white" />
              </Box>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 800,
                  letterSpacing: "-0.02em",
                  color: "#0f172a",
                }}
              >
                Wild<span style={{ color: "#2563eb" }}>Escape</span>
              </Typography>
            </Box>

            {/* DESKTOP NAVIGATION */}
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                gap: 5,
              }}
            >
              <Link
                component={RouterLink}
                to="/"
                underline="none"
                sx={linkStyle}
              >
                Home
              </Link>
              <Link
                component={RouterLink}
                to="/about"
                underline="none"
                sx={linkStyle}
              >
                About
              </Link>

              {/* Services Dropdown */}
              <Box>
                <Button
                  onClick={handleMenuOpen}
                  endIcon={
                    <ChevronDown
                      size={16}
                      style={{
                        transition: "transform 0.2s",
                        transform: open ? "rotate(180deg)" : "none",
                      }}
                    />
                  }
                  sx={{
                    textTransform: "none",
                    color: "#1e293b",
                    fontWeight: 500,
                    fontSize: "0.95rem",
                    "&:hover": {
                      backgroundColor: "transparent",
                      color: "#2563eb",
                    },
                  }}
                >
                  Services
                </Button>

                {/* Styled Menu */}
                <Menu
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleMenuClose}
                  PaperProps={{
                    elevation: 0,
                    sx: {
                      mt: 1.5,
                      minWidth: 240,
                      borderRadius: 4,
                      boxShadow: "0 10px 40px -10px rgba(0,0,0,0.1)",
                      border: "1px solid rgba(0,0,0,0.05)",
                      overflow: "visible",
                      // Little triangle pointer
                      "&:before": {
                        content: '""',
                        display: "block",
                        position: "absolute",
                        top: 0,
                        right: 20,
                        width: 10,
                        height: 10,
                        bgcolor: "background.paper",
                        transform: "translateY(-50%) rotate(45deg)",
                        zIndex: 0,
                      },
                    },
                  }}
                  transformOrigin={{ horizontal: "right", vertical: "top" }}
                  anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                >
                  {[
                    {
                      text: "Hotel Booking",
                      icon: User,
                      action: () => navTo("/booking"),
                    },
                    {
                      text: "Reviews",
                      icon: MessageSquareMore,
                      action: () => navTo("/reviews"),
                    },
                    {
                      text: "Price Offer",
                      icon: PhilippinePeso,
                      action: () => navTo("/price-offer"),
                    },
                  ].map((item, index) => (
                    <MenuItem
                      key={index}
                      onClick={item.action}
                      sx={menuItemStyles}
                    >
                      <item.icon
                        size={18}
                        className="icon"
                        style={{
                          marginRight: 12,
                          color: "#64748b",
                          transition: "color 0.2s",
                        }}
                      />
                      <Typography variant="body2" fontWeight={500}>
                        {item.text}
                      </Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
            </Box>

            {/* AUTH BUTTONS AREA */}
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                gap: 2,
                alignItems: "center",
              }}
            >
              {!isAuthenticated ? (
                <>
                  <Button
                    onClick={() => navigate("/login")}
                    sx={{
                      textTransform: "none",
                      color: "#64748b",
                      fontWeight: 600,
                      "&:hover": {
                        color: "#1e293b",
                        backgroundColor: "transparent",
                      },
                    }}
                  >
                    Sign in
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => navigate("/register")}
                    sx={{
                      textTransform: "none",
                      borderRadius: "50px",
                      px: 3,
                      py: 1,
                      fontWeight: 600,
                      boxShadow: "0 4px 14px 0 rgba(37, 99, 235, 0.39)",
                      background:
                        "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                      transition: "all 0.2s ease-in-out",
                      "&:hover": {
                        transform: "translateY(-1px)",
                        boxShadow: "0 6px 20px rgba(37, 99, 235, 0.23)",
                      },
                    }}
                  >
                    Create account
                  </Button>
                </>
              ) : (
                /* Logged In User State */
                <Box>
                  <Button
                    onClick={handleUserMenuOpen}
                    startIcon={
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: "50%",
                          bgcolor: "#e0f2fe",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#0284c7",
                        }}
                      >
                        <User size={18} />
                      </Box>
                    }
                    endIcon={<ChevronDown size={16} />}
                    sx={{
                      textTransform: "none",
                      color: "#334155",
                      fontWeight: 600,
                      borderRadius: "50px",
                      pl: 0.5,
                      pr: 2,
                      py: 0.5,
                      border: "1px solid #e2e8f0",
                      "&:hover": { bgcolor: "#f8fafc", borderColor: "#cbd5e1" },
                    }}
                  >
                    {user?.name || "User"}
                  </Button>
                  <Menu
                    anchorEl={anchorElUser}
                    open={userMenuOpen}
                    onClose={handleUserMenuClose}
                    PaperProps={{
                      elevation: 0,
                      sx: {
                        mt: 1.5,
                        minWidth: 200,
                        borderRadius: 4,
                        boxShadow: "0 10px 40px -10px rgba(0,0,0,0.1)",
                        border: "1px solid rgba(0,0,0,0.05)",
                      },
                    }}
                    transformOrigin={{ horizontal: "right", vertical: "top" }}
                    anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                  >
                    <MenuItem
                      onClick={() => navTo("/profile")}
                      sx={menuItemStyles}
                    >
                      <User size={18} style={{ marginRight: 12 }} /> My Profile
                    </MenuItem>
                    <MenuItem
                      onClick={() => navTo("/booking?tab=status")}
                      sx={menuItemStyles}
                    >
                      <NotebookPen size={18} style={{ marginRight: 12 }} /> My Bookings
                    </MenuItem>
                    {isAdmin && (
                      <>
                        <MenuItem
                          onClick={() => navTo("/owner/dashboard")}
                          sx={menuItemStyles}
                        >
                          <LayoutDashboard size={18} style={{ marginRight: 12 }} /> Owner
                          Dashboard
                        </MenuItem>

                        <MenuItem
                          onClick={() => navTo("/owner/hotels")}
                          sx={menuItemStyles}
                        >
                          <Hotel size={18} style={{ marginRight: 12 }} /> Manage
                          Hotels
                        </MenuItem>

                        <MenuItem
                          onClick={() => navTo("/owner/rooms")}
                          sx={menuItemStyles}
                        >
                          <DoorClosed size={18} style={{ marginRight: 12 }} /> Manage
                          Rooms
                        </MenuItem>

                        <MenuItem
                          onClick={() => navTo("/owner/offers")}
                          sx={menuItemStyles}
                        >
                          <PhilippinePeso
                            size={18}
                            style={{ marginRight: 12 }}
                          />{" "}
                          Manage Offers
                        </MenuItem>

                        <MenuItem
                          onClick={() => navTo("/owner/bookings")}
                          sx={menuItemStyles}
                        >
                          <SquareChartGantt
                            size={18}
                            style={{ marginRight: 12 }}
                          />{" "}
                          Manage Bookings
                        </MenuItem>
                      </>
                    )}
                    <MenuItem
                      onClick={handleLogout}
                      sx={{
                        ...menuItemStyles,
                        color: "#ef4444",
                        "&:hover": { bgcolor: "#fef2f2", color: "#dc2626" },
                      }}
                    >
                      <LogOut size={18} style={{ marginRight: 12 }} /> Logout
                    </MenuItem>
                  </Menu>
                </Box>
              )}
            </Box>

            {/* MOBILE MENU TOGGLE */}
            <IconButton
              onClick={() => setMobileOpen(true)}
              sx={{
                display: { xs: "flex", md: "none" },
                color: "#1e293b",
                bgcolor: scrolled ? "rgba(0,0,0,0.03)" : "transparent",
              }}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      {/* MOBILE DRAWER */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        PaperProps={{
          sx: { width: "85%", maxWidth: 300, borderRadius: "20px 0 0 20px" },
        }}
      >
        <Box
          sx={{
            p: 3,
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 4,
            }}
          >
            <Typography variant="h6" fontWeight={800}>
              Menu
            </Typography>
            <IconButton
              onClick={() => setMobileOpen(false)}
              sx={{ bgcolor: "#f1f5f9" }}
            >
              <CloseIcon size={20} />
            </IconButton>
          </Box>

          <List sx={{ flexGrow: 1 }}>
            <ListItem disablePadding sx={{ mb: 2 }}>
              <ListItemButton
                onClick={() => navTo("/")}
                sx={{ borderRadius: 2 }}
              >
                <ListItemText
                  primary="Home"
                  primaryTypographyProps={{ fontWeight: 600 }}
                />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding sx={{ mb: 2 }}>
              <ListItemButton
                onClick={() => navTo("/about")}
                sx={{ borderRadius: 2 }}
              >
                <ListItemText
                  primary="About"
                  primaryTypographyProps={{ fontWeight: 600 }}
                />
              </ListItemButton>
            </ListItem>

            {/* Mobile Expandable Services */}
            <ListItemButton
              onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
              sx={{ borderRadius: 2, mb: 1 }}
            >
              <ListItemText
                primary="Services"
                primaryTypographyProps={{ fontWeight: 600 }}
              />
              <ChevronDown
                size={20}
                style={{
                  transform: mobileServicesOpen ? "rotate(180deg)" : "none",
                  transition: "transform 0.2s",
                }}
              />
            </ListItemButton>
            <Collapse in={mobileServicesOpen}>
              <List component="div" disablePadding sx={{ pl: 2, mb: 2 }}>
                {[
                  { text: "Hotel Booking", action: () => navTo("/booking") },
                  { text: "Reviews", action: () => navTo("/reviews") },
                  { text: "Price Offer", action: () => navTo("/price-offer") },
                ].map((item, idx) => (
                  <ListItemButton
                    key={idx}
                    onClick={item.action}
                    sx={{ borderRadius: 2 }}
                  >
                    <ListItemText
                      primary={item.text}
                      secondaryTypographyProps={{ fontSize: "0.9rem" }}
                    />
                  </ListItemButton>
                ))}
              </List>
            </Collapse>
          </List>

          <Box sx={{ mt: "auto" }}>
            {!isAuthenticated ? (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => navigate("/login")}
                  sx={{ borderRadius: 3, py: 1.5, fontWeight: 600 }}
                >
                  Sign In
                </Button>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => navigate("/register")}
                  sx={{
                    borderRadius: 3,
                    py: 1.5,
                    fontWeight: 600,
                    background: "#2563eb",
                  }}
                >
                  Create account
                </Button>
              </Box>
            ) : (
              <Button
                variant="outlined"
                color="error"
                fullWidth
                startIcon={<LogOut />}
                onClick={handleLogout}
                sx={{ borderRadius: 3, py: 1.5, fontWeight: 600 }}
              >
                Log Out
              </Button>
            )}
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default NavBar;
