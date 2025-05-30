import { MdEdit, MdContentCopy } from "react-icons/md";
import { useNavigate, useParams } from "react-router";
import { useState } from "react";

type GroupHeaderProps = {
  groupName: string;
  userNames: string[];
};

const GroupHeader = ({ groupName, userNames }: GroupHeaderProps) => {
  const navigate = useNavigate();
  const { uuid } = useParams();
  const origin = window.location.origin;
  const url = `${origin}/group/${uuid}`;
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 1000);
    } catch (err) {
      console.error('URLのコピーに失敗しました:', err);
    }
  };

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
      <div className="flex items-center mt-4 ml-4">
        <button
          onClick={handleCopyUrl}
          className={`text-xs px-2 py-1 rounded transition-all duration-200 flex items-center gap-1 ${
            isCopied 
              ? 'bg-white text-[#F58220]' 
              : 'bg-[#e3781b] hover:bg-[#d16d16]'
          }`}
        >
          <MdContentCopy className="text-base" />
          {isCopied ? 'コピーしました！' : 'URLをコピー'}
        </button>
      </div>
    </header>
  );
};

export default GroupHeader;