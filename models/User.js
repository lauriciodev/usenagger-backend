const connection = require("../databases/connection");
const bcrypt = require("bcrypt");
const Token = require("./Token");

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
      return result[0];
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
  //atualização de dados do usuario

  async update(id, email, nome, role) {
    //verificando a existencia do email
    let user = await this.getById(id);

    if (user != undefined) {
      let editeUser = {};

      //email foi passado?
      if (email != undefined) {
        //email é diferente do email atual
        if (email == user.email) {
          editeUser.email = email;
        } else {
          let emailExists = await this.verifyEmail(email);
          //email passado já está em uso?
          if (emailExists === false) {
            editeUser.email = email;
          } else {
            return { status: false, erro: "email já existe !" };
          }
        }
      }

      if (nome != undefined) {
        editeUser.nome = nome;
      }

      if (role != undefined) {
        editeUser.role = role;
      }

      //enviando dados atualizados
      try {
        await connection.update(editeUser).where({ id: id }).table("usuarios");
        return { status: true };
      } catch (erro) {
        return { status: false, erro: erro };
      }
    } else {
      return { status: false, erro: "o usuario não existe !" };
    }
  }

  async changePassword(password, id, token) {
    let hash = await bcrypt.hash(password, 10);

    await connection
      .update({
        password: hash,
      })
      .where({ id: id })
      .table("usuarios");
    await Token.setUsed(token);
  }
}

module.exports = new User();
