import { useState } from "react";
import firebaseAppConfig from "../util/firebase-config";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const auth = getAuth(firebaseAppConfig);
const Login = () => {
  const [passwordType, setPasswordType] = useState("password");
  const [loader, setLoader] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [formValue, setFormValue] = useState({
    email: "",
    password: "",
  });
  const login = async (e) => {
    try {
      e.preventDefault();
      setLoader(true);
      await signInWithEmailAndPassword(
        auth,
        formValue.email,
        formValue.password
      );
      navigate("/");
    } catch (err) {
      setError("Inavalid credetailes");
    } finally {
      setLoader(false);
    }
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setFormValue({
      ...formValue,
      [name]: value,
    });
    setError(null);
  };
  return (
    <div className="grid md:grid-cols-2 md:h-screen md:overflow-hidden">
      <img
        src="/images/signup.jpg"
        alt="signup"
        className="md:h-full w-full h-[500px] object-cover"
      />
      <div className="flex flex-col md:p-16 p-8 justify-center">
        <h1 className="text-4xl font-bold">Signin</h1>
        <p className="text-lg text-gray-600">Enter Profile datails to Login</p>
        <form className="space-y-2 mt-8" onSubmit={login}>
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
            <p className="text-xl text-blue-600">Loading...</p>
          ) : (
            <button className="px-8 py-3 bg-blue-600 text-white font-semibold text-xl rounded-sm hover:bg-orange-600 duration-300">
              Signup
            </button>
          )}
        </form>

        <div className="mt-2">
          Don`t have an account ?
          <Link to="/signup" className="text-blue-600 font-semibold ml-1">
            Register Now
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

export default Login;
