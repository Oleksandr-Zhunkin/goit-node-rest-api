import Joi from "joi";

const phonePattern = "^\\(\\d{3}\\) \\d{3}-\\d{4}$";
export const createContactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required().pattern(new RegExp(phonePattern)).messages({
    "string.pattern.base":
      "Неправильний формат телефону. Використовуйте (992) 914-3792",
    "string.empty": "Поле телефону не може бути порожнім",
  }),
});

export const updateContactSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string().email(),
  phone: Joi.string().pattern(new RegExp(phonePattern)).messages({
    "string.pattern.base":
      "Неправильний формат телефону. Використовуйте (992) 914-3792",
    "string.empty": "Поле телефону не може бути порожнім",
  }),
});
