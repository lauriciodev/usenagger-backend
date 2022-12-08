const User = require("../models/User");
const Token = require("../models/Token");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

//secret jwt
const secret = "lauricio";

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

  //editando usuauarios

  async edit(req, res) {
    let { id, nome, role, email } = req.body;
    let result = await User.update(id, email, nome, role);
    if (result != undefined) {
      if (result.status) {
        res.send("usuario atualizado");
      } else {
        res.status(406);
        res.send(result.erro);
      }
    } else {
      res.status(406);
      res.send("erro no servidor");
    }
  }

  //criando token
  async recoverPassword(req, res) {
    let email = req.body.email;
    //verificação se email exite
    let result = await Token.create(email);
    if (result.status) {
      res.status(200);
      res.send("" + result.token);
    } else {
      res.status(404);
      res.send(result.erro);
    }
  }

  //usando token para alterar senha;

  async changePassword(req, res) {
    let { token, password } = req.body;

    let isValidToken = await Token.validate(token);

    if (isValidToken.status) {
      await User.changePassword(
        password,
        isValidToken.token.user_id,
        isValidToken.token.token
      );
      res.status(200);
      res.send("senha alterada");
    } else {
      res.status(406);
      res.send("token inválido !");
    }
  }

  //gerando webtoken se credenciais corretas;]

  async login(req, res) {
    let { email, password } = req.body;

    let user = await User.getByEmail(email);
    if (user.length > 0) {
      let passwordIsCorrect = await bcrypt.compare(password, user[0].password);

      if (passwordIsCorrect) {
        let token = jwt.sign({ email: email, role: user[0].role }, secret, {
          expiresIn: "24H",
        });
        res.status(200);
        res.json({ token: token });
      } else {
        res.status(406);
        res.send("senha incorreta");
      }
    } else {
      res.status(406);
      res.send("email inválido");
    }
  }
}

module.exports = new UserController();
