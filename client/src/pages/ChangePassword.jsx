import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { BASE_URL } from "../App";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading";

const ChangePassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pin, setPin] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const userId = JSON.parse(localStorage.getItem("userDetails")).id;

  useEffect(() => {
    const userDetails = localStorage.getItem("userDetails");
    if (!userDetails) {
      navigate("/login");
    } else {
      setLoading(false);
    }
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    fetch(`${BASE_URL}/changePassword`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, newPassword, pin }),
    })
      .then((response) => {
        if (response.status !== 200) {
          return response.json().then((data) => {
            throw new Error(
              data.message || "Error: Unable to change password."
            );
          });
        }
        return response.json();
      })
      .then((data) => {
        setMessage(data.message);
        setErrorMessage("");
      })
      .catch((error) => {
        setErrorMessage(error.toString());
        setMessage("");
      });
  };

  const handlePinChange = (e) => {
    const pinValue = e.target.value;
    // Hanya memperbarui pin jika input kosong atau berisi maksimal 3 angka
    if (!pinValue || (pinValue.length <= 3 && /^\d*$/.test(pinValue))) {
      setPin(pinValue);
    }
  };

  if (loading) {
    return <Loading />; // Tampilkan loading saat memeriksa
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto my-10 p-6 max-w-sm bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-8">
          Change Password
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">
              New Password:
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Confirm New Password:
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">
              PIN:
            </label>
            <input
              type="password"
              value={pin}
              onChange={handlePinChange}
              maxLength="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          {message && (
            <p className="mt-4 text-center text-sm text-green-600">{message}</p>
          )}
          {errorMessage && (
            <p className="mt-4 text-center text-sm text-red-600">
              {errorMessage}
            </p>
          )}
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-md focus:outline-none focus:bg-blue-700"
          >
            Change Password
          </button>
        </form>
      </div>
    </>
  );
};

export default ChangePassword;
