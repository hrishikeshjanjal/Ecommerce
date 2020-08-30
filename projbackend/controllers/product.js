const Product = require("../models/product");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs"); //to access filepath of image, by default provided! by nodejs.

exports.getProductById = (req, res, next, id) => {
  Product.findById(id)
    .populate("category")
    .exec((err, product) => {
      if (err) {
        return res.status(400).json({
          error: "Product not Found!",
        });
      }
      req.product = product;
      next();
    });
};

exports.createProduct = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "Problem with image!",
      });
    }

    //destructure the fields:
    const { name, price, description, stock, category } = fields;
    if (!price || !stock || !category || !name || !description) {
      return res.status(400).json({
        error: "Please include all fields!",
      });
    }

    let product = new Product(fields);

    //handle file here
    if (file.photo) {
      if (product.photo.size > 3000000) {
        return res.status(400).json({
          error: "File size too big!",
        });
      }
      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }
    // console.log(product);
    //save to DB (product is created time to save)
    product.save((err, product) => {
      if (err) {
        res.status(400).json({
          error: "saving Tshirt in DB failed!",
        });
      }
      res.json(product);
    });
  });
};

exports.getProduct = (req, res) => {
  req.product.photo = undefined;
  return res.json(req.product);
};

//middleware for optimisation //if u want to remove then remove undefined line from getProduct()
exports.photo = (req, res, next) => {
  if (req.product.photo.data) {
    res.set("Content-Type", req.product.photo.contentType);
    return res.send(req.product.photo.data);
  }
  next();
};

//delete controllers
exports.deleteProduct = (req, res) => {
  let product = req.product;
  product.remove((err, deletedProduct) => {
    if (err) {
      return res.status(400).json({
        error: "failed to delete product from DB",
      });
    }
    res.json({
      message: "Deletion was Successful!",
      deletedProduct,
    });
  });
};

//update controllers
exports.updateProduct = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "Problem with image!",
      });
    }

    //updation code
    let product = req.product;
    product = _.extend(product, fields);

    //handle file here
    if (file.photo) {
      if (product.photo.size > 3000000) {
        return res.status(400).json({
          error: "File size too big!",
        });
      }
      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }

    //save to DB (product is created time to save)
    product.save((err, product) => {
      if (err) {
        res.status(400).json({
          error: "Updation of Product failed in DB!",
        });
      }
      res.json(product);
    });
  });
};

//product listing
exports.getAllProducts = (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 8;
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";

  Product.find()
    .select("-photo")
    .populate("category")
    .sort([[sortBy, "asc"]])
    .limit(limit)
    .exec((err, products) => {
      if (err) {
        return res.status(400).json({
          error: "No product Found!",
        });
      }
      res.json(products);
    });
};

exports.getAllUniqueCategories = (req, res) => {
  Product.distinct("category", {}, (err, category) => {
    if (err) {
      res.status(400).json({
        error: "No category Found!",
      });
    }
    res.json(category);
  });
};

exports.updateStock = (req, res, next) => {
  //parameters passing
  let myOperations = req.body.order.products.map((prod) => {
    return {
      updateOne: {
        filter: { _id: prod._id },
        update: { $inc: { stock: -prod.count, sold: +prod.count } },
      },
    };
  });

  //options passing if any else pass null/empty
  //callback
  Product.bulkWrite(myOperations, {}, (err, products) => {
    if (err) {
      return res.status(400).json({
        error: "Bulk operation failed!",
      });
    }
    next();
  });
};
