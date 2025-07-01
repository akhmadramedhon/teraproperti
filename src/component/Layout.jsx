import { Outlet } from "react-router-dom";
import HeaderNav from "./Header";

export default function Layout() {
  return (
    <>
      <HeaderNav />
      <main className="pt-4">
        <Outlet />
      </main>
    </>
  );
}
