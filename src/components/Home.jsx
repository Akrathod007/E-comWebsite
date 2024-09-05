import Layout from "./Layout";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// import required modules
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

import firebaseAppConfig from "../util/firebase-config";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  addDoc,
  collection,
  getDocs,
  getFirestore,
  serverTimestamp,
  query,
  where,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
const auth = getAuth(firebaseAppConfig);
const db = getFirestore(firebaseAppConfig);
const Home = ({ slider, title = "Latest Products" }) => {
  const [products, setProducts] = useState([]);
  const [session, setSession] = useState(null);
  const [address, setAddress] = useState(null);
  const [updateUi, setUpdateUi] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setSession(user);
      } else {
        setSession(false);
      }
    });
  });

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
    };
    req();
  });

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

  const addTocart = async (item) => {
    try {
      item.userId = session.uid;
      await addDoc(collection(db, "carts"), item);
      setUpdateUi(!updateUi);
      new Swal({
        icon: "success",
        title: "Product Added !",
      });
    } catch {
      new Swal({
        icon: "error",
        title: "Failed !",
        text: err.message,
      });
    }
  };

  const buyNow = async (product) => {
    try {
      const col = collection(db, "addresses");
      const q = query(col, where("userId", "==", session.uid));
      const snapshot = await getDocs(q);
      if (snapshot.empty) {
        new Swal({
          icon: "info",
          title: "Please update your address",
          // confirm: () => alert(),
        }).then((result) => {
          if (result.isConfirmed) {
            navigate("/profile#address");
          }
        });
        return false;
      }
      product.userId = session.uid;
      product.status = "Pending";
      product.email = session.email;
      product.customerName = session.displayName;
      product.createdAt = serverTimestamp();
      product.address = address;

      await addDoc(collection(db, "orders"), product);
      navigate("/profile");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Layout update={updateUi}>
      <div>
        {slider && (
          <header>
            <Swiper
              spaceBetween={30}
              centeredSlides={true}
              autoplay={{
                delay: 2500,
                disableOnInteraction: false,
              }}
              pagination={{
                clickable: true,
              }}
              navigation={true}
              modules={[Autoplay, Pagination, Navigation]}
              className="mySwiper"
            >
              <SwiperSlide>
                <img src="/images/p1.jpg" alt="p1.jpg" />
              </SwiperSlide>
              <SwiperSlide>
                <img src="/images/p2.jpg" alt="p2.jpg" />
              </SwiperSlide>
              <SwiperSlide>
                <img src="/images/p3.jpg" alt="p3.jpg" />
              </SwiperSlide>
              <SwiperSlide>
                <img src="/images/p4.jpg" alt="p4.jpg" />
              </SwiperSlide>
              <SwiperSlide>
                <img src="/images/p5.jpg" alt="p5.jpg" />
              </SwiperSlide>
              <SwiperSlide>
                <img src="/images/c1.jpg" alt="c1.jpg" />
              </SwiperSlide>
            </Swiper>
          </header>
        )}

        <div className="md:p-16 p-8">
          <h1 className="text-center font-bold text-orange-600 text-6xl">
            {title}
          </h1>
          <p className="md:w-7/12 mt-2 mb-8 mx-auto text-center text-blue-700 font-semibold">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae
            nostrum blanditiis ea cumque non ex atque impedit ratione mollitia,
            eum et doloremque adipisci consequatur quasi rerum culpa dolore
            maiores molestias!
          </p>
          <div className="md:w-10/12 mx-auto py-10 grid md:grid-cols-4 gap-12">
            {products.map((item, index) => (
              <div key={index} className="bg-white shadow-lg border">
                <img
                  src={item.image ? item.image : "/images/avatar.jpg"}
                  alt={item.image}
                  className="w-full h-[500px] object-cover"
                />
                <div className="p-4">
                  <h1 className="text-lg font-bold">{item.title}</h1>
                  <div className="flex gap-3 items-center">
                    <label className="font-bold text-xl">
                      {item.price - (item.price * item.discount) / 100}
                    </label>
                    <del className="text-slate-800">{item.price}</del>
                    <label className="text-slate-800">
                      ({item.discount}% Off)
                    </label>
                  </div>
                  <button
                    className="bg-green-500 hover:bg-green-900  py-2 w-full rounded text-white font-semibold mt-4 duration-500"
                    onClick={() => buyNow(item)}
                  >
                    Buy Now
                  </button>
                  <button
                    className="bg-rose-500 hover:bg-rose-900 py-2 w-full rounded text-white font-semibold mt-4 duration-500"
                    onClick={() => addTocart(item)}
                  >
                    <i className="ri-shopping-cart-line mr-2"></i>
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
