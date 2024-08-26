import Joi from "joi";
import { phonePattern } from "../constants/contactConstants.js";

export const createContactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required().pattern(phonePattern).messages({
    "string.pattern.base":
      "Неправильний формат телефону. Використовуйте (992) 914-3792",
    "string.empty": "Поле телефону не може бути порожнім",
  }),
  favorite: Joi.boolean(),
});

export const updateContactSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string().email(),
  phone: Joi.string().pattern(phonePattern).messages({
    "string.pattern.base":
      "Неправильний формат телефону. Використовуйте (992) 914-3792",
    "string.empty": "Поле телефону не може бути порожнім",
  }),
}).or("name", "email", "phone");
