import { read, write } from '../utils/model.js';

let productsController = {
  GET: (req, res) => res.json(read('products')),

  PARAMS: (req, res) => {
    const products = read("products")
    const { id } = req.params;

    res.send(products.find(product => product.product_id == id));
  },

  QUERY: (req, res) => {
    const subcategories = read("subCategories");
    const categories = read('categories');
    const products = read('products');

    const { categoryId, subCategoryId, model } = req.query;

    let query;

    for (const item of products) {
      
      if (subCategoryId) {
        query = products.filter(product => product.sub_category_id == subCategoryId)
      } else if (model) {
        query = products.filter(product => product.model == model)
      } else if (model && subCategoryId) {
        query = products.filter(product => product.model == model && product.sub_category_id == subCategoryId)
      } else if  ( categoryId ) {
        query = categories.filter(product => product.category_id == categoryId)
      }

        if(!categoryId){
          let filterd =  products.filter((e)=> {
            let ByTittle = subCategoryId ? e.sub_category_id == subCategoryId : true
            let Byid = model ? e.model == model : true
            return ByTittle && Byid
          })
        
        }else{
          let sub =  read('subCategories')
          let filter = []
          products.filter((e)=>{
            return sub.filter((element)=> {
              if(element.category_id == categoryId){
                if(element.sub_category_id == e.sub_category_id){
                  filter.push(e)
                }
              }
            } )
          })
          res.send(filter)
        }
      

      
    }
    res.send(query);

  },

  POST: (req,  res) => {
    let products = read('products');
    let { sub_category_id, product_name, price, color, model  } = req.body;
    try {
      

      let newProduct = { product_id: products.at(-1)?.product_id + 1 || 1,  sub_category_id, product_name, price, color, model }
      products.push(newProduct);
      write('products', products);
      res.writeHead(201, { 'Content-Type': 'applicatin/json' })
      res.end(JSON.stringify({status: 201, message: 'New Product added'}))
    } catch (error) {
      res.writeHead(400, { 'Content-Type': 'applicatin/json' })
      res.end(JSON.stringify({status: 400, message: error.message}))
    }
  },

  DELETE: (req, res) => {
    let products = read('products');
    let { productId } = req.body;
   
    try {
      const productIndex = products.findIndex( product => product.product_id == productId )

      if(productIndex == -1) {
        throw new Error('User not found')
      }

      products.splice(productIndex, 1)
      write('products', products)
      res.writeHead(201, { 'Content-Type': 'applicatin/json' })
      res.end(JSON.stringify({status: 200, message: 'Product deleted'}))
    } catch (error) {
      res.writeHead(400, { 'Content-Type': 'applicatin/json' })
      res.end(JSON.stringify({status: 400, message: error.message}))
    }
  },

  PUT: (req, res) => {
    let products = read('products');
    let { productName, productId } = req.body;

    try {
      const productFind = products.find( product => product.product_id ==  productId)

    if (!productFind) {
      throw new Error('User not found')
    }
    productFind.product_name = productName;
    write('products', products)
    res.writeHead(201, { 'Content-Type': 'applicatin/json' })
    res.end(JSON.stringify({status: 200, message: 'Product updated'}))
    } catch (error) {
      res.writeHead(400, { 'Content-Type': 'applicatin/json' })
      res.end(JSON.stringify({status: 400, message: error.message}))
    }
  }

};

export default productsController;
