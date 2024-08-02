import BoardCard from "./BoardCard";
import EmptyCard from "./EmptyCard";
import Modal from "./Modal";
import { useState } from "react";
import { TfiBlackboard } from "react-icons/tfi";
import { IoRocketOutline } from "react-icons/io5";
import { useEffect } from "react";

import ScrumBoard from "./ScrumBoard"

import { BoardContext } from "../contexts/BoardContext";
import axios from "axios";

const Dashboard = () => {
  const [openNewBoard, setOpenNewBoard] = useState(false);
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Select a board
  const [selectedBoard, setSelectedBoard] = useState(null);

  // Board Information
  const [boardName, setBoardName] = useState("");
  const [boardDescription, setBoardDescription] = useState("");

  // Fetch boards function
  const fetchBoards = async () => {
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  // Create new scrum board
  const handleCreateBoard = async (e) => {
    e.preventDefault();
    setOpenNewBoard(false);
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/boards",
        {
          title: boardName,
          description: boardDescription,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Re-fetch boards after creating a new one
      setBoardName("");
      setBoardDescription("");
    } catch (error) {
      setError(
        error.response ? error.response.data.error : "Error creating board"
      );
    } finally {
      fetchBoards();
    }
  };

  useEffect(() => {
    fetchBoards();
    setLoading(false);
  }, []);

  // Board is clicked
  const handleBoardClick = (board) => {
    setSelectedBoard(board);
  };

  // Proxy boards if empty
  const filledData = [...boards];
  while (filledData.length < 3) {
    filledData.push({ id: `empty-${filledData.length}`, isEmpty: true });
  }

  // Loading screen for data to load fetch
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
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
    );
  }

  // Render board if board is selected
  if (selectedBoard) {
    console.log("True")
    return (
      <ScrumBoard
        board={selectedBoard}
        onClose={() => setSelectedBoard(null)}
      />
    );
  }

  return (
    <BoardContext.Provider value={{ openNewBoard, setOpenNewBoard }}>
      <div className=" text-white flex flex-col">
        {/* Board Card*/}
        <div className="grid grid-cols-1 grid-rows-3 gap-16 px-16 py-32 h-screen">
          {filledData.map((item) =>
            item ? (
              item.isEmpty ? (
                <EmptyCard key={item.id} />
              ) : (
                <BoardCard
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  description={item.description}
                  lastUpdate={item.lastUpdated}
                  onClick={() => handleBoardClick(item)}
                />
              )
            ) : null
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
            <form onSubmit={handleCreateBoard}>
              <div className="flex flex-col font-normal gap-3">
                {/* Title */}
                <div className="flex flex-col gap-2">
                  <div className="text-md">Board Name</div>
                  <input
                    className="bg-[#0A0F1D] appearance-none border-lg border border-white/10 rounded-lg py-2 px-4 text-white leading-tight focus:outline-none focus:border-primary focus:border-2"
                    type="text"
                    placeholder="Enter board name here"
                    value={boardName}
                    onChange={(e) => setBoardName(e.target.value)}
                  />
                </div>
                {/* Description */}
                <div className="flex flex-col gap-2">
                  <div className="text-md">Description</div>
                  <input
                    className="bg-[#0A0F1D] appearance-none border-lg border border-white/10 rounded-lg py-2 px-4 text-white leading-tight focus:outline-none focus:border-primary focus:border-2"
                    type="text"
                    placeholder="Enter board description here"
                    value={boardDescription}
                    onChange={(e) => setBoardDescription(e.target.value)}
                  />
                </div>
                {/* Continue */}
                <button
                  type="submit"
                  className="bg-[#0A0F1D] border-lg border-2 border-white/10 rounded-lg px-24 py-2 font-semibold hover:bg-[#0E3736] hover:text-primary hover:outline-none hover:border-primary"
                >
                  Continue
                </button>
              </div>
            </form>
          </div>
        </Modal>
      </div>
    </BoardContext.Provider>
  );
};

export default Dashboard;
