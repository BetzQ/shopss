import Navbar from "../components/Navbar";
import AddProduct from "../components/addProduct";
import Loading from "../components/Loading";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Seller = () => {
  const [dontLoad, setDontLoad] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const userDetails = JSON.parse(localStorage.getItem("userDetails"));
    if (userDetails.role === "seller") {
      setDontLoad(false);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  if (dontLoad) {
    return <Loading />;
  }
  return (
    <>
      <Navbar />
      <AddProduct />
    </>
  );
};

export default Seller;
