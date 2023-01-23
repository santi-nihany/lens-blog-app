import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { v4 as uuidv4 } from "uuid";
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

export const getPublication = gql`
  query Publications($request: PublicationQueryRequest!) {
    publication(request: $request) {
      ... on Post {
        metadata {
          image
          content
          name
        }
        profile {
          name
        }
      }
    }
  }
`;

export const createContentMetadata = function (
  content,
  contentName,
  imageURI,
  imageType
) {
  return {
    version: "2.0.0",
    metadata_id: uuidv4(), // random id to our metadata
    content: content,
    description: "Created from Lens Blog",
    name: contentName,
    mainContentFocus: "ARTICLE",
    locale: "en-US",
    image: imageURI,
    imageMimeType: imageType,
    appId: "Lens Blog",
    attributes: [],
  };
};
