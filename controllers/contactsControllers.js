import * as contactsService from "../services/contactsServices.js";

import HttpError from "../helpers/HttpError.js";
import ctrlWrapper from "../decorators/ctrlWrapper.js";

export const getAllContacts = async (_, res) => {
  const result = await contactsService.listContacts();

  res.json(result);
};

export const getOneContact = async (req, res) => {
  const { id } = req.params;

  const result = await contactsService.getContactById(id);

  if (!result) {
    throw HttpError(404, `Contact with id - ${id} not found`);
  }

  res.json(result);
};

export const deleteContact = async (req, res) => {
  const { id } = req.params;
  const result = await contactsService.removeContact(id);

  if (!result) {
    throw HttpError(404, `Contact with id - ${id} not found`);
  }

  res.json(result);
};

export const createContact = async (req, res) => {
  const result = await contactsService.addContact(req.body);

  res.status(201).json(result);
};

export const updateContact = async (req, res) => {
  const { id } = req.params;

  const result = await contactsService.updateContactById(id, req.body);

  if (!result) {
    throw HttpError(404, `Contact with id - ${id} not found`);
  }

  res.json(result);
};

export const updateStatusContact = async (req, res) => {
  const { id } = req.params;

  const { favorite } = req.body;

  const result = await contactsService.updateFavorite(id, favorite);

  if (!result) {
    throw HttpError(404);
  }

  res.json(result);
};
export default {
  getAllContacts: ctrlWrapper(getAllContacts),
  getOneContact: ctrlWrapper(getOneContact),
  deleteContact: ctrlWrapper(deleteContact),
  createContact: ctrlWrapper(createContact),
  updateContact: ctrlWrapper(updateContact),
  updateStatusContact: ctrlWrapper(updateStatusContact),
};
