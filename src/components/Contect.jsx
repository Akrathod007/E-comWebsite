import Layout from "./Layout";

const Contect = () => {
  return (
    <Layout>
      <div className="bg-white md:w-6/12 px-4 mx-auto md:border  shadow-lg my-10">
        <img src="/images/contact.jpg" alt="Contect" />
        <div className="p-8">
          <form className="space-y-2">
            <div className="flex flex-col">
              <label className="font-semibold text-lg mb-1">Fullname</label>
              <input
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
                type="email"
                name="email"
                required
                placeholder="xyz123@gmail.com"
                className="border p-3 border-gray-400 rounded"
              />
            </div>

            <div className="flex flex-col">
              <label className="font-semibold text-lg mb-1">Message</label>
              <textarea
                name="message"
                required
                placeholder="Enter Your Message..."
                className="border p-3 border-gray-400 rounded"
                rows={5}
              />
            </div>

            <button className="px-8 py-3 bg-blue-600 text-white font-semibold text-xl rounded-sm hover:bg-orange-600 duration-300">
              Submit
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Contect;
