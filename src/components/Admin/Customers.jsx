import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import firebaseAppConfig from "../../util/firebase-config";
import { getFirestore, getDocs, collection } from "firebase/firestore";
import moment from "moment";
const db = getFirestore(firebaseAppConfig);

function Customers() {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const req = async () => {
      const snapshot = await getDocs(collection(db, "customers"));
      const temp = [];
      snapshot.forEach((doc) => {
        const document = doc.data();
        temp.push(document);
      });
      console.log(temp);
      setCustomers(temp);
    };
    req();
  }, []);

  return (
    <Layout>
      <div>
        <div className="flex border-2 w-fit h-12">
          <h1 className="text-2xl text-orange-600 font-semibold">Customers</h1>
          <i className="ri-arrow-right-double-line text-4xl text-orange-600"></i>
        </div>
        <div className="mt-3">
          <table className="w-full">
            <thead className="bg-red-500 text-white">
              <tr className="text-left">
                <th className="p-3">Customer Name</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((item, index) => (
                <tr
                  key={index}
                  style={{
                    background: (index + 1) % 2 === 0 ? "gray" : "#f1f5f9",
                  }}
                >
                  <td className="p-3 flex gap-2">
                    <img
                      src="/images/avatar.jpg"
                      alt="customer"
                      width={50}
                      className="rounded-full"
                    />
                    <div>
                      <h1>{item.customerName}</h1>
                    </div>
                  </td>
                  <td>{item.email}</td>
                  <td>{item.mobile}</td>
                  <td>{moment(item.createdAt).format("DD MMM YYYY")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}

export default Customers;
