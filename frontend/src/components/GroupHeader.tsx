import { MdEdit } from "react-icons/md";
import { useNavigate, useParams } from "react-router";

type GroupHeaderProps = {
  groupName: string;
  userNames: string[];
};

const GroupHeader = ({ groupName, userNames }: GroupHeaderProps) => {
  const navigate = useNavigate();
  const { uuid } = useParams();

  return (
    <header className="bg-[#F58220] text-white px-4 pb-2">
      <div className="flex justify-between items-center mr-4">
        <h2 className="text-lg font-bold ml-4">{groupName}</h2>
        <button 
          className="cursor-pointer"
          onClick={() => navigate(`/group/${uuid}/settings`)}
        >
          <MdEdit className="text-4xl bg-[#e3781b] p-[6px] rounded-md" />
        </button>
      </div>
      <h3 className="text-xs mt-1 ml-4">{userNames.join('・')}</h3>
    </header>
  );
};

export default GroupHeader;