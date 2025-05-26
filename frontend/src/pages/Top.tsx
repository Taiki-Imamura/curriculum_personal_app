import { useNavigate } from 'react-router-dom';
import { FaPerson } from "react-icons/fa6";

const Top = () => {
  const navigate = useNavigate();

  const handleCreateGroup = () => {
    navigate('/create-group');
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">グループを作成</h1>
      <button
        className="bg-[#F58220] text-white px-4 py-2 rounded hover:bg-[#E5731F] flex items-center"
        onClick={handleCreateGroup}
      >
        <FaPerson className="mr-2" />
        グループを作成する
      </button>
    </div>
  );
};

export default Top;