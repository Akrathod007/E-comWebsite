import React from "react";

function NotFound() {
  return (
    <div className="h-screen flex flex-col gap-5 justify-center items-center">
      <h1 className="font-semibold text-6xl text-indigo-500 underline">
        Not Found
      </h1>
      <img src="/images/notfound.svg" alt="notfound" width={600} />
    </div>
  );
}

export default NotFound;
