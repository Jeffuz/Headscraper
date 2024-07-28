import { useState } from "react";
import { TfiBlackboard } from "react-icons/tfi";
import { FaGoogle } from "react-icons/fa";
import axios from "axios";

import Navbar from "./components/Navbar";
import Modal from "./components/Modal";

import { LoginContext } from "./contexts/LoginContext";
// import Dashboard from "./components/Dashboard";
// import ScrumBoard from "./components/ScrumBoard";

function App() {
  const [openLoginModal, setOpenLoginModal] = useState(false);
  const [openSignupModal, setOpenSignupModal] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Handle Signup States
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle Login States
  const [loginError, setLoginError] = useState(null);
  const [loginSuccess, setLoginSuccess] = useState(null);
  const [loginLoading, setLoginLoading] = useState(false);

  // Submit form for signup
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/signup", {
        email,
        password,
      });
      setSuccess(response.data.message);
      setError(null);
      setLoading(false);
    } catch (error) {
      setError(error.response.data.error);
      setSuccess(null);
      setLoading(false);
    }
  };

  // Submit form for login
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/login", {
        email,
        password,
      });
      setLoginSuccess(response.data.message);
      setLoginError(null);
      setLoginLoading(false);
    } catch (error) {
      setLoginError(error.response.data.error);
      setLoginSuccess(null);
      setLoginLoading(false);
    }
  };

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
        {/* <div className="">
          <Dashboard/>
        </div> */}
        {/* Scrum Board */}
        {/* <div>
          <ScrumBoard/>
        </div> */}
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
            <form onSubmit={handleLoginSubmit}>
              {/* Login via Email/Password */}
              <div className="flex flex-col font-normal gap-3">
                {/* Email */}
                <div className="flex flex-col gap-2">
                  <div className="text-md">Email</div>
                  <input
                    className="bg-[#0A0F1D] appearance-none border-lg border border-white/10 rounded-lg py-2 px-4 text-white leading-tight focus:outline-none focus:border-primary focus:border-2"
                    type="email"
                    placeholder="name@example.com"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                {/* Password */}
                <div className="flex flex-col gap-2">
                  <div className="text-md">Password</div>
                  <input
                    className="bg-[#0A0F1D] appearance-none border-lg border border-white/10 rounded-lg py-2 px-4 text-white leading-tight focus:outline-none focus:border-primary focus:border-2"
                    type="password"
                    placeholder="******************"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                {/* Continue */}
                <button
                  disabled={loginLoading}
                  type="submit"
                  className="bg-[#0A0F1D] border-lg border-2 border-white/10 rounded-lg px-24 py-2 font-semibold hover:bg-[#0E3736] hover:text-primary hover:outline-none hover:border-primary"
                >
                  {/* Continue, therwise loading after submit */}
                  {loginLoading ? (
                    <div className="flex justify-center">
                      <svg
                        aria-hidden="true"
                        className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-primary"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="currentColor"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="currentFill"
                        />
                      </svg>
                      <span className="sr-only">Loading...</span>
                    </div>
                  ) : (
                    "Continue"
                  )}
                </button>
                {/* Error or success tags */}
                {loginError && <div className="text-red-500">{loginError}</div>}
                {loginSuccess && (
                  <div className="text-green-500">{loginSuccess}</div>
                )}
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
            </form>
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
            <form onSubmit={handleSignupSubmit}>
              <div className="flex flex-col font-normal gap-3">
                {/* Email */}
                <div className="flex flex-col gap-2">
                  <div className="text-md">Email</div>
                  <input
                    className="bg-[#0A0F1D] appearance-none border-lg border border-white/10 rounded-lg py-2 px-4 text-white leading-tight focus:outline-none focus:border-primary focus:border-2"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                {/* Password */}
                <div className="flex flex-col gap-2">
                  <div className="text-md">Password</div>
                  <input
                    className="bg-[#0A0F1D] appearance-none border-lg border border-white/10 rounded-lg py-2 px-4 text-white leading-tight focus:outline-none focus:border-primary focus:border-2"
                    type="password"
                    placeholder="******************"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                {/* Continue */}
                <button
                  type="submit"
                  className="bg-[#0A0F1D] border-lg border-2 border-white/10 rounded-lg px-24 py-2 font-semibold hover:bg-[#0E3736] hover:text-primary hover:outline-none hover:border-primary"
                  disabled={loading}
                >
                  {/* Continue, therwise loading after submit */}
                  {loading ? (
                    <div className="flex justify-center">
                      <svg
                        aria-hidden="true"
                        className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-primary"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="currentColor"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="currentFill"
                        />
                      </svg>
                      <span className="sr-only">Loading...</span>
                    </div>
                  ) : (
                    "Continue"
                  )}
                </button>
                {/* Error or success tags */}
                {error && <div className="text-red-500">{error}</div>}
                {success && <div className="text-green-500">{success}</div>}
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
            </form>
          </div>
        </Modal>
      </LoginContext.Provider>
    </div>
  );
}

export default App;
