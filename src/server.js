import express from 'express';
import cors from 'cors';

import productsController from './controllers/products.controller.js';
import categoriesController from './controllers/categories.controller.js'
import subCategoriesController from './controllers/subcategories.controller.js'

const PORT = process.env.PORT || 5000;

const app = express();
app.use( cors() );
app.use( express.json() )

app.get('/products/:id', productsController.PARAMS);
app.get('/products', productsController.QUERY);
app.get('/categories', categoriesController.GET);
app.get('/categories/:id', categoriesController.PARAMS);
app.get('/subCategories', subCategoriesController.GET);
app.get('/subCategories/:id', subCategoriesController.PARAMS);

app.post('/products', productsController.POST);
app.post('/subCategories', subCategoriesController.POST);
app.post('/categories', categoriesController.POST);

app.delete('/products', productsController.DELETE)
app.delete('/categories', categoriesController.DELETE)
app.delete('/subCategories', subCategoriesController.DELETE)


app.put('/products', productsController.PUT)
app.put('/subCategories', subCategoriesController.PUT)
app.put('/categories', categoriesController.PUT)



app.listen(PORT, () => console.log(`server ready at ${PORT}`))