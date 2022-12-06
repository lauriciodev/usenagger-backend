const connection = require("../databases/connection");
const bcrypt = require("bcrypt");

class User {
  //criar usuario
  async create(nome, email, password) {
    try {
      let hash = await bcrypt.hash(password, 10);
      await connection
        .insert({ nome: nome, email: email, password: hash, role: 0 })
        .table("usuarios");
      return true;
    } catch (erro) {
      console.log(erro);
      return false;
    }
  }

  //listando todos os usuarios
  async getAll() {
    try {
      let result = await connection.select().table("usuarios");
      return result;
    } catch (erro) {
      console.log(erro);
    }
  }

  //listando usuario especifico
  async getById(id) {
    try {
      let result = await connection
        .select()
        .where({ id: id })
        .table("usuarios");
      return result;
    } catch (erro) {
      console.log(erro);
    }
  }

  //listando usuario por email especifico
  async getByEmail(email) {
    try {
      let result = await connection
        .select()
        .where({ email: email })
        .table("usuarios");

      return result;
    } catch (erro) {
      console.log(erro);
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
