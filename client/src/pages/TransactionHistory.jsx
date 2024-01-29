import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const buyer_id = JSON.parse(localStorage.getItem("userDetails")).id;
  useEffect(() => {
    fetch(`http://localhost:3000/transaction/${buyer_id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        // Set data transaksi ke dalam state
        setTransactions(data);
      })
      .catch((error) => {
        console.error("Error fetching transaction data:", error);
      });
  }, [buyer_id]);

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4">
        <h2 className="text-3xl font-semibold mb-4">Transaction History</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 text-left">ID</th>
                <th className="py-2 px-4 text-left">Product ID</th>
                <th className="py-2 px-4 text-left">Buyer ID</th>
                <th className="py-2 px-4 text-left">Quantity</th>
                <th className="py-2 px-4 text-left">Price at Purchase</th>
                <th className="py-2 px-4 text-left">Image URL</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="border-t border-gray-200">
                  <td className="py-2 px-4">{transaction.id}</td>
                  <td className="py-2 px-4">{transaction.product_id}</td>
                  <td className="py-2 px-4">{transaction.buyer_id}</td>
                  <td className="py-2 px-4">{transaction.quantity}</td>
                  <td className="py-2 px-4">{transaction.price_at_purchase}</td>
                  <td className="py-2 px-4">{transaction.image_url}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default TransactionHistory;
