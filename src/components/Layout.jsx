import React from "react";
import Sidebar from "./Sidebar";

function Layout({ children }) {
  return (
    <div className="flex h-screen overflow-hidden bg-black">
      <Sidebar />
      <div className="ml-[240px] flex-1 flex flex-col min-w-0 overflow-y-auto">
        <div className="p-9 px-8 w-full box-border">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Layout;