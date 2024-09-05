import { useState } from "react";
import Layout from "./Layout";

const Category = () => {
  const [category, setCategory] = useState([
    {
      title: "Electronics",
      icon: <i class="ri-headphone-fill text-6xl"></i>,
    },
    {
      title: "Fashion",
      icon: <i class="ri-handbag-fill text-6xl"></i>,
    },
    {
      title: "Smartphones",
      icon: <i class="ri-smartphone-fill text-6xl"></i>,
    },
    {
      title: "Furnitures",
      icon: <i class="ri-sofa-fill text-6xl"></i>,
    },
    {
      title: "Men's Trend",
      icon: <i class="ri-user-fill text-6xl"></i>,
    },
    {
      title: "Women's Trend",
      icon: <i class="ri-user-fill text-6xl"></i>,
    },
    {
      title: "Accessories",
      icon: <i class="ri-cup-fill text-6xl"></i>,
    },
    {
      title: "Toys",
      icon: <i class="ri-mickey-fill text-6xl"></i>,
    },
  ]);
  return (
    <Layout>
      <div className="md:p-16 p-8">
        <h1 className="text-center font-bold text-orange-600 text-6xl mb-12">
          Category
        </h1>
        <div className="md:w-10/12 mx-auto grid md:grid-cols-4 md:gap-16 gap-8">
          {category.map((item, index) => (
            <div
              key={index}
              className="p-8 border-2 border-orange-500 flex flex-col justify-center items-center rounded hover:bg-orange-600 hover:text-white duration-500"
            >
              {item.icon}
              <h1 className="text-2xl">{item.title}</h1>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Category;
