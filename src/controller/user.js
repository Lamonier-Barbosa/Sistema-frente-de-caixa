const bcrypt = require('bcrypt');
const knex = require('../database/connection/connection.js');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
    const { nome, email, senha } = req.body;

    try {
        const emailCheck = await knex('usuarios')
            .where('email', email);

        if (emailCheck.length != 0) {
            // checar se seria permitido utilizar 409 aqui.
            return res.status(400).json({ mensagem: "Email já cadastrado" })
        }

        const encryptedPassword = await bcrypt.hash(senha, 10);

        const insertion = await knex('usuarios')
            .insert({
                nome: nome,
                email: email,
                senha: encryptedPassword
            })

        return res.status(201).json({ mensagem: "Usuário criado com sucesso." })

    } catch (error) {
        return res.status(500).json(error.message)
    }
};

const detailUser = async (req, res) => {
    return res.json(req.usuario)
};

const editUser = async (req, res) => {
    const { nome, email, senha } = req.body;

    try {
        const { id } = req.usuario;

        if (!id) {
            return res.status(401).json({ mensagem: 'Usuario não autenticado.' });
        };

        const userCheck = await knex('usuarios')
            .where('email', email);


        if (userCheck.length > 0 && userCheck[0].id !== id) {
            return res.status(409).json({ mensagem: 'Já existe um usuário cadastrado com esse e-mail!' });
        };

        const encryptedPassword = await bcrypt.hash(senha, 10);

        await knex('usuarios').where('id', id).update({
            nome: nome,
            email: email,
            senha: encryptedPassword
        });

        return res.status(204).send();

    } catch (error) {
        return res.status(500).json(error.message);
    };

};

const listClient = async (req, res) => {
    try {
        const clients = await knex('clientes')

        return res.status(200).json(clients)
    } catch (error) {
        return res.status(500).json(error.message)
    }
}

const registerClient = async (req, res) => {
    const { nome, email, cpf, cep, rua, numero, bairro, cidade, estado } = req.body;

    const letterTestCpf = cpf.match(/\D+/g);

    if (letterTestCpf) {
        return res.status(400).json({ mensagem: 'CPF inválido' });
    }

    if (cep) {
        const letterTestCep = cep.match(/\D+/g);
        if (letterTestCep) {
            return res.status(400).json({ mensagem: 'CEP inválido' });
        }
    }

    try {
        const emailCheck = await knex('clientes').where('email', email).first();
        if (emailCheck) {
            return res.status(400).json({ mensagem: 'Email já cadastrado.' });
        }

        const cpfCheck = await knex('clientes').where('cpf', cpf).first();
        if (cpfCheck) {
            return res.status(400).json({ mensagem: 'CPF já cadastrado.' });
        }

        await knex('clientes').insert(req.body);
        return res.status(200).json({ mensagem: 'Cliente cadastrado com sucesso.' });
    } catch (error) {
        return res.status(500).json(error.message)
    }
};

const editClient = async (req, res) => {
    const { nome, email, cpf, cep, rua, numero, bairro, cidade, estado } = req.body;
    const { id } = req.params;

    const letterTestCpf = cpf.match(/[a-zA-Z\.\-]/g);

    if (letterTestCpf) {
        return res.status(400).json({ mensagem: 'CPF inválido' });
    }

    if (cep) {
        const letterTestCep = cep.match(/[a-zA-Z\.\-]/g);
        if (letterTestCep) {
            return res.status(400).json({ mensagem: 'CEP inválido' });
        }
    }

    try {
        const clientCheck = await knex('clientes').where("id", id).first();

        if (!clientCheck) {
            return res.status(404).json({ mensagem: "Cliente não encontrado." });
        }

        const emailCheck = await knex('clientes').where('email', email).andWhere('id', '<>', id).first();
        if (emailCheck) {
            return res.status(400).json({ mensagem: 'Email já cadastrado.' });
        }

        const cpfCheck = await knex('clientes').where('cpf', cpf).andWhere('id', '<>', id).first();
        if (cpfCheck) {
            return res.status(400).json({ mensagem: 'CPF já cadastrado.' });
        }

        await knex('clientes').where('id', id).update(req.body);
        return res.status(204).send();
    } catch (error) {
        return res.status(500).json(error.message)
    }
};

const detailCustomer = async (req, res) => {
    try {
        const { id } = req.params
        const cliente = await knex('clientes').where({ id }).first();
        if (!cliente) {
            return res.status(404).json({ mensagem: 'Cliente não encontrado.' })
        }
        const info = {
            id: cliente.id,
            nome: cliente.nome,
            email: cliente.email,
            cpf: cliente.cpf,
            cep: cliente.cep,
            rua: cliente.rua,
            numero: cliente.numero,
            bairro: cliente.bairro,
            cidade: cliente.cidade,
            estado: cliente.estado
        }
        res.status(200).json(info);
    } catch (error) {
        res.status(500).json({ mensagem: "Erro interno do servidor" });
    }
};

module.exports = {
    registerUser,
    detailUser,
    editUser,
    listClient,
    registerClient,
    editClient,
    detailCustomer
}