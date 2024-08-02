import { TfiBlackboard } from "react-icons/tfi";
import { LoginContext } from "../contexts/LoginContext";
import { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import Modal from "./Modal";
import { CgProfile } from "react-icons/cg";

const Navbar = () => {
  const { setOpenLoginModal } = useContext(LoginContext);
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);

  // Profile Page Modal
  const [open, setOpen] = useState(false);

  // Handle Logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    window.location.reload();
  };

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
        {!isAuthenticated ? (
          <button
            className="py-2 px-6 bg-primary text-lg font-medium rounded-sm shadow-lg shadow-primary/50 hover:bg-primary/90 delay-50"
            onClick={() => setOpenLoginModal(true)}
          >
            Login
          </button>
        ) : (
          <button
            className="p-2 bg-primary text-lg font-medium rounded-full shadow-lg shadow-primary/50 hover:bg-primary/90 delay-50"
            onClick={() => {
              setOpen(true);
            }}
          >
            <CgProfile size={25} />
          </button>
        )}
        {/* Modal for profile */}
        <Modal open={open} onClose={() => setOpen(false)}>
          <div className="flex flex-col text-white">
            {/* Company Name */}
            <div className="text-primary flex items-center gap-3">
              <TfiBlackboard size={28} />
              <div className="text-white font-bold text-lg">Headscraper</div>
            </div>
            {/* Profile */}
            <div className="flex flex-col py-5 gap-2">
              <div className="font-bold text-2xl">Profile</div>
              <div className="text-md">Hello <span className="italic">{localStorage.getItem("email")}</span>! 👋</div>
            </div>
            {/* Logout */}
            <div className="flex">
              <button
                onClick={() => setOpen(false)}
                className="w-[50%] flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-secondary rounded-lg px-24 py-2 font-semibold"
              >
                <div>Cancel</div>
              </button>
              <button
                onClick={() => {
                  handleLogout();
                  setOpen(false);
                }}
                className="w-[50%] flex justify-center items-center"
              >
                <div>Sign Out</div>
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Navbar;
