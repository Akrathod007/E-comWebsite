import React, { useEffect, useState } from "react";
import Layout from "./Layout";
import firebaseAppConfig from "../../util/firebase-config";
import Swal from "sweetalert2";
import {
  getFirestore,
  addDoc,
  collection,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import uploadFile from "../../util/uploadFile";

const db = getFirestore(firebaseAppConfig);

function Product() {
  const [products, setProducts] = useState([]);
  const [productModel, setProductModel] = useState(false);
  const [applyCloseAnimation, setApplyCloseAnimation] = useState(false);
  const [isUpdated, setIsupdated] = useState(false);
  const model = {
    title: "",
    price: "",
    discount: "",
    description: "",
  };

  const [productFormValue, setProductFormValue] = useState(model);
  const [edit, setEdit] = useState(null);

  const handleProductValue = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setProductFormValue({
      ...productFormValue,
      [name]: value,
    });
  };

  const handleModelOpen = () => {
    setApplyCloseAnimation(false);
    setProductModel(true);
  };

  const handleModelClose = () => {
    setApplyCloseAnimation(true);
    setTimeout(() => {
      setProductModel(false);
    }, 700);
  };

  useEffect(() => {
    const req = async () => {
      const snapshot = await getDocs(collection(db, "products"));
      const temp = [];
      snapshot.forEach((doc) => {
        const allProducts = doc.data();
        allProducts.id = doc.id;
        temp.push(allProducts);
      });
      setProducts(temp);
      console.log(products);
    };
    req();
  }, [isUpdated]);

  const createProduct = async (e) => {
    try {
      e.preventDefault();
      await addDoc(collection(db, "products"), productFormValue);
      setProductFormValue(model);
      handleModelClose();
      setIsupdated(!isUpdated);
      new Swal({
        icon: "success",
        title: "Product Added",
      });
    } catch (err) {
      new Swal({
        icon: "error",
        title: "Failed !",
        text: err.message,
      });
    }
  };

  const editProduct = (item) => {
    setEdit(item);
    setProductFormValue(item);
    setProductModel(true);
  };

  const deleteProduct = async (id) => {
    try {
      const ref = doc(db, "products", id);
      await deleteDoc(ref);
      setIsupdated(!isUpdated);
    } catch (err) {
      new Swal({
        icon: "error",
        title: "Failed to delete this product",
      });
    }
  };
  const handleProductImage = async (e, id) => {
    const input = e.target;
    const file = input.files[0];
    const path = `products/${Date.now()}.jpg`;
    const url = await uploadFile(file, path);
    const ref = doc(db, "products", id);
    await updateDoc(ref, { image: url });
    // console.log(url);
    setIsupdated(!isUpdated);
  };

  const saveProduct = async (e) => {
    try {
      e.preventDefault();
      const ref = doc(db, "products", edit.id);
      await updateDoc(ref, productFormValue);
      setProductFormValue(model);
      setProductModel(false);
      setEdit(null);
      setIsupdated(!isUpdated);
    } catch (err) {
      new Swal({
        icon: "error",
        title: "Failed to update this product",
      });
    }
  };
  return (
    <Layout>
      <div>
        <div className="flex justify-between items-center">
          <div className="flex border-2 w-fit h-12">
            <h1 className="text-2xl text-orange-600 font-semibold">Products</h1>
            <i className="ri-arrow-right-double-line text-4xl text-orange-600"></i>
          </div>

          <button
            className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-sm"
            onClick={handleModelOpen}
          >
            <i className="ri-sticky-note-add-line mr-2"></i>
            New Product
          </button>
        </div>
        <div className="grid md:grid-cols-4 gap-8">
          {products.map((item, index) => (
            <div key={index} className="bg-white rounded-md shadow-lg">
              <div className="relative">
                {}
                <img
                  src={item.image ? item.image : "/images/avatar.jpg"}
                  alt={item.image}
                  className="rounded-t-md w-full h-[270px] object-cover"
                />
                <input
                  type="file"
                  className="absolute bg-red-500 w-full h-full top-0 left-0 opacity-0 cursor-pointer"
                  onChange={(e) => handleProductImage(e, item.id)}
                />
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <h1 className="font-semibold text-md">{item.title}</h1>
                  <div className="space-x-2">
                    <button onClick={() => editProduct(item)}>
                      <i className="ri-edit-box-line text-violet-600"></i>
                    </button>
                    <button onClick={() => deleteProduct(item.id)}>
                      <i className="ri-delete-bin-6-line text-rose-600"></i>
                    </button>
                  </div>
                </div>
                <div className="flex gap-2 mt-2">
                  <label>
                    ₹ {item.price - (item.price * item.discount) / 100}
                  </label>
                  <del className="font-semibold">₹ {item.price}</del>
                  <label className="text-gray-600">
                    ({item.discount}% Off)
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>

        {productModel && (
          <div
            className={`animate__animated ${
              applyCloseAnimation ? "animate__fadeOut" : "animate__fadeIn"
            }  bg-black bg-opacity-80 absolute top-0 left-0 w-full h-full flex justify-center items-center`}
          >
            <div
              className={`animate__animated
               ${applyCloseAnimation ? "animate__zoomOut" : "animate__zoomIn"}
              w-5/12 relative bg-white px-6 py-5 border border-1 rounded-sm`}
            >
              <button
                className="absolute top-2 right-2 bg-red-600 py-2 px-3 text-white rounded-lg"
                onClick={handleModelClose}
              >
                <i className="ri-close-line text-lg"></i>
              </button>
              <h1 className="text-lg- font-semibold">New Product</h1>
              <form
                className="grid grid-cols-2 gap-6 mt-4"
                onSubmit={edit ? saveProduct : createProduct}
              >
                <input
                  required
                  type="text"
                  name="title"
                  placeholder="Enter Your product title"
                  className="col-span-2 border p-2 border-gray-300 rounded"
                  onChange={handleProductValue}
                  value={productFormValue.title}
                />
                <input
                  required
                  type="number"
                  name="price"
                  placeholder="Enter Your product title"
                  className="border p-2 border-gray-300 rounded"
                  onChange={handleProductValue}
                  value={productFormValue.price}
                />
                <input
                  required
                  type="number"
                  name="discount"
                  placeholder="Enter Your product title"
                  className="border p-2 border-gray-300 rounded"
                  onChange={handleProductValue}
                  value={productFormValue.discount}
                />
                <textarea
                  required
                  name="description"
                  placeholder="Enter Your product title"
                  className="col-span-2 border p-2 border-gray-300 rounded"
                  rows={5}
                  onChange={handleProductValue}
                  value={productFormValue.description}
                />

                <div>
                  <button className="bg-indigo-600 text-white rounded py-2 px-4 hover:bg-pink-700 duration-300">
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Product;
