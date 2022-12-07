const connection = require("../databases/connection");

//criando token

class CreateToken {
  //pegando usuario por email
  async getForEmail(email) {
    try {
      let result = await connection
        .select()
        .where({ email: email })
        .table("usuarios");

      if (result.length > 0) {
        return result[0];
      } else {
        return undefined;
      }
    } catch (erro) {
      console.log(erro);
      return { erro: "email não pode ser encontrado" };
    }
  }

  //criando token
  async create(email) {
    try {
      let user = await this.getForEmail(email);
      if (user != undefined) {
        let token = Date.now();

        await connection
          .insert({
            user_id: user.id,
            used: 0,
            token: token,
          })
          .table("tokens");

        return { status: true, token: token };
      } else {
        return { erro: "email não encontrado" };
      }
    } catch (erro) {
      return { erro: erro };
    }
  }

  //validando token
  async validate(token) {
    try {
      let tokenExists = await connection
        .select()
        .where({ token: token })
        .table("tokens");

      if (tokenExists.length > 0) {
        let tk = tokenExists[0];
        if (tk.used) {
          return { status: false };
        } else {
          return { status: true, token: tk };
        }
      } else {
        return false;
      }
    } catch (erro) {
      console.erro(erro);
    }
  }

  async setUsed(token) {
    await connection
      .update({ used: 1 })
      .where({ token: token })
      .table("tokens");
  }
}

module.exports = new CreateToken();
