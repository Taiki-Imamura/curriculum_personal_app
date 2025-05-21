import React from 'react'
import { useNavigate, useParams } from 'react-router';

const GroupList = () => {
  const navigate = useNavigate();
  const { groupId } = useParams();

  return (
    <div className="overflow-y-auto">
      <h1 className="text-2xl text-center font-bold mt-10">支払いを記録しよう！</h1>

      <div className="text-center">
        <button 
          className="w-[80%] font-bold text-[#F58220] border border-2 text-xs mt-4 px-4 py-2 hover:bg-[#F58220] hover:text-white"
          onClick={() => navigate(`/group/${groupId}/new`)}
        >
          支払いを記録する
        </button>

        <div className="flex mx-6 mt-6 px-2 justify-between items-center border-b-2 border-gray-200 mb-10 pb-2">
          <div className="flex flex-col items-start w-[65%]">
            <p className="text-sm">夕飯代</p>
            <p className="text-[10px] text-gray-500">ジョセフが立て替え（5/19）</p>
            <p className="text-[10px] text-gray-500">承太郎・ジョセフ・ポルナレフ・アブドゥル</p>
          </div>
          <p className="w-[20%] text-sm">¥15000</p>
          <button 
            className="bg-[#F58220] rounded-md font-bold text-[10px] text-white px-2 py-1 hover:cursor-pointer"
            onClick={() => navigate(`/group/${groupId}/show/1`)}
          >
            詳細
          </button>
        </div>

        <div className="mb-6">
          <p className="text-start text-sm font-bold mb-2 px-12">合計金額</p>
          <p className="font-bold text-2xl">¥15000</p>
        </div>

        <div className="mb-6">
          <p className="text-start text-sm font-bold mt-8 mb-4 px-12">平均割り勘額</p>
          <p className="font-bold text-2xl">¥7500</p>
        </div>

        <div className="mb-6">
          <p className="text-start text-sm font-bold my-4 px-12">立て替え額</p>
          <div className="flex mx-10 px-2 justify-between items-center border-b-2 border-gray-200 mb-4 pb-2">
            <div className="flex flex-col items-start">
              <p className="text-xs">承太郎 → ジョセフ</p>
            </div>
            <p className="w-[20%] text-xs">¥15000</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GroupList;