const connection = require("../databases/connection");

class User {
  //criar usuario

  async create(nome, email, password) {
    try {
      await connection
        .insert({ nome: nome, email: email, password: password, role: 0 })
        .table("usuarios");
      return true;
    } catch (erro) {
      console.log(erro);
      return false;
    }
  }

  //verificando a existencia do email ao criar usuario;
  async verifyEmail(email) {
    try {
      let emailExists = await connection
        .select()
        .where({ email: email })
        .table("usuarios");

      if (emailExists.length > 0) {
        return true;
      } else {
        return false;
      }
    } catch (erro) {
      console.log(erro);
      return false;
    }
  }
}

module.exports = new User();
