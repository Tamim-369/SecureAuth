import React from "react";

const UserAuthLayout = ({ children }) => {
  return (
    <div className="h-full flex items-center justify-center font-sans">
      {children}
    </div>
  );
};

export default UserAuthLayout;
