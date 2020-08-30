import React, { useState, useEffect } from "react"; //usestate and use effect are component reloading stuff
import Base from "../core/Base";
import { Link } from "react-router-dom";
import {  getAllCategories, deleteaCategory,getaCategory } from "./helper/adminapicall";
import { isAuthenticated } from "../auth/helper";

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const { user, token } = isAuthenticated();

  const preload = () => {
    getAllCategories()
      .then((data) => {
        if (data.error) {
          console.log(data.error);
        } else {
          setCategories(data);
        }
      })
      .catch(console.log("Error in managing categories"));
  };

  useEffect(() => {
    preload();
  }, []);

  const deleteThisCategory = (categoryId) => {
    deleteaCategory(categoryId, user._id, token)
      .then((data) => {
        if (data.error) {
          console.log(data.error);
        } else {
          preload();
        }
      })
      .catch(console.log("Error in deleting the category"));

    };

  return (
    <Base title="Welcome admin" description="Manage products here">
      <h2 className="mb-4">All products:</h2>
      <Link className="btn btn-info" to={`/admin/dashboard`}>
        <span className="">Admin Home</span>
      </Link>

      <div className="row">
        <div className="col-12">
          <h2 className="text-center text-white my-3">
            Total categories are: {totalProductCount}
          </h2>
         
          
          {categories.map((category, index) => {
            return (
              <div key={index} className="row text-center mb-2 ">
                <div className="col-4">
                  <h3 className="text-white text-left">{category.name}</h3>
                </div>
                <div className="col-4">
                  <Link
                    className="btn btn-success"
                    to={`/admin/categories/update/${category._id}`}
                  >
                    <span className="">Update</span>
                  </Link>
                </div>
                <div className="col-4">
                  <button
                    onClick={() => {
                      deleteThisCategory(category._id);
                    }}
                    className="btn btn-danger"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}

          
        </div>
      </div>
    </Base>
  );
};

const totalProductCount = () => {
  //
};

export default ManageCategories;
