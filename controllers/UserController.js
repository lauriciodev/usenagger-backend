const User = require("../models/User");

class UserController {
  //criando usuarios;
  async create(req, res) {
    let { nome, email, password } = req.body;
    let emailUsed = await User.verifyEmail(email);

    if (emailUsed) {
      //se email está em uso;
      res.status(406);
      res.send("email já está sendo usado.");
    } else {
      let result = await User.create(nome, email, password);
      if (result) {
        res.status(200);
        res.send("usuario cadastrado com sucesso");
      } else {
        res.status(400);
        res.send("erro ao cadastrar novo usuario");
      }
    }
  }

  //buscando todos os usuario
  async getAllUsers(req, res) {
    try {
      let result = await User.getAll();
      res.status(200);
      res.send(result);
    } catch (erro) {
      res.send(400);
      console.log(erro);
    }
  }

  //buscando usuario id especifico
  async getById(req, res) {
    let id = req.params.id;
    let response = await User.getById(id);

    if (response != undefined) {
      res.status(200);
      res.send(response);
    } else {
      res.status(404);
      res.send("usuario não encontrado");
    }
  }

  //buscando usuario por email especifico;
  async getUserByEmail(req, res) {
    let { email } = req.body;

    let result = await User.getByEmail(email);
    if (result.length > 0) {
      res.status(200);
      res.send(result);
    } else {
      res.status(404);
      res.send("email não encontrado !");
    }
  }
}

module.exports = new UserController();
