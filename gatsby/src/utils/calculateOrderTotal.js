import calculatePizzaPrice from "./calculatePizzaPrice";

export default function calculateOrderTotal(order, pizzas) {
  // 1. Loop over each item in order.
  // 2. Calculate the total for that pizza.
  // 3. Add to running total.
  return order.reduce((runningTotal, singleOrder) => {
    const pizza = pizzas.find(
      (singlePizza) => singlePizza.id === singleOrder.id
    );
    return runningTotal + calculatePizzaPrice(pizza.price, singleOrder.size);
  }, 0);
}
