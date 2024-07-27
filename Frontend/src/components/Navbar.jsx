import React from "react";
import { TfiBlackboard } from "react-icons/tfi";

const Navbar = () => {
  return (
    <div className="flex justify-between">
      {/* Company Name - Left*/}
      <div className="text-primary flex items-center gap-3">
        <TfiBlackboard size={28} />
        <div className="text-white font-bold text-3xl">Headscraper</div>
      </div>
      {/* Button Interaction - Right */}
      <div>
        {/* List of call to actions */}
        <button className="py-3 px-6 bg-primary text-lg font-medium rounded-sm">Login</button>
      </div>
    </div>
  );
};

export default Navbar;
