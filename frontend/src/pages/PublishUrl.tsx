import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import { FaCircleCheck } from "react-icons/fa6";

const PublishUrl = () => {
  const { uuid } = useParams();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const origin = window.location.origin;
  const url = `${origin}/group/${uuid}`;

  if (!uuid) {
    navigate("/");
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(groupUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      alert("コピーに失敗しました");
    }
  };
  
  const handleGoToGroup = () => {
    navigate(`/group/${uuid}`);
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <FaCircleCheck color="#F58220" className="text-5xl mt-12" />

      <h1 className="text-2xl font-bold text-center mt-6 leading-tight">
        グループが作成されました！
      </h1>

      <p className="text-xs text-center mt-4">
        以下のURLをコピーして、<br />
        LINEなどでメンバーに共有しましょう。
      </p>
      
      <div className="relative flex justify-center items-center w-[100%] mt-6">
        <input
          id="member_name"
          type="text"
          className="input input-sm bg-gray-100 border border-gray-200 px-2 w-[80%] mt-2"
          value={url}
          readOnly
        />
        <button 
          className="absolute right-[10%] top-1/2 -translate-y-1/2 z-1 bg-[#F58220] rounded-md font-bold text-xs text-white mt-1 px-3 p-2 hover:cursor-pointer"
          onClick={handleCopy}
        >
          {copied ? "コピーしました！" : "コピー"}
        </button>
      </div>

      <button 
        className="w-[80%] font-bold text-[#F58220] border border-2 text-xs mt-10 px-4 py-2 hover:bg-[#F58220] hover:text-white hover:cursor-pointer"
        onClick={handleGoToGroup}
      >
        グループページへ
      </button>
    </div>
  );
}

export default PublishUrl;