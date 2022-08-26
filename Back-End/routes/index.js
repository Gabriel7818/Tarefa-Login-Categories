const router = require('express').Router();

// Route in categories
const categoriesRoutes = require('./categories.routes');
router.use('/categories', categoriesRoutes);

// Route in products
const productsRoutes = require('./products.routes');
router.use('/products', productsRoutes);

// Route in users
const usersRoutes = require('./users.routes');
router.use('/users', usersRoutes);


module.exports = router;