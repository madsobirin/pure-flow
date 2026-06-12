"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Info,
  ArrowRight,
  LogOut,
  Loader2,
  Sparkles,
  ShieldAlert,
  Compass,
  Check,
  UserCheck,
} from "lucide-react";

// Define the type for registered user state
interface UserProfile {
  namaLengkap: string;
  email: string;
}

export default function App() {
  // Navigation states: 'signup' | 'login' | 'success'
  const [currentMode, setCurrentMode] = useState<
    "signup" | "login" | "success"
  >("signup");

  // Registration Form States
  const [signUpName, setSignUpName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Login Form States
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // UI interaction states
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loggedInUser, setLoggedInUser] = useState<UserProfile | null>(null);
  const [showGoogleModal, setShowGoogleModal] = useState(false);

  // Pre-seed some account for login demonstration
  const [registeredAccounts, setRegisteredAccounts] = useState<UserProfile[]>([
    { namaLengkap: "Alex Johnson", email: "alex@example.com" },
  ]);

  // Validation functions
  const validateSignUp = () => {
    const newErrors: { [key: string]: string } = {};

    if (!signUpName.trim()) {
      newErrors.namaLengkap = "Nama lengkap wajib diisi";
    } else if (signUpName.trim().length < 3) {
      newErrors.namaLengkap = "Nama minimal 3 karakter";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!signUpEmail.trim()) {
      newErrors.email = "Email wajib diisi";
    } else if (!emailRegex.test(signUpEmail)) {
      newErrors.email = "Format email tidak valid";
    }

    if (!signUpPassword) {
      newErrors.password = "Password wajib diisi";
    } else if (signUpPassword.length < 8) {
      newErrors.password = "Password minimal 8 karakter";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateLogin = () => {
    const newErrors: { [key: string]: string } = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!loginEmail.trim()) {
      newErrors.loginEmail = "Email wajib diisi";
    } else if (!emailRegex.test(loginEmail)) {
      newErrors.loginEmail = "Format email tidak valid";
    }

    if (!loginPassword) {
      newErrors.loginPassword = "Password wajib diisi";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handler for manual Sign Up submission
  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateSignUp()) return;

    setIsLoading(true);

    // Simulate server request delay
    setTimeout(() => {
      const newUser: UserProfile = {
        namaLengkap: signUpName,
        email: signUpEmail,
      };

      // Save in registered accounts and session
      setRegisteredAccounts((prev) => [...prev, newUser]);
      setLoggedInUser(newUser);
      setIsLoading(false);
      setCurrentMode("success");

      // Reset fields
      setSignUpName("");
      setSignUpEmail("");
      setSignUpPassword("");
      setErrors({});
    }, 1500);
  };

  // Handler for manual Login submission
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateLogin()) return;

    setIsLoading(true);

    setTimeout(() => {
      // Find if user is registered (case insensitive email search)
      const user = registeredAccounts.find(
        (acc) => acc.email.toLowerCase() === loginEmail.toLowerCase().trim(),
      );

      if (user) {
        setLoggedInUser(user);
        setCurrentMode("success");
        setLoginEmail("");
        setLoginPassword("");
        setErrors({});
      } else {
        // Mock register for demonstration if not found, or show error
        setErrors({
          loginEmail: "Email atau password salah/tidak terdaftar",
        });
      }
      setIsLoading(false);
    }, 1200);
  };

  // Google Sign-In Simulation
  const handleGoogleClick = () => {
    setShowGoogleModal(true);
  };

  const selectGoogleAccount = (name: string, email: string) => {
    setIsLoading(true);
    setShowGoogleModal(false);

    setTimeout(() => {
      const gUser: UserProfile = { namaLengkap: name, email };
      // Register if not already there
      if (!registeredAccounts.some((acc) => acc.email === email)) {
        setRegisteredAccounts((prev) => [...prev, gUser]);
      }
      setLoggedInUser(gUser);
      setIsLoading(false);
      setCurrentMode("success");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] flex items-center justify-center p-4 md:p-8 font-sans transition-colors duration-300">
      {/* Container - Styled like a beautiful elegant mock smartphone wrapper on desktop */}
      <div
        id="app_frame"
        className="w-full max-w-md bg-[#faf9f6] md:bg-white md:shadow-2xl md:shadow-gray-100/80 md:border md:border-gray-100 md:rounded-[40px] overflow-hidden relative min-h-[820px] flex flex-col justify-between py-8 px-6 md:px-8"
      >
        {/* Subtle decorative elements for the desktop phone layout */}
        <div className="hidden md:block absolute top-3 left-1/2 -translate-x-1/2 w-32 h-4 bg-gray-100 rounded-full" />

        <AnimatePresence mode="wait">
          {/* 1. SIGN UP SCREEN (Primary screen requested in user's layout image) */}
          {currentMode === "signup" && (
            <motion.div
              id="signup_view"
              key="signup"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="w-full flex flex-col justify-start flex-1 mt-4"
            >
              {/* Header Title */}
              <h1
                id="signup_title"
                className="text-[32px] font-bold text-center text-[#2d3238] tracking-tight mb-8 mt-4 leading-tight"
              >
                Create an Account
              </h1>

              {/* Form Card containing fields */}
              <div
                id="signup_card"
                className="bg-white rounded-[32px] border border-[#eff1f4] shadow-[0_8px_30px_rgb(0,0,0,0.02)] p-6 mb-6"
              >
                <form onSubmit={handleSignUpSubmit} className="space-y-5">
                  {/* Nama Lengkap field */}
                  <div id="field_name" className="flex flex-col">
                    <label className="text-sm font-semibold text-[#1a1f24] mb-2 leading-none">
                      Nama Lengkap
                    </label>
                    <div
                      className={`flex items-center bg-field-bg rounded-[16px] px-4 py-3.5 border ${errors.namaLengkap ? "border-red-400" : "border-transparent focus-within:border-brand-teal"} transition-all duration-200`}
                    >
                      <User className="text-gray-400 w-5 h-5 shrink-0" />
                      <input
                        type="text"
                        placeholder="E.g. Alex Johnson"
                        value={signUpName}
                        onChange={(e) => {
                          setSignUpName(e.target.value);
                          if (errors.namaLengkap)
                            setErrors((prev) => ({ ...prev, namaLengkap: "" }));
                        }}
                        className="bg-transparent text-sm text-[#1a1f24] placeholder:text-gray-400/85 focus:outline-none w-full ml-3"
                      />
                    </div>
                    {errors.namaLengkap && (
                      <span className="text-red-500 text-xs mt-1.5 ml-1 flex items-center gap-1">
                        <ShieldAlert className="w-3.5 h-3.5" />{" "}
                        {errors.namaLengkap}
                      </span>
                    )}
                  </div>

                  {/* Email field */}
                  <div id="field_email" className="flex flex-col">
                    <label className="text-sm font-semibold text-[#1a1f24] mb-2 leading-none">
                      Email
                    </label>
                    <div
                      className={`flex items-center bg-field-bg rounded-[16px] px-4 py-3.5 border ${errors.email ? "border-red-400" : "border-transparent focus-within:border-brand-teal"} transition-all duration-200`}
                    >
                      <Mail className="text-gray-400 w-5 h-5 shrink-0" />
                      <input
                        type="email"
                        placeholder="alex@example.com"
                        value={signUpEmail}
                        onChange={(e) => {
                          setSignUpEmail(e.target.value);
                          if (errors.email)
                            setErrors((prev) => ({ ...prev, email: "" }));
                        }}
                        className="bg-transparent text-sm text-[#1a1f24] placeholder:text-gray-400/85 focus:outline-none w-full ml-3"
                      />
                    </div>
                    {errors.email && (
                      <span className="text-red-500 text-xs mt-1.5 ml-1 flex items-center gap-1">
                        <ShieldAlert className="w-3.5 h-3.5" /> {errors.email}
                      </span>
                    )}
                  </div>

                  {/* Password field */}
                  <div id="field_password" className="flex flex-col">
                    <label className="text-sm font-semibold text-[#1a1f24] mb-2 leading-none">
                      Password
                    </label>
                    <div
                      className={`flex items-center bg-field-bg rounded-[16px] px-4 py-3.5 border ${errors.password ? "border-red-400" : "border-transparent focus-within:border-brand-teal"} transition-all duration-200`}
                    >
                      <Lock className="text-gray-400 w-5 h-5 shrink-0" />
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={signUpPassword}
                        onChange={(e) => {
                          setSignUpPassword(e.target.value);
                          if (errors.password)
                            setErrors((prev) => ({ ...prev, password: "" }));
                        }}
                        className="bg-transparent text-sm text-[#1a1f24] placeholder:text-gray-400/85 focus:outline-none w-full ml-3 tracking-wider font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
                      >
                        {showPassword ? (
                          <Eye className="w-5 h-5" />
                        ) : (
                          <EyeOff className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {errors.password ? (
                      <span className="text-red-500 text-xs mt-1.5 ml-1 flex items-center gap-1">
                        <ShieldAlert className="w-3.5 h-3.5" />{" "}
                        {errors.password}
                      </span>
                    ) : (
                      <div className="text-xs text-[#71777f] mt-2.5 flex items-center gap-1.5 font-medium">
                        <Info className="w-4 h-4 text-gray-400 shrink-0" />
                        <span>Minimal 8 karakter</span>
                      </div>
                    )}
                  </div>
                </form>
              </div>

              {/* Outside buttons section */}
              <div id="action_buttons" className="space-y-4">
                {/* Create Account button */}
                <button
                  id="btn_create_account"
                  onClick={handleSignUpSubmit}
                  disabled={isLoading}
                  className="w-full bg-brand-teal hover:bg-brand-teal-dark text-white rounded-[16px] py-4 px-6 font-semibold flex items-center justify-center gap-2 group shadow-lg shadow-teal-900/10 active:scale-[0.98] transition-all duration-200 cursor-pointer disabled:opacity-80"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <span>Create Account</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>

                {/* Split text */}
                <div className="text-center">
                  <span className="text-sm font-medium text-[#71777f]">
                    atau masuk dengan
                  </span>
                </div>

                {/* Google Sign-in button */}
                <button
                  id="btn_google_signup"
                  onClick={handleGoogleClick}
                  disabled={isLoading}
                  className="w-full bg-brand-teal hover:bg-brand-teal-dark text-white rounded-[16px] py-4 px-6 font-semibold flex items-center justify-center gap-2 active:scale-[0.98] transition-all duration-200 cursor-pointer disabled:opacity-80"
                >
                  {/* Minimal multicolor Google logo */}
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center p-1">
                    <svg viewBox="0 0 24 24" className="w-full h-full">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                  </div>
                  <span>Google</span>
                </button>
              </div>

              {/* Bottom login link */}
              <div id="bottom_link" className="text-center mt-7 mb-2">
                <p className="text-sm font-medium text-gray-500">
                  Already have an account?{" "}
                  <button
                    onClick={() => {
                      setCurrentMode("login");
                      setErrors({});
                    }}
                    className="text-brand-teal font-bold hover:underline ml-1 cursor-pointer focus:outline-none"
                  >
                    Login
                  </button>
                </p>
              </div>
            </motion.div>
          )}

          {/* 2. LOGIN SCREEN (Alternate view for cohesive workflow) */}
          {currentMode === "login" && (
            <motion.div
              id="login_view"
              key="login"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="w-full flex flex-col justify-start flex-1 mt-4"
            >
              {/* Header Title */}
              <h1
                id="login_title"
                className="text-[32px] font-bold text-center text-[#2d3238] tracking-tight mb-8 mt-4 leading-tight"
              >
                Welcome Back
              </h1>

              {/* Form Card containing fields */}
              <div
                id="login_card"
                className="bg-white rounded-[32px] border border-[#eff1f4] shadow-[0_8px_30px_rgb(0,0,0,0.02)] p-6 mb-6"
              >
                <form onSubmit={handleLoginSubmit} className="space-y-5">
                  {/* Email field */}
                  <div id="login_field_email" className="flex flex-col">
                    <label className="text-sm font-semibold text-[#1a1f24] mb-2 leading-none">
                      Email
                    </label>
                    <div
                      className={`flex items-center bg-field-bg rounded-[16px] px-4 py-3.5 border ${errors.loginEmail ? "border-red-400" : "border-transparent focus-within:border-brand-teal"} transition-all duration-200`}
                    >
                      <Mail className="text-gray-400 w-5 h-5 shrink-0" />
                      <input
                        type="email"
                        placeholder="alex@example.com"
                        value={loginEmail}
                        onChange={(e) => {
                          setLoginEmail(e.target.value);
                          if (errors.loginEmail)
                            setErrors((prev) => ({ ...prev, loginEmail: "" }));
                        }}
                        className="bg-transparent text-sm text-[#1a1f24] placeholder:text-gray-400/85 focus:outline-none w-full ml-3"
                      />
                    </div>
                    {errors.loginEmail && (
                      <span className="text-red-500 text-xs mt-1.5 ml-1 flex items-center gap-1">
                        <ShieldAlert className="w-3.5 h-3.5" />{" "}
                        {errors.loginEmail}
                      </span>
                    )}
                  </div>

                  {/* Password field */}
                  <div id="login_field_password" className="flex flex-col">
                    <label className="text-sm font-semibold text-[#1a1f24] mb-2 leading-none">
                      Password
                    </label>
                    <div
                      className={`flex items-center bg-field-bg rounded-[16px] px-4 py-3.5 border ${errors.loginPassword ? "border-red-400" : "border-transparent focus-within:border-brand-teal"} transition-all duration-200`}
                    >
                      <Lock className="text-gray-400 w-5 h-5 shrink-0" />
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={loginPassword}
                        onChange={(e) => {
                          setLoginPassword(e.target.value);
                          if (errors.loginPassword)
                            setErrors((prev) => ({
                              ...prev,
                              loginPassword: "",
                            }));
                        }}
                        className="bg-transparent text-sm text-[#1a1f24] placeholder:text-gray-400/85 focus:outline-none w-full ml-3 tracking-wider font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
                      >
                        {showPassword ? (
                          <Eye className="w-5 h-5" />
                        ) : (
                          <EyeOff className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {errors.loginPassword && (
                      <span className="text-red-500 text-xs mt-1.5 ml-1 flex items-center gap-1">
                        <ShieldAlert className="w-3.5 h-3.5" />{" "}
                        {errors.loginPassword}
                      </span>
                    )}
                  </div>
                </form>
              </div>

              {/* Outside buttons section */}
              <div id="login_action_buttons" className="space-y-4">
                {/* Submit button */}
                <button
                  id="btn_login_submit"
                  onClick={handleLoginSubmit}
                  disabled={isLoading}
                  className="w-full bg-brand-teal hover:bg-brand-teal-dark text-white rounded-[16px] py-4 px-6 font-semibold flex items-center justify-center gap-2 group shadow-lg shadow-teal-900/10 active:scale-[0.98] transition-all duration-200 cursor-pointer disabled:opacity-80"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>

                {/* Split text */}
                <div className="text-center">
                  <span className="text-sm font-medium text-[#71777f]">
                    atau masuk dengan
                  </span>
                </div>

                {/* Google Sign-in button */}
                <button
                  id="btn_google_login"
                  onClick={handleGoogleClick}
                  disabled={isLoading}
                  className="w-full bg-brand-teal hover:bg-brand-teal-dark text-white rounded-[16px] py-4 px-6 font-semibold flex items-center justify-center gap-2 active:scale-[0.98] transition-all duration-200 cursor-pointer disabled:opacity-80"
                >
                  {/* Google Logo */}
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center p-1">
                    <svg viewBox="0 0 24 24" className="w-full h-full">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                  </div>
                  <span>Google</span>
                </button>
              </div>

              {/* Bottom login link */}
              <div id="login_bottom_link" className="text-center mt-7 mb-2">
                <p className="text-sm font-medium text-gray-500">
                  Don&apos;t have an account?{" "}
                  <button
                    onClick={() => {
                      setCurrentMode("signup");
                      setErrors({});
                    }}
                    className="text-brand-teal font-bold hover:underline ml-1 cursor-pointer focus:outline-none"
                  >
                    Register
                  </button>
                </p>
              </div>
            </motion.div>
          )}

          {/* 3. SUCCESS / WELCOME SCREEN DETAILS */}
          {currentMode === "success" && loggedInUser && (
            <motion.div
              id="success_view"
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="w-full flex flex-col justify-between flex-1 py-4 text-center"
            >
              <div className="flex-1 flex flex-col items-center justify-center my-6">
                {/* Interactive premium animated checkmark */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.1, 1] }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                  className="w-20 h-20 bg-brand-teal-light rounded-full flex items-center justify-center text-brand-teal mb-6 shadow-md shadow-emerald-900/5"
                >
                  <Check className="w-10 h-10 stroke-3" />
                </motion.div>

                {/* Congratulations Details */}
                <h2 className="text-2xl font-bold text-gray-800 tracking-tight leading-tight mb-2">
                  Akun Berhasil Dibuat!
                </h2>
                <p className="text-brand-teal font-medium text-sm mb-6 flex items-center gap-1 bg-brand-teal-light px-3 py-1 rounded-full">
                  <Sparkles className="w-4 h-4" /> Selamat datang di platform
                  kami
                </p>

                {/* User card profile specs */}
                <div className="w-full bg-white border border-[#eff1f4] rounded-[24px] p-6 text-left space-y-4 shadow-[0_4px_24px_rgba(0,0,0,0.01)]">
                  <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                      Detail Sesi
                    </span>
                    <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                      <UserCheck className="w-3 h-3" /> Aktif
                    </span>
                  </div>

                  <div>
                    <span className="text-xs text-gray-400 block font-medium">
                      Nama Lengkap
                    </span>
                    <span className="text-base font-bold text-[#1a1f24] block mt-0.5">
                      {loggedInUser.namaLengkap}
                    </span>
                  </div>

                  <div>
                    <span className="text-xs text-gray-400 block font-medium">
                      Alamat Email
                    </span>
                    <span className="text-sm font-semibold text-gray-700 block mt-0.5 break-all">
                      {loggedInUser.email}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-gray-100">
                    <p className="text-xs text-gray-500 flex items-center gap-1.5 font-medium leading-relaxed">
                      <Compass className="w-4 h-4 text-brand-teal shrink-0" />
                      <span>
                        Sistem sandbox ini berjalan secara lokal untuk menguji
                        fungsionalitas visual formulir pendaftaran.
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Back to authentication link */}
              <button
                id="btn_logout"
                onClick={() => {
                  setLoggedInUser(null);
                  setCurrentMode("signup");
                }}
                className="w-full mt-6 bg-gray-100 hover:bg-gray-200 text-text-charcoal font-semibold rounded-[16px] py-3.5 px-6 flex items-center justify-center gap-2 active:scale-[0.98] transition-all duration-200 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout Sesi</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Brand footers */}
        <div className="text-center text-[11px] text-[#71777f] font-medium tracking-tight mt-6 select-none opacity-80">
          <p className="flex items-center justify-center gap-1">
            <span>Metode otentikasi aman terenkripsi</span>
          </p>
        </div>
      </div>

      {/* Interactive Simulated Google Choice Account Modal Overlay */}
      <AnimatePresence>
        {showGoogleModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[28px] max-w-sm w-full p-6 shadow-2xl relative border border-gray-100 overflow-hidden"
            >
              {/* Header */}
              <div className="text-center pb-4 border-b border-gray-100">
                <div className="w-10 h-10 mx-auto rounded-full bg-gray-50 flex items-center justify-center mb-2 shadow-sm">
                  <svg viewBox="0 0 24 24" className="w-6 h-6">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                </div>
                <h3 className="font-bold text-gray-800 text-lg leading-tight">
                  Pilih akun Google
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  untuk melanjutkan ke pendaftaran
                </p>
              </div>

              {/* Accounts List */}
              <div className="space-y-2.5 my-5">
                {/* Account 1 */}
                <button
                  onClick={() =>
                    selectGoogleAccount(
                      "Ahmad Sobirin",
                      "ahmadsobirin67834@gmail.com",
                    )
                  }
                  className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-gray-100 hover:bg-[#faf9f6] text-left transition-all duration-150 active:scale-[0.99]"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-teal text-white flex items-center justify-center font-bold text-sm">
                      AS
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800 leading-none">
                        Ahmad Sobirin
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        ahmadsobirin67834@gmail.com
                      </p>
                    </div>
                  </div>
                  <div className="text-[11px] bg-brand-teal-light text-brand-teal font-bold px-2 py-0.5 rounded-full">
                    G-User
                  </div>
                </button>

                {/* Account 2 */}
                <button
                  onClick={() =>
                    selectGoogleAccount("Alex Johnson", "alex@example.com")
                  }
                  className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-gray-100 hover:bg-[#faf9f6] text-left transition-all duration-150 active:scale-[0.99]"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center font-bold text-sm">
                      AJ
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800 leading-none">
                        Alex Johnson
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        alex@example.com
                      </p>
                    </div>
                  </div>
                  <div className="text-[11px] bg-gray-100 text-gray-600 font-bold px-2 py-0.5 rounded-full">
                    G-User
                  </div>
                </button>
              </div>

              {/* Cancel Button */}
              <button
                onClick={() => setShowGoogleModal(false)}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl py-3 text-sm tracking-wide cursor-pointer text-center select-none"
              >
                Batal
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
