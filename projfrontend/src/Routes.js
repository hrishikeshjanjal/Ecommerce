import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Home from "./core/Home";
import Signup from "./user/Signup";
import Signin from "./user/Signin";
import AdminRoute from "./auth/helper/AdminRoutes";
import PrivateRoute from "./auth/helper/PrivateRoutes";
import UserDashBoard from "./user/UserDashBoard";
import AdminDashBoard from "./user/AdminDashBoard";
import addCategory from "./admin/AddCategory";
import ManageCategories from "./admin/ManageCategories";
import AddProduct from "./admin/AddProduct";
import ManageProducts from "./admin/ManageProducts";
import UpdateProduct from "./admin/UpdateProduct";
import cart from "./core/cart";

const Routes = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Home}></Route>
        <Route path="/signup" exact component={Signup}></Route>
        <Route path="/signin" exact component={Signin}></Route>
         <Route path="/cart" exact component={cart}></Route>
        <PrivateRoute
          path="/user/dashboard"
          exact
          component={UserDashBoard}
        ></PrivateRoute>
        <AdminRoute
          path="/admin/dashboard"
          exact
          component={AdminDashBoard}
        ></AdminRoute>
        <AdminRoute
          path="/admin/create/category"
          exact
          component={addCategory}
        ></AdminRoute>
        <AdminRoute
          path="/admin/categories"
          exact
          component={ManageCategories}
        ></AdminRoute>
        <AdminRoute
          path="/admin/create/product"
          exact
          component={AddProduct}
        ></AdminRoute>
        <AdminRoute
          path="/admin/products"
          exact
          component={ManageProducts}
        ></AdminRoute>
        <AdminRoute
          path="/admin/product/update/:productId"
          exact
          component={UpdateProduct}
        ></AdminRoute>
        <AdminRoute
          path="/admin/categories/update/:categoryId"
          exact
          component={ManageCategories}
        ></AdminRoute>
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;
