import { read, write } from '../utils/model.js';

let categoriesController = {

  GET: (req, res) => {
    const categories = read("categories")
    const subcategories = read("subCategories");

    categories.map(category => {
        category.subcategories = subcategories.filter(subcategory => subcategory.category_id == category.category_id);

        category.subcategories.map(item => delete item.category_id)
    })
    
    res.send(categories)
},

  PARAMS: (req, res) => {
    const categories = read("categories")
    const subcategories = read("subCategories");
    const { id } = req.params;

    categories.map(category => {
      category.subcategories = subcategories.filter(subcategory => subcategory.category_id == category.category_id);
      
      category.subcategories.map(item => delete item.category_id)
    })

    res.send(categories.find(category => category.category_id == id));
  },

  POST: (req,  res) => {
    let categories = read('categories');
    let { category_name  } = req.body;
    try {
      let newSubCategory = { category_id: categories.at(-1)?.category_id + 1 || 1,  category_name }
      categories.push(newSubCategory);
      write('categories', categories);
      res.writeHead(201, { 'Content-Type': 'applicatin/json' })
      res.end(JSON.stringify({status: 201, message: 'New Category added'}))
    } catch (error) {
      res.writeHead(400, { 'Content-Type': 'applicatin/json' })
      res.end(JSON.stringify({status: 400, message: error.message}))
    }
  },

  DELETE: (req, res) => {
    let category = read('categories');
    let { categoryId } = req.body;
   
    try {
      const categoryIndex = category.findIndex( category => category.category_id == categoryId )

      if(categoryIndex == -1) {
        throw new Error('Category not found')
      }

      category.splice(categoryIndex, 1)
      write('categories', category)
      res.end(JSON.stringify({status: 200, message: 'Category deleted'}))
    } catch (error) {
      res.writeHead(400, { 'Content-Type': 'applicatin/json' })
      res.end(JSON.stringify({status: 400, message: error.message}))
    }
  },

  PUT: (req, res) => {
    let categories = read('categories');
    let { categoryName, categoryId } = req.body;

    try {
      const categoryFind = categories.find( category => category.category_id == categoryId)

    if (!categoryFind) {
      throw new Error('Category not found')
    }
    categoryFind.category_name = categoryName;
    write('categories', categories)
    res.writeHead(201, { 'Content-Type': 'applicatin/json' })
    res.end(JSON.stringify({status: 200, message: 'Category updated'}))
    } catch (error) {
      res.writeHead(400, { 'Content-Type': 'applicatin/json' })
      res.end(JSON.stringify({status: 400, message: error.message}))
    }
  }

  
};

export default categoriesController;