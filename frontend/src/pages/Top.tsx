import { useState } from 'react';
import { useNavigate } from 'react-router';
import InputField from '../components/InputField'
import { FaPeopleGroup, FaPerson } from "react-icons/fa6";
import Require from "../components/Require";

const Top = () => {
  const [groupName, setGroupName] = useState<string>("");
  const [memberName, setMemberName] = useState<string>("");
  const [members, setMembers] = useState<string[]>([]);
  const navigate = useNavigate();

  const handleAddMember = () => {
    if (!memberName.trim()) {
      alert('メンバー名を入力してください');
      return;
    }

    setMembers((prev) => [...prev, memberName.trim()]);
    setMemberName("");
  };

  const handleCreateGroup = async () => {
    const trimmedGroupName = groupName.trim();

    if (!trimmedGroupName) {
      alert("グループ名を入力してください");
      return;
    }

    if (members.length < 2) {
      alert("メンバーは2名以上必要です");
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/groups`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          group: {
            name: trimmedGroupName,
          },
          members: members
        }),
      });

      if (!res.ok) throw new Error("グループ作成に失敗しました");

      const data = await res.json();
      const groupId = data.uuid;

      console.log("グループ作成成功", data);
      navigate(`/publish-url/${groupId}`);
    } catch (err) {
      console.error(err);
      alert("通信エラーが発生しました");
    }
  };

  return (
    <div className="overflow-y-auto">
      <h1 className="text-[26px] font-bold text-center ml-4 mt-8 leading-tight">
        面倒なお金のやり取りを、<br />
        もっとシンプルに。
      </h1>

      <p className="text-xs text-center mt-4">友達との旅行で、お金の貸し借りをした時、<br />
        誰が誰にいくら払えば良いのか困った経験、ありませんか？
      </p>

      <img src="src/assets/iconmonstr-angel-down-thin-120.png" alt="angel-down" className="mx-auto w-10 h-8 mt-4 opacity-30" />
      <img src="src/assets/iconmonstr-angel-down-thin-120.png" alt="angel-down" className="mx-auto w-10 h-8 m-[-12px] opacity-30" />
      <img src="src/assets/iconmonstr-angel-down-thin-120.png" alt="angel-down" className="mx-auto w-10 h-8 mb-4 opacity-30" />

      <h2 className="text-2xl font-bold text-center ml-4">それ、ワリペイが解決します。</h2>
      <p className="text-xs text-center mt-1 mb-10">ワリペイは、割り勘や立て替えのわずらわしさを<br />
        なくしてくれる無料のサービスです。
      </p>

      <h2 className="text-2xl font-bold text-center ml-2">いますぐ始めよう！</h2>
      <InputField
        id="group_name"
        label="グループ名"
        icon={FaPeopleGroup}
        require={true}
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
      />
      <div className="mb-6">
        <div className="flex items-center mx-10 mt-6 mb-1 space-x-2">
          <FaPerson color="#F58220" className="text-2xl" />
          <label htmlFor="member_name" className="text-xs">メンバー名（2名以上追加してください）</label>
          <Require />
        </div>
        <div className="relative flex justify-center items-center">
          <input
            id="member_name"
            type="text"
            className="input input-sm bg-gray-100 border border-gray-200 px-2 w-[80%] mt-2"
            required
            value={memberName}
            onChange={(e) => setMemberName(e.target.value)}
          />
          <button 
            className="absolute right-[10%] top-1/2 -translate-y-1/2 z-1 bg-[#F58220] rounded-md font-bold text-xs text-white mt-1 px-4 p-2 hover:cursor-pointer"
            type="button"
            onClick={handleAddMember}
          >
            追加
          </button>
        </div>
      </div>

      {members.length > 0 && (
        <div className="text-sm text-center mb-6">
          <p className="font-semibold mb-1">追加されたメンバー</p>
          <ul>
            {members.map((name, i) => (
              <li key={i}>{name}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="text-center">
        <button 
          className="w-[80%] font-bold bg-[#F58220] text-white text-xs mt-6 px-4 py-2 hover:bg-white hover:text-[#F58220] cursor-pointer border-2 border-[#F58220]"
          type="submit"
          onClick={handleCreateGroup}
        >
          グループを作成
        </button>
      </div>
    </div>
  );
}

export default Top;