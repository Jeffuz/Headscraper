import { CiCalendar } from "react-icons/ci";
import { FaRegTrashAlt } from "react-icons/fa";
import Modal from "./Modal";
import { useState } from "react";
import { TfiBlackboard } from "react-icons/tfi";


const BoardCard = ({ id, title, description, lastUpdate, onClick }) => {
  const [open, setOpen] = useState(false);
  return (
    <div onClick={onClick} className="flex flex-col bg-[#050916] p-8 border rounded-lg gap-6 cursor-pointer min-h-full">
      {/* Title Bar */}
      <div className="flex justify-between items-center">
        <div className="font-semibold text-2xl">{title}</div>
        <FaRegTrashAlt
          size={25}
          className="hover:text-red-600 transition delay-50"
          onClick={()=>setOpen(true)}
        />
      </div>
      {/* Description */}
      <div>{description}</div>
      {/* Last Updated */}
      <div className="flex items-center gap-2">
        <CiCalendar size={20} />
        <div className="text-sm"> Last updated on {lastUpdate}</div>
      </div>
      <Modal open={open} onClose={() => setOpen(false)}>
        <div className="flex flex-col text-white">
          {/* Company Name */}
          <div className="text-primary flex items-center gap-3">
            <TfiBlackboard size={28} />
            <div className="text-white font-bold text-lg">Headscraper</div>
          </div>
          {/* Delete Board */}
          <div className="flex flex-col py-5 gap-2">
            <div className="font-bold text-2xl">Deleting the board?</div>
            <div className="text-md">
              Click &apos;Delete&apos; to confirm.
            </div>
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
                setOpen(false);
              }}
              className="w-[50%] flex justify-center items-center"
            >
              <div className="hover:text-red-500 delay-50 transition">Delete</div>
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default BoardCard;
