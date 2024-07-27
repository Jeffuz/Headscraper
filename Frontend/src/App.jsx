import { useState } from "react";
import { TfiBlackboard } from "react-icons/tfi";
import { FaGoogle } from "react-icons/fa";

import Navbar from "./components/Navbar";
import Modal from "./components/Modal";

import { LoginContext } from "./contexts/LoginContext";
import Dashboard from "./components/Dashboard";

function App() {
  const [openLoginModal, setOpenLoginModal] = useState(false);
  const [openSignupModal, setOpenSignupModal] = useState(false);

  return (
    <div className="bg-secondary h-screen">
      <LoginContext.Provider
        value={{
          openLoginModal,
          setOpenLoginModal,
          openSignupModal,
          setOpenSignupModal,
        }}
      >
        {/* Navbar */}
        <div className="py-8 px-16 fixed w-screen">
          <Navbar />
        </div>
        {/* Dashboard */}
        <div className="">
          <Dashboard/>
        </div>
        {/* Pop up Modal for Login */}
        <Modal open={openLoginModal} onClose={() => setOpenLoginModal(false)}>
          <div className="flex flex-col justify-start text-white">
            {/* Company Name */}
            <div className="text-primary flex items-center gap-3">
              <TfiBlackboard size={28} />
              <div className="text-white font-bold text-lg">Headscraper</div>
            </div>
            {/* Login  */}
            <div className="flex flex-col py-5 gap-2">
              <div className="font-bold text-2xl">Log In</div>
              <div className="text-md">or create an account</div>
            </div>
            {/* Google Login Button */}
            <button className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-secondary rounded-lg px-24 py-2 font-semibold">
              <FaGoogle size={15} />
              <div>Continue with Google</div>
            </button>
            {/* Divider */}
            <hr className="my-8 h-0.5 border-t-0 bg-neutral-100 dark:bg-white/10" />
            {/* Login via Email/Password */}
            <div className="flex flex-col font-normal gap-3">
              {/* Email */}
              <div className="flex flex-col gap-2">
                <div className="text-md">Email</div>
                <input
                  className="bg-[#0A0F1D] appearance-none border-lg border border-white/10 rounded-lg py-2 px-4 text-white leading-tight focus:outline-none focus:border-primary focus:border-2"
                  type="email"
                  placeholder="name@example.com"
                />
              </div>
              {/* Password */}
              <div className="flex flex-col gap-2">
                <div className="text-md">Password</div>
                <input
                  className="bg-[#0A0F1D] appearance-none border-lg border border-white/10 rounded-lg py-2 px-4 text-white leading-tight focus:outline-none focus:border-primary focus:border-2"
                  type="password"
                  placeholder="******************"
                />
              </div>
              {/* Continue */}
              <button className="bg-[#0A0F1D] border-lg border-2 border-white/10 rounded-lg px-24 py-2 font-semibold hover:bg-[#0E3736] hover:text-primary hover:outline-none hover:border-primary">
                Continue
              </button>
              {/* Sign Up */}
              <button
                onClick={() => {
                  setOpenLoginModal(false);
                  setOpenSignupModal(true);
                }}
                className="underline text-sm hover:text-primary delay-50"
              >
                Not signed up yet?
              </button>
            </div>
          </div>
        </Modal>
        {/* Pop up Modal for Sign Up */}
        <Modal open={openSignupModal} onClose={() => setOpenSignupModal(false)}>
          <div className="flex flex-col justify-start text-white">
            <div className="text-primary flex items-center gap-3">
              <TfiBlackboard size={28} />
              <div className="text-white font-bold text-lg">Headscraper</div>
            </div>
            {/* Sign up  */}
            <div className="flex flex-col py-5 gap-2">
              <div className="font-bold text-2xl">Sign Up</div>
              <div className="text-md">to create an account</div>
            </div>
            {/* Google Sign up Button */}
            <button className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-secondary rounded-lg px-24 py-2 font-semibold">
              <FaGoogle size={15} />
              <div>Continue with Google</div>
            </button>
            {/* Divider */}
            <hr className="my-8 h-0.5 border-t-0 bg-neutral-100 dark:bg-white/10" />
            {/* Sign up via Email and Password */}
            <div className="flex flex-col font-normal gap-3">
              {/* Email */}
              <div className="flex flex-col gap-2">
                <div className="text-md">Email</div>
                <input
                  className="bg-[#0A0F1D] appearance-none border-lg border border-white/10 rounded-lg py-2 px-4 text-white leading-tight focus:outline-none focus:border-primary focus:border-2"
                  type="email"
                  placeholder="name@example.com"
                />
              </div>
              {/* Password */}
              <div className="flex flex-col gap-2">
                <div className="text-md">Password</div>
                <input
                  className="bg-[#0A0F1D] appearance-none border-lg border border-white/10 rounded-lg py-2 px-4 text-white leading-tight focus:outline-none focus:border-primary focus:border-2"
                  type="password"
                  placeholder="******************"
                />
              </div>
              {/* Continue */}
              <button className="bg-[#0A0F1D] border-lg border-2 border-white/10 rounded-lg px-24 py-2 font-semibold hover:bg-[#0E3736] hover:text-primary hover:outline-none hover:border-primary">
                Continue
              </button>
              {/* Sign Up */}
              <button
                onClick={() => {
                  setOpenSignupModal(false);
                  setOpenLoginModal(true);
                }}
                className="underline text-sm hover:text-primary delay-50"
              >
                Have an account?
              </button>
            </div>
          </div>
        </Modal>
      </LoginContext.Provider>
    </div>
  );
}

export default App;
