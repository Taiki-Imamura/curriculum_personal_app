import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import LoadingSpinner from "../../components/LoadingSpinner";
import NotFound from "../../NotFound";
import InputField from "../../components/InputField";
import { FaPeopleGroup, FaPerson, FaTrash } from "react-icons/fa6";
import type { Payment } from '../../types/types';

interface Member {
  name: string;
  id: string;
}

const GroupSettings = () => {
  const { uuid } = useParams();
  const navigate = useNavigate();
  const [groupName, setGroupName] = useState<string>('');
  const [memberName, setMemberName] = useState<string>('');
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [payments, setPayments] = useState<Payment[]>([]);

  useEffect(() => {
    const fetchGroupData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/groups/${uuid}`);
        if (!res.ok) throw new Error('getエラー');
        const data = await res.json();
        setGroupName(data.group_name);
        setMembers(data.users);
        setPayments(data.payments);
      } catch (err) {
        console.error(err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    if (uuid) fetchGroupData();
  }, [uuid]);

  const isMemberInvolvedInPayments = (memberName: string): boolean => {
    return payments.some(payment => 
      payment.participants.some(participant => participant.user_name === memberName)
    );
  };

  const handleAddMember = () => {
    if (!memberName.trim()) {
      alert('メンバー名を入力してください');
      return;
    }

    setMembers((prev) => [...prev, { name: memberName.trim(), id: Date.now().toString() }]);
    setMemberName("");
  };

  const handleUpdateMember = (index: number, value: string) => {
    const newMembers = [...members];
    newMembers[index] = { ...newMembers[index], name: value };
    setMembers(newMembers);
  };

  const handleDeleteMember = (index: number) => {
    if (members.length <= 2) {
      alert('メンバーは2名以上必要です');
      return;
    }

    const memberToDelete = members[index];
    if (isMemberInvolvedInPayments(memberToDelete.name)) {
      alert('このメンバーは支払いに関与しているため削除できません');
      return;
    }

    const newMembers = members.filter((_, i) => i !== index);
    setMembers(newMembers);
  };

  const handleUpdate = async () => {
    if (!groupName.trim()) {
      alert('グループ名を入力してください');
      return;
    }
    if (members.length < 2) {
      alert('メンバーは2名以上必要です');
      return;
    }

    setIsUpdating(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/groups/${uuid}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          group: {
            name: groupName
          },
          members: members.map(member => member.name)
        }),
      });

      if (!res.ok) throw new Error('更新に失敗しました');
      navigate(`/group/${uuid}`);
    } catch (err) {
      console.error(err);
      alert('更新に失敗しました');
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (notFound) return <NotFound />;

  return (
    <div className="overflow-y-auto">
      <div className="mt-10">
        <InputField
          id="group_name"
          label="グループ名"
          icon={FaPeopleGroup}
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
        />
        <div className="mb-6">
          <div className="flex items-center mx-10 mt-6 mb-1 space-x-2">
            <FaPerson color="#F58220" className="text-2xl" />
            <label htmlFor="member_name" className="text-xs">メンバー名（2名以上追加してください）</label>
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

        <div className="mx-6 mt-4 space-y-2">
          {members.map((member, index) => (
            <div key={member.id} className="flex justify-center items-center space-x-2">
              <input
                type="text"
                className="input input-sm bg-gray-100 border border-gray-200 px-2 w-[80%]"
                value={member.name}
                onChange={(e) => handleUpdateMember(index, e.target.value)}
              />
              <button
                type="button"
                className="p-2 text-red-500 hover:text-red-700"
                onClick={() => handleDeleteMember(index)}
              >
                <FaTrash />
              </button>
            </div>
          ))}
        </div>

        <div className="text-center mt-10 space-y-4">
          <button
            className="w-[80%] font-bold bg-[#F58220] text-white text-xs px-4 py-2 border-2 border-[#F58220] hover:bg-white hover:text-[#F58220] hover:cursor-pointer"
            onClick={handleUpdate}
            disabled={isUpdating}
          >
            {isUpdating ? '更新中...' : '更新する'}
          </button>
          <button 
            className="w-[80%] font-bold bg-[#D9D9D9] text-[#62686C] text-xs px-4 py-2 border-2 border-[#D9D9D9] hover:bg-[#62686C] hover:text-[#D9D9D9] hover:cursor-pointer"
            onClick={() => navigate(`/group/${uuid}`)}
          >
            戻る
          </button>
        </div>
      </div>
    </div>
  )
};

export default GroupSettings; 