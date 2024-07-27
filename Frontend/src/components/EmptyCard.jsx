import { FiPlusCircle } from "react-icons/fi";
import { BoardContext } from "../contexts/BoardContext";
import { useContext } from "react";
const EmptyCard = () => {
    const {setOpenNewBoard} = useContext(BoardContext);
  return (
    <div className="flex justify-center items-center bg-[#050916] p-8 border rounded-lg cursor-pointer min-h-full" onClick={()=>setOpenNewBoard(true)}>
      <FiPlusCircle size={60}/>
    </div>
  );
};

export default EmptyCard;
