import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <div className="flex  w-full items-center py-2 px-4 md:px-3 z-10 fixed">
      <img
        className="px-6 object-contain cursor-pointer w-32 mt-3 "
        onClick={() => navigate("/")}
        src="/OCQ-logo.svg"
        alt="logo"
        title="Logo OCQ"
      />
    </div>
  );
}
