const express = require("express");
const router = require("./routes/routes");
const app = express();
const cors = require("cors");

//url encoded
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//setando cors (bloqueia requisições externas)
app.use(cors());

//setando rotas
app.use("/", router);

app.listen(3000, (erro) => {
  if (erro) {
    console.log("erro ao execultar servidor");
  } else {
    console.log("servidor online");
  }
});
