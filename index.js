const express = require("express");
const router = require("./routes/routes");
const app = express();

//url encoded
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//setando rotas
app.use("/", router);

app.listen(3000, (erro) => {
  if (erro) {
    console.log("erro ao execultar servidor");
  } else {
    console.log("servidor online");
  }
});
