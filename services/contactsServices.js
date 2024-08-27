import Contact from "../models/Contact.js";

export const listContacts = (filter, settings) => {
  return Contact.find(filter, "-createdAt -updatedAt", settings).populate(
    "owner",
    "email subscription"
  );
};

export const getContactById = (filter) => {
  return Contact.findOne(filter);
};

export const removeContact = (filter) => Contact.findOneAndDelete(filter);

export const addContact = (data) => Contact.create(data);

export const updateContactById = (filter, data) =>
  Contact.findOneAndUpdate(filter, data, { new: true, runValidators: true });

export const updateFavorite = (filter, data) =>
  Contact.findOneAndUpdate(
    filter,
    { $set: { favorite: data } },
    { new: true, runValidators: true }
  );
