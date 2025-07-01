// src/app.jsx (Versi Final dengan Keamanan Menyeluruh)

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './component/Layout';
import PageUser from './page/user/PageUser';
import ErrorPage from './component/Error';
import IsiDataUser from './page/IsiDataUser';
import DashboardUser from './page/user/DashboardUsers';
import PropertyDetail from './component/PropertyDetail';
import PageChat from './page/PageChat';
import PageFormJual from './page/user/PageFormJual';
import PagePengajuanRumah from './page/admin/PagePengajuanRumah';
import PengajuanKonsultan from './page/admin/PagePengajuanKonsultan';
import AdminPengguna from './page/admin/PagePengguna';
import UserProfile from './page/PageProfile';

// Komponen Proteksi
import RequireAuth from './component/RequareAuth';
import RequireCompleteProfile from './component/RequareCompleteProfile';
import RequireRole from './component/RequareRole';
import DashboardAdmin from './page/admin/DashboardAdmin';
import DetailPengajuanRumah from './page/admin/DetailPengajuanRumah';
import ChatDetailPage from './page/PageDetailChat';

const router = createBrowserRouter([
  {
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      // Rute Publik (atau untuk semua role yang sudah login)
      { path: '/', element: <PageUser /> },
      {
        path: '/isi-data',
        element: (
          <RequireAuth>
            <IsiDataUser />
          </RequireAuth>
        ),
      },

      // Rute yang HANYA untuk role 'user'
      {
        path: '/dashboard-user',
        element: (
          <RequireAuth>
            <RequireCompleteProfile>
              {/* DITAMBAHKAN: Hanya 'user' yang boleh masuk */}
              <RequireRole allowedRoles={['user']}>
                <DashboardUser />
              </RequireRole>
            </RequireCompleteProfile>
          </RequireAuth>
        ),
      },

      // Rute yang HANYA untuk role 'user' dan 'consultant'
      {
        path: '/chats',
        element: (
          <RequireAuth>
            <RequireCompleteProfile>
              {/* DITAMBAHKAN: Admin tidak perlu akses chat ini */}
              <RequireRole allowedRoles={['user', 'consultant']}>
                <PageChat />
              </RequireRole>
            </RequireCompleteProfile>
          </RequireAuth>
        ),
      },
      {
        path: '/chats/start/:id',
        element: (
          <RequireAuth>
            <RequireCompleteProfile>
              {/* DITAMBAHKAN: Admin tidak perlu akses chat ini */}
              <RequireRole allowedRoles={['user', 'consultant']}>
                <ChatDetailPage />
              </RequireRole>
            </RequireCompleteProfile>
          </RequireAuth>
        ),
      },
      {
        path: '/form-jual',
        element: (
          <RequireAuth>
            <RequireCompleteProfile>
              {/* DITAMBAHKAN: Hanya 'user' yang bisa jual, misalnya */}
              <RequireRole allowedRoles={['user']}>
                <PageFormJual />
              </RequireRole>
            </RequireCompleteProfile>
          </RequireAuth>
        ),
      },

      // Rute yang HANYA untuk role 'admin'
      {
        path: "/admin/dashboard",
        element: (
          <RequireAuth>
            <RequireCompleteProfile>
              <RequireRole allowedRoles={['admin']}>
                <DashboardAdmin />
              </RequireRole>
            </RequireCompleteProfile>
          </RequireAuth>
        ),
      },
      {
        path: "/admin/rumah",
        element: (
          <RequireAuth>
            <RequireCompleteProfile>
              <RequireRole allowedRoles={['admin']}>
                <PagePengajuanRumah />
              </RequireRole>
            </RequireCompleteProfile>
          </RequireAuth>
        ),
      },
      {
        path: "/admin/konsultan",
        element: (
          <RequireAuth>
            <RequireCompleteProfile>
              <RequireRole allowedRoles={['admin']}>
                <PengajuanKonsultan />
              </RequireRole>
            </RequireCompleteProfile>
          </RequireAuth>
        ),
      },
      {
        path: "/admin/pengguna",
        element: (
          <RequireAuth>
            <RequireCompleteProfile>
              <RequireRole allowedRoles={['admin']}>
                <AdminPengguna />
              </RequireRole>
            </RequireCompleteProfile>
          </RequireAuth>
        ),
      },
      {
        path: "/admin/pengajuan/:id",
        element: (
          <RequireAuth>
            <RequireCompleteProfile>
              <RequireRole allowedRoles={['admin']}>
                <DetailPengajuanRumah />
              </RequireRole>
            </RequireCompleteProfile>
          </RequireAuth>
        ),
      },
      
      // Rute yang untuk SEMUA role yang sudah login
      {
        path: "/detail-properti/:id", // Semua role boleh lihat detail
        element: (
          <RequireAuth>
            <RequireCompleteProfile>
              <PropertyDetail />
            </RequireCompleteProfile>
          </RequireAuth>
        ),
      },
      {
        path: "/profile", // Semua role pasti punya profil
        element: (
          <RequireAuth>
            <RequireCompleteProfile>
              <UserProfile />
            </RequireCompleteProfile>
          </RequireAuth>
        ),
      }
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}