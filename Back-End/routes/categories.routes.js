const categoriesRoutes = require('express').Router();
const categories = require('../controllers/categories.controller');
const { validarToken } = require('../middlewares/auth');


categoriesRoutes.get("/all", validarToken, categories.findAll);

categoriesRoutes.get("/all/pages/:page", validarToken, categories.findAllPages);

categoriesRoutes.get("/show/:id", validarToken, categories.findOne);

categoriesRoutes.post("/create", validarToken, categories.create);

categoriesRoutes.put("/update", validarToken, categories.update);

categoriesRoutes.delete("/delete/:id", validarToken, categories.delete);

module.exports = categoriesRoutes;