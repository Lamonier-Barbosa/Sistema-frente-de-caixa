const joi = require('joi');

const loginSchema = joi.object({
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

module.exports = loginSchema;