class UserController {
  async create(req, res) {
    res.send("sou um controller");
  }
}

module.exports = new UserController();
