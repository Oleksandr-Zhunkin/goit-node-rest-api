import Contact from "../models/Contact.js";

export const listContacts = () => Contact.find({}, "-createdAt -updatedAt");

export const getContactById = (_id) => {
  return Contact.findById(_id);
};

export const removeContact = (id) => Contact.findByIdAndDelete(id);

export const addContact = (data) => Contact.create(data);

export const updateContactById = (id, data) =>
  Contact.findByIdAndUpdate(id, data, { new: true, runValidators: true });

export const updateFavorite = (id, data) =>
  Contact.findOneAndUpdate(
    { _id: id },
    { $set: { favorite: data } },
    { new: true, runValidators: true }
  );
