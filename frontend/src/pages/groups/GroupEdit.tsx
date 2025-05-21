import React, { useState } from 'react';
import GroupHeader from '../../components/GroupHeader';
import Require from '../../components/Require';
import Optional from '../../components/Optional';
import Multiple from '../../components/Multiple';
import { FaPerson, FaPeopleGroup, FaCreditCard, FaFile, FaCalendar } from "react-icons/fa6";
import {
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Checkbox,
  ListItemText,
  OutlinedInput,
} from '@mui/material';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CustomDateInput } from "../../components/CustomDateInput";
import { useNavigate, useParams } from 'react-router';

const GroupEdit = () => {
  const navigate = useNavigate();
  const { groupId } = useParams();

  const [selected, setSelected] = useState([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const names = [
    'ジョセフ',
    '承太郎',
    'ポルナレフ',
    'アヴドゥル',
    '花京院',
    'イギー',
    'ホリィ',
    'シーザー',
    'スピードワゴン',
  ];

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelected(typeof value === 'string' ? value.split(',') : value);
  };

  return (
    <div className="overflow-y-auto">
      <GroupHeader />

      <div className="mx-8 mt-10">
        <div className="mb-6">
          <div className="flex items-center mt-6 mb-1 space-x-2">
            <FaPerson color="#F58220" className="text-2xl" />
            <label htmlFor="member_name" className="text-xs">立て替え者</label>
            <Require />
            <Multiple />
          </div>
          <div className="mt-4">
            <FormControl className="w-full" size="small">
              <InputLabel id="multiple-checkbox-label" className="ml-8">選択してください</InputLabel>
              <Select
                labelId="multiple-checkbox-label"
                multiple
                value={selected}
                onChange={handleChange}
                input={<OutlinedInput label="選択してください" />}
                renderValue={(selected) => (selected as string[]).join(', ')}
                sx={{ height: 36, backgroundColor: '#F3F4F7', marginLeft: 4, marginRight: 4 }}
                required
              >
                {names.map((name) => (
                  <MenuItem key={name} value={name}>
                    <Checkbox checked={selected.indexOf(name) > -1} />
                    <ListItemText primary={name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </div> 

        <div className="mb-6">
          <div className="flex items-center mb-1 space-x-2">
            <FaPeopleGroup color="#F58220" className="text-2xl" />
            <label htmlFor="payer_name" className="text-xs">支払い対象者</label>
            <Require />
            <Multiple />
            <button className="text-[10px] bg-[#F3F4F7] border-1 border-[#D9D9D9] ml-8 px-1 hover:cursor-pointer">均等にする</button>
          </div>
          <div className="mr-6 ml-8 mt-2 space-y-2">
            {[
              { name: '承太郎さん', value: '60' },
              { name: '花京院さん', value: '40' }
            ].map((person, idx) => (
              <div key={idx} className="flex justify-between items-center space-x-2">
                <div>
                  <input
                    id={`payer-${idx}`}
                    type="checkbox"
                    className="checkbox checkbox-sm bg-[#F3F4F7]"
                    required
                  />
                  <label htmlFor={`payer-${idx}`} className="text-xs w-24 ml-4">{person.name}</label>
                </div>
                <div>
                  <input
                    className="input input-xs w-10 bg-[#F3F4F7] text-xs"
                    defaultValue={person.value}
                    required
                  />
                  <span className="text-xs ml-2">%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-center mb-1 space-x-4">
            <FaCreditCard color="#F58220" className="text-2xl" />
            <label htmlFor="payer_name" className="text-xs">支払い金額</label>
            <Require />
          </div>
          <div className="flex items-center space-x-8">
            <input 
              type="text" 
              className="input input-sm w-[40%] bg-[#F3F4F7] ml-8 my-2 py-2"
              required
            />
            <p className="text-xs">円</p>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-center mb-1 space-x-4">
            <FaFile color="#F58220" className="text-2xl" />
            <label htmlFor="payer_name" className="text-xs">内容</label>
            <Require />
          </div>
          <div className="flex items-center space-x-8">
            <input 
              type="text" 
              className="input input-sm w-[80%] bg-[#F3F4F7] ml-8 my-2 py-2"
              required
            />
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-center mb-1 space-x-4">
            <FaCalendar color="#F58220" className="text-2xl" />
            <label htmlFor="payer_name" className="text-xs">支払い日</label>
            <Optional />
          </div>
          <div className="w-[75%] ml-8 mt-4 mb-4">
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              dateFormat="yyyy/MM/dd"
              customInput={<CustomDateInput />}
              isClearable
            />
          </div>
        </div>

        <div className="text-center mt-10 space-y-4">
          <button 
            className="w-[80%] font-bold bg-[#F58220] text-white border-2 text-xs px-4 py-2 hover:bg-white hover:text-[#F58220] hover:cursor-pointer hover:border-[#F58220]"
            type="submit"
            onClick={() => navigate(`/group/${groupId}/edit/1`)}
          >
            更新する
          </button>
          <button 
            className="w-[80%] font-bold bg-[#D9D9D9] text-[#62686C] text-xs px-4 py-2 hover:bg-[#62686C] hover:text-[#D9D9D9] hover:cursor-pointer"
            onClick={() => navigate(`/group/${groupId}/show/1`)}
          >
            戻る
          </button>
        </div>

      </div>
    </div>
  )
}

export default GroupEdit;