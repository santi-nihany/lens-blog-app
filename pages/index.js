import {
  apolloClient,
  getFollowing,
  getPublications,
  getPublicationsQueryVariables,
} from "@/constants/lensConstants";
import { useMoralis } from "react-moralis";
import { useEffect, useState } from "react";
import { useLensContext } from "../context/LensContext";
import PostFeed from "../components/PostFeed";
import { toast, Toaster } from "react-hot-toast";

let profileIdList = ["0x28a2", "0x869c", "0xe111"];

export default function Home(props) {
  const [pubs, setPubs] = useState();
  const { profileId } = useLensContext();
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
    <main className="pt-24">
      <div className="pl-2 pr-2">
        <div className="p-2 m1 bg-sky-600 border text-white rounded  border-solid border-black">
          <p>Our decentralized blogging platform!</p>
        </div>
      </div>

      {account ? (
        !pubs ? (
          <p>Loading...</p>
        ) : (
          <PostFeed posts={pubs.data.publications.items} />
        )
      ) : (
        <div>Please, log in </div>
      )}
    </main>
  );
}
