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
}

module.exports = new CreateToken();
