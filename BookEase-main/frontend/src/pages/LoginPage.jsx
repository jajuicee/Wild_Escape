import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Sparkles,
  Shield,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormErrors((prev) => ({ ...prev, backend: "" }));

    const sanitizedValue =
      type === "checkbox" ? checked : sanitizeInput(name, value);

    setFormData((prev) => ({
      ...prev,
      [name]: sanitizedValue,
    }));

    // Live email validation
    if (name === "email") {
      setFormErrors((prev) => ({
        ...prev,
        email:
          sanitizedValue && !emailValidation(sanitizedValue)
            ? "Please enter a valid email address."
            : "",
      }));
    }

    // Live password validation
    if (name === "password") {
      setFormErrors((prev) => ({
        ...prev,
        password: validatePassword(sanitizedValue),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors({});
    setLoading(true);

    const errors = {};

    if (!formData.email.trim()) errors.email = "Email is required.";
    else if (!emailValidation(formData.email))
      errors.email = "Please enter a valid email address.";

    const pwdErr = validatePassword(formData.password);
    if (pwdErr) errors.password = pwdErr;

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setLoading(false);
      return;
    }

    try {
      // 🚀 Use AuthContext login
      const userData = await login(formData.email, formData.password);

      toast.success(`Welcome back, ${userData.name}!`);
      redirectHome();
    } catch (err) {
      const msg =
        err.response?.data?.message?.toLowerCase() ||
        err.response?.data?.toLowerCase() ||
        "";

      if (msg.includes("invalid")) {
        setFormErrors((prev) => ({
          ...prev,
          backend: "Incorrect email or password.",
        }));
      } else {
        setFormErrors((prev) => ({
          ...prev,
          backend: "Login failed. Please try again.",
        }));
      }
    }

    setLoading(false);
  };

  const redirectHome = () => {
    setTimeout(() => {
      navigate("/"); // ✅ Use the navigate function inside setTimeout
    }, 1500);
  };

  const emailValidation = (email) => {
    // Simple regex pattern for basic email validation (you can adjust it)
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  };

  const validatePassword = (password) => {
    if (password.length === 0) return "Password is required.";
    if (password.length < 8) return "Password must be at least 8 characters.";
    return ""; // valid
  };

  const sanitizeInput = (name, value) => {
    if (name === "email") {
      return value.trim(); // remove leading/trailing space
    }

    if (name === "password") {
      return value.trim(); // do NOT strip inside characters
    }

    return value;
  };

  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setFormData((prev) => ({
        ...prev,
        email: savedEmail,
        rememberMe: true,
      }));
    }
  }, []);

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
    backgroundDecor: {
      position: "absolute",
      width: "600px",
      height: "600px",
      borderRadius: "50%",
      background:
        "radial-gradient(circle, rgba(37, 99, 235, 0.08) 0%, transparent 70%)",
      filter: "blur(60px)",
    },
    decorLeft: {
      top: "-200px",
      left: "-200px",
    },
    decorRight: {
      bottom: "-200px",
      right: "-200px",
    },
    wrapper: {
      width: "100%",
      maxWidth: "540px",
      margin: "0 auto",
      padding: "0 16px",
      position: "relative",
      zIndex: 1,
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
      border: "1px solid rgba(37, 99, 235, 0.15)",
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
    rememberRow: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: "28px",
      marginTop: "8px",
    },
    checkboxLabel: {
      display: "flex",
      alignItems: "center",
      cursor: "pointer",
    },
    checkbox: {
      width: "18px",
      height: "18px",
      marginRight: "10px",
      cursor: "pointer",
      accentColor: "#2563eb",
    },
    checkboxText: {
      fontSize: "14px",
      color: "#64748b",
      fontWeight: 500,
    },
    forgotLink: {
      fontSize: "14px",
      fontWeight: 600,
      color: "#2563eb",
      textDecoration: "none",
      transition: "color 0.2s",
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
    registerText: {
      textAlign: "center",
      marginTop: "28px",
      color: "#64748b",
      fontSize: "15px",
    },
    registerLink: {
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
      backgroundColor: "rgba(16, 185, 129, 0.05)",
      borderRadius: "12px",
      border: "1px solid rgba(16, 185, 129, 0.15)",
    },
    securityText: {
      fontSize: "12px",
      color: "#059669",
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
          
          @keyframes fadeInOut {
            0%, 100% { opacity: 0.15; }
            50% { opacity: 0.3; }
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

      {/* Travel Icons - Using Unicode characters */}
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
          <h2 style={styles.title}>Welcome Back</h2>
          <p style={styles.subtitle}>
            Access your personalized booking dashboard and manage your
            reservations
          </p>

          {/* Form */}
          <div>
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
                  placeholder="Enter your email"
                  required
                  style={styles.input}
                />
              </div>
              {formErrors.email && (
                <span style={{ color: "red", fontSize: "12px" }}>
                  {formErrors.email}
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
                  placeholder="Enter your password"
                  required
                  style={styles.input}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={styles.eyeButton}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor =
                      "rgba(37, 99, 235, 0.08)";
                    e.currentTarget.style.color = "#2563eb";
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
              {formErrors.backend && (
                <span style={{ color: "red", fontSize: "12px" }}>
                  {formErrors.backend}
                </span>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div style={styles.rememberRow}>
              <label style={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  style={styles.checkbox}
                />
                <span style={styles.checkboxText}>Remember me</span>
              </label>
              <a
                href="#forgot"
                style={styles.forgotLink}
                onMouseOver={(e) => (e.target.style.color = "#1d4ed8")}
                onMouseOut={(e) => (e.target.style.color = "#2563eb")}
              >
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              style={styles.submitButton}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 12px 32px rgba(37, 99, 235, 0.45)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 8px 24px rgba(37, 99, 235, 0.35)";
              }}
            >
              {loading ? "Singing in..." : "Sign in to your Account"}
              <ArrowRight size={20} />
            </button>

            {/* Security Badge */}
            <div style={styles.securityBadge}>
              <Shield size={16} style={{ color: "#059669" }} />
              <span style={styles.securityText}>
                256-bit SSL Encrypted Connection
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
              e.currentTarget.style.borderColor = "#059669";
              e.currentTarget.style.backgroundColor = "rgba(37, 99, 235, 0.02)";
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow =
                "0 4px 12px rgba(37, 99, 235, 0.1)";
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
            Continue with Google
          </button>

          {/* Register Link */}
          <p style={styles.registerText}>
            Don't have an account?{" "}
            <a
              onClick={(e) => {
                e.preventDefault();
                navigate("/register");
              }}
              style={{ ...styles.registerLink, cursor: "pointer" }}
              onMouseOver={(e) => (e.target.style.color = "#059669")}
              onMouseOut={(e) => (e.target.style.color = "#10b981")}
            >
              Create account
            </a>
          </p>
        </div>

        {/* Footer */}
        <p style={styles.footer}>
          By signing in, you agree to our{" "}
          <a
            href="#terms"
            style={styles.footerLink}
            onMouseOver={(e) => (e.target.style.color = "#1d4ed8")}
            onMouseOut={(e) => (e.target.style.color = "#2563eb")}
          >
            Terms of Service
          </a>{" "}
          and{" "}
          <a
            href="#privacy"
            style={styles.footerLink}
            onMouseOver={(e) => (e.target.style.color = "#1d4ed8")}
            onMouseOut={(e) => (e.target.style.color = "#2563eb")}
          >
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
}
