const User = require("../models/User");

class UserController {
  async create(req, res) {
    try {
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
    } catch (erro) {
      res.status(400);
      res.send("erro ao cadastrar novo usuario");
    }
  }
}

module.exports = new UserController();
