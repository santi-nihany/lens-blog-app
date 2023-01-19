import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

//cenrtralized API, but easier
const API_URL = "https://api.lens.dev";

// client: how we make calls to and from the lens protocol GraphQL API
export const apolloClient = new ApolloClient({
  uri: API_URL,
  cache: new InMemoryCache(),
});

export const challenge = gql`
  query Challenge($address: EthereumAddress!) {
    challenge(request: { address: $address }) {
      text
    }
  }
`;

export const authenticate = gql`
  mutation Authenticate($address: EthereumAddress!, $signature: Signature!) {
    authenticate(request: { address: $address, signature: $signature }) {
      accessToken
      refreshToken
    }
  }
`;

export const getDefaultProfile = gql`
  query DefaultProfile($request: DefaultProfileRequest!) {
    defaultProfile(request: $request) {
      id
    }
  }
`;

export const getFollowing = gql`
  query Following($request: FollowingRequest!) {
    following(request: $request) {
      items {
        profile {
          id
        }
      }
    }
  }
`;

export const getPublications = gql`
  query Metadata($request: PublicationsQueryRequest!) {
    publications(request: $request) {
      items {
        ... on Post {
          id
          onChainContentURI
          profile {
            name
          }
          metadata {
            image
            name
          }
        }
      }
    }
  }
`;

export const getPublicationsQueryVariables = function (profileIds) {
  return {
    request: {
      limit: 5,
      publicationTypes: "POST",
      metadata: {
        mainContentFocus: "ARTICLE",
      },
      profileIds: profileIds,
    },
  };
};
