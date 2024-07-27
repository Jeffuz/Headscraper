import { FiPlusCircle } from "react-icons/fi";

const EmptyCard = () => {
  return (
    <div className="flex justify-center items-center bg-[#050916] p-8 border rounded-lg cursor-pointer min-h-full">
      <FiPlusCircle size={60}/>
    </div>
  );
};

export default EmptyCard;
