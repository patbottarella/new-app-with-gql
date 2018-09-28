import React from "react";
import { render } from "react-dom";
import "./index.css";
import { ApolloProvider } from "react-apollo";
import ApolloClient from "apollo-boost";
import { Query } from "react-apollo";
import gql from "graphql-tag";

const client = new ApolloClient({
  uri: "https://rasch.dev.rasch1-dev.cluster.amazee.io/graphql"
});

const query = gql`
  {
    routeByPath(path: "politik/test", publication: HZ) {
      object {
        ... on Article {
          title
          lead
          heroImageBody {
            ... on ImageParagraph {
              image {
                file(style: "inline_image_1200") {
                  source
                }
              }
            }
          }
          body {
            ... on TextParagraph {
              header
              text
            }
          }
        }
      }
    }
  }
`;

client.query({ query: query }).then(console.log);

const App = () => (
  <ApolloProvider client={client}>
    <div>
      <Query query={query}>
        {({ loading, error, data }) => {
          if (loading) return "Loading...";
          if (error) return `Error! ${error.message}`;

          return (
            <div>
              <h2>{data.routeByPath.object.title}</h2>
              <img
                src={data.routeByPath.object.heroImageBody[0].image.file.source}
              />
              <span>{data.routeByPath.object.lead}</span>
              <p>{data.routeByPath.object.body[0].text}</p>
            </div>
          );
        }}
      </Query>
    </div>
  </ApolloProvider>
);

render(<App />, document.getElementById("root"));
