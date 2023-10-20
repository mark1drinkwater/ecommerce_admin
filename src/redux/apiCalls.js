import { loginFailure, loginStart, loginSuccess } from "./userRedux";
import { publicRequest, userRequest } from "../requestMethods";

import {
  getProductFailure, getProductSuccess, getProductStart,
  deleteProductFailure, deleteProductStart, deleteProductSuccess, 
  updateProductFailure, updateProductStart, updateProductSuccess,
  addProductFailure, addProductStart, addProductSuccess
} from "./productRedux";

import
{
  getUsersStart, getUsersSuccess, getUsersFailure,
  deleteUserFailure, deleteUserStart, deleteUserSuccess,
  updateUserStart, updateUserSuccess, updateUserFailure
}
from "./userRedux";

// LOGIN
export const login = async (dispatch, user) => {
  dispatch(loginStart());
  try {
    const res = await publicRequest.post("/auth/login", user);
    dispatch(loginSuccess(res.data));
  } catch (err) {
    console.log("Login failed", err)
    dispatch(loginFailure());
  }
};
// GET PRODUCTS
export const getProducts = async (dispatch) => {
  dispatch(getProductStart());
  try {
    const res = await publicRequest.get("/products/?category=all");
    dispatch(getProductSuccess(res.data));
  } catch (err) {
    dispatch(getProductFailure());
  }
};
//DELETE PRODUCT
export const deleteProduct = async (id, dispatch) => {
  dispatch(deleteProductStart());
  try {
    const res = await userRequest.delete(`/products/${id}`);
    dispatch(deleteProductSuccess(res.data));
  } catch (err) {
    dispatch(deleteProductFailure());
  }
};
//UPDATE PRODUCT
export const updateProduct = async (id, product, dispatch) => {
  dispatch(updateProductStart());
  try {
    const res = await userRequest.put(`/products/${id}`, product);
    console.log("Product successfully updated")
    dispatch(updateProductSuccess({ id: id, product: product }));
  } catch (err) {
    console.log("Error updating product", err)
    dispatch(updateProductFailure());
  }
};
//ADD PRODUCT
export const addProduct = async (product, dispatch) => {
  dispatch(addProductStart());
  try {
    const res = await userRequest.post(`/products`, product);
    dispatch(addProductSuccess(res.data));
  } catch (err) {
    dispatch(addProductFailure());
  }
};

// USERS
// GET USERS
export const getUsers = async (dispatch) => {
  dispatch(getUsersStart());
  try {
    const res = await userRequest.get("/users");
    dispatch(getUsersSuccess(res.data));
  } catch (err) {
    console.log("Getting users failed", err);
    dispatch(getUsersFailure());
  }
};

//USER
// DELETE USER
export const deleteUser = async (id, dispatch) => {
  dispatch(deleteUserStart());
  try {
    const res = await userRequest.delete(`/users/${id}`);
    dispatch(deleteUserSuccess(res.data));
  } catch (err) {
    dispatch(deleteUserFailure());
  }
};

// UPDATE USER
export const updateUser = async (id, user, dispatch) => {
  dispatch(updateUserStart());
  try {
    const res = await userRequest.put(`/users/${id}`, user);
    console.log("User successfully updated")
    dispatch(updateUserSuccess({ id: id, user: user }));
  } catch (err) {
    console.log("Error updating user", err)
    dispatch(updateUserFailure());
  }
};