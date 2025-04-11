import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function Layout() {
  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden relative">
      <Navbar />
      <div className="h-full w-full overflow-x-hidden overflow-y-auto pb-4 md:pb-0">
        <Outlet />
      </div>
    </div>
  );
}
