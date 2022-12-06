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

  //atualizando dados do usuario;
  async update(id, nome, email, role) {
    let user = await this.getById(id);
    if (user != undefined) {
      let updateUser = {};

      if (email != undefined) {
        if (email != user.email) {
          let emailExists = await this.verifyEmail(email);
          if (emailExists == false) {
            updateUser.email = email;
          } else {
            return { status: false, erro: "email já em uso!" };
          }
        }

        if (nome != undefined) {
          updateUser.nome = nome;
        }

        if (role != undefined) {
          updateUser.role = role;
        }

        //enviando dados atualizados

        try {
          await connection
            .update(updateUser)
            .where({ id: id })
            .table("usuarios");
          return { status: true };
        } catch (erro) {
          console.log(erro);
        }
      }
    }
  }
}

module.exports = new User();
