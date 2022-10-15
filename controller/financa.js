const sequelize = require("sequelize");
const model = require("../models");
const Op = sequelize.Op;
const financa = model.Financa;

module.exports = {
  async create(request, response) {
    try {
      const { data, categoria_id, titulo, valor } = request.body;
      const Financa = await financa.create({
        data,
        categoria_id,
        titulo,
        valor,
      });
      return response.json({
        msg: "Finança cadastrada com sucesso!",
      });
    } catch (error) {
      return response.json({
        msg: "Não possivel cadastrar a finança " + error,
      });
    }
  },

  async update(request, response) {
    try {
      const { id } = request.params;

      const { data, categoria_id, titulo, valor } = request.body;

      const Financa = await financa.update(
        {
          data,
          categoria_id,
          titulo,
          valor,
        },
        { where: { id } }
      );
      return response.json({
        msg: "Finança alterada com sucesso!",
      });
    } catch (error) {
      return response.json({
        msg: "Não foi possivel alterar a finança. Error: " + error,
      });
    }
  },

  async findAll(request, response) {
    try {
      const { page } = request.params;
      const limite = 5;

      const Financa = await financa.findAndCountAll({
        order: [["data", "ASC"]],
        include: {
          all: true,
        },
        limit: limite,
        offset: parseInt(page),
      });
      return response.json(Financa);
    } catch (error) {
      return response.json("Erro ao listar finanças " + error);
    }
  },

  async findAllDate(request, response) {
    try {
      const { page, dataInicial, dataFinal } = request.params;
      const limite = 5;

      const Financa = await financa.findAndCountAll({
        limit: limite,
        offset: parseInt(page),
        where: {
          data: {
            [Op.gte]: dataInicial,
            [Op.lte]: dataFinal,
          },
        },
      });
      return response.json(Financa);
    } catch (error) {
      return response.json("Erro ao listar finanças " + error);
    }
  },

  async delete(request, response) {
    try {
      const { id } = request.params;
      const Financa = await financa.destroy({
        where: {
          id: id,
        },
      });
      return response.json({
        msg: "Excluido com sucesso.",
      });
    } catch (error) {
      return response.json({
        msg: "Não foi possivel excluir. Error: " + error,
      });
    }
  },
  async findById(request, response) {
    try {
      const { id } = request.params;
      var saldo = 0;
      var soma = 0;
      const Financa = await financa.findAll({
        where: {
          categoria_id: parseInt(id),
        },
        include: {
          all: true,
        },
      });
      if (Financa.length === 0) {
        return response.json({ saldo });
      } else {
        for (soma of Financa) {
          saldo = saldo + soma.valor;
        }
        return response.json({ saldo });
      }
    } catch (error) {
      return response.json({
        msg: "Erro ao listar finanças por categoria. " + error,
      });
    }
  },
};
