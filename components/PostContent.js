import ReactMarkdown from "react-markdown";

export default function PostContent({ post }) {
  return (
    <div id="post-content" className="flex justify-center">
      <div className="p-6">
        <h5 className="text-gray-900 text-xl font-medium mb-2">
          {post.metadata.name}
        </h5>
        <span className="text-sm">Written by {post.profile.name}</span>
        <ReactMarkdown className="markdown">
          {post.metadata.content}
        </ReactMarkdown>
      </div>
    </div>
  );
}
