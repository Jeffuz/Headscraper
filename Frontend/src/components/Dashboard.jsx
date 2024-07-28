import BoardCard from "./BoardCard";
import EmptyCard from "./EmptyCard";
import Modal from "./Modal";
import { useState } from "react";
import { TfiBlackboard } from "react-icons/tfi";
import { IoRocketOutline } from "react-icons/io5";
import { useEffect } from "react";

import { BoardContext } from "../contexts/BoardContext";
import axios from "axios";

const Dashboard = () => {
  const [openNewBoard, setOpenNewBoard] = useState(false);
  const [boards, setBoards] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/boards", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // Convert Response to an array
        const boardsData = response.data;
        const boardsArray = Object.keys(boardsData).map((key) => ({
          id: key,
          ...boardsData[key],
        }));
        setBoards(boardsArray);
      } catch (error) {
        setError(
          error.response ? error.response.data.error : "Error fetching boards"
        );
      }
    };

    fetchBoards();
  }, []);
  
  const filledData = [...boards];
  while (filledData.length < 3) {
    filledData.push({ id: `empty-${filledData.length}`, isEmpty: true });
  }
  return (
    <BoardContext.Provider value={{ openNewBoard, setOpenNewBoard }}>
      <div className=" text-white flex flex-col">
        {/* Board Card*/}
        <div className="grid grid-cols-1 grid-rows-3 gap-16 px-16 py-32 h-screen">
          {filledData.map((item) =>
            item.isEmpty ? (
              <EmptyCard key={item.id} />
            ) : (
              <BoardCard
                key={item.id}
                title={item.title}
                description={item.description}
                lastUpdate={item.lastUpdated}
              />
            )
          )}
        </div>
        <Modal open={openNewBoard} onClose={() => setOpenNewBoard(false)}>
          <div className="flex flex-col justify-start text-white">
            <div className="text-primary flex items-center gap-3">
              <TfiBlackboard size={28} />
              <div className="text-white font-bold text-lg">Headscraper</div>
            </div>
            {/* Sign up  */}
            <div className="flex flex-col py-5 gap-2">
              <div className="font-bold text-2xl">Create new Board</div>
              <div className="text-md">
                use the Headstarter AI Fellowship template?
              </div>
            </div>
            {/* Google Sign up Button */}
            <button className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-secondary rounded-lg px-24 py-2 font-semibold">
              <IoRocketOutline size={15} />
              <div>Continue with Headstarter</div>
            </button>
            {/* Divider */}
            <hr className="my-8 h-0.5 border-t-0 bg-neutral-100 dark:bg-white/10" />
            {/* Input Title and description */}
            <div className="flex flex-col font-normal gap-3">
              {/* Title */}
              <div className="flex flex-col gap-2">
                <div className="text-md">Board Name</div>
                <input
                  className="bg-[#0A0F1D] appearance-none border-lg border border-white/10 rounded-lg py-2 px-4 text-white leading-tight focus:outline-none focus:border-primary focus:border-2"
                  type="text"
                  placeholder="Enter board name here"
                />
              </div>
              {/* Description */}
              <div className="flex flex-col gap-2">
                <div className="text-md">Description</div>
                <input
                  className="bg-[#0A0F1D] appearance-none border-lg border border-white/10 rounded-lg py-2 px-4 text-white leading-tight focus:outline-none focus:border-primary focus:border-2"
                  type="text"
                  placeholder="Enter board description here"
                />
              </div>
              {/* Continue */}
              <button className="bg-[#0A0F1D] border-lg border-2 border-white/10 rounded-lg px-24 py-2 font-semibold hover:bg-[#0E3736] hover:text-primary hover:outline-none hover:border-primary">
                Continue
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </BoardContext.Provider>
  );
};

export default Dashboard;
