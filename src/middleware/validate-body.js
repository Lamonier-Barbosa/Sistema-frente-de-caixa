const validateBody = (joiSchema) => async (req, res, next) => {
  try {
    await joiSchema.validateAsync(req.body);
    next();
  } catch (error) {
    return res.status(400).json({ mensagem: error.message });
  }
};

const errorHandling = (err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({
      mensagem:
        "Erro de formatação JSON no corpo da solicitação. Você deve informar todos os dados no formato padrão!",
    });
  }

  return res.status(500).json({ mensagem: error.message });
};

module.exports = { validateBody, errorHandling };
