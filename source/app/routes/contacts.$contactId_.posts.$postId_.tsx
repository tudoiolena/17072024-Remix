import { useLoaderData } from "@remix-run/react";
import { getPostById } from "../data";
import { json, LoaderFunctionArgs } from "@remix-run/node";
import invariant from "tiny-invariant";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.contactId, "Missing postId param");
  const { postId } = params;
  if (!postId) {
    throw new Response("PostId Not Found", { status: 404 });
  }
  const post = await getPostById(postId);
  if (!post) {
    throw new Response("Post Not Found", { status: 404 });
  }
  return json(post);
};
export default function PostDetails() {
  const post = useLoaderData<typeof loader>();
  console.log("post", post);

  return (
    <div id="post-details">
      <h3>Title: {post.title}</h3>
      <p>Description: {post.body}</p>
      <p>Tags: {post.tags.join(", ")}</p>
      <p>
        Reactions: Likes - {post.reactions.likes}, Dislikes -{" "}
        {post.reactions.dislikes}
      </p>
      <p>Views: {post.views}</p>
    </div>
  );
}
