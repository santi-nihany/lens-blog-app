import Link from "next/link";

export default function PostFeed({ posts }) {
  return (
    <div>
      {posts
        ? posts.map((post) => <PostItem post={post} key={post.id} />)
        : null}
    </div>
  );
}

function PostItem({ post }) {
  let imageURL;
  if (post.metadata.image) {
    imageURL = post.metadata.image.replace("ipfs://", "https://ipfs.io/ipfs/");
  }
  console.log(`${post.metadata.name}: ${imageURL}`);

  return (
    <div className="flex justify-center p-2">
      <Link href={`/posts/${post.id}`}>
        <div className="rounded-lg shadow-lg bg-white max-w-sm">
          <div className="p-6">
            <h2 className="text-gray-900 text-xl font-medium mb-2">
              {post.metadata.name}
            </h2>
          </div>
          <img className="rounded-t-lg" width="100%" src={imageURL} alt="" />
        </div>
      </Link>
    </div>
  );
}
