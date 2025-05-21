import React from 'react';
import GroupHeader from '../../components/GroupHeader';
import { FaPerson, FaPeopleGroup, FaCreditCard, FaFile, FaCalendar } from "react-icons/fa6";
import { useNavigate, useParams } from 'react-router';

const GroupShow = () => {
  const navigate = useNavigate();
  const { groupId } = useParams();

  return (
    <div className="overflow-y-auto">
      <GroupHeader />

      <div className="mx-10 mt-10">
        <div className="flex items-center mb-1 space-x-4">
          <FaPerson color="#F58220" className="text-2xl" />
          <label htmlFor="payer_name" className="text-xs">立て替え者</label>
        </div>
        <p className="ml-10 mt-2 text-xs">ジョセフさん</p>
      </div>

      <div className="mx-10 mt-6">
        <div className="flex items-center mb-1 space-x-4">
          <FaPeopleGroup color="#F58220" className="text-2xl" />
          <label htmlFor="payer_name" className="text-xs">支払い対象者</label>
        </div>
        <div className="flex justify-between items-center">
          <p className="ml-10 mt-2 text-xs">承太郎さん</p>
          <p className="mr-10 mt-2 text-xs">60%</p>
        </div>
        <div className="flex justify-between items-center">
          <p className="ml-10 mt-2 text-xs">承太郎さん</p>
          <p className="mr-10 mt-2 text-xs">60%</p>
        </div>
      </div>

      <div className="mx-10 mt-6">
        <div className="flex items-center mb-1 space-x-4">
          <FaCreditCard color="#F58220" className="text-2xl" />
          <label htmlFor="payer_name" className="text-xs">支払い金額</label>
        </div>
        <p className="ml-10 mt-2 text-xs">¥15000</p>
      </div>

      <div className="mx-10 mt-6">
        <div className="flex items-center mb-1 space-x-4">
          <FaFile color="#F58220" className="text-2xl" />
          <label htmlFor="payer_name" className="text-xs">内容</label>
        </div>
        <p className="ml-10 mt-2 text-xs">夕飯代</p>
      </div>

      <div className="mx-10 mt-6">
        <div className="flex items-center mb-1 space-x-4">
          <FaCalendar color="#F58220" className="text-2xl" />
          <label htmlFor="payer_name" className="text-xs">支払い日</label>
        </div>
        <p className="ml-10 mt-2 text-xs">2025/5/16</p>
      </div>

      <div className="text-center mt-8 space-y-4">
        <button 
          className="w-[80%] font-bold bg-[#F58220] text-white border-2 text-xs px-4 py-2 hover:bg-white hover:text-[#F58220] hover:cursor-pointer hover:border-[#F58220]"
          onClick={() => navigate(`/group/${groupId}/edit/1`)}
        >
          編集する
        </button>
        <button 
          className="w-[80%] font-bold bg-white text-[#EB1010] border-2 text-xs px-4 py-2 hover:bg-[#EB1010] hover:text-white hover:cursor-pointer"
          type="submit"
        >
          削除する
        </button>
        <button 
          className="w-[80%] font-bold bg-[#D9D9D9] text-[#62686C] text-xs px-4 py-2 hover:bg-[#62686C] hover:text-[#D9D9D9] hover:cursor-pointer"
          onClick={() => navigate(`/group/${groupId}`)}
        >
          戻る
        </button>
      </div>
    </div>
  )
}

export default GroupShow;