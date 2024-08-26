import * as fs from "node:fs/promises";
import * as path from "node:path";
import { nanoid } from "nanoid";

import Contact from "../models/Contact.js";

const contactsPath = path.resolve("db", "contacts.json");

export const listContacts = () => Contact.find();

export async function getContactById(contactId) {
  const contacts = await listContacts();
  const contactById = contacts.find((item) => item.id === contactId);
  return contactById || null;
}

export async function removeContact(contactId) {
  const contacts = await listContacts();
  const index = contacts.findIndex((item) => item.id === contactId);
  if (index === -1) {
    return null;
  }

  const [deletedContact] = contacts.splice(index, 1);

  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

  return deletedContact;
}

export const addContact = (data) => Contact.create(data);

export async function updateContactById(id, data) {
  const contacts = await listContacts();

  const index = contacts.findIndex((item) => item.id === id);

  if (index === -1) {
    return null;
  }

  contacts[index] = {
    ...contacts[index],
    ...data,
  };
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

  return contacts[index];
}
