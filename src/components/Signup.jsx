import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import firebaseAppConfig from "../util/firebase-config";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import {
  getFirestore,
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
const auth = getAuth(firebaseAppConfig);
const db = getFirestore(firebaseAppConfig);
const Signup = () => {
  const navigate = useNavigate();
  const [passwordType, setPasswordType] = useState("password");
  const [error, setError] = useState(null);
  const [loader, setLoader] = useState(false);
  const [formValue, setFormValue] = useState({
    fullname: "",
    email: "",
    mobile: "",
    password: "",
  });

  const handleChange = (e) => {
    const input = e.target;
    const name = input.name;
    const value = input.value;
    // console.log(name, value);

    setFormValue({
      ...formValue,
      [name]: value,
    });
    setError(null);
  };
  const signup = async (e) => {
    try {
      e.preventDefault();
      setLoader(true);
      const userCre = await createUserWithEmailAndPassword(
        auth,
        formValue.email,
        formValue.password
      );
      await updateProfile(auth.currentUser, {
        displayName: formValue.fullname,
      });

      await addDoc(collection(db, "customers"), {
        email: formValue.email,
        customerName: formValue.fullname,
        userId: userCre.user.uid,
        mobile: formValue.mobile,
        role: "user",
        createdAt: serverTimestamp(),
      });
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoader(false);
    }
  };
  return (
    <div className="grid md:grid-cols-2 md:h-screen md:overflow-hidden">
      <img
        src="/images/signup.jpg"
        alt="signup"
        className="md:h-full w-full h-[500px]"
      />
      <div className="flex flex-col p-16 justify-center">
        <h1 className="text-4xl font-bold">New User</h1>
        <p className="text-lg text-gray-600">
          Create your account to start shopping
        </p>
        <form className="space-y-2 mt-8" onSubmit={signup}>
          <div className="flex flex-col">
            <label className="font-semibold text-lg mb-1">Fullname</label>
            <input
              onChange={handleChange}
              type="text"
              name="fullname"
              required
              placeholder="Er Rahul"
              className="border p-3 border-gray-400 rounded"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-semibold text-lg mb-1">Email</label>
            <input
              onChange={handleChange}
              type="email"
              name="email"
              required
              placeholder="xyz123@gmail.com"
              className="border p-3 border-gray-400 rounded"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-semibold text-lg mb-1">Mobile</label>
            <input
              onChange={handleChange}
              type="number"
              name="mobile"
              required
              placeholder="9876543210"
              className="border p-3 border-gray-400 rounded"
            />
          </div>

          <div className="flex flex-col relative">
            <label className="font-semibold text-lg mb-1">Password</label>
            <input
              onChange={handleChange}
              type={passwordType}
              name="password"
              required
              placeholder="**********"
              className="border p-3 border-gray-400 rounded"
              rows={5}
            />
            <button
              type="button"
              onClick={() =>
                setPasswordType(
                  passwordType === "password" ? "text" : "password"
                )
              }
              className="absolute top-11 right-4 w-8 h-8 rounded-full hover:bg-blue-200 hover:text-blue-600"
            >
              {passwordType === "password" ? (
                <i className="ri-eye-line"></i>
              ) : (
                <i className="ri-eye-off-line"></i>
              )}
            </button>
          </div>

          {loader ? (
            <h1 className=" text-lg font-semibold text-gray-600">Loading...</h1>
          ) : (
            <button className="px-8 py-3 bg-blue-600 text-white font-semibold text-xl rounded-sm hover:bg-orange-600 duration-300">
              Signup
            </button>
          )}
        </form>

        <div className="mt-2">
          Already have an account ?
          <Link to="/login" className="text-blue-600 font-semibold ml-1">
            Signin
          </Link>
        </div>

        {error && (
          <div className="flex justify-between mt-2 bg-rose-600 text-white font-semibold p-3 rounded shadow animate__animated animate__pulse">
            <p>{error}</p>
            <button onClick={() => setError(null)}>
              <i className="ri-close-line"></i>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Signup;
