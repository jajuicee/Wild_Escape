import React, { useState, useEffect } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Shield,
  Phone,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  // Helper function to capitalize field names
  const capitalizeFriendly = (s) =>
    s.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailValid, setEmailValid] = useState(true);
  const [formErrors, setFormErrors] = useState({});
  const [focusedField, setFocusedField] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let sanitizedValue = sanitizeInput(name, value);

    if (name === "email") {
      setEmailValid(emailValidation(sanitizedValue));
    }

    if (name === "phoneNumber") {
      sanitizedValue = formatPhoneNumberPH(sanitizedValue);
    }

    // LIVE PASSWORD VALIDATION
    if (name === "password") {
      const pwdErrors = validatePassword(sanitizedValue);

      setFormErrors((prev) => ({
        ...prev,
        password: pwdErrors.length > 0 ? pwdErrors[0] : "", // ← show first rule live
      }));
    }

    // LIVE CONFIRM-PASSWORD CHECK
    if (name === "confirmPassword") {
      setFormErrors((prev) => ({
        ...prev,
        confirmPassword:
          sanitizedValue !== formData.password ? "Passwords do not match." : "",
      }));
    }

    setFormData({
      ...formData,
      [name]: sanitizedValue,
    });
  };

  const emailValidation = (email) => {
    // Simple regex pattern for basic email validation (you can adjust it)
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  };

  const validatePassword = (password) => {
    const errors = [];

    if (password.length < 8) {
      errors.push("Password must be at least 8 characters.");
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter.");
    }
    if (!/[a-z]/.test(password)) {
      errors.push("Password must contain at least one lowercase letter.");
    }
    if (!/[0-9]/.test(password)) {
      errors.push("Password must contain at least one number.");
    }
    if (!/[!@#$%^&*]/.test(password)) {
      errors.push(
        "Password must contain at least one special character (!@#$%^&*)."
      );
    }

    return errors;
  };

  const formatPhoneNumberPH = (value) => {
    // Remove everything except digits
    let digits = value.replace(/\D/g, "");

    /**
     * AUTO-CONVERT RULES
     * -------------------
     * If it starts with "0" (ex: 09123456789)
     * Convert to international: +63 912 345 6789
     */
    if (digits.startsWith("0")) {
      digits = "63" + digits.slice(1);
    }

    /**
     * If it already starts with 63 (ex: 639123456789)
     * Keep it
     */

    // Limit to PH mobile number length: +63 + 10 digits = total 12 digits ("63" + 10)
    digits = digits.slice(0, 12);

    // Format output: +63 912 345 6789
    if (digits.length <= 2) return `+${digits}`;
    if (digits.length <= 5) return `+${digits.slice(0, 2)} ${digits.slice(2)}`;
    if (digits.length <= 8)
      return `+${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5)}`;

    return `+${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(
      5,
      8
    )} ${digits.slice(8)}`;
  };

  const sanitizeInput = (name, value) => {
    switch (name) {
      case "fullName":
        return sanitizeFullName(value);
      case "email":
        return sanitizeEmail(value);
      case "phoneNumber":
        return sanitizePhoneNumber(value);
      case "password":
      case "confirmPassword":
        return value; // live typing: don’t trim spaces
      default:
        return value;
    }
  };

  const sanitizeFullName = (name) => {
    return name.replace(/[^a-zA-Z\s]/g, ""); // Keep only letters and spaces
  };

  // Sanitization for Email: Remove unwanted characters (for security)
  const sanitizeEmail = (email) => {
    return email.trim().replace(/[<>\"&]/g, ""); // Remove dangerous characters
  };

  // Sanitization for Phone Number: Remove non-digit characters and format for PH numbers
  const sanitizePhoneNumber = (phoneNumber) => {
    let sanitizedPhone = phoneNumber.replace(/\D/g, ""); // Keep only digits
    if (sanitizedPhone.startsWith("0")) {
      sanitizedPhone = "63" + sanitizedPhone.slice(1); // Convert to +63 if starts with 0
    }
    return sanitizedPhone.slice(0, 12); // Limit to 12 digits for PH numbers
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = {};

    // Required fields
    Object.keys(formData).forEach((key) => {
      if (!formData[key].trim()) {
        errors[key] =
          key === "confirmPassword"
            ? "Password is required."
            : `${capitalizeFriendly(key)} is required.`;
      }
    });

    // Email validation
    if (formData.email && !emailValidation(formData.email)) {
      errors.email = "Please enter a valid email address.";
    }

    // Phone validation
    const phoneDigits = formData.phoneNumber.replace(/\D/g, "");
    if (formData.phoneNumber && phoneDigits.length !== 12) {
      errors.phoneNumber = "Please enter a phone number.";
    }

    // Password strength validation
    if (formData.password.trim()) {
      const pwdErrors = validatePassword(formData.password);
      if (pwdErrors.length > 0) {
        errors.password = pwdErrors[0];
      }
    }

    // Password match
    if (
      formData.password &&
      formData.confirmPassword &&
      formData.password !== formData.confirmPassword
    ) {
      errors.confirmPassword = "Passwords do not match.";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // Cleaned form data
    const cleanedFormData = {
      name: formData.fullName.trim(),
      email: formData.email.trim(),
      phoneNumber: formData.phoneNumber.trim(),
      password: formData.password.trim(),
    };

    setLoading(true);
    setFormErrors({});
    console.log("Registration Submitted:", cleanedFormData);

    // 🚀 API SUBMISSION STARTS HERE
    try {
      const response = await api.post(
        "/api/auth/register",
        cleanedFormData,
        { withCredentials: true } // REQUIRED for HttpOnly cookies
      );

      console.log("Registration success:", response.data);

      toast.success("Account created successfully! Redirecting...");

      // Save access token (use context ideally)
      localStorage.setItem("accessToken", response.data.token);

      // Redirect to dashboard/home
      redirectLogin();
    } catch (err) {
      console.error(err);
      const backendMessage = err.response?.data?.message || "";

      if (backendMessage.toLowerCase().includes("email")) {
        setFormErrors((prev) => ({
          ...prev,
          email: "This email is already registered.",
        }));
      } else {
        toast.error("Registration failed. Please try again.");
      }

      setLoading(false);
    }

    setLoading(false);
  };

  const redirectLogin = () => {
    setTimeout(() => {
      navigate("/login"); // ✅ Use the navigate function inside setTimeout
    }, 1500);
  };

  const styles = {
    container: {
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      padding: "32px 0",
      background:
        "linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #3b82f6 100%)",
      position: "relative",
      overflow: "hidden",
    },
    wrapper: {
      width: "100%",
      maxWidth: "540px",
      margin: "0 auto",
      padding: "0 16px",
      position: "relative",
      zIndex: 1,
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? "translateY(0)" : "translateY(30px)",
      transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
    },
    paper: {
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      backdropFilter: "blur(20px)",
      borderRadius: "28px",
      boxShadow:
        "0 20px 60px rgba(37, 99, 235, 0.12), 0 0 0 1px rgba(255, 255, 255, 0.8)",
      border: "1px solid rgba(255, 255, 255, 0.3)",
      padding: "48px",
      position: "relative",
    },
    headerBadge: {
      display: "inline-flex",
      alignItems: "center",
      gap: "8px",
      padding: "8px 16px",
      backgroundColor: "rgba(37, 99, 235, 0.08)",
      borderRadius: "50px",
      marginBottom: "24px",
      border: "1px solid rgba(37, 99, 235, 0.2)",
    },
    badgeText: {
      fontSize: "13px",
      fontWeight: 600,
      color: "#2563eb",
      letterSpacing: "0.5px",
    },
    title: {
      fontSize: "36px",
      fontWeight: 800,
      textAlign: "center",
      background:
        "linear-gradient(135deg, #1e40af 0%, #2563eb 50%, #3b82f6 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      marginBottom: "12px",
      letterSpacing: "-1px",
    },
    subtitle: {
      textAlign: "center",
      color: "#64748b",
      marginBottom: "40px",
      fontSize: "15px",
      lineHeight: "1.6",
    },
    formGroup: {
      marginBottom: "20px",
    },
    label: {
      display: "flex",
      alignItems: "center",
      gap: "6px",
      fontSize: "13px",
      fontWeight: 600,
      color: "#475569",
      marginBottom: "10px",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    },
    inputBox: {
      position: "relative",
      display: "flex",
      alignItems: "center",
      backgroundColor: "white",
      borderRadius: "14px",
      padding: "14px 18px",
      border: "2px solid #e2e8f0",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.02)",
    },
    inputBoxFocused: {
      border: "2px solid #2563eb",
      boxShadow:
        "0 0 0 4px rgba(37, 99, 235, 0.08), 0 4px 12px rgba(37, 99, 235, 0.12)",
      transform: "translateY(-1px)",
    },
    iconLeft: {
      marginRight: "12px",
      color: "#94a3b8",
      display: "flex",
      alignItems: "center",
      transition: "color 0.3s",
    },
    iconLeftFocused: {
      color: "#2563eb",
    },
    input: {
      flex: 1,
      backgroundColor: "transparent",
      border: "none",
      color: "#1e293b",
      fontSize: "15px",
      outline: "none",
      fontWeight: 500,
    },
    eyeButton: {
      background: "none",
      border: "none",
      cursor: "pointer",
      padding: "6px",
      display: "flex",
      alignItems: "center",
      marginLeft: "8px",
      color: "#94a3b8",
      borderRadius: "8px",
      transition: "all 0.2s",
    },
    submitButton: {
      width: "100%",
      background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
      color: "white",
      padding: "16px 24px",
      borderRadius: "14px",
      fontWeight: 700,
      fontSize: "16px",
      border: "none",
      cursor: "pointer",
      boxShadow: "0 8px 24px rgba(37, 99, 235, 0.35)",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      marginTop: "8px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      position: "relative",
      overflow: "hidden",
    },
    divider: {
      position: "relative",
      margin: "32px 0",
      height: "1px",
      background: "linear-gradient(90deg, transparent, #e2e8f0, transparent)",
    },
    dividerText: {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      padding: "0 20px",
      fontSize: "13px",
      color: "#94a3b8",
      fontWeight: 600,
      letterSpacing: "1px",
    },
    socialButton: {
      width: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "12px",
      padding: "14px 20px",
      border: "2px solid #e2e8f0",
      borderRadius: "14px",
      fontWeight: 600,
      color: "#475569",
      backgroundColor: "white",
      cursor: "pointer",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.02)",
    },
    googleIcon: {
      width: "20px",
      height: "20px",
    },
    loginText: {
      textAlign: "center",
      marginTop: "28px",
      color: "#64748b",
      fontSize: "15px",
    },
    loginLink: {
      fontWeight: 700,
      color: "#2563eb",
      textDecoration: "none",
      transition: "color 0.2s",
    },
    footer: {
      textAlign: "center",
      marginTop: "28px",
      fontSize: "13px",
      color: "white",
      lineHeight: "1.6",
    },
    footerLink: {
      color: "#93c5fd",
      textDecoration: "none",
      fontWeight: 600,
      transition: "color 0.2s",
    },
    securityBadge: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      marginTop: "24px",
      padding: "12px",
      backgroundColor: "rgba(37, 99, 235, 0.05)",
      borderRadius: "12px",
      border: "1px solid rgba(37, 99, 235, 0.15)",
    },
    securityText: {
      fontSize: "12px",
      color: "#2563eb",
      fontWeight: 600,
    },
  };

  return (
    <div style={styles.container}>
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-15px); }
          }
          
          @keyframes slideCloud {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100vw); }
          }
          
          .travel-icon {
            position: absolute;
            opacity: 0.1;
            color: white;
            animation: float 6s ease-in-out infinite;
          }
          
          .icon1 { top: 15%; left: 10%; animation-delay: 0s; }
          .icon2 { top: 25%; right: 15%; animation-delay: 1s; }
          .icon3 { bottom: 20%; left: 15%; animation-delay: 2s; }
          .icon4 { top: 60%; right: 20%; animation-delay: 1.5s; }
          .icon5 { top: 40%; left: 20%; animation-delay: 0.5s; }
          .icon6 { bottom: 30%; right: 25%; animation-delay: 2.5s; }
          
          .cloud {
            position: absolute;
            width: 100px;
            height: 40px;
            background: rgba(255, 255, 255, 0.08);
            border-radius: 50px;
            animation: slideCloud 60s linear infinite;
          }
          
          .cloud::before,
          .cloud::after {
            content: '';
            position: absolute;
            background: rgba(255, 255, 255, 0.08);
            border-radius: 50%;
          }
          
          .cloud::before {
            width: 50px;
            height: 50px;
            top: -25px;
            left: 10px;
          }
          
          .cloud::after {
            width: 60px;
            height: 40px;
            top: -20px;
            right: 10px;
          }
          
          .cloud1 { top: 20%; animation-duration: 80s; }
          .cloud2 { top: 50%; animation-duration: 100s; animation-delay: -20s; }
          .cloud3 { top: 70%; animation-duration: 90s; animation-delay: -40s; }
          
          .wave {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 200%;
            height: 100px;
            background: rgba(255, 255, 255, 0.03);
            animation: wave 15s ease-in-out infinite;
          }
          
          @keyframes wave {
            0%, 100% { transform: translateX(0) translateY(0); }
            50% { transform: translateX(-25%) translateY(-10px); }
          }
        `}
      </style>

      {/* Animated Clouds */}
      <div className="cloud cloud1"></div>
      <div className="cloud cloud2"></div>
      <div className="cloud cloud3"></div>

      {/* Wave Effect */}
      <div className="wave"></div>

      {/* Travel Icons */}
      <div className="travel-icon icon1" style={{ fontSize: "60px" }}>
        ✈️
      </div>
      <div className="travel-icon icon2" style={{ fontSize: "50px" }}>
        🏨
      </div>
      <div className="travel-icon icon3" style={{ fontSize: "55px" }}>
        🗺️
      </div>
      <div className="travel-icon icon4" style={{ fontSize: "45px" }}>
        🏖️
      </div>
      <div className="travel-icon icon5" style={{ fontSize: "50px" }}>
        🧳
      </div>
      <div className="travel-icon icon6" style={{ fontSize: "55px" }}>
        🗼
      </div>

      <div style={styles.wrapper}>
        <div style={styles.paper}>
          {/* Header */}
          <h2 style={styles.title}>Create Account</h2>
          <p style={styles.subtitle}>
            Join thousands of travelers and unlock exclusive booking benefits
          </p>

          {/* Form */}
          <div>
            {/* Full Name Field */}
            <div style={styles.formGroup}>
              <label style={styles.label}>
                <User size={14} />
                Full Name
              </label>
              <div
                style={{
                  ...styles.inputBox,
                  ...(focusedField === "fullName"
                    ? styles.inputBoxFocused
                    : {}),
                }}
              >
                <div
                  style={{
                    ...styles.iconLeft,
                    ...(focusedField === "fullName"
                      ? styles.iconLeftFocused
                      : {}),
                  }}
                >
                  <User size={20} />
                </div>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("fullName")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Enter your full name"
                  required
                  style={styles.input}
                />
              </div>
              {formErrors.fullName && (
                <span style={{ color: "red", fontSize: "12px" }}>
                  {formErrors.fullName}
                </span>
              )}
            </div>

            {/* Email Field */}
            <div style={styles.formGroup}>
              <label style={styles.label}>
                <Mail size={14} />
                Email Address
              </label>
              <div
                style={{
                  ...styles.inputBox,
                  ...(focusedField === "email" ? styles.inputBoxFocused : {}),
                  ...(emailValid
                    ? styles.inputBoxValid
                    : styles.inputBoxInvalid), // Style based on validation
                }}
              >
                <div
                  style={{
                    ...styles.iconLeft,
                    ...(focusedField === "email" ? styles.iconLeftFocused : {}),
                  }}
                >
                  <Mail size={20} />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Enter your email address"
                  required
                  style={styles.input}
                />
              </div>

              {/* Email Validity Feedback */}
              {(!emailValid || formErrors.email) && (
                <span style={{ color: "red", fontSize: "12px" }}>
                  {formErrors.email || "Please enter a valid email address."}
                </span>
              )}
            </div>

            {/* Phone Number Field */}
            <div style={styles.formGroup}>
              <label style={styles.label}>
                <Phone size={14} />
                Phone Number
              </label>
              <div
                style={{
                  ...styles.inputBox,
                  ...(focusedField === "phone" ? styles.inputBoxFocused : {}),
                }}
              >
                <div
                  style={{
                    ...styles.iconLeft,
                    ...(focusedField === "phone" ? styles.iconLeftFocused : {}),
                  }}
                >
                  <Phone size={20} />
                </div>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("phone")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Enter your phone number"
                  required
                  style={styles.input}
                />
              </div>
              {formErrors.phoneNumber && (
                <span style={{ color: "red", fontSize: "12px" }}>
                  {formErrors.phoneNumber}
                </span>
              )}
            </div>

            {/* Password Field */}
            <div style={styles.formGroup}>
              <label style={styles.label}>
                <Lock size={14} />
                Password
              </label>
              <div
                style={{
                  ...styles.inputBox,
                  ...(focusedField === "password"
                    ? styles.inputBoxFocused
                    : {}),
                }}
              >
                <div
                  style={{
                    ...styles.iconLeft,
                    ...(focusedField === "password"
                      ? styles.iconLeftFocused
                      : {}),
                  }}
                >
                  <Lock size={20} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Create a password"
                  required
                  style={styles.input}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={styles.eyeButton}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor =
                      "rgba(16, 185, 129, 0.08)";
                    e.currentTarget.style.color = "#10b981";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "#94a3b8";
                  }}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {formErrors.password && (
                <span style={{ color: "red", fontSize: "12px" }}>
                  {formErrors.password}
                </span>
              )}
            </div>

            {/* Confirm Password Field */}
            <div style={styles.formGroup}>
              <label style={styles.label}>
                <Lock size={14} />
                Confirm Password
              </label>
              <div
                style={{
                  ...styles.inputBox,
                  ...(focusedField === "confirmPassword"
                    ? styles.inputBoxFocused
                    : {}),
                }}
              >
                <div
                  style={{
                    ...styles.iconLeft,
                    ...(focusedField === "confirmPassword"
                      ? styles.iconLeftFocused
                      : {}),
                  }}
                >
                  <Lock size={20} />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("confirmPassword")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Confirm your password"
                  required
                  style={styles.input}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.eyeButton}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor =
                      "rgba(16, 185, 129, 0.08)";
                    e.currentTarget.style.color = "#10b981";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "#94a3b8";
                  }}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>

              {formErrors.confirmPassword && (
                <span style={{ color: "red", fontSize: "12px" }}>
                  {formErrors.confirmPassword}
                </span>
              )}
            </div>

            {/* Submit Button */}
            <button
              onClick={(e) => {
                e.preventDefault();
                handleSubmit(e);
              }}
              disabled={loading}
              style={{
                ...styles.submitButton,
                opacity: loading ? 0.7 : 1,
                cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseOver={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 12px 32px rgba(16, 185, 129, 0.45)";
                }
              }}
              onMouseOut={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 24px rgba(16, 185, 129, 0.35)";
                }
              }}
            >
              {loading ? (
                "Creating Account..."
              ) : (
                <>
                  Create Your Account
                  <ArrowRight size={20} />
                </>
              )}
            </button>

            {/* Security Badge */}
            <div style={styles.securityBadge}>
              <Shield size={16} style={{ color: "#059669" }} />
              <span style={styles.securityText}>
                Your data is protected with 256-bit encryption
              </span>
            </div>
          </div>

          {/* Divider */}
          <div style={styles.divider}>
            <span style={styles.dividerText}>OR</span>
          </div>

          {/* Social Login */}
          <button
            type="button"
            style={styles.socialButton}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = "#10b981";
              e.currentTarget.style.backgroundColor =
                "rgba(16, 185, 129, 0.02)";
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow =
                "0 4px 12px rgba(16, 185, 129, 0.1)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = "#e2e8f0";
              e.currentTarget.style.backgroundColor = "white";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.02)";
            }}
          >
            <img
              src="https://www.google.com/favicon.ico"
              alt="Google"
              style={styles.googleIcon}
            />
            Sign up with Google
          </button>

          {/* Login Link */}
          <p style={styles.loginText}>
            Already have an account?{" "}
            <a
              href="#login"
              style={styles.loginLink}
              onClick={(e) => {
                e.preventDefault();
                navigate("/login");
              }}
              onMouseOver={(e) => (e.target.style.color = "#059669")}
              onMouseOut={(e) => (e.target.style.color = "#10b981")}
            >
              Sign in
            </a>
          </p>
        </div>

        {/* Footer */}
        <p style={styles.footer}>
          By creating an account, you agree to our{" "}
          <a
            href="#terms"
            style={styles.footerLink}
            onMouseOver={(e) => (e.target.style.color = "#dbeafe")}
            onMouseOut={(e) => (e.target.style.color = "#93c5fd")}
          >
            Terms of Service
          </a>{" "}
          and{" "}
          <a
            href="#privacy"
            style={styles.footerLink}
            onMouseOver={(e) => (e.target.style.color = "#dbeafe")}
            onMouseOut={(e) => (e.target.style.color = "#93c5fd")}
          >
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
}
