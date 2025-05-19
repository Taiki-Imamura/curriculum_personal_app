import React from 'react'
import { FaCircleCheck } from "react-icons/fa6";

const PublishUrl = () => {
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
          value="https://example.com/group/1234567890"
          readOnly
        />
        <button className="absolute right-[10%] top-1/2 -translate-y-1/2 z-1 bg-[#F58220] rounded-md font-bold text-xs text-white mt-1 px-4 p-2 hover:cursor-pointer">追加</button>
      </div>

      <button className="w-[80%] font-bold text-[#F58220] border border-2 text-xs mt-10 px-4 py-2 hover:bg-[#F58220] hover:text-white">グループページへ</button>
    </div>
  );
}

export default PublishUrl;