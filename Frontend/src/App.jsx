import { useState } from "react";
import { TfiBlackboard } from "react-icons/tfi";
import { FaGoogle } from "react-icons/fa";

import Navbar from "./components/Navbar";
import Modal from "./components/Modal";

import { LoginContext } from "./contexts/LoginContext";

function App() {
  const [openModal, setOpenModal] = useState(false);
  return (
    <div className="bg-secondary h-screen">
      <LoginContext.Provider value={{ openModal, setOpenModal }}>
        {/* Navbar */}
        <div className="py-8 px-16">
          <Navbar />
        </div>
        {/* Pop up Modal for Login */}
        <Modal open={openModal} onClose={() => setOpenModal(false)}>
          <div className="flex flex-col justify-start text-white">
            {/* Company Name */}
            <div className="text-primary flex items-center gap-3">
              <TfiBlackboard size={28} />
              <div className="text-white font-bold text-xl">Headscraper</div>
            </div>
            {/* Login  */}
            <div className="flex flex-col py-5">
              <div className="font-bold text-2xl">Log In</div>
              <div className="text-md">or create an account</div>
            </div>
            {/* Google Login Button */}
            <button className="flex items-center gap-2 bg-primary text-secondary rounded-lg px-16 py-2 font-semibold">
              <FaGoogle size={15} />
              <div>Continue with Google</div>
            </button>
          </div>
        </Modal>
      </LoginContext.Provider>
    </div>
  );
}

export default App;
