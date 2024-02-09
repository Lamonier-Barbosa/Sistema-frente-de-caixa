const knex = require("../database/connection/connection.js");
const { uploadFile, deleteFile } = require("../storage/s3_storage.js");

const listCategories = async (req, res) => {
  try {
    const categories = await knex("categorias");
    res.json(categories);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const registerProduct = async (req, res) => {
  const { descricao, quantidade_estoque, valor, categoria_id } = req.body;
  const { file } = req;

  try {
    const categoryCheck = await knex("categorias").where("id", categoria_id);

    if (categoryCheck.length === 0) {
      return res.status(404).json({ mensagem: "Categoria não encontrada." });
    }

    if (file) {
      const produto_imagem = (
        await uploadFile(
          `productimages/${file.originalname}`,
          file.buffer,
          file.mimetype
        )
      ).url;

      await knex("produtos").insert({
        descricao,
        quantidade_estoque,
        valor,
        categoria_id,
        produto_imagem,
      });

      return res
        .status(201)
        .json({ mensagem: "Produto cadastrado com sucesso." });
    }

    await knex("produtos").insert({
      descricao,
      quantidade_estoque,
      valor,
      categoria_id,
    });

    return res
      .status(201)
      .json({ mensagem: "Produto cadastrado com sucesso." });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

const editProduct = async (req, res) => {
  const { id } = req.params;
  const { descricao, quantidade_estoque, valor, categoria_id } = req.body;
  const { file } = req;

  try {
    const product = await knex("produtos").where({ id }).first();

    if (!product) {
      return res.status(404).json({ mensagem: "Produto não encontrado." });
    }

    const categories = await knex("categorias").where({ id: categoria_id });

    if (categories.length === 0) {
      return res.status(404).json({ mensagem: "Categoria não encontrada." });
    }

    if (file) {
      const produto_imagem = (
        await uploadFile(
          `productimages/${file.originalname}`,
          file.buffer,
          file.mimetype
        )
      ).url;

      await knex("produtos").where({ id }).update({
        descricao,
        quantidade_estoque,
        valor,
        categoria_id,
        produto_imagem,
      });

      return res.status(201).json({ mensagem: "Produto atualizado!" });
    }

    await knex("produtos").where({ id }).update({
      descricao,
      quantidade_estoque,
      valor,
      categoria_id,
    });

    return res.status(201).json({ mensagem: "Produto atualizado!" });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

const listProduct = async (req, res) => {
  const categoria_id = req.query.categoria_id;

  try {
    if (categoria_id) {
      const products = await knex("produtos").where({ categoria_id });

      if (products.length === 0) {
        return res.status(404).json({
          mensagem: "Nenhum produto encontrado para a categoria informada.",
        });
      }

      return res.status(200).json(products);
    }
    const allProducts = await knex("produtos");

    return res.status(200).json(allProducts);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

const detailProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await knex("produtos").where({ id }).first();

    if (!product) {
      return res.status(404).json({ mensagem: "Produto não encontrado." });
    }
    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await knex("produtos").where({ id }).first();

    if (!product) {
      return res.status(404).json({ mensagem: "Produto não encontrado." });
    }

    const orderExist = await knex("pedidos_produtos").where({ produto_id: id }).first();

    if (orderExist) {
      return res.status(409).json({
          mensagem:
            "Não foi possivel excluir o produto, pois está vinculado a um ou mais pedidos!",
        });
    }

    if (product.produto_imagem) {
      const path = product.produto_imagem.split("/").slice(3).join("/");
      await deleteFile(path);
    }

    await knex("produtos").where({ id }).del();

    return res.status(200).json({ mensagem: "Produto excluído com sucesso!" });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

module.exports = {
  listCategories,
  registerProduct,
  editProduct,
  listProduct,
  detailProduct,
  deleteProduct,
};
