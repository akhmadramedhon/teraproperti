// src/component/RequireRole.jsx

import { useUser } from "@clerk/clerk-react";
import { useQuery } from "convex/react";
import { Navigate } from "react-router-dom";
import { api } from "../../convex/_generated/api";

/**
 * Komponen "Guard" untuk melindungi rute berdasarkan role pengguna.
 * @param {object} props
 * @param {React.ReactNode} props.children - Komponen/halaman yang akan dirender jika otorisasi berhasil.
 * @param {string[]} props.allowedRoles - Array berisi string role yang diizinkan mengakses rute ini (e.g., ['admin'], ['user', 'consultant']).
 * @returns {React.ReactNode} - Merender children atau mengalihkan pengguna.
 */
export default function RequireRole({ children, allowedRoles }) {
  const { user, isLoaded: isClerkLoaded } = useUser();

  // Mengambil data lengkap pengguna dari database Convex, termasuk informasi role.
  // Query ini hanya dijalankan jika Clerk sudah selesai loading DAN user.id ada.
  // Jika tidak, query di-skip untuk menghindari error.
  const userData = useQuery(
    api.users.getUser,
    isClerkLoaded && user?.id ? { userId: user.id } : "skip"
  );

  // Selama Clerk atau Convex masih mengambil data, tampilkan pesan loading.
  // Ini sangat penting untuk mencegah redirect yang salah sebelum role sempat terverifikasi.
  if (!isClerkLoaded || userData === undefined) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading user data...</p>
      </div>
    );
  }

  // Cek otorisasi setelah semua data dimuat
  if (user && userData) {
    const userRole = userData.role;

    // Jika role pengguna saat ini ada di dalam daftar role yang diizinkan (allowedRoles)
    if (allowedRoles.includes(userRole)) {
      return children; // Tampilkan halaman yang dituju
    }
  }

  // Jika pengguna tidak login, data tidak ditemukan, atau role tidak sesuai,
  // alihkan (redirect) mereka ke halaman utama.
  // 'replace' digunakan agar pengguna tidak bisa menekan tombol "back" di browser
  // untuk kembali ke halaman admin yang tidak bisa mereka akses.
  return <Navigate to="/teraproperti/" replace />;
}