import { useState } from "react";

import Navbar from "./components/Navbar";
import Modal from "./components/Modal";

import { LoginContext } from "./contexts/LoginContext";

function App() {
  const [openModal, setOpenModal] = useState(false);
  return (
    <div className="bg-secondary h-screen">
      <LoginContext.Provider value={{openModal, setOpenModal}}>
        {/* Navbar */}
        <div className="py-8 px-16">
          <Navbar />
        </div>
        <Modal open={openModal} onClose={() => setOpenModal(false)}>
          Test
        </Modal>
      </LoginContext.Provider>
    </div>
  );
}

export default App;
