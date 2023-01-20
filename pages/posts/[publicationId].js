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

  return (
    <div>
      <h1>Publication ID: {publicationId}</h1>
    </div>
  );
}
