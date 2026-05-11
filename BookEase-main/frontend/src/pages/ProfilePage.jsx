import { Box, Container, Paper, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import ProfileHeader from "../components/ProfileHeader";
import ProfileStats from "../components/ProfileStats";
import TabsNavigation from "../components/TabsNavigation";
import BookingSummary from "../components/BookingSummary";
import ReviewCard from "../components/ReviewCard";
import EditProfileModal from "../components/EditProfileModal";
import userService from "../api/userService";
import reviewService from "../api/reviewService";
import { Settings } from "@mui/icons-material"; // Added generic icon for UI polish

const ProfilePage = () => {
  const { user, updateUser, stats } = useAuth();
  const [activeTab, setActiveTab] = useState("reviews");
  const [editOpen, setEditOpen] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  useEffect(() => {
    if (activeTab === "reviews" && user?.id) {
      setReviewsLoading(true);

      reviewService
        .getReviewsByUser(user.id)
        .then((res) => setReviews(res.data))
        .catch(() => {
          toast.error("Failed to load reviews");
          setReviews([]);
        })
        .finally(() => setReviewsLoading(false));
    }
  }, [activeTab, user?.id]);

  // ✅ DEFINE STATS
  const statsData = {
    bookings: stats?.bookingsCount ?? 0,
    reviews: stats?.reviewsCount ?? 0,
    // saved: user?.savedHotelsCount || 0,
  };

  const handleSaveProfile = async (updatedData) => {
    try {
      const res = await userService.updateProfile(user.id, updatedData);
      updateUser(res.data); // 🔥 Update global user
      toast.success("Profile updated!");
      setEditOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile");
    }
  };

  const tabs = [
    {
      id: "reviews",
      text: "My Reviews",
      icon: null,
      content: (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {reviewsLoading ? (
            <Typography textAlign="center">Loading reviews...</Typography>
          ) : reviews.length > 0 ? (
            reviews.map((r) => <ReviewCard key={r.id} review={r} />)
          ) : (
            <Typography color="text.secondary" textAlign="center" py={4}>
              No reviews yet.
            </Typography>
          )}
        </Box>
      ),
    },
  ];

  // --- ANIMATION STYLES ---
  const fadeInUp = {
    animation: "fadeSlideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
    opacity: 0, // Start hidden
    transform: "translateY(20px)", // Start lower
    "@keyframes fadeSlideUp": {
      "0%": {
        opacity: 0,
        transform: "translateY(20px)",
      },
      "100%": {
        opacity: 1,
        transform: "translateY(0)",
      },
    },
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f8fafc", // Professional subtle grey background
        pt: { xs: 4, md: 8 },
        pb: 10,
      }}
    >
      <Container maxWidth="lg">
        {/* SECTION 1: PROFILE CARD (Header + Stats) */}
        <Paper
          elevation={0}
          sx={{
            ...fadeInUp,
            animationDelay: "0ms", // Immediate start
            borderRadius: 4,
            border: "1px solid",
            borderColor: "divider",
            overflow: "hidden",
            boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
            mb: 5,
          }}
        >
          <Box sx={{ p: { xs: 3, md: 5 } }}>
            <ProfileHeader user={user} onEdit={() => setEditOpen(true)} />
          </Box>

          <Box
            sx={{
              p: 2,
              borderTop: "1px solid",
              borderColor: "divider",
              bgcolor: "rgba(248, 250, 252, 0.5)",
            }}
          >
            <ProfileStats stats={statsData} />
          </Box>
        </Paper>

        {/* MODAL */}
        <EditProfileModal
          open={editOpen}
          onClose={() => setEditOpen(false)}
          user={user}
          onSave={handleSaveProfile}
        />

        {/* SECTION 2: TABS NAVIGATION */}
        <Box
          sx={{
            ...fadeInUp,
            animationDelay: "150ms", // Slight delay for staggered effect
            mb: 4,
            display: "flex",
            justifyContent: { xs: "center", md: "flex-start" },
          }}
        >
          <TabsNavigation
            tabs={tabs}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </Box>

        {/* SECTION 3: TAB CONTENT */}
        <Box
          sx={{
            ...fadeInUp,
            animationDelay: "300ms", // Longer delay for staggered effect
            minHeight: 300,
          }}
        >
          {/* We wrap the content in a key to force re-animation on tab switch if desired, 
              or keep it static. Here we keep it simple. */}
          {tabs.find((tab) => tab.id === activeTab)?.content}
        </Box>
      </Container>
    </Box>
  );
};

export default ProfilePage;
