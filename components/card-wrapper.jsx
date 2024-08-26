import React from "react";

const CardWrapper = ({ children }) => {
  return (
    <div className="p-5 min-[400px]:p-7 text-white bg-slate-950 w-11/12 min-[400px]:w-10/12 sm:w-8/12 md:w-6/12 lg:w-5/12">
      {children}
    </div>
  );
};

export default CardWrapper;
