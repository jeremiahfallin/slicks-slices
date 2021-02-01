import dotenv from "dotenv";

dotenv.config({ path: ".env" });

export default {
  siteMetadata: {
    title: `Slick's Slices`,
    siteUrl: `https://gatsby.pizza`,
    description: `The best pizza place in Hamilton!`,
    twitter: "@SlicksSlices",
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-styled-components`,
    {
      resolve: `gatsby-source-sanity`,
      options: {
        projectId: `s7p1qxcw`,
        dataset: `production`,
        watchMode: true,
        token: process.env.SANITY_TOKEN,
      },
    },
  ],
};
