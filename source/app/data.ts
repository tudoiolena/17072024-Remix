import { matchSorter } from "match-sorter";
import sortBy from "sort-by";

type ContactMutation = {
  id?: string;
  firstName?: string;
  lastName?: string;
  image?: string;
  twitter?: string;
  notes?: string;
  favorite?: boolean;
};

export type ContactRecord = ContactMutation & {
  id: string;
  createdAt: string;
};

type TPost = {
  id: number;
  title: string;
  body: string;
  tags: string[];
  reactions: Record<string, number>;
  views: number;
  userId: number;
};

const API_URL = "https://dummyjson.com/";

async function fetchContacts(): Promise<ContactRecord[]> {
  const response = await fetch(new URL("users", API_URL));
  if (!response.ok) {
    throw new Error(`Failed to fetch contacts: ${response.statusText}`);
  }
  const data = await response.json();
  return data.users;
}

export async function getContacts(
  query?: string | null
): Promise<ContactRecord[]> {
  const contacts = await fetchContacts();
  let filteredContacts = contacts;
  if (query) {
    filteredContacts = matchSorter(contacts, query, {
      keys: ["firstName", "lastName"],
    });
  }
  return filteredContacts.sort(sortBy("lastName", "createdAt"));
}

export async function getContact(id: string): Promise<ContactRecord> {
  const response = await fetch(new URL(`users/${id}`, API_URL));
  const data = await response.json();
  return data;
}

export async function createContact(
  contactData: ContactMutation
): Promise<ContactRecord> {
  const response = await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify(contactData),
  });

  if (!response.ok) {
    throw new Error(`Failed to create contact: ${response.statusText}`);
  }

  return await response.json();
}

export async function createEmptyContact(): Promise<ContactRecord> {
  const emptyContactData = {
    firstName: "",
    lastName: "",
    image: "",
    twitter: "",
    notes: "",
    favorite: false,
  };

  return createContact(emptyContactData);
}

export async function getUserPosts(id: string): Promise<TPost[]> {
  const response = await fetch(new URL(`users/${id}/posts/`, API_URL));

  if (!response.ok) {
    throw new Error(`Failed to fetch posts: ${response.statusText}`);
  }

  const data = await response.json();
  return data.posts;
}

export async function getPostById(postId: string): Promise<TPost> {
  const response = await fetch(new URL(`posts/${postId}`, API_URL));

  if (!response.ok) {
    throw new Error(`Failed to fetch post: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}

export async function updateContact(
  id: string,
  updates: ContactMutation
): Promise<ContactRecord> {
  const response = await fetch(`${API_URL}${id}`, {
    method: "PUT",
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    throw new Error(`Failed to update contact: ${response.statusText}`);
  }
  // TODO: UPDATE LOGIC
  return await response.json();
}

export async function deleteContact(id: string): Promise<string> {
  const response = await fetch(`${API_URL}${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`Failed to delete contact: ${response.statusText}`);
  }
  // TODO: UPDATE LOGIC
  return id;
}
