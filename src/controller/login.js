const bcrypt = require('bcrypt');
const knex = require('../database/connection/connection.js');
const jwt = require('jsonwebtoken');
const hashPassword = require('../database/hashPassword.js')

const loginUser = async (req, res) => {
    try {
        const { email, senha } = req.body;
        if (!email || !senha) {
            return res
                .status(400)
                .json({ mensagem: "Preencha todos os campos obrigatórios" });
        }
        const usuario = await knex('usuarios').where('email', email).first();
        if (!usuario) {
            return res
                .status(404)
                .json({ mensagem: "Usuário ou senha inválidos." });
        }
        const senhaUsuario = await bcrypt.compare(senha, usuario.senha);
        if (!senhaUsuario) {
            return res
                .status(401)
                .json({ mensagem: "Usuário ou senha inválido." });
        }
        const token = jwt.sign({ id: usuario.id }, hashPassword, { expiresIn: '8h' });

        const { senha: _, ...usuarioLogado } = usuario;
        return res.status(200).json({ usuario: usuarioLogado, token });
    } catch (error) {
        //console.log("Erro ao realizar o login do usuário:", error);
        res.status(500).json({ mensagem: error.message });
    }
};

module.exports = loginUser;