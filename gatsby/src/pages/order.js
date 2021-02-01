import React from "react";
import { graphql } from "gatsby";
import Img from "gatsby-image";
import SEO from "../components/SEO";
import useForm from "../utils/useForm";
import usePizza from "../utils/usePizza";
import calculatePizzaPrice from "../utils/calculatePizzaPrice";
import formatMoney from "../utils/formatMoney";
import calculateOrderTotal from "../utils/calculateOrderTotal";
import OrderStyles from "../styles/OrderStyles";
import MenuItemStyles from "../styles/MenuItemStyles";
import PizzaOrder from "../components/PizzaOrder";

export default function OrderPage({ data }) {
  const pizzas = data.pizzas.nodes;
  const { values, updateValue } = useForm({
    name: "",
    email: "",
    mapleSyrup: "",
  });
  const {
    order,
    addToOrder,
    removeFromOrder,
    error,
    loading,
    message,
    submitOrder,
  } = usePizza({
    pizzas,
    values,
  });

  if (message) {
    return <p>{message}</p>;
  }

  return (
    <>
      <SEO title="Order a Pizza!" />
      <OrderStyles onSubmit={submitOrder}>
        <fieldset disabled={loading}>
          <legend>Your Info</legend>
          <label htmlFor="name">
            Name
            <input
              type="text"
              name="name"
              value={values.name}
              onChange={updateValue}
            />
          </label>
          <label htmlFor="email">
            Email
            <input
              type="email"
              name="email"
              value={values.email}
              onChange={updateValue}
            />
          </label>
          <label htmlFor="mapleSyrup">
            <input
              className="mapleSyrup"
              type="mapleSyrup"
              name="mapleSyrup"
              value={values.mapleSyrup}
              onChange={updateValue}
            />
          </label>
        </fieldset>
        <fieldset className="menu" disabled={loading}>
          <legend>Menu</legend>
          {pizzas.map((pizza) => (
            <MenuItemStyles key={pizza.id}>
              <Img
                width="50"
                height="50"
                fluid={pizza.image.asset.fluid}
                alt={pizza.name}
              />
              <div>
                <h2>{pizza.name}</h2>
              </div>
              <div>
                {["S", "M", "L"].map((size) => (
                  <button
                    type="button"
                    key={size}
                    onClick={() => addToOrder({ id: pizza.id, size })}
                  >
                    {size} {formatMoney(calculatePizzaPrice(pizza.price, size))}
                  </button>
                ))}
              </div>
            </MenuItemStyles>
          ))}
        </fieldset>
        <fieldset className="order" disabled={loading}>
          <legend>Order</legend>
          <PizzaOrder {...{ order, pizzas, removeFromOrder }} />
        </fieldset>
        <fieldset>
          <h3>
            Your Total is {formatMoney(calculateOrderTotal(order, pizzas))}
          </h3>
          <div>{error ? <p>Error: {error}</p> : ""}</div>
          <button type="submit" disabled={loading}>
            {loading ? "Placing Order..." : "Order Ahead"}
          </button>
        </fieldset>
      </OrderStyles>
    </>
  );
}

export const query = graphql`
  query {
    pizzas: allSanityPizza {
      nodes {
        name
        id
        slug {
          current
        }
        price
        image {
          asset {
            fluid(maxWidth: 100) {
              ...GatsbySanityImageFluid
            }
          }
        }
      }
    }
  }
`;
