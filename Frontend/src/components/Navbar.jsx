import { TfiBlackboard } from "react-icons/tfi";
import { LoginContext } from "../contexts/LoginContext";
import { useContext } from "react";

const Navbar = () => {
  const { setOpenLoginModal } = useContext(LoginContext);
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
        <button 
        className="py-2 px-6 bg-primary text-lg font-medium rounded-sm shadow-lg shadow-primary/50 hover:bg-primary/90 delay-50"
        onClick={() => setOpenLoginModal(true)}
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Navbar;
