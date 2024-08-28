import * as contactsService from "../services/contactsServices.js";

import HttpError from "../helpers/HttpError.js";
import ctrlWrapper from "../decorators/ctrlWrapper.js";

export const getAllContacts = async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 3, favorite } = req.query;
  let filter;
  if (!favorite) {
    filter = {
      owner,
    };
  } else {
    filter = {
      owner,
      favorite,
    };
  }

  const skip = (page - 1) * limit;
  const result = await contactsService.listContacts(filter, { skip, limit });

  res.json(result);
};

export const getOneContact = async (req, res) => {
  const { id } = req.params;
  const { _id: owner } = req.user;

  const result = await contactsService.getContactById({ _id: id, owner });

  if (!result) {
    throw HttpError(404, `Contact with id - ${id} not found`);
  }

  res.json(result);
};

export const deleteContact = async (req, res) => {
  const { id } = req.params;
  const { _id: owner } = req.user;

  const result = await contactsService.removeContact({ _id: id, owner });

  if (!result) {
    throw HttpError(404, `Contact with id - ${id} not found`);
  }

  res.json(result);
};

export const createContact = async (req, res) => {
  const { _id: owner } = req.user;

  const result = await contactsService.addContact({ ...req.body, owner });

  res.status(201).json(result);
};

export const updateContact = async (req, res) => {
  const { id } = req.params;
  const { _id: owner } = req.user;

  const result = await contactsService.updateContactById(
    { _id: id, owner },
    req.body
  );

  if (!result) {
    throw HttpError(404, `Contact with id - ${id} not found`);
  }

  res.json(result);
};

export const updateStatusContact = async (req, res) => {
  const { id } = req.params;
  const { _id: owner } = req.user;

  const { favorite } = req.body;

  const result = await contactsService.updateFavorite(
    { _id: id, owner },
    favorite
  );

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
