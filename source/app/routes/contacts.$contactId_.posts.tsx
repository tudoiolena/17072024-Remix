import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { Form, useLoaderData, useNavigate } from "@remix-run/react";
import invariant from "tiny-invariant";
import { json, redirect } from "@remix-run/node";
import { getContact, getUserPosts, updateContact } from "../data";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.contactId, "Missing contactId param");
  const contact = await getContact(params.contactId);
  if (!contact) {
    throw new Response("Not Found", { status: 404 });
  }
  const posts = await getUserPosts(params.contactId);
  if (!posts) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ contact, posts });
};

export const action = async ({ params, request }: ActionFunctionArgs) => {
  invariant(params.contactId, "Missing contactId param");
  const formData = await request.formData();
  const updates = Object.fromEntries(formData);
  await updateContact(params.contactId, updates);
  return redirect(`/contacts/${params.contactId}`);
};

export default function ContactPosts() {
  const { contact, posts } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  return (
    <Form key={contact.id} id="contact-form" method="post">
      <ul id="posts-container">
        {posts && posts.length > 0 ? (
          posts.map((post) => (
            <li key={post.id}>
              <h3>{post.title}</h3>
              <p id="post-body">
                {post.body.length > 60
                  ? `${post.body.substring(0, 60)}...`
                  : post.body}
              </p>
            </li>
          ))
        ) : (
          <p>No posts available</p>
        )}
      </ul>

      <p>
        <button onClick={() => navigate(-1)} type="button">
          Back
        </button>
      </p>
    </Form>
  );
}
