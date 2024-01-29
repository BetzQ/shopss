import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading";
import CardBuyer from "../components/CardBuyer";
import { fetchProducts } from "../api/product";

const Home = () => {
  const [dontLoad, setDontLoad] = useState(true);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const userDetails = localStorage.getItem("userDetails");
    if (!userDetails) {
      navigate("/login");
      return;
    }

    const getProducts = async () => {
      try {
        const fetchedProducts = await fetchProducts();
        setProducts(fetchedProducts);
        setDontLoad(false);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        // Handle the error appropriately
      }
    };

    getProducts();
  }, [navigate]);

  if (dontLoad) {
    return <Loading />;
  }
  return (
    <>
      <Navbar />
      <div className="flex justify-center pt-5">
        <div className="grid grid-cols-3 gap-6">
          {products.map((product, index) => (
            <CardBuyer key={index} product={product} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;
