//Here is where you'll set up your server as shown in lecture code
// This file should set up the express server as shown in the lecture code
import express from "express";
import configRoutesFunction from "./routes/index.js";
import exphbs from "express-handlebars";
import path from "path";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.engine("handlebars", exphbs.engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
// app.set("views", "./views")

configRoutesFunction(app);

app.listen(PORT, () => {
  console.log(`Your routes will be running on http://localhost:${PORT}`);
});
