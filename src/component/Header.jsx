import {
  SignedIn,
  SignedOut,
  useClerk,
  useUser,
  UserButton,
} from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { Search, Menu } from "lucide-react";
import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function HeaderNav() {
  const { openSignIn } = useClerk();
  const { user, isLoaded } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);

  const userData = useQuery(
    api.users.getUser,
    isLoaded && user?.id ? { userId: user.id } : "skip"
  );

  const role = userData?.role;

  const navItems = {
    user: [
      { to: "/teraproperti/", label: "Home" },
      { to: "/teraproperti/chats", label: "Chat" },
      { to: "/teraproperti/form-jual", label: "Jual" },
      { to: "/teraproperti/profile", label: "Profile" },
    ],
    admin: [
      { to: "/teraproperti/admin/dashboard", label: "Dashboard" },
      { to: "/teraproperti/admin/rumah", label: "Pengajuan Rumah" },
      { to: "/teraproperti/admin/konsultan", label: "Pengajuan Konsultan" },
      { to: "/teraproperti/admin/pengguna", label: "Pengguna" },
      { to: "/teraproperti/profile", label: "Profile" },
    ],
    consultant: [
      { to: "/teraproperti/", label: "Home" },
      { to: "/teraproperti/chats", label: "Chat" },
      { to: "/teraproperti/orderan", label: "Orderan" },
      { to: "/teraproperti/profile", label: "Profile" },
    ],
  };

  const activeNav = navItems[role] || [];

  return (
    <nav className="bg-white shadow px-4 py-3">
      <div className="flex items-center justify-between max-w-full mx-auto">
        <div className="text-xl font-bold text-black">
          Tera<span className="text-indigo-600">Pro</span>
        </div>

        {/* Mobile menu button */}
        <button
          className="lg:hidden"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <Menu className="w-6 h-6 text-gray-700" />
        </button>

        {/* Desktop Search */}
        <div className="hidden lg:flex items-center border rounded-md px-3 py-1 w-64 bg-gray-50">
          <Search className="h-4 w-4 text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Cari rumah"
            className="w-full bg-transparent outline-none text-sm text-gray-700"
          />
        </div>

        <div className="hidden lg:flex items-center space-x-4">
          {activeNav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="text-sm text-black hover:text-indigo-600"
            >
              {item.label}
            </Link>
          ))}

          {!isLoaded ? null : user ? (
            <UserButton afterSignOutUrl="/teraproperti/" />
          ) : (
            <button
              onClick={() => openSignIn()}
              className="bg-black text-white px-4 py-1 rounded hover:bg-gray-800"
            >
              Sign In
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden mt-3 space-y-2 px-2">
          <div className="flex items-center border rounded-md px-3 py-1 bg-gray-50">
            <Search className="h-4 w-4 text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Cari rumah"
              className="w-full bg-transparent outline-none text-sm text-gray-700"
            />
          </div>
          {activeNav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="block px-2 py-1 text-sm text-black hover:text-indigo-600"
            >
              {item.label}
            </Link>
          ))}

          {!isLoaded ? null : user ? (
            <UserButton afterSignOutUrl="/teraproperti/" />
          ) : (
            <button
              onClick={() => openSignIn()}
              className="w-full bg-black text-white px-4 py-1 rounded hover:bg-gray-800"
            >
              Sign In
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
