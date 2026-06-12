"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  User,
  Mail,
  Calendar,
  Dumbbell,
  ClipboardList,
  LogOut,
  ChevronRight,
  Shield,
  Bell,
  Scale,
  Sparkles,
  Loader2,
  Lock,
  UserX,
  LogIn,
  UserPlus,
  Pencil,
} from "lucide-react";
import BottomNav from "@/components/dashboard/BottomNav";

interface ProfileClientProps {
  isLoggedIn: boolean;
  user?: {
    name: string;
    email: string;
    memberSince: string;
  };
  stats?: {
    totalAlat: number;
    totalLogs: number;
  };
}

export default function ProfileClient({
  isLoggedIn,
  user,
  stats,
}: ProfileClientProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [preferences] = useState({
    unit: "kg",
    notifications: true,
    weeklyGoal: "4 kali",
  });
  // Edit profile states
  const [currentName, setCurrentName] = useState(user?.name || "");
  const [showEditNameModal, setShowEditNameModal] = useState(false);
  const [newNameInput, setNewNameInput] = useState(user?.name || "");
  const [editError, setEditError] = useState("");
  const [isEditingLoading, setIsEditingLoading] = useState(false);

  // Handle unit toggle
  // const toggleUnit = () => {
  //   if (!isLoggedIn) return;
  //   setPreferences((prev) => ({
  //     ...prev,
  //     unit: prev.unit === "kg" ? "lbs" : "kg",
  //   }));
  // };
  const toggleUnit = () => {
    alert("Fitur ini belum tersedia.");
    return;
  };

  // Handle notification toggle
  // const toggleNotifications = () => {
  //   if (!isLoggedIn) return;
  //   setPreferences((prev) => ({
  //     ...prev,
  //     notifications: !prev.notifications,
  //   }));
  // };
  const toggleNotifications = () => {
    alert("Fitur ini belum tersedia.");
    return;
  };

  // Handle logout
  const handleLogout = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });
      if (response.ok) {
        router.push("/login");
        router.refresh();
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle profile name update
  const handleUpdateName = async () => {
    if (!newNameInput.trim()) {
      setEditError("Nama tidak boleh kosong.");
      return;
    }
    if (newNameInput.trim().length < 2) {
      setEditError("Nama minimal terdiri dari 2 karakter.");
      return;
    }

    setIsEditingLoading(true);
    setEditError("");

    try {
      const response = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newNameInput }),
      });

      const result = await response.json();

      if (response.ok) {
        setCurrentName(newNameInput.trim());
        setShowEditNameModal(false);
        router.refresh(); // Refresh dashboard components to update the header
      } else {
        setEditError(result.message || "Gagal memperbarui nama.");
      }
    } catch (error) {
      console.error("Update name error:", error);
      setEditError("Gagal terhubung ke server.");
    } finally {
      setIsEditingLoading(false);
    }
  };

  // Get initials & first name for profile header
  let initials = "??";
  let firstName = "Tamu";
  if (isLoggedIn && currentName) {
    const parts = currentName.trim().split(/\s+/);
    firstName = parts[0]; // First name only

    // Get up to 2 initials (e.g. "Ahmad Sobirin" -> "AS")
    if (parts.length > 1) {
      initials = (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    } else if (parts[0].length > 1) {
      initials = parts[0].substring(0, 2).toUpperCase();
    } else {
      initials = parts[0][0].toUpperCase();
    }
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 100, damping: 15 },
    },
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] flex justify-center w-full">
      {/* Mobile container - matches Dashboard */}
      <div className="w-full max-w-md bg-white min-h-screen relative shadow-sm flex flex-col md:my-8 md:rounded-[40px] md:min-h-[850px] md:shadow-xl md:border md:border-gray-100 overflow-hidden">
        {/* Scrollable area */}
        <div className="flex-1 overflow-y-auto px-6 pb-28">
          {/* Header Navigation */}
          <div className="flex items-center justify-between py-6">
            <Link
              href="/"
              className="w-10 h-10 bg-field-bg rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-100 transition-colors focus:outline-none"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-lg font-bold text-[#2d3238] tracking-tight">
              Profil {isLoggedIn ? "Saya" : ""}
            </h1>
            <div className="w-10 h-10" /> {/* Spacer to center the title */}
          </div>

          <AnimatePresence mode="wait">
            {!isLoggedIn ? (
              /* ============================================================ */
              /* GUEST / UNAUTHENTICATED PROFILE STATE (PROFILE KOSONG)      */
              /* ============================================================ */
              <motion.div
                key="guest-state"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center justify-center py-10 text-center"
              >
                {/* Empty Round Avatar State */}
                <div className="relative mb-6">
                  <div className="w-28 h-28 rounded-full border-4 border-dashed border-gray-200 flex items-center justify-center bg-field-bg shadow-inner relative">
                    <UserX
                      className="w-12 h-12 text-gray-300"
                      strokeWidth={1.5}
                    />
                  </div>
                  <div className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-orange-100 border-2 border-white flex items-center justify-center text-orange-500 shadow-md">
                    <Lock className="w-4 h-4" />
                  </div>
                </div>

                <h2 className="text-2xl font-extrabold text-[#2d3238] tracking-tight mb-2">
                  Profil Belum Aktif
                </h2>
                <p className="text-sm font-semibold text-gray-500 max-w-[280px] leading-relaxed mb-8">
                  Silakan masuk atau buat akun baru untuk melacak latihan
                  harian, mengelola alat gym, dan melihat riwayat Anda.
                </p>

                {/* Authentication actions */}
                <div className="w-full space-y-4 px-2">
                  <Link
                    href="/login"
                    className="w-full bg-brand-teal hover:bg-brand-teal-dark text-white rounded-2xl py-4 px-6 font-semibold flex items-center justify-center gap-2 group shadow-lg shadow-teal-900/10 active:scale-[0.98] transition-all duration-200"
                  >
                    <LogIn className="w-5 h-5" />
                    <span>Masuk (Sign In)</span>
                  </Link>

                  <Link
                    href="/register"
                    className="w-full bg-white hover:bg-gray-50 text-brand-teal border border-brand-teal/20 rounded-2xl py-4 px-6 font-semibold flex items-center justify-center gap-2 active:scale-[0.98] transition-all duration-200"
                  >
                    <UserPlus className="w-5 h-5" />
                    <span>Daftar Akun Baru</span>
                  </Link>
                </div>
              </motion.div>
            ) : (
              /* ============================================================ */
              /* LOGGED IN USER PROFILE STATE (UI PROFILE BAGUS BULAT)         */
              /* ============================================================ */
              <motion.div
                key="authenticated-state"
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="space-y-6"
              >
                {/* Premium Round Profile Card */}
                <motion.div
                  variants={itemVariants}
                  className="bg-linear-to-tr from-brand-teal to-brand-teal-dark rounded-[36px] p-6 text-white relative overflow-hidden shadow-xl shadow-teal-950/10 flex flex-col items-center text-center"
                >
                  {/* Decorative background blurs */}
                  <div className="absolute right-0 top-0 w-36 h-36 bg-white/5 rounded-full blur-2xl -translate-y-6 translate-x-6" />
                  <div className="absolute left-0 bottom-0 w-28 h-28 bg-white/5 rounded-full blur-xl translate-y-10 -translate-x-6" />

                  {/* Super circular Avatar Ring with initials (e.g. "SA" or "AS") */}
                  <div className="relative mb-4">
                    <div className="absolute -inset-1 rounded-full bg-linear-to-tr from-teal-300/40 to-white/60 blur-[2px] opacity-75" />
                    <div className="w-24 h-24 rounded-full bg-white/10 border-2 border-white/40 flex items-center justify-center text-4xl font-black text-white relative z-10 shadow-inner select-none">
                      {initials}
                    </div>
                  </div>

                  <h2 className="text-2xl font-black tracking-tight mb-0.5">
                    {firstName}
                  </h2>

                  {/* Clickable Full Name to trigger editing */}
                  <div
                    onClick={() => {
                      setNewNameInput(currentName);
                      setShowEditNameModal(true);
                    }}
                    className="flex items-center gap-1.5 hover:text-teal-200 transition-colors cursor-pointer text-teal-100/80 mb-4 select-none group"
                  >
                    <span className="text-xs font-semibold">{currentName}</span>
                    <Pencil className="w-3 h-3 opacity-60 group-hover:opacity-100 transition-opacity" />
                  </div>

                  <p className="text-teal-100/95 text-xs font-bold mb-3.5 flex items-center gap-1.5 bg-white/15 px-3 py-1 rounded-full backdrop-blur-sm">
                    <Sparkles className="w-3.5 h-3.5" />
                    Fitness Enthusiast
                  </p>

                  <span className="text-[10px] text-teal-100/70 font-semibold tracking-wider uppercase">
                    Member Sejak {user?.memberSince}
                  </span>
                </motion.div>

                {/* Quick Stats Grid */}
                <motion.div
                  variants={itemVariants}
                  className="grid grid-cols-2 gap-4"
                >
                  <div className="bg-field-bg rounded-[24px] p-4 border border-[#eff1f4] flex flex-col justify-between">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-brand-teal mb-3">
                      <ClipboardList className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-0.5">
                        Total Latihan
                      </span>
                      <span className="text-2xl font-black text-gray-900">
                        {stats?.totalLogs}{" "}
                        <span className="text-xs font-bold text-gray-400">
                          sesi
                        </span>
                      </span>
                    </div>
                  </div>

                  <div className="bg-field-bg rounded-[24px] p-4 border border-[#eff1f4] flex flex-col justify-between">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-brand-teal mb-3">
                      <Dumbbell className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-0.5">
                        Alat Terdaftar
                      </span>
                      <span className="text-2xl font-black text-gray-900">
                        {stats?.totalAlat}{" "}
                        <span className="text-xs font-bold text-gray-400">
                          alat
                        </span>
                      </span>
                    </div>
                  </div>
                </motion.div>

                {/* Settings Categories */}
                <motion.div variants={itemVariants} className="space-y-3">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                    Akun & Preferensi
                  </h3>

                  <div className="bg-white border border-[#eff1f4] rounded-[28px] overflow-hidden divide-y divide-[#eff1f4] shadow-sm">
                    {/* Nama Lengkap */}
                    <div
                      onClick={() => {
                        setNewNameInput(currentName);
                        setShowEditNameModal(true);
                      }}
                      className="flex items-center justify-between px-5 py-4.5 hover:bg-[#faf9f6]/40 cursor-pointer active:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="text-gray-400">
                          <User className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-sm font-bold text-gray-800 block">
                            Nama Lengkap
                          </span>
                          <span className="text-xs font-semibold text-gray-500">
                            {currentName}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-300" />
                    </div>

                    {/* Email */}
                    <div className="flex items-center justify-between px-5 py-4.5">
                      <div className="flex items-center gap-3.5">
                        <div className="text-gray-400">
                          <Mail className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-sm font-bold text-gray-800 block">
                            Email
                          </span>
                          <span className="text-xs font-semibold text-gray-500">
                            {user?.email}
                          </span>
                        </div>
                      </div>
                      <div className="bg-teal-50 text-brand-teal text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                        <Shield className="w-3 h-3" />
                        Terverifikasi
                      </div>
                    </div>

                    {/* Weight Unit Preference */}
                    <div
                      onClick={toggleUnit}
                      className="flex items-center justify-between px-5 py-4.5 hover:bg-[#faf9f6]/40 cursor-pointer active:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="text-gray-400">
                          <Scale className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-sm font-bold text-gray-800 block">
                            Satuan Berat
                          </span>
                          <span className="text-xs font-semibold text-gray-500">
                            Satuan default untuk beban latihan
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-extrabold text-brand-teal uppercase bg-brand-teal-light px-2.5 py-1 rounded-lg">
                          {preferences.unit}
                        </span>
                        <ChevronRight className="w-4 h-4 text-gray-300" />
                      </div>
                    </div>

                    {/* Notifications Toggle */}
                    <div
                      onClick={toggleNotifications}
                      className="flex items-center justify-between px-5 py-4.5 hover:bg-[#faf9f6]/40 cursor-pointer active:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="text-gray-400">
                          <Bell className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-sm font-bold text-gray-800 block">
                            Notifikasi Pengingat
                          </span>
                          <span className="text-xs font-semibold text-gray-500">
                            Kirim pengingat latihan harian
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-200 cursor-pointer ${preferences.notifications ? "bg-brand-teal" : "bg-gray-200"}`}
                        >
                          <div
                            className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${preferences.notifications ? "translate-x-5" : "translate-x-0"}`}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Goal Settings */}
                    <div className="flex items-center justify-between px-5 py-4.5 hover:bg-[#faf9f6]/40 cursor-pointer active:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3.5">
                        <div className="text-gray-400">
                          <Calendar className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-sm font-bold text-gray-800 block">
                            Target Mingguan
                          </span>
                          <span className="text-xs font-semibold text-gray-500">
                            Tentukan frekuensi latihan Anda
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-gray-600 bg-gray-100 px-2.5 py-1.5 rounded-lg">
                          {preferences.weeklyGoal} / mg
                        </span>
                        <ChevronRight className="w-4 h-4 text-gray-300" />
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Logout Action */}
                <motion.div variants={itemVariants} className="pt-2">
                  <button
                    type="button"
                    onClick={() => setShowLogoutConfirm(true)}
                    className="w-full bg-red-50 hover:bg-red-100 text-red-600 border border-red-100/50 rounded-2xl py-4 px-6 font-semibold flex items-center justify-center gap-2 transition-colors duration-200 cursor-pointer active:scale-[0.99]"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Keluar dari Akun</span>
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Navigation */}
        <BottomNav />
      </div>

      {/* Edit Name Modal Overlay */}
      <AnimatePresence>
        {showEditNameModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="bg-white rounded-[32px] p-6 max-w-sm w-full shadow-2xl border border-gray-100"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-2 text-center">
                Ubah Nama Lengkap
              </h3>
              <p className="text-xs text-gray-500 mb-4 text-center leading-relaxed">
                Nama ini akan ditampilkan di dashboard dan profil latihan Anda.
              </p>

              {editError && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-xs flex items-center gap-2 border border-red-100">
                  <span>{editError}</span>
                </div>
              )}

              <div className="flex flex-col mb-6">
                <label className="text-xs font-semibold text-[#1a1f24] mb-2">
                  Nama Lengkap Baru
                </label>
                <input
                  type="text"
                  placeholder="Masukkan nama lengkap Anda"
                  value={newNameInput}
                  onChange={(e) => {
                    setNewNameInput(e.target.value);
                    if (editError) setEditError("");
                  }}
                  className="bg-field-bg rounded-[16px] px-4 py-3.5 border border-transparent focus:outline-none focus:border-brand-teal text-sm text-[#1a1f24] w-full"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditNameModal(false);
                    setNewNameInput(currentName);
                    setEditError("");
                  }}
                  disabled={isEditingLoading}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3.5 px-4 rounded-xl transition-colors cursor-pointer text-sm"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleUpdateName}
                  disabled={isEditingLoading}
                  className="flex-1 bg-brand-teal hover:bg-brand-teal-dark text-white font-bold py-3.5 px-4 rounded-xl transition-colors cursor-pointer text-sm flex items-center justify-center gap-1.5"
                >
                  {isEditingLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Simpan"
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Logout Confirmation Dialog (Modal Overlay) */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="bg-white rounded-[32px] p-6 max-w-sm w-full text-center shadow-2xl border border-gray-100"
            >
              <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center text-red-500 mx-auto mb-4">
                <LogOut className="w-7 h-7" />
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Konfirmasi Logout
              </h3>
              <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                Apakah Anda yakin ingin keluar? Anda harus masuk kembali untuk
                mengakses data latihan Anda.
              </p>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowLogoutConfirm(false)}
                  disabled={isLoading}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3.5 px-4 rounded-xl transition-colors cursor-pointer text-sm"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={isLoading}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 px-4 rounded-xl transition-colors cursor-pointer text-sm flex items-center justify-center gap-1.5"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Keluar"
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
