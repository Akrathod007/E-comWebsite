import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import firebaseAppConfig from "../../util/firebase-config";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

const auth = getAuth(firebaseAppConfig);
function Layout({ children }) {
  const [size, setSize] = useState(300);
  const [mobileSize, setMobileSize] = useState(0);
  const [session, setSession] = useState(null);
  const [showDetails, setShowDeatails] = useState(false);
  const location = useLocation();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setSession(user);
      } else {
        setSession(null);
      }
    });
  }, []);
  const menus = [
    {
      label: "Dashboard",
      icon: <i className="ri-dashboard-3-line mr-2"></i>,
      link: "/admin/dashboard",
    },
    {
      label: "Products",
      icon: <i className="ri-shopping-cart-line mr-2"></i>,
      link: "/admin/products",
    },
    {
      label: "Orders",
      icon: <i className="ri-shape-line mr-2"></i>,
      link: "/admin/orders",
    },
    {
      label: "Customers",
      icon: <i className="ri-user-3-line mr-2"></i>,
      link: "/admin/customers",
    },
    {
      label: "Payments",
      icon: <i className="ri-money-dollar-circle-line mr-2"></i>,
      link: "/admin/payments",
    },
    {
      label: "Settings",
      icon: <i className="ri-settings-3-line mr-2"></i>,
      link: "/admin/settings",
    },
  ];
  return (
    <>
      {/* Desktop */}
      <div className="md:block hidden">
        <aside
          className="h-full bg-violet-600 fixed top-0 left-0 overflow-hidden"
          style={{
            width: size,
            transition: "0.4s",
          }}
        >
          <div className="flex flex-col gap-3">
            {menus.map((item, index) => (
              <Link
                key={index}
                to={item.link}
                className="px-4 py-3 text-gray-50 text-[17.5px] hover:bg-[#e11d473d]"
                style={{
                  background: location.pathname === item.link && "#E11D48",
                }}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
            <button
              className="text-left px-4 py-3 text-gray-50 text-[17.5px] hover:bg-rose-600 hover:text-white"
              onClick={() => signOut(auth)}
            >
              <i className="ri-logout-circle-r-line mr-2"></i>
              Logout
            </button>
          </div>
        </aside>
        <section
          className="min-h-screen bg-gray-200"
          style={{
            marginLeft: size,
            transition: "0.4s",
          }}
        >
          <nav className="flex justify-between p-6 items-center bg-white sticky top-0 left-0">
            <div className="flex gap-4 items-center">
              <button
                onClick={() => setSize(size == 300 ? 0 : 300)}
                className="border-2 px-2 py-1 font-semibold text-xl"
              >
                <i className="ri-menu-2-fill"></i>
              </button>
              <h1 className="text-2xl font-semibold text-blue-700">
                E - ComOnline
              </h1>
            </div>

            <div>
              <button className="relative">
                <img
                  src="/images/avatar.jpg"
                  alt=""
                  width="50px"
                  onClick={() => setShowDeatails(!showDetails)}
                />

                {showDetails && (
                  <div className="absolute top-12 right-0 p-3 bg-gray-300 w-[200px] rounded-md">
                    <div className="flex flex-col gap-3 font-semibold">
                      <h1>
                        {session && session.displayName
                          ? session.displayName
                          : "Admin"}
                      </h1>
                      <p>
                        {session && session.email
                          ? session.email
                          : "Admin@123gmail.com"}
                      </p>
                      <div className="h-px border border-slate-600"></div>
                      <button
                        className="text-white text-2xl bg-slate-500 rounded-md"
                        onClick={() => signOut(auth)}
                      >
                        <i className="ri-logout-circle-line"></i>
                      </button>
                    </div>
                  </div>
                )}
              </button>
            </div>
          </nav>
          <div className="p-6 min-h-[100%]">{children}</div>
        </section>
      </div>

      {/* Mobile */}

      <div className="md:hidden block">
        <aside
          className="h-full bg-violet-600 fixed top-0 left-0 overflow-hidden"
          style={{
            width: mobileSize,
            transition: "0.4s",
          }}
        >
          <div className="flex flex-col gap-3">
            <button
              onClick={() => setMobileSize(mobileSize == 0 ? 300 : 0)}
              className="text-left mx-3 my-2 py-2 px-3 border-2 w-fit font-semibold text-xl text-white"
            >
              <i className="ri-menu-2-fill"></i>
            </button>
            {menus.map((item, index) => (
              <Link
                key={index}
                to={item.link}
                className="px-4 py-3 text-gray-50 text-[17.5px] hover:bg-[#e11d473d]"
                style={{
                  background: location.pathname === item.link && "#E11D48",
                }}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
            <button
              className="text-left px-4 py-3 text-gray-50 text-[17.5px] hover:bg-rose-600 hover:text-white"
              onClick={() => signOut(auth)}
            >
              <i className="ri-logout-circle-r-line mr-2"></i>
              Logout
            </button>
          </div>
        </aside>
        <section
          className="min-h-screen bg-gray-200"
          style={{
            marginLeft: mobileSize,
            transition: "0.4s",
          }}
        >
          <nav className="flex justify-between p-6 items-center bg-white sticky top-0 left-0">
            <div className="flex gap-4 items-center">
              <button
                onClick={() => setMobileSize(mobileSize == 0 ? 300 : 0)}
                className="border-2 px-2 py-1 font-semibold text-xl"
              >
                <i className="ri-menu-2-fill"></i>
              </button>
              <h1 className="text-2xl font-semibold text-blue-700">
                E - ComOnline
              </h1>
            </div>

            <div>
              <button className="relative">
                <img
                  src="/images/avatar.jpg"
                  alt=""
                  width="50px"
                  onClick={() => setShowDeatails(!showDetails)}
                />

                {showDetails && (
                  <div className="absolute top-12 right-0 p-3 bg-gray-300 w-[200px] rounded-md">
                    <div className="flex flex-col gap-3 font-semibold">
                      <h1>
                        {session && session.displayName
                          ? session.displayName
                          : "Admin"}
                      </h1>
                      <p>
                        {session && session.email
                          ? session.email
                          : "Admin@123gmail.com"}
                      </p>
                      <div className="h-px border border-slate-600"></div>
                      <button
                        className="text-white text-2xl bg-slate-500 rounded-md"
                        onClick={() => signOut(auth)}
                      >
                        <i className="ri-logout-circle-line"></i>
                      </button>
                    </div>
                  </div>
                )}
              </button>
            </div>
          </nav>
          <div className="p-6 min-h-[100%]">{children}</div>
        </section>
      </div>
    </>
  );
}

export default Layout;
