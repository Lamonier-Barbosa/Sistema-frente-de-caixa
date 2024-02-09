const joi = require('joi');

const userSchema = joi.object({
    nome: joi.string().required().messages({
        'string.base': 'O campo nome deve ser string.',
        'string.empty': 'O campo nome não pode ser uma string vazia.',
        'any.required': 'O campo nome é obrigatório.'
    }),
    email: joi.string().email().required().messages({
        'string.base': 'O campo email deve ser string.',
        'string.empty': 'O campo email não pode ser uma string vazia.',
        'string.email': 'O campo email deve ter um formato válido.',
        'any.required': 'O campo email é obrigatório.'
    }),
    senha: joi.string().required().messages({
        'string.base': 'O campo senha deve ser string.',
        'string.empty': 'O campo senha não pode ser uma string vazia.',
        'any.required': 'O campo senha é obrigatório.'
    })
});

module.exports = userSchema;