import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  CircularProgress,
  Button,
  Paper,
  Stack,
  Divider,
  Container,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Fade,
  Alert,
} from "@mui/material";
import { Star, User, MessageSquareOff, Hotel } from "lucide-react";
import IconCards from "../components/IconCards";
import ReviewCard from "../components/ReviewCard";
import reviewService from "../api/reviewService";
import WriteReviewModal from "../components/WriteReviewModal";
import { useAuth } from "../context/AuthContext";
import hotelService from "../api/hotelService";

export default function ReviewsPage({ hotelId = 2 }) {
  const [reviews, setReviews] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [openWrite, setOpenWrite] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [reviewableHotels, setReviewableHotels] = useState([]);
  const [selectedHotelId, setSelectedHotelId] = useState(null);
  const [allHotels, setAllHotels] = useState([]);
  const [reloading, setReloading] = useState(false);
  const [hasCompletedBooking, setHasCompletedBooking] = useState(false);

  const refreshEligibility = async () => {
    if (!user) return;

    const [reviewableRes, completedRes] = await Promise.all([
      reviewService.getReviewableHotels(),
      reviewService.hasCompletedBooking(),
    ]);

    setReviewableHotels(reviewableRes.data);
    setHasCompletedBooking(completedRes.data);
  };

  useEffect(() => {
    const fetchHotels = async () => {
      const res = await hotelService.getAllHotels();
      setAllHotels(res.data);

      if (res.data.length > 0) {
        setSelectedHotelId(res.data[0].id);
      }
    };

    fetchHotels();
  }, []);

  useEffect(() => {
    if (!selectedHotelId) return;
    loadData(true); // first load
  }, [selectedHotelId]);

  const loadData = async (initial = false) => {
    initial ? setLoading(true) : setReloading(true);

    const reviewsRes = await reviewService.getHotelReviews(selectedHotelId);

    setReviews(reviewsRes.data);
    setSummary(calculateSummary(reviewsRes.data));

    initial ? setLoading(false) : setReloading(false);
  };

  useEffect(() => {
    refreshEligibility();
  }, [user]);

  const calculateSummary = (reviews) => {
    if (!reviews.length) return { averageRating: 0, totalReviews: 0 };

    const total = reviews.reduce((sum, r) => sum + r.rating, 0);
    return {
      averageRating: total / reviews.length,
      totalReviews: reviews.length,
    };
  };

  const submitReview = async (data) => {
    if (editingReview) {
      await reviewService.updateReview(editingReview.id, data);
    } else {
      await reviewService.createReview({
        ...data,
        hotelId: selectedHotelId,
      });
    }

    setOpenWrite(false);
    setEditingReview(null);

    await refreshEligibility();
    loadData(false);
  };

  const parallaxBackground = {
    backgroundImage:
      'url("https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=3540&auto=format&fit=crop")',
    backgroundAttachment: "fixed",
    backgroundPosition: "center",
    backgroundSize: "cover",
    minHeight: "100vh", // ✅ FIX
    width: "100%",
    display: "flex",
    flexDirection: "column",
    position: "relative",
    overflow: "hidden",
  };

  const glassCardStyle = {
    p: { xs: 3, md: 6 },
    borderRadius: 4,
    border: "1px solid rgba(255, 255, 255, 0.3)",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    backdropFilter: "blur(12px)",
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
  };

  if (loading) {
    return (
      <Box
        sx={{
          ...parallaxBackground,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Paper
          sx={{
            ...glassCardStyle,
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <CircularProgress
            size={50}
            thickness={4}
            sx={{ color: "primary.main" }}
          />
          <Typography variant="body2" color="text.secondary">
            Loading reviews...
          </Typography>
        </Paper>
      </Box>
    );
  }

  const ratingSummary = summary
    ? [
        {
          icon: <Star size={24} strokeWidth={2.5} />,
          title: `${summary.averageRating.toFixed(1)} / 5.0`,
          desc: "Overall Rating",
        },
        {
          icon: <User size={24} strokeWidth={2.5} />,
          title: summary.totalReviews,
          desc: "Total Reviews",
        },
      ]
    : [];

  return (
    <Box sx={parallaxBackground}>
      <Container maxWidth="xl" sx={{ py: 8, flexGrow: 1 }}>
        <Paper elevation={0} sx={glassCardStyle}>
          {/* Header Section */}
          <Stack
            direction={{ xs: "column", md: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", md: "center" }}
            spacing={3}
            mb={6}
          >
            <Box>
              <Typography
                variant="overline"
                color="primary"
                fontWeight={700}
                letterSpacing={1.2}
              >
                Feedback & Experiences
              </Typography>
              <Typography
                variant="h3"
                fontWeight={800}
                color="text.primary"
                sx={{ letterSpacing: "-0.02em", mb: 1 }}
              >
                Guest Reviews
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                maxWidth="600px"
              >
                See what our customers are saying about their stay. We value
                transparency and authentic experiences.
              </Typography>
            </Box>

            <Box>
              {/* Can review */}
              {reviewableHotels.length > 0 && (
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => {
                    setSelectedHotelId(reviewableHotels[0].id);
                    setOpenWrite(true);
                  }}
                  sx={{
                    borderRadius: 3,
                    px: 4,
                    py: 1.5,
                    textTransform: "none",
                    fontWeight: 700,
                    boxShadow: "0 4px 14px 0 rgba(0,118,255,0.39)",
                  }}
                >
                  Write a Review
                </Button>
              )}

              {/* Never booked or not completed */}
              {user && !hasCompletedBooking && (
                <Alert
                  severity="info"
                  variant="outlined"
                  sx={{ borderRadius: 2, bgcolor: "background.paper" }}
                >
                  Book and complete your stay before leaving a review.
                </Alert>
              )}

              {/* Completed but reviewed all */}
              {user && hasCompletedBooking && reviewableHotels.length === 0 && (
                <Alert
                  severity="info"
                  variant="outlined"
                  sx={{ borderRadius: 2, bgcolor: "background.paper" }}
                >
                  You’ve already reviewed all your completed stays.
                </Alert>
              )}
            </Box>
          </Stack>

          <FormControl sx={{ mb: 4, minWidth: 260 }}>
            <InputLabel>Hotel</InputLabel>
            <Select
              value={selectedHotelId || ""}
              label="Hotel"
              onChange={(e) => setSelectedHotelId(e.target.value)}
            >
              {allHotels.map((hotel) => (
                <MenuItem key={hotel.id} value={hotel.id}>
                  {hotel.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Rating Summary */}
          <Fade in={true} timeout={800}>
            <Box mb={6}>
              <Grid container spacing={3}>
                {ratingSummary.map((item, idx) => (
                  <Grid item xs={12} sm={6} md={3} key={idx}>
                    <IconCards content={item} />
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Fade>

          <Divider sx={{ mb: 6, opacity: 0.6 }} />

          {/* Reviews List */}
          <Box>
            {reviews.length === 0 ? (
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                py={10}
                bgcolor="rgba(0,0,0,0.02)"
                borderRadius={4}
                border="1px dashed"
                borderColor="divider"
              >
                <Box
                  sx={{
                    p: 3,
                    borderRadius: "50%",
                    bgcolor: "background.paper",
                    mb: 2,
                    boxShadow: 1,
                  }}
                >
                  <MessageSquareOff size={40} color="#9e9e9e" />
                </Box>
                <Typography variant="h6" color="text.primary" fontWeight={700}>
                  No reviews yet
                </Typography>
                <Typography color="text.secondary" variant="body2" mt={0.5}>
                  Be the first to share your experience with us!
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={4}>
                {reviews.map((r, index) => (
                  <Grid item xs={12} md={6} key={r.id}>
                    <Fade in={true} timeout={500 + index * 100}>
                      <Box height="100%">
                        <ReviewCard
                          review={{
                            id: r.id,
                            name: r.userName,
                            hotel: r.hotelName,
                            date: new Date(r.createdAt).toLocaleDateString(
                              undefined,
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            ),
                            rating: r.rating,
                            comment: r.comment,
                            isOwner: user?.id === r.userId,
                            onEdit: () => {
                              setEditingReview(r);
                              setOpenWrite(true);
                            },
                            onDelete: async () => {
                              await reviewService.deleteReview(r.id);

                              await refreshEligibility();
                              loadData(false);
                            },
                          }}
                        />
                      </Box>
                    </Fade>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        </Paper>

        <WriteReviewModal
          open={openWrite}
          onClose={() => {
            setOpenWrite(false);
            setEditingReview(null);
          }}
          onSubmit={submitReview}
          initialData={editingReview}
          reviewableHotels={reviewableHotels}
          selectedHotelId={selectedHotelId}
          setSelectedHotelId={setSelectedHotelId}
        />
      </Container>
    </Box>
  );
}
