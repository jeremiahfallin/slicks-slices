import React from "react";
import { graphql } from "gatsby";
import Img from "gatsby-image";
import SEO from "../components/SEO";

export default function SlicemasterPage({ data }) {
  return (
    <>
      <SEO title={`data.person.name`} image={data.person.image.asset.src} />
      <div className="center">
        <Img fluid={data.person.image.asset.fluid} alt={data.person.name} />
        <h2>
          <span className="mark">{data.person.name}</span>
        </h2>
      </div>
    </>
  );
}

export const query = graphql`
  query($slug: String!) {
    person: sanityPerson(slug: { current: { eq: $slug } }) {
      name
      id
      description
      image {
        asset {
          fluid(maxWidth: 1000, maxHeight: 750) {
            ...GatsbySanityImageFluid
          }
        }
      }
    }
  }
`;
