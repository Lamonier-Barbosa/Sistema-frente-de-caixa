const joi = require('joi');

const productSchema = joi.object({
    descricao: joi.string().required().messages({
        'string.base': 'O campo descricao deve ser string.',
        'string.empty': 'O campo descricao não pode ser uma string vazia.',
        'any.required': 'O campo descricao é obrigatório.'
    }),
    quantidade_estoque: joi.number().integer().min(0).required().messages({
        'number.base': 'O campo quantidade_estoque deve ser um número',
        'number.integer': 'O campo quantidade_estoque deve ser um número inteiro',
        'number.min': 'O campo quantidade_estoque deve ser maior ou igual a zero.',
        'any.required': 'O campo quantidade_estoque é obrigatório.'
    }),
    valor: joi.number().integer().positive().required().messages({
        'number.base': 'O campo valor deve ser um número',
        'number.integer': 'O campo valor deve ser um número inteiro',
        'number.positive': 'O campo valor deve ser maior que zero',
        'any.required': 'O campo valor é obrigatório.',
    }),
    categoria_id: joi.number().integer().positive().required().messages({
        'number.base': 'O campo categoria_id deve ser um número',
        'number.integer': 'O campo categoria_id deve ser um número inteiro',
        'number.positive': 'O campo categoria_id deve ser maior que zero',
        'any.required': 'O campo categoria_id é obrigatório.',
    })
});

module.exports = productSchema;