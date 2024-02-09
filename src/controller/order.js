const knex = require("../database/connection/connection.js");
const transporter = require("../email/transporter.js");

//*******************Register Order****************/
const registerOrder = async (req, res) => {
  const { cliente_id, observacao, pedido_produtos } = req.body;

  try {
    let erros = [];
    let valorTotal = 0;

    const client = await knex("clientes").where({ id: cliente_id }).first();

    if (!client) {
      return res.status(404).json({mensagem: 'Não existe o cliente informado.'})
    }

    for (const item of pedido_produtos) {
      let produtoCorrente = await knex("produtos")
        .where("id", "=", item.produto_id)
        .first();

      if (!produtoCorrente) {
        erros.push({
          mensagem: `Não existe produto para o produto_id informado: ${item.produto_id}`,
        });
        continue; //verifica o proximo item
      }

      if (item.quantidade_produto > produtoCorrente.quantidade_estoque) {
        erros.push({
          mensagem: `A quantidade solicitada: ${item.quantidade_produto} para o produto de ID: ${produtoCorrente.id} é maior que a quantidade em estoque: ${produtoCorrente.quantidade_estoque}`,
        });
        continue;
      }

      valorTotal += produtoCorrente.valor * item.quantidade_produto;
      item.valor_produto = produtoCorrente.valor;
      item.quantidade_estoque = produtoCorrente.quantidade_estoque;
    }

    if (erros.length > 0) {
      return res.status(400).json({ erros });
    }

    //registar pedido ***********
    const pedido = await knex("pedidos")
      .insert({
        cliente_id,
        observacao,
        valor_total: valorTotal,
      })
      .returning("*"); //retorna tudo

    for (const item of pedido_produtos) {
      await knex("pedidos_produtos").insert({
        pedido_id: pedido[0].id,
        produto_id: item.produto_id,
        quantidade_produto: item.quantidade_produto,
        valor_produto: item.valor_produto,
      });

      let quantidadeReduzida =
        item.quantidade_estoque - item.quantidade_produto;

      await knex("produtos").where("id", "=", item.produto_id).update({
        quantidade_estoque: quantidadeReduzida,
      });
    }

    await transporter.sendMail({
      from: `${process.env.EMAIL_NAME} <${process.env.EMAIL_FROM}>`,
      to: `${client.nome} <${client.email}>`,
      subject: "Pedido criado",
      text: `Um pedido foi criado para você, ${client.nome}!`,
    });

    return res.status(201).json({ mensagem: "Pedido gerado com sucesso" });
  } catch (error) {
    return res.status(500).json({ mensagem: error.message });
  }
};

//*******************List Order****************/
const listOrder = async (req, res) => {
  const customerId = req.query.cliente_id;
  if (customerId) {
    const isNumeric = Number(customerId) == customerId;
    if (!isNumeric) {
      return res.status(400).json({
        mensagem: `${customerId} não é um id válido.`,
      });
    }
  }
  try {
    if (customerId) {
      const customerCheck = await knex("pedidos")
        .where("cliente_id", customerId)
        .select("cliente_id")
        .first();

      if (!customerCheck) {
        return res.status(400).json({
          mensagem: `Não há pedidos registrados para o cliente ${customerId}`,
        });
      }

      const formatedOrders = [];

      const allOrders = await knex("pedidos").where("cliente_id", customerId);

      for (order of allOrders) {
        const orderProducts = await knex("pedidos_produtos").where(
          "pedido_id",
          order.id
        );

        const orderOb = { pedido: order, pedido_produtos: orderProducts };

        formatedOrders.push(orderOb);
      }
      return res.status(200).json(formatedOrders);
    } else {
      const formatedOrders = [];

      const allOrders = await knex("pedidos");
      for (order of allOrders) {
        const orderProducts = await knex("pedidos_produtos").where(
          "pedido_id",
          order.id
        );

        const orderOb = { pedido: order, pedido_produtos: orderProducts };

        formatedOrders.push(orderOb);
      }

      return res.status(200).json(formatedOrders);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json(error.message);
  }
};

module.exports = {
  registerOrder,
  listOrder,
};
