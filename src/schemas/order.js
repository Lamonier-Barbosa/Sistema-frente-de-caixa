const joi = require('joi');

const orderSchema = joi.object({

  cliente_id: joi.number().integer().positive().required().messages({
    'number.base': 'O campo cliente_id deve ser um número',
    'number.integer': 'O campo cliente_id deve ser um número inteiro',
    'number.positive': 'O campo cliente_id deve ser maior que zero',
    'any.required': 'O campo cliente_id é obrigatório.',
  }),
  observacao: joi.string().messages({
    "string.base": "O campo observacao deve ser string.",
    "string.empty": "O campo observacao não pode ser uma string vazia.",
  }),

  pedido_produtos: joi.array().items(
    joi.object({
      produto_id: joi.number().integer().positive().required().messages({
        'number.base': 'O campo produto_id deve ser um número',
        'number.integer': 'O campo produto_id deve ser um número inteiro',
        'number.positive': 'O campo produto_id deve ser maior que zero',
        'any.required': 'O campo produto_id é obrigatório.',
      }),
      quantidade_produto: joi.number().integer().min(1).required().messages({
        'number.base': 'O campo quantidade_produto deve ser um número',
        'number.integer': 'O campo quantidade_produto deve ser um número inteiro',
        'number.min': 'O campo quantidade_produto deve ser maior que zero.',
        'any.required': 'O campo quantidade_produto é obrigatório.'
      }),

    }))
});



module.exports = orderSchema ;