import React, { useState } from "react";
import Layout from "./Layout";

function Payment() {
  const [payments, setPayments] = useState([
    {
      paymentId: "#rty45678",
      customerName: "er saurav",
      email: "ersaurav@gmail.com",
      mobile: "+91 9472395194",
      product: "lenovo ideapad 360",
      amount: 52000,
      date: "12-10-2024 10:15:14 Am",
    },
    {
      paymentId: "#rty45678",
      customerName: "er saurav",
      email: "ersaurav@gmail.com",
      mobile: "+91 9472395194",
      product: "lenovo ideapad 360",
      amount: 52000,
      date: "12-10-2024 10:15:14 Am",
    },
    {
      paymentId: "#rty45678",
      customerName: "er saurav",
      email: "ersaurav@gmail.com",
      mobile: "+91 9472395194",
      product: "lenovo ideapad 360",
      amount: 52000,
      date: "12-10-2024 10:15:14 Am",
    },
    {
      paymentId: "#rty45678",
      customerName: "er saurav",
      email: "ersaurav@gmail.com",
      mobile: "+91 9472395194",
      product: "lenovo ideapad 360",
      amount: 52000,
      date: "12-10-2024 10:15:14 Am",
    },
    {
      paymentId: "#rty45678",
      customerName: "er saurav",
      email: "ersaurav@gmail.com",
      mobile: "+91 9472395194",
      product: "lenovo ideapad 360",
      amount: 52000,
      date: "12-10-2024 10:15:14 Am",
    },
    {
      paymentId: "#rty45678",
      customerName: "er saurav",
      email: "ersaurav@gmail.com",
      mobile: "+91 9472395194",
      product: "lenovo ideapad 360",
      amount: 52000,
      date: "12-10-2024 10:15:14 Am",
    },
  ]);
  return (
    <Layout>
      <div>
        <div className="flex border-2 w-fit h-12">
          <h1 className="text-2xl text-orange-600 font-semibold">Payments</h1>
          <i className="ri-arrow-right-double-line text-4xl text-orange-600"></i>
        </div>
        <div className="mt-3">
          <table className="w-full">
            <thead className="bg-red-500 text-white">
              <tr>
                <th className="p-3">Payement Id</th>
                <th>Customer Name</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Product</th>
                <th>Amount</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((item, index) => (
                <tr
                  className="text-center"
                  key={index}
                  style={{
                    background: (index + 1) % 2 === 0 ? "gray" : "#f1f5f9",
                  }}
                >
                  <td className="p-3">{item.paymentId}</td>
                  <td>{item.customerName}</td>
                  <td>{item.email}</td>
                  <td>{item.mobile}</td>
                  <td className="capitalize">{item.product}</td>
                  <td>{item.amount.toLocaleString()}</td>
                  <td>{item.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}

export default Payment;
