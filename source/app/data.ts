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

const API_URL = "https://dummyjson.com/users/";

async function fetchContacts(): Promise<ContactRecord[]> {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch contacts: ${response.statusText}`);
  }
  const data = await response.json();
  return data.users;
}

export async function getContacts(query?: string | null) {
  const contacts = await fetchContacts();
  let filteredContacts = contacts;
  if (query) {
    filteredContacts = matchSorter(contacts, query, {
      keys: ["firstName", "lastName"],
    });
  }
  return filteredContacts.sort(sortBy("lastName", "createdAt"));
}

export async function getContact(id: string) {
  const response = await fetch(`${API_URL}/${id}`);
  const data = await response.json();
  return data;
}

export async function createEmptyContact(contactData: ContactMutation) {
  const response = await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify(contactData),
  });

  if (!response.ok) {
    throw new Error(`Failed to create contact: ${response.statusText}`);
  }

  return await response.json();
}

export async function updateContact(id: string, updates: ContactMutation) {
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

export async function deleteContact(id: string) {
  const response = await fetch(`${API_URL}${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`Failed to delete contact: ${response.statusText}`);
  }
  // TODO: UPDATE LOGIC
  return id;
}
