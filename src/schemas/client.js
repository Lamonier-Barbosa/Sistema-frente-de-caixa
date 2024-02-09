const joi = require("joi");

const clientSchema = joi.object({
  nome: joi
    .string()
    .pattern(/^[A-Za-z]+$/)
    .required()
    .messages({
      "string.pattern.base": "O campo nome deve conter apenas letras",
      "string.base": "O campo nome deve ser string.",
      "string.empty": "O campo nome não pode ser uma string vazia.",
      "any.required": "O campo nome é obrigatório.",
    }),
  email: joi.string().email().required().messages({
    "string.base": "O campo email deve ser string.",
    "string.empty": "O campo email não pode ser uma string vazia.",
    "string.email": "O campo email deve ter um formato válido.",
    "any.required": "O campo email é obrigatório.",
  }),
  cpf: joi.string().length(11).required().messages({
    "string.base": "O campo cpf deve ser string.",
    "string.empty": "O campo cpf não pode ser uma string vazia.",
    "string.length": "O campo cpf deve ter 11 caracteres",
    "any.required": "O campo cpf é obrigatório.",
  }),
  cep: joi.string().length(8).messages({
    "string.base": "O campo cep deve ser string.",
    "string.empty": "O campo cep não pode ser uma string vazia.",
    "string.length": "O campo cep deve ter 8 caracteres",
  }),
  rua: joi.string().messages({
    "string.base": "O campo rua deve ser string.",
    "string.empty": "O campo rua não pode ser uma string vazia.",
  }),
  numero: joi.string().messages({
    "string.base": "O campo numero deve ser string.",
    "string.empty": "O campo numero não pode ser uma string vazia.",
  }),
  bairro: joi.string().messages({
    "string.base": "O campo bairro deve ser string.",
    "string.empty": "O campo bairro não pode ser uma string vazia.",
  }),
  cidade: joi.string().messages({
    "string.base": "O campo cidade deve ser string.",
    "string.empty": "O campo cidade não pode ser uma string vazia.",
  }),
  estado: joi.string().messages({
    "string.base": "O campo estado deve ser string.",
    "string.empty": "O campo estado não pode ser uma string vazia.",
  }),
});

module.exports = clientSchema;
