import { read, write} from '../utils/model.js';

let subCategoriesController = {

  GET: (req, res) => {
    const subcategories = read("subCategories");
    const products = read('products');

    subcategories.map(product => {
      product.subcategories = products.filter(subcategory => subcategory.sub_category_id == product.sub_category_id);

      product.subcategories.map(item => delete item.sub_category_id)
    })
    
    res.send(subcategories)
},

  PARAMS: (req, res) => {
    const subcategories = read("subCategories");
    const products = read('products');
    const { id } = req.params;

    subcategories.map(product => {
      product.subcategories = products.filter(subcategory => subcategory.sub_category_id == product.sub_category_id);
      
      product.subcategories.map(item => delete item.sub_category_id)
    })

    res.send(subcategories.find(category => category.sub_category_id == id));
  },

  POST: (req,  res) => {
    let subCategories = read('subCategories');
    let { category_id, sub_category_name  } = req.body;
    try {
      let newSubCategory = { sub_category_id: subCategories.at(-1)?.sub_category_id + 1 || 1,  category_id, sub_category_name }
      subCategories.push(newSubCategory);
      write('subCategories', subCategories);
      res.writeHead(201, { 'Content-Type': 'applicatin/json' })
      res.end(JSON.stringify({status: 201, message: 'New SubCategory added'}))
    } catch (error) {
      res.writeHead(400, { 'Content-Type': 'applicatin/json' })
      res.end(JSON.stringify({status: 400, message: error.message}))
    }
  },

  DELETE: (req, res) => {
    let subCategory = read('subCategories');
    let { subCategoryId } = req.body;
   
    try {
      const subCategoryIndex = subCategory.findIndex( sub => sub.sub_category_id == subCategoryId )

      if(subCategoryIndex == -1) {
        throw new Error('SubCategory not found')
      }

      subCategory.splice(subCategoryIndex, 1)
      write('subCategories', subCategory)
      res.end(JSON.stringify({status: 200, message: 'SubCategory deleted'}))
    } catch (error) {
      res.writeHead(400, { 'Content-Type': 'applicatin/json' })
      res.end(JSON.stringify({status: 400, message: error.message}))
    }
  },

  PUT: (req, res) => {
    let subCategories = read('subCategories');
    let { subCategoryName, subCategoryId } = req.body;

    try {
      const subCategoryFind = subCategories.find( sub => sub.sub_category_id == subCategoryId)

    if (!subCategoryFind) {
      throw new Error('SubCategory not found')
    }
    subCategoryFind.sub_category_name = subCategoryName;
    write('subCategories', subCategories)
    res.writeHead(201, { 'Content-Type': 'applicatin/json' })
    res.end(JSON.stringify({status: 200, message: 'subCategory updated'}))
    } catch (error) {
      res.writeHead(400, { 'Content-Type': 'applicatin/json' })
      res.end(JSON.stringify({status: 400, message: error.message}))
    }
  }
};

export default subCategoriesController;