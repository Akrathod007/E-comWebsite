import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import firebaseAppConfig from "../util/firebase-config";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

const auth = getAuth(firebaseAppConfig);
const db = getFirestore(firebaseAppConfig);
const Layout = ({ children, update }) => {
  const [open, setOpen] = useState(0);
  const [accounrMenu, setAccountMenu] = useState(false);
  const [session, setSession] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setSession(user);
        // console.log(session);
      } else {
        setSession(false);
      }
    });
  }, []);

  useEffect(() => {
    if (session) {
      const req = async () => {
        const col = collection(db, "customers");
        const q = query(col, where("userId", "==", session.uid));
        const snapshot = await getDocs(q);
        snapshot.forEach((doc) => {
          const customer = doc.data();
          setRole(customer.role);
        });
      };

      req();
    }
  }, [session]);

  useEffect(() => {
    if (session) {
      const req = async () => {
        const col = collection(db, "carts");
        const q = query(col, where("userId", "==", session.uid));
        const snapshot = await getDocs(q);
        setCartCount(snapshot.size);
        // console.log(snapshot.empty);
        // console.log(cartCount);
      };
      req();
    }
  }, [session, update]);

  const mobileLink = (href) => {
    navigate(href);
    // setOpen(false);
  };
  const menus = [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Product",
      href: "/Product",
    },
    {
      label: "Category",
      href: "/category",
    },
    {
      label: "Contect Us",
      href: "/contect-us",
    },
  ];

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
    <div>
      {/* Navbar */}
      <nav className="sticky top-0 right-0 bg-white shadow-lg z-10">
        <div className="w-10/12 mx-auto flex justify-between items-center">
          <img src="/images/logo.png" alt="Logo" width={100} />

          <button
            className="md:hidden"
            onClick={() => setOpen(open === 0 ? 300 : 0)}
          >
            <i className="ri-menu-3-fill text-3xl"></i>
          </button>
          <ul className="md:flex gap-8 items-center hidden">
            {menus.map((menu, index) => (
              <li key={index}>
                <Link
                  to={menu.href}
                  className="block py-8 text-center hover:bg-blue-600 hover:text-white w-[100px] duration-300 font-semibold"
                >
                  {menu.label}
                </Link>
              </li>
            ))}
            {session && cartCount > 0 && (
              <Link to="/cart" className="relative">
                <i className="ri-shopping-cart-line text-xl"></i>
                <div
                  className="absolute -top-4 -right-4 font-bold text-white text-xs bg-rose-600 rounded-full
              w-6 h-6 flex justify-center items-center"
                >
                  {cartCount}
                </div>
              </Link>
            )}
            {!session && (
              <>
                <Link
                  to="/login"
                  className="block py-8 text-center hover:bg-blue-600 hover:text-white w-[100px] duration-300 font-semibold"
                >
                  Login
                </Link>

                <Link
                  to="/signup"
                  className="block px-8 py-4 bg-blue-600 text-white hover:bg-orange-600 rounded-sm duration-300 font-semibold"
                >
                  Register
                </Link>
              </>
            )}

            {session && (
              <button
                onClick={() => setAccountMenu(!accounrMenu)}
                className="relative"
              >
                <img
                  src={
                    session.photoURL ? session.photoURL : "/images/avatar.jpg"
                  }
                  alt="avatar"
                  className="rounded-full w-16 h-16"
                />
                {accounrMenu && (
                  <div className="absolute border-2 shadow-lg bg-white w-[150px] p-2 flex flex-col items-start gap-2">
                    <Link
                      to="/profile"
                      className="w-full text-left px-3 py-2 hover:bg-gray-300"
                    >
                      <i className="ri-user-line mr-2"></i>
                      Profile
                    </Link>
                    <Link
                      to="/cart"
                      className="w-full text-left px-3 py-2 hover:bg-gray-300"
                    >
                      <i className="ri-shopping-cart-line mr-2"></i>
                      Cart
                    </Link>
                    <div className="h-px w-full bg-slate-500 my-2"></div>
                    <button
                      className="w-full px-3 py-2 bg-red-600 text-white"
                      onClick={() => signOut(auth)}
                    >
                      <i className="ri-logout-circle-r-line mr-2"></i>
                      Logout
                    </button>
                  </div>
                )}
              </button>
            )}
          </ul>
        </div>
      </nav>

      <div>{children}</div>
      {/* Footer */}
      <footer className="bg-orange-600 py-14">
        <div className="w-10/12 mx-auto grid md:grid-cols-4">
          <div>
            <h1 className="text-white font-semibold text-2xl mb-3">
              Website Links
            </h1>

            <ul className="text-slate-300 space-y-2">
              {menus.map((menu, index) => (
                <li key={index}>
                  <Link to={menu.href}>{menu.label}</Link>
                </li>
              ))}

              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/signup">Register</Link>
              </li>
            </ul>
          </div>
          <div>
            <h1 className="text-white font-semibold text-2xl mb-3">
              Follow Us
            </h1>

            <ul className="text-slate-300 space-y-2">
              <li>
                <Link to="/">Facebook</Link>
              </li>
              <li>
                <Link to="/">Instagram</Link>
              </li>
              <li>
                <Link to="/">Telegram</Link>
              </li>
              <li>
                <Link to="/">Github</Link>
              </li>
              <li>
                <Link to="/">Twitter</Link>
              </li>
            </ul>
          </div>
          <div>
            <h1 className="text-white font-semibold text-2xl mb-3">
              Brand Detailes
            </h1>

            <p className="text-slate-300 mb-6">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              Quibusdam nostrum pariatur asperiores facilis ratione alias id
              deleniti voluptates nam reprehenderit.
            </p>

            <img
              src="/images/logo.png"
              alt="Logo"
              width={100}
              className="rounded-sm"
            />
          </div>
          <div>
            <h1 className="text-white font-semibold text-2xl mb-3">
              Contact Us
            </h1>

            <form className="space-y-3">
              <input
                type="text"
                required
                placeholder="Enter Your Name"
                className="bg-white w-full p-3 rounded-sm"
              />

              <input
                type="email"
                required
                placeholder="Enter Your Email"
                className="bg-white w-full p-3 rounded-sm"
              />

              <textarea
                className="bg-white w-full p-3 rounded-sm"
                required
                placeholder="Enter Meassage..."
                rows={3}
              ></textarea>

              <button className="bg-blue-600 px-6 py-3 text-white font-semibold text-xl rounded-md hover:bg-blue-800 duration-300">
                Submit
              </button>
            </form>
          </div>
        </div>
      </footer>

      <aside
        className="md:hidden overflow-hidden z-50 bg-slate-900 shadow-lg fixed top-0 left-0 h-full"
        style={{
          width: open,
          transition: "0.4s",
        }}
      >
        <div className="flex flex-col p-8 gap-6">
          {session && (
            <button
              onClick={() => setAccountMenu(!accounrMenu)}
              className="relative"
            >
              <div className="flex gap-5">
                <img
                  src={
                    session.photoURL ? session.photoURL : "/images/avatar.jpg"
                  }
                  alt="avatar"
                  className="rounded-full w-16 h-16"
                />

                <div>
                  <p className="text-slate-100 text-xl font-semibold">
                    {session.displayName}
                  </p>
                  <p className="text-slate-100 text-md font-semibold">
                    {session.email}
                  </p>
                </div>
              </div>
              {accounrMenu && (
                <div className="absolute border-2 shadow-lg bg-white w-[150px] p-2 flex flex-col items-start gap-2">
                  <Link
                    to="/profile"
                    className="w-full text-left px-3 py-2 hover:bg-gray-300"
                  >
                    <i className="ri-user-line mr-2"></i>
                    Profile
                  </Link>
                  <Link
                    to="/cart"
                    className="w-full text-left px-3 py-2 hover:bg-gray-300"
                  >
                    <i className="ri-shopping-cart-line mr-2"></i>
                    Cart
                  </Link>
                  <div className="h-px w-full bg-slate-500 my-2"></div>
                  <button
                    className="w-full px-3 py-2 bg-red-600 text-white"
                    onClick={() => signOut(auth)}
                  >
                    <i className="ri-logout-circle-r-line mr-2"></i>
                    Logout
                  </button>
                </div>
              )}
            </button>
          )}
          {menus.map((menu, index) => (
            <button
              className="text-white"
              key={index}
              onClick={() => mobileLink(menu.href)}
            >
              {menu.label}
            </button>
          ))}
        </div>
      </aside>
    </div>
  );
};

export default Layout;
