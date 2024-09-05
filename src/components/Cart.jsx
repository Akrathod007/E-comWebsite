import Layout from "./Layout";
import { useState, useEffect } from "react";
import firebaseAppConfig from "../util/firebase-config";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import {
  getFirestore,
  getDocs,
  collection,
  query,
  where,
  doc,
  deleteDoc,
  serverTimestamp,
  addDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const auth = getAuth(firebaseAppConfig);
const db = getFirestore(firebaseAppConfig);

const Cart = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [address, setAddress] = useState(null);
  const [updateUi, setUpdateUi] = useState(false);
  const [session, setSession] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setSession(user);
      } else {
        setSession(null);
      }
    });
  }, []);

  useEffect(() => {
    if (session) {
      const req = async () => {
        const col = collection(db, "carts");
        const q = query(col, where("userId", "==", session.uid));
        const snapshot = await getDocs(q);
        const temp = [];
        snapshot.forEach((doc) => {
          const document = doc.data();
          document.cartId = doc.id;
          // console.log(document);
          temp.push(document);
        });
        console.log(temp);
        setProducts(temp);
      };
      req();
    }
  }, [session, updateUi]);

  useEffect(() => {
    const req = async () => {
      if (session) {
        const col = collection(db, "addresses");
        const q = query(col, where("userId", "==", session.uid));
        const snapshot = await getDocs(q);
        snapshot.forEach((doc) => {
          const document = doc.data();
          setAddress(document);
        });
      }
    };
    req();
  }, [session]);

  const getPrice = (products) => {
    let sum = 0;
    for (let item of products) {
      let amount = Math.round(item.price - (item.price * item.discount) / 100);
      sum = sum + amount;
    }
    return sum;
  };

  const removeCart = async (id) => {
    try {
      const ref = doc(db, "carts", id);
      await deleteDoc(ref);
      setUpdateUi(!updateUi);
    } catch (err) {
      console.log(err);
    }
  };

  const buyNow = async () => {
    try {
      // const amount = getPrice(products);
      for (let item of products) {
        let product = {
          ...item,
          userId: session.uid,
          status: "pending",
          email: session.email,
          customerName: session.displayName,
          createdAt: serverTimestamp(),
          address: address,
        };
        await addDoc(collection(db, "orders"), product);
        await removeCart(item.cartId);
      }
      navigate("/profile");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Layout>
      <div className="md:w-7/12 mx-auto border shadow-lg p-8 md:my-16 rounded-md bg-white">
        <div className="flex items-center gap-4">
          <i className="ri-shopping-cart-line text-4xl"></i>
          <h1 className="text-3xl text-gray-800">Cart</h1>
        </div>

        <hr className="my-6" />

        <div className="space-y-6">
          {products.map((item, index) => (
            <div key={index} className="flex gap-6">
              <img
                src={item.image}
                alt={item.image}
                className="w-[100px] border-3 border-white shadow"
              />

              <div className="flex flex-col">
                <h1 className="text-xl font-semibold text-slate-800">
                  {item.title}
                </h1>
                <div className="flex flex-col gap-4">
                  <div className="space-x-2">
                    <label className="text-lg font-semibold text-slate-800">
                      ₹ {item.price - (item.price * item.discount) / 100}
                    </label>
                    <del className="text-slate-600">{item.price}</del>
                    <label className="text-slate-600">
                      ({item.discount}% Off)
                    </label>
                  </div>
                  <button
                    onClick={() => removeCart(item.cartId)}
                    className="w-fit bg-rose-600 text-white px-4 py-2 rounded hover:bg-rose-900 duration-300"
                  >
                    <i className="ri-delete-bin-line mr-2"></i>
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <hr className="my-6" />
        <div className="space-y-2">
          <h1 className="text-2xl text-slate-800 font-semibold">
            Total : ₹{getPrice(products).toLocaleString()}
          </h1>
          {products.length > 0 && (
            <button
              onClick={buyNow}
              className="bg-green-600 rounded text-white py-2 px-3 hover:bg-rose-600 duration-300"
            >
              <i className="ri-shopping-bag-4-line mr-2"></i>
              Buy Now
            </button>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Cart;
