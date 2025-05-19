import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex-grow mb-14">
      {children}
    </div>
  );
};

export default Layout;
