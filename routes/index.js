//Here you will import route files and export them as used in previous labs
import userRoutes from "./users.js";
import express from "express";

const constructorMethod = (app) => {
  app.use(express.json());

  app.use("/", userRoutes);

  app.use("*", (req, res) => {
    return res.status(404).json({ error: "Not found" });
  });
};

export default constructorMethod;
