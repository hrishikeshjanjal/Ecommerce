const User = require("../models/user");
const Order = require("../models/order");
const order = require("../models/order");

exports.getUserById = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "No User found in DB",
      });
    }
    req.profile = user;
    next();
  });
};

exports.getUser = (req, res) => {
  //TODO:get back here for password
  req.profile.salt = undefined; //""
  req.profile.encry_password = undefined;
  req.profile.createdAt = undefined; //""
  req.profile.updatedAt = undefined; //""

  return res.json(req.profile);
};

/*
//assignment route
exports.getAllUsers = (req, res) => {
  User.find().exec((err,users)=>{
    if(err||!users){
      return res.status(400).json({
        error: "No User found in DB",
      });
    }
    res.json(users);
  })
};
*/

exports.updateUser = (req, res) => {
  User.findByIdAndUpdate(
    { _id: req.profile._id },
    { $set: req.body },
    { new: true, useFindAndModify: false },
    (err, user) => {
      if (err) {
        return res.status(400).json({
          error: "You are not authorized to update this USER",
        });
      }
      res.json(user);
      user.salt = undefined;
      user.encry_password = undefined;
    }
  );
};

exports.userPurchaseList = (req, res) => {
  Order.find({ user: req.profile._id })
    .populate("user", "_id name")
    .exec((err, order) => {
      if (err) {
        return res.status(400).json({
          error: "No Order in this Account",
        });
      }
      return res.json(order);
    });
};

//middleware
exports.pushOrderInPurchaseList = (req, res, next) => {
  let purchases = [];
  req.body.order.products.forEach((product) => {
    purchases.push({
      _id: product._id,
      name: product.name,
      description: product.description,
      category: product.category,
      quantity: product.quantity,
      amount: req.body.order.amount,
      transaction_id: req.body.order.transaction_id,
    });
  });

  //store this in db
  User.findOneAndUpdate(
    { _id: req.profile._id },
    { $push: { purchases: purchases } },
    { new: true },
      //send me the new uodate object from database and not the old one
      
      (err,purchases) => {
        if(err){
        return res.status(400).json({
          error: "Unable to save Purchase List",
        });
      }
      next();
      }
  );
};
