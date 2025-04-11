import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function Layout() {
  return (
    <div className="flex h-svh w-screen flex-col overflow-hidden relative">
      <div className="absolute inset-0 bg-[#42B186] [clip-path:polygon(100%_100%,0%_100%,100%_0%)] z-0" />
      <Navbar />
      <div className="h-full w-full overflow-x-hidden overflow-y-auto pb-4 md:pb-0">
        <Outlet />
      </div>
    </div>
  );
}
