import React from 'react'
import InputField from '../components/InputField'
import { FaPeopleGroup } from "react-icons/fa6";
import { FaPerson } from "react-icons/fa6";
import Require from "../components/Require";

const Top = () => {
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

      <h2 className="text-2xl font-bold text-center">それ、ワリペイが解決します</h2>
      <p className="text-xs text-center mt-1 mb-10">ワリペイは、割り勘や立て替えのわずらわしさを<br />
        なくしてくれる無料のサービスです。
      </p>

      <h2 className="text-2xl font-bold text-center ml-2">いますぐ始めよう！</h2>
      <InputField
        id="group_name"
        label="グループ名"
        icon={FaPeopleGroup}
        optional={true}
      />
      <div className="mb-12">
        <div className="flex items-center mx-10 mt-6 mb-1 space-x-2">
          <FaPerson className="text-2xl" />
          <label htmlFor="member_name" className="text-xs">メンバー名（2名以上追加してください）</label>
          <Require />
        </div>
        <div className="relative flex justify-center items-center">
          <input
            id="member_name"
            type="text"
            className="input input-sm bg-gray-100 border border-gray-200 px-2 w-[80%] mt-2"
          />
          <button className="absolute right-[10%] top-1/2 -translate-y-1/2 z-1 bg-[#F58220] rounded-md font-bold text-xs text-white mt-1 px-4 p-2 hover:cursor-pointer">追加</button>
        </div>
      </div>
      
      <div className="text-center">
        <button className="w-[80%] font-bold text-[#F58220] border text-xs px-4 py-2 hover:bg-[#F58220] hover:text-white">グループを作成</button>
      </div>
    </div>
  );
}

export default Top;