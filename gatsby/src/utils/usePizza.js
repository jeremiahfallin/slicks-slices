import { useState, useContext } from "react";
import OrderContext from "../components/OrderContext";
import attachNamesAndPrices from "./attachNamesAndPrices";
import calculateOrderTotal from "./calculateOrderTotal";
import formatMoney from "./formatMoney";

export default function usePizza({ pizzas, values }) {
  // 1. Create state to hold order.
  // State now stored in provider.
  //   const [order, setOrder] = useState([]);
  const [order, setOrder] = useContext(OrderContext);
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // 2. Make function to add things to order.
  function addToOrder(orderedPizza) {
    setOrder([...order, orderedPizza]);
  }
  // 3. Make function to remove things from order.
  function removeFromOrder(index) {
    setOrder([
      // everything before the item we're removing
      ...order.splice(0, index),
      // everything after the item we're removing
      ...order.splice(index + 1),
    ]);
  }
  // This is the function that is run when someone submits the form.
  async function submitOrder(e) {
    e.preventDefault();
    console.log(e);
    setLoading(true);
    setError(null);
    setMessage(null);
    // Gather all the data.
    const body = {
      order: attachNamesAndPrices(order, pizzas),
      total: formatMoney(calculateOrderTotal(order, pizzas)),
      name: values.name,
      email: values.email,
      mapleSyrup: values.mapleSyrup,
    };

    // 4. Send this data to a serverless function for checkout.
    const res = await fetch(
      `${process.env.GATSBY_SERVERLESS_BASE}/placeOrder`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const text = JSON.parse(await res.text());

    // Check if everything worked.
    if (res.status >= 400 && res.status < 600) {
      setLoading(false);
      setError(text.message);
    } else {
      setLoading(false);
      setMessage("Success! Come on down for your pizza.");
    }
  }

  return {
    order,
    addToOrder,
    removeFromOrder,
    error,
    loading,
    message,
    submitOrder,
  };
}
