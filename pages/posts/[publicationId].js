import { useQuery } from "@apollo/client";
import { getPublication } from "@/constants/lensConstants";
import PostContent from "@/components/PostContent";

// Get some  possible paths
export async function getStaticPaths() {
  const paths = [{ params: { posts: "posts", publicationId: "0x869c-0x11" } }];
  return {
    paths,
    fallback: true,
  };
}

// get the props from the paths
export async function getStaticProps({ params }) {
  const { publicationId } = params;

  return {
    props: {
      publicationId,
    },
  };
}

export default function ReadPost(props) {
  const { publicationId } = props;
  const {
    loading,
    error,
    data: publication,
  } = useQuery(getPublication, {
    variables: {
      request: {
        publicationId: publicationId,
      },
    },
  });

  return (
    <div>
      {publication && publicationId && !loading ? (
        <PostContent post={publication.publication}></PostContent>
      ) : loading ? (
        <div>Loading...</div>
      ) : (
        <div>Post not found</div>
      )}
    </div>
  );
}
