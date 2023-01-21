import {
  apolloClient,
  getFollowing,
  getPublications,
  getPublicationsQueryVariables,
} from "@/constants/lensConstants";
import { useMoralis } from "react-moralis";
import { useEffect, useState } from "react";
import PostFeed from "../components/PostFeed";

let profileIdList = ["0x28a2", "0x869c"];

export default function Home() {
  const [pubs, setPubs] = useState();

  const { account } = useMoralis();

  const getPublicationsList = async function () {
    let followers;
    let followingsIds = [];
    if (account) {
      followers = await apolloClient.query({
        query: getFollowing,
        variables: {
          request: {
            address: account,
          },
        },
      });
      followingsIds = followers.data.following.items.map((f) => f.profile.id);
    }
    console.log(followingsIds);

    profileIdList = profileIdList.concat(followingsIds);
    console.log(profileIdList);
    const publications = await apolloClient.query({
      query: getPublications,
      variables: getPublicationsQueryVariables(profileIdList),
    });
    return publications;
  };
  useEffect(() => {
    if (account) {
      getPublicationsList().then((publications) => {
        console.log(publications);
        setPubs(publications);
      });
    }
  }, [account]);

  return (
    <div>
      {!pubs ? (
        <p>Loading...</p>
      ) : (
        <PostFeed posts={pubs.data.publications.items} />
      )}
    </div>
  );
}
