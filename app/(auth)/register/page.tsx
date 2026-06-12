"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  ShieldAlert,
  Info,
} from "lucide-react";
import { registerSchema } from "@/lib/validations/auth";

export default function RegisterPage() {
  const router = useRouter();

  const [signUpName, setSignUpName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Interaction states
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateSignUp = () => {
    const result = registerSchema.safeParse({
      namaLengkap: signUpName,
      email: signUpEmail,
      password: signUpPassword,
    });

    if (!result.success) {
      const newErrors: { [key: string]: string } = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as string;
        if (!newErrors[path]) {
          newErrors[path] = issue.message;
        }
      });
      setErrors(newErrors);
      return false;
    }

    setErrors({});
    return true;
  };
  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateSignUp()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: signUpName,
          email: signUpEmail,
          password: signUpPassword,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        const serverMessage = result.message || "Terjadi kesalahan.";
        if (serverMessage.toLowerCase().includes("email")) {
          setErrors({ email: serverMessage });
        } else if (serverMessage.toLowerCase().includes("password")) {
          setErrors({ password: serverMessage });
        }
        return;
      }

      setSignUpName("");
      setSignUpEmail("");
      setSignUpPassword("");

      router.push("/login");
    } catch (error) {
      console.error("[Register Fetch Error]", error);
      setErrors({ global: "Gagal terhubung ke server." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex-1 flex flex-col justify-between">
      <AnimatePresence mode="wait">
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
              {/* Global Error Notice jika ada issue server */}
              {errors.global && (
                <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs flex items-center gap-2 border border-red-100 animate-shake">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>{errors.global}</span>
                </div>
              )}

              {/* Nama Lengkap field */}
              <div id="field_name" className="flex flex-col">
                <label className="text-sm font-semibold text-[#1a1f24] mb-2 leading-none">
                  Nama Lengkap
                </label>
                <div
                  className={`flex items-center bg-field-bg rounded-[16px] px-4 py-3.5 border ${
                    errors.namaLengkap
                      ? "border-red-400"
                      : "border-transparent focus-within:border-brand-teal"
                  } transition-all duration-200`}
                >
                  <User className="text-gray-400 w-5 h-5 shrink-0" />
                  <input
                    type="text"
                    placeholder="E.g. Alex Johnson"
                    value={signUpName}
                    onChange={(e) => {
                      setSignUpName(e.target.value);
                      if (errors.namaLengkap) {
                        setErrors((prev) => ({ ...prev, namaLengkap: "" }));
                      }
                    }}
                    className="bg-transparent text-sm text-[#1a1f24] placeholder:text-gray-400/85 focus:outline-none w-full ml-3"
                  />
                </div>
                {errors.namaLengkap && (
                  <span className="text-red-500 text-xs mt-1.5 ml-1 flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5" />
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
                  className={`flex items-center bg-field-bg rounded-[16px] px-4 py-3.5 border ${
                    errors.email
                      ? "border-red-400"
                      : "border-transparent focus-within:border-brand-teal"
                  } transition-all duration-200`}
                >
                  <Mail className="text-gray-400 w-5 h-5 shrink-0" />
                  <input
                    type="email"
                    placeholder="alex@example.com"
                    value={signUpEmail}
                    onChange={(e) => {
                      setSignUpEmail(e.target.value);
                      if (errors.email) {
                        setErrors((prev) => ({ ...prev, email: "" }));
                      }
                    }}
                    className="bg-transparent text-sm text-[#1a1f24] placeholder:text-gray-400/85 focus:outline-none w-full ml-3"
                  />
                </div>
                {errors.email && (
                  <span className="text-red-500 text-xs mt-1.5 ml-1 flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    {errors.email}
                  </span>
                )}
              </div>

              {/* Password field */}
              <div id="field_password" className="flex flex-col">
                <label className="text-sm font-semibold text-[#1a1f24] mb-2 leading-none">
                  Password
                </label>
                <div
                  className={`flex items-center bg-field-bg rounded-[16px] px-4 py-3.5 border ${
                    errors.password
                      ? "border-red-400"
                      : "border-transparent focus-within:border-brand-teal"
                  } transition-all duration-200`}
                >
                  <Lock className="text-gray-400 w-5 h-5 shrink-0" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={signUpPassword}
                    onChange={(e) => {
                      setSignUpPassword(e.target.value);
                      if (errors.password) {
                        setErrors((prev) => ({ ...prev, password: "" }));
                      }
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
                    <ShieldAlert className="w-3.5 h-3.5" />
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
              disabled={isLoading}
              className="w-full bg-brand-teal hover:bg-brand-teal-dark text-white rounded-[16px] py-4 px-6 font-semibold flex items-center justify-center gap-2 active:scale-[0.98] transition-all duration-200 cursor-pointer disabled:opacity-80"
            >
              <div className="bg-white rounded-full p-0.5 flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-4 h-4">
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
              <Link
                href="/login"
                className="text-brand-teal font-bold hover:underline ml-1 cursor-pointer focus:outline-none"
              >
                Login
              </Link>
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
