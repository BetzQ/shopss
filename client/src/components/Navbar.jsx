import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [userRole, setUserRole] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const userDetails = JSON.parse(localStorage.getItem("userDetails"));
    if (userDetails && userDetails.role) {
      setUserRole(userDetails.role);
    }
  }, []);

  const handleLogout = (event) => {
    event.preventDefault();
    localStorage.removeItem("userDetails");
    navigate("/login");
  };

  const getRoleColorClass = (role) => {
    switch (role) {
      case "buyer":
        return "text-yellow-400"; // Vibrant yellow
      case "seller":
        return "text-blue-500"; // Cool blue
      case "admin":
        return "text-red-500"; // Bold red
      default:
        return "";
    }
  };

  return (
    <nav className="flex justify-between px-20 py-10 items-center bg-white">
      <h1 className="text-xl text-gray-800 font-bold">SHOPS</h1>
      <div className="flex items-center">
        <ul className="flex items-center space-x-6">
          <Link
            to={"/"}
            className="font-semibold text-gray-700 hover:text-gray-500"
          >
            Shops
          </Link>

          {userRole === "seller" && (
            <Link
              to={"/seller"}
              className="font-semibold text-gray-700 hover:text-gray-500"
            >
              Seller
            </Link>
          )}
          {userRole === "buyer" && (
            <Link
              to={"/transaction-history"}
              className="font-semibold text-gray-700 hover:text-gray-500"
            >
              transaction-history
            </Link>
          )}
          <Link
            to={"/change-password"}
            className="font-semibold text-gray-700 hover:text-gray-500"
          >
            change-password
          </Link>
          {userRole === "admin" && (
            <Link
              to={"/change-background"}
              className="font-semibold text-gray-700 hover:text-gray-500"
            >
              Change-background
            </Link>
          )}
          <li className="font-semibold text-sm text-gray-500">
            You&apos;re{" "}
            <b className={getRoleColorClass(userRole)}>{userRole}</b>
          </li>
          <button
            onClick={handleLogout}
            className="text-gray-500 hover:text-gray-700 font-medium rounded-lg text-sm text-center inline-flex items-center"
          >
            Logout
            <svg
              className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 5h12m0 0L9 1m4 4L9 9"
              />
            </svg>
          </button>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
