import React, { useEffect, useState } from "react";
import Layout from "./Layout";
import firebaseAppConfig from "../../util/firebase-config";
import {
  getFirestore,
  getDocs,
  collection,
  updateDoc,
  doc,
} from "firebase/firestore";
import Swal from "sweetalert2";
import moment from "moment";

const db = getFirestore(firebaseAppConfig);

function Order() {
  const [orders, setOrders] = useState([]);
  const [toggleAddress, settoggleAddress] = useState(false);
  const [toggleIndex, setToggleIndex] = useState(null);

  useEffect(() => {
    const req = async () => {
      const snapshot = await getDocs(collection(db, "orders"));
      const temp = [];
      snapshot.forEach((doc) => {
        const order = doc.data();
        order.orderId = doc.id;
        temp.push(order);
      });
      setOrders(temp);
    };
    req();
  }, []);

  const updateOrderStatus = async (e, orderId) => {
    try {
      const status = e.target.value;
      const ref = doc(db, "orders", orderId);
      await updateDoc(ref, { status: status });
      new Swal({
        icon: "success",
        title: "Order Status Updated !",
      });
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <Layout>
      <div>
        <div className="flex border-2 w-fit h-12">
          <h1 className="text-2xl text-orange-600 font-semibold">Orders</h1>
          <i className="ri-arrow-right-double-line text-4xl text-orange-600"></i>
        </div>
        <div className="mt-3">
          <table className="w-full">
            <thead className="bg-red-500 text-white">
              <tr>
                <th className="p-3">OrderId</th>
                <th>Customer Name</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Product</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Address</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((item, index) => (
                <tr
                  key={index}
                  className="text-center"
                  style={{
                    background: (index + 1) % 2 === 0 ? "gray" : "#f1f5f9",
                  }}
                >
                  <td className="p-3">{item.orderId}</td>
                  <td>{item.customerName}</td>
                  <td>{item.email}</td>
                  <td>
                    {item.address ? item.address.mobile : "Updated Required!"}
                  </td>
                  <td>{item.title}</td>
                  <td>₹ {item.price.toLocaleString()}</td>
                  <td>
                    {moment(item.createdAt.toDate()).format(
                      "DD MMM YYYY, hh:mm:ss A"
                    )}
                  </td>
                  <td>
                    <button
                      className="text-blue-600 font-medium"
                      onClick={() => {
                        setToggleIndex(index);
                        settoggleAddress(!toggleAddress);
                      }}
                    >
                      Browse Address
                    </button>
                    {toggleAddress && toggleIndex === index && (
                      <div className="animate__animated animate__flipInX">
                        {`${item.address.address},${item.address.city},${item.address.state},${item.address.country},${item.address.pincode},Mob- ${item.address.mobile}`}
                      </div>
                    )}
                  </td>
                  <td className="border-red-700">
                    <select
                      className="border p-1 border-gray-200"
                      onChange={(e) => updateOrderStatus(e, item.orderId)}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="dispatched">Dispatched</option>
                      <option value="returned">Returned</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}

export default Order;
