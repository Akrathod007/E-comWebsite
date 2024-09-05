import Layout from "./Layout";
import firebaseAppConfig from "../util/firebase-config";
import { getAuth, onAuthStateChanged, updateProfile } from "firebase/auth";
import {
  getFirestore,
  addDoc,
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Swal from "sweetalert2";
import uploadFile from "../util/uploadFile";
const auth = getAuth(firebaseAppConfig);
const db = getFirestore(firebaseAppConfig);
const Profile = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [docId, setDocId] = useState(null);
  const [isUpdated, setIsupdated] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isAddress, setIsAddress] = useState(false);
  const [orders, setOrders] = useState([]);
  const [formValue, setFormValue] = useState({
    fullname: "",
    email: "",
  });

  const [addressFormValue, setAddressFormValue] = useState({
    address: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    userId: "",
    mobile: "",
  });

  // console.log(addressFormValue);
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setSession(user);
        // console.log(session);
      } else {
        setSession(false);
        navigate("/login");
      }
    });
  }, []);

  useEffect(() => {
    const res = async () => {
      if (session) {
        setFormValue({
          ...formValue,
          fullname: session.displayName,
          mobile: session.phoneNumber ? session.mobile : "",
        });

        setAddressFormValue({
          ...addressFormValue,
          userId: session.uid,
        });

        //fetch address data
        const col = collection(db, "addresses");
        const q = query(col, where("userId", "==", session.uid));
        const snapshot = await getDocs(q);
        setIsAddress(!snapshot.empty);
        snapshot.forEach((doc) => {
          setDocId(doc.id);
          const address = doc.data();
          // console.log(address);
          setAddressFormValue({
            ...addressFormValue,
            ...address,
          });
        });
      }
    };

    res();
  }, [session, isUpdated]);

  useEffect(() => {
    const req = async () => {
      if (session) {
        const col = collection(db, "orders");
        const q = query(col, where("userId", "==", session.uid));
        const snapshot = await getDocs(q);
        const temp = [];
        snapshot.forEach((doc) => {
          temp.push(doc.data());
        });
        setOrders(temp);
      }
    };

    req();
  }, [session]);

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setFormValue({
      ...formValue,
      [name]: value,
    });
  };

  const handleAddressForm = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setAddressFormValue({
      ...addressFormValue,
      [name]: value,
    });
  };

  // setProfile Picture
  const setProfilePicture = async (e) => {
    const input = e.target;
    const file = input.files[0];
    const fileNameArray = file.name.split(".");
    const extension = fileNameArray[fileNameArray.length - 1];
    const fileName = Date.now() + "." + extension;
    const path = `pictures/${fileName}`;
    setUploading(true);

    const url = await uploadFile(file, path);
    await updateProfile(auth.currentUser, {
      photoURL: url,
    });
    setUploading(false);
    setSession({
      ...session,
      photoURL: url,
    });
    // console.log(url);
  };

  const saveProfileInfo = async (e) => {
    try {
      e.preventDefault();
      await updateProfile(auth.currentUser, {
        displayName: formValue.fullname,
        phoneNumber: formValue.mobile,
      });
      new Swal({
        icon: "success",
        title: "Profile Saved !",
      });
    } catch (err) {
      new Swal({
        icon: "Failed",
        title: "Profile Not Saved",
      });
    }
  };

  // Address form submit function
  const setAddress = async (e) => {
    try {
      e.preventDefault();
      await addDoc(collection(db, "addresses"), addressFormValue);
      setIsAddress(true);
      setIsupdated(!isUpdated);
      new Swal({
        icon: "success",
        title: "Address Saved",
      });
      // console.log(addressFormValue);
    } catch (err) {
      new Swal({
        icon: "Failed",
        title: "Address Not Saved",
        text: err.message,
      });
    }
  };
  const updateAddress = async (e) => {
    try {
      e.preventDefault();
      const ref = doc(db, "addresses", docId);
      await updateDoc(ref, addressFormValue);
      new Swal({
        icon: "success",
        title: "Address Updated",
      });
    } catch (err) {
      new Swal({
        icon: "Failed",
        title: "Address Not Saved",
        text: err.message,
      });
    }
  };

  useEffect(() => {
    const req = async () => {
      if (session) {
        const col = collection(db, "orders");
        const q = query(col, where("userId", "==", session.uid));
        const snapshot = await getDocs(q);
        const temp = [];
        snapshot.forEach((doc) => {
          temp.push(doc.data());
        });
        setOrders(temp);
      }
    };
    req();
  }, [session]);

  const getStatusColor = (status) => {
    if (status == "processing") {
      return "bg-blue-600";
    } else if (status == "pending") {
      return "bg-indigo-600";
    } else if (status == "dispatched") {
      return "bg-red-600";
    } else if (status == "returned") {
      return "bg-orange-600";
    } else {
      return "bg-cyan-600";
    }
  };

  if (session === null) {
    return (
      <div className="bg-gray-100 h-full fixed top-0 left-0 w-full flex justify-center items-center">
        <span className="relative flex h-6 w-6">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-6 w-6 bg-sky-500"></span>
        </span>
      </div>
    );
  }

  return (
    <Layout>
      <div className="md:w-7/12 mx-auto border shadow-lg p-8 md:my-16 rounded-md bg-white">
        <div className="flex items-center gap-4">
          <i className="ri-shopping-cart-line text-4xl"></i>
          <h1 className="text-3xl text-gray-800">Orders</h1>
        </div>

        <hr className="my-6" />

        {orders.map((item, index) => (
          <div key={index} className="flex gap-3 mb-8">
            <img src={item.image} alt={item.image} className="w-[100px]" />
            <div>
              <h1 className="font-semibold capitalize text-lg">{item.title}</h1>
              <p className="text-gray-600">
                {item.description.slice(0, 50)}...
              </p>

              <div className="space-x-2">
                <label className="font-semibold text-lg">
                  ₹{item.price - (item.price * item.discount) / 100}
                </label>
                <del className="text-gray-600">₹{item.price}</del>
                <label className="text-gray-600">({item.discount}Off)%</label>
              </div>
              <button
                className={`${getStatusColor(
                  item.status
                )} py-2 px-4 mt-2 w-fit text-white text-xl font-semibold rounded-md hover:bg-orange-600 duration-300`}
              >
                {item.status ? item.status : "Pending"}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="md:w-7/12 mx-auto border shadow-lg p-8 md:my-16 rounded-md bg-white">
        <div className="flex items-center gap-4">
          <i className="ri-user-line text-4xl"></i>
          <h1 className="text-3xl text-gray-800">Profile</h1>
        </div>

        <hr className="my-6" />

        <div className="w-24 h-24 mx-auto relative mb-6">
          {uploading ? (
            <img src="/images/loader.gif" className="rounded-full w-24 h-24" />
          ) : (
            <img
              src={session.photoURL ? session.photoURL : "/images/avatar.jpg"}
              className="rounded-full w-24 h-24"
            />
          )}

          <input
            type="file"
            accept="image/*"
            className="opacity-0 absolute top-0 left-0 w-full h-full"
            onChange={setProfilePicture}
          />
        </div>

        <form className="grid grid-cols-2 gap-6" onSubmit={saveProfileInfo}>
          <div className="flex flex-col gap-2">
            <label>Fullname</label>
            <input
              onChange={handleChange}
              type="text"
              name="fullname"
              value={formValue.fullname}
              required
              className="p-2 rounded border border-gray-300"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label>Email</label>
            <input
              onChange={handleChange}
              readOnly
              type="text"
              name="email"
              value={session.email}
              required
              className="p-2 rounded border border-gray-300"
            />
          </div>

          <div />

          <button className="bg-rose-600 py-2 px-6 w-fit text-white text-xl font-semibold rounded-md hover:bg-orange-600 duration-300 col-span-2">
            <i className="ri-save-line mr-2"></i>
            Save
          </button>
        </form>
      </div>

      <div className="md:w-7/12 mx-auto border shadow-lg p-8 md:my-16 rounded-md bg-white">
        <div className="flex items-center gap-4">
          <i className="ri-link-unlink-m text-4xl"></i>
          <h1 className="text-3xl text-gray-800">Delivery Address</h1>
        </div>

        <hr className="my-6" />

        <form
          className="grid grid-cols-2 gap-6"
          onSubmit={isAddress ? updateAddress : setAddress}
        >
          <div className="flex flex-col gap-2 col-span-2">
            <label>Area/Street/Village</label>
            <input
              onChange={handleAddressForm}
              type="text"
              name="address"
              value={addressFormValue.address}
              required
              className="p-2 rounded border border-gray-300"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label>City</label>
            <input
              onChange={handleAddressForm}
              type="text"
              name="city"
              value={addressFormValue.city}
              required
              className="p-2 rounded border border-gray-300"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label>State</label>
            <input
              onChange={handleAddressForm}
              type="text"
              name="state"
              value={addressFormValue.state}
              required
              className="p-2 rounded border border-gray-300"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label>Country</label>
            <input
              onChange={handleAddressForm}
              type="text"
              name="country"
              value={addressFormValue.country}
              required
              className="p-2 rounded border border-gray-300"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label>Pincode</label>
            <input
              onChange={handleAddressForm}
              type="number"
              name="pincode"
              value={addressFormValue.pincode}
              required
              className="p-2 rounded border border-gray-300"
            />
          </div>
          <div className="flex flex-col gap-2 col-span-2">
            <label>Mobile</label>
            <input
              onChange={handleAddressForm}
              type="number"
              name="mobile"
              value={addressFormValue.mobile}
              required
              className="p-2 rounded border border-gray-300"
            />
          </div>
          {isAddress ? (
            <button className="bg-rose-600 py-2 px-6 w-fit text-white text-xl font-semibold rounded-md hover:bg-orange-600 duration-300">
              <i className="ri-save-line mr-2"></i>
              Save
            </button>
          ) : (
            <button className="bg-rose-600 py-2 px-6 w-fit text-white text-xl font-semibold rounded-md hover:bg-orange-600 duration-300">
              <i className="ri-save-line mr-2"></i>
              Submit
            </button>
          )}
        </form>
      </div>
    </Layout>
  );
};
export default Profile;
