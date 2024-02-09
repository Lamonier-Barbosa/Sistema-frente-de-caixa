const jwt = require("jsonwebtoken");
const hashPassword = require("../database/hashPassword");
const knex = require("../database/connection/connection.js");

const verifyToken = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ mensagem: "Não autorizado!" });
  }

  const token = authorization.split(" ")[1];

  try {
    const tokenUser = jwt.verify(token, hashPassword);

    const usuario = await knex("usuarios").where("id", tokenUser.id).first();

    if (!usuario) {
      return res.status(401).json({ mensagem: "Não autorizado" });
    }

    const { senha, ...usuarioLogado } = usuario;

    req.usuario = usuarioLogado;

    next();
  } catch (error) {
    return res.status(401).json({ mensagem: "Não autorizado" });
  }
};

module.exports = { verifyToken };
