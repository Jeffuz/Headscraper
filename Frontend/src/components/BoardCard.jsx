import { CiViewBoard } from "react-icons/ci";
import { CiCalendar } from "react-icons/ci";

const BoardCard = ({ title, description, lastUpdate }) => {
  return (
    <div className="flex flex-col bg-[#050916] p-8 border rounded-lg gap-6 cursor-pointer min-h-full">
      {/* Title Bar */}
      <div className="flex justify-between items-center">
        <div className="font-semibold text-2xl">{title}</div>
        <CiViewBoard size={30} />
      </div>
      {/* Description */}
      <div>{description}</div>
      {/* Last Updated */}
      <div className="flex items-center gap-2">
        <CiCalendar size={20} />
        <div className="text-sm">{lastUpdate}</div>
      </div>
    </div>
  );
};

export default BoardCard;
