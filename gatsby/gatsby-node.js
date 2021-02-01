import path from "path";
import fetch from "isomorphic-fetch";

async function turnPizzasIntoPages({ graphql, actions }) {
  // 1. Get a template for this page.
  const pizzaTemplate = path.resolve("./src/templates/Pizza.js");
  // 2. Query all pizzas.
  const { data } = await graphql(`
    query {
      pizzas: allSanityPizza {
        nodes {
          name
          slug {
            current
          }
        }
      }
    }
  `);
  // 3. Loop over each pizza and create page.
  data.pizzas.nodes.forEach((pizza) => {
    actions.createPage({
      // URL of new page.
      path: `pizza/${pizza.slug.current}`,
      // Component page is made with.
      component: pizzaTemplate,
      context: {
        slug: pizza.slug.current,
      },
    });
  });
}

async function turnToppingsIntoPages({ graphql, actions }) {
  // 1. Get the template
  const toppingTemplate = path.resolve("./src/pages/pizzas.js");
  // 2. query all the toppings
  const { data } = await graphql(`
    query {
      toppings: allSanityTopping {
        nodes {
          name
          id
        }
      }
    }
  `);
  // 3. createPage for that topping
  data.toppings.nodes.forEach((topping) => {
    actions.createPage({
      path: `topping/${topping.name}`,
      component: toppingTemplate,
      context: {
        topping: topping.name,
        // TODO Regex for Topping
        toppingRegex: `/${topping.name}/i`,
      },
    });
  });
  // 4. Pass topping data to pizza.js
}

async function fetchBeersAndTurnIntoNodes({
  actions,
  createNodeId,
  createContentDigest,
}) {
  // 1. Fetch a list of beers.
  const res = await fetch("https://api.sampleapis.com/beers/ale");
  const beers = await res.json();
  // 2. Loop over each one.
  for (const beer of beers) {
    // Create a node for each beer.
    const nodeMeta = {
      id: createNodeId(`beer-${beer.name}`),
      parent: null,
      children: [],
      internal: {
        type: "Beer",
        mediaType: "application/json",
        contentDigest: createContentDigest(beer),
      },
    };
    // 3. Create a node for that beer.
    actions.createNode({
      ...beer,
      ...nodeMeta,
    });
  }
}

async function turnSlicemastersIntoPages({ graphql, actions }) {
  // 1. Query all slicemasters
  const { data } = await graphql(`
    query {
      slicemasters: allSanityPerson {
        totalCount
        nodes {
          name
          id
          slug {
            current
          }
        }
      }
    }
  `);
  // TODO: 2. Turn each slicemaster into their own page (TODO)
  data.slicemasters.nodes.forEach((slicemaster) => {
    actions.createPage({
      component: path.resolve("./src/templates/Slicemaster.js"),
      path: `/slicemaster/${slicemaster.slug.current}`,
      context: {
        name: slicemaster.person,
        slug: slicemaster.slug.current,
      },
    });
  });

  // 3. Figure out how many pages there are based on how many slicemasters there are, and how many per page!
  const pageSize = parseInt(process.env.GATSBY_PAGE_SIZE);
  const pageCount = Math.ceil(data.slicemasters.totalCount / pageSize);

  // 4. Loop from 1 to n and create the pages for them
  Array.from({ length: pageCount }).forEach((_, i) => {
    actions.createPage({
      path: `/slicemasters/${i + 1}`,
      component: path.resolve("./src/pages/slicemasters.js"),
      // This data is pass to the template when we create it
      context: {
        skip: i * pageSize,
        currentPage: i + 1,
        pageSize: pageSize,
      },
    });
  });
}

export async function sourceNodes(params) {
  // 1. Fetch a list of beers and source them into gatsby API.
  await Promise.all([fetchBeersAndTurnIntoNodes(params)]);
}

export async function createPages(params) {
  // Create pages dynamically

  await Promise.all([
    // 1. Pizzas.
    turnPizzasIntoPages(params),
    // 2. Toppings.
    turnToppingsIntoPages(params),
    // 3. Slicemasters.
    turnSlicemastersIntoPages(params),
  ]);
}
