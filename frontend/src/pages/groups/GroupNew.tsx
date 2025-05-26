import { useState, useEffect } from 'react';
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
import type { SelectChangeEvent } from '@mui/material';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CustomDateInput } from "../../components/CustomDateInput";
import { useNavigate, useParams, useLocation } from 'react-router';
import { formatDate } from '../../utils/date';
import type { User } from '../../types/types';

const GroupNew = () => {
  const navigate = useNavigate();
  const { uuid } = useParams();
  const location = useLocation();
  const users = location.state?.users || [];

  const [totalAmount, setTotalAmount] = useState<string>('');
  const [selectedPayers, setSelectedPayers] = useState<{ id: number; name: string }[]>([]);
  const [payerAmounts, setPayerAmounts] = useState<{ [id: number]: string }>({});
  const [payees, setPayees] = useState<{ [name: string]: { checked: boolean; percent: string } }>({});
  const [content, setContent] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    setPayees((prevPayees) => {
      const updatedPayees = { ...prevPayees };

      selectedPayers.forEach(({ name }) => {
        if (!updatedPayees[name]?.checked) {
          updatedPayees[name] = {
            checked: true,
            percent: updatedPayees[name]?.percent || '',
          };
        }
      });

      return updatedPayees;
    });
  }, [selectedPayers]);

  const handleCreatePayment = async () => {
    const trimmedTotalAmount = totalAmount.trim();
    const totalAmountNumber = Number(trimmedTotalAmount);

    if (!trimmedTotalAmount || isNaN(totalAmountNumber) || totalAmountNumber <= 0) {
      alert("合計金額を正しく入力してください");
      return;
    }

    if (selectedPayers.length === 0) {
      alert("立て替え者を選択してください");
      return;
    }

    const totalPayerAmount = selectedPayers.reduce((sum, payer) => {
      return sum + Number(payerAmounts[payer.id] || 0);
    }, 0);

    if (Math.abs(totalPayerAmount - totalAmountNumber) !== 0) {
      alert(`立て替え者の合計金額が合計金額と一致しません（現在: ${totalPayerAmount}円）`);
      return;
    }

    const totalPayeePercent = Object.entries(payees)
      .filter(([, { checked }]) => checked)
      .reduce((sum, [, { percent }]) => sum + Number(percent || 0), 0);

    if (Math.abs(totalPayeePercent - 100) !== 0) {
      alert(`支払い対象者の割合の合計が100%ではありません（現在: ${totalPayeePercent}％）`);
      return;
    }

    if (selectedDate) {
      const formattedDate = formatDate(selectedDate.toISOString());
      console.log("支払い日:", formattedDate);
    }

    const payeeParticipants = Object.entries(payees)
      .filter(([, { checked }]) => checked)
      .map(([name, { percent }]) => {
        const shareRate = Number(percent);
        const shareAmount = Math.round(totalAmountNumber * (shareRate / 100));
        return {
          name,
          share_rate: shareRate,
          share_amount: shareAmount,
        };
      });


    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/groups/${uuid}/payments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          payment: {
            group_uuid: uuid,
            total_amount: trimmedTotalAmount,
            content,
            paid_at: selectedDate ? selectedDate.toISOString().split('T')[0] : Date.now(),
            payment_participants: users
              .filter((user: User) => 
                selectedPayers.some(p => p.id === user.id) || 
                payeeParticipants.some(p => p.name === user.name)
              )
              .map((user: User) => {
                const payer = selectedPayers.find(p => p.id === user.id);
                const payee = payeeParticipants.find(p => p.name === user.name);

                return {
                  user_id: user.id,
                  is_payer: payer ? true : false,
                  paid_amount: payer ? Number(payerAmounts[payer.id] || 0) : 0,
                  share_rate: payee ? Number(payee.share_rate) : 0,
                  share_amount: payee ? Number(payee.share_amount) : 0,
                };
              }),
          }
        })
      });

      if (!res.ok) throw new Error("支払い登録に失敗しました");

      const data = await res.json();
      console.log("支払い登録成功", data);
      navigate(`/group/${uuid}`);
    } catch (err) {
      console.error(err);
      alert("通信エラーが発生しました");
    }
  };

  const handlePayerChange = (event: SelectChangeEvent<number[]>) => {
    const {
      target: { value },
    } = event;

    const selectedIds = typeof value === 'string' ? value.split(',').map(Number) : value;
    const selectedUsers = users.filter((user: User) => selectedIds.includes(user.id));
    setSelectedPayers(selectedUsers);

    const trimmedTotalAmount = totalAmount.trim();
    const totalAmountNumber = Number(trimmedTotalAmount);

    let updatedPayerAmounts: { [id: number]: string } = {};
    if (!isNaN(totalAmountNumber) && totalAmountNumber > 0 && selectedUsers.length > 0) {
      const baseAmount = Math.floor(totalAmountNumber / selectedUsers.length);
      const remainder = totalAmountNumber - baseAmount * selectedUsers.length;

      selectedUsers.forEach((user: User, idx: number) => {
        updatedPayerAmounts[user.id] = String(baseAmount + (idx === selectedUsers.length - 1 ? remainder : 0));
      });
    } else {
      updatedPayerAmounts = Object.fromEntries(
        selectedUsers.map((user: User) => [user.id, payerAmounts[user.id] || ''])
      );
    }
    setPayerAmounts(updatedPayerAmounts);

    const updatedPayees = { ...payees };

    selectedUsers.forEach((user: User) => {
      if (!updatedPayees[user.name]) {
        updatedPayees[user.name] = {
          checked: true,
          percent: '',
        };
      } else {
        updatedPayees[user.name].checked = true;
      }
    });

    const checkedUsers = users.filter((user: User) => updatedPayees[user.name]?.checked);
    if (checkedUsers.length > 0) {
      const basePercent = Math.floor(100 / checkedUsers.length);
      const remainder = 100 - basePercent * checkedUsers.length;

      checkedUsers.forEach((user: User, idx: number) => {
        updatedPayees[user.name].percent = String(basePercent + (idx === checkedUsers.length - 1 ? remainder : 0));
      });
    }

    setPayees(updatedPayees);
  };

  const handlePayerAmountChange = (id: number, amount: string) => {
    setPayerAmounts((prev) => ({ ...prev, [id]: amount }));
  };

  const handlePayeeCheckChange = (name: string) => {
    const newChecked = !payees[name]?.checked;

    const updatedPayees = {
      ...payees,
      [name]: {
        checked: newChecked,
        percent: payees[name]?.percent || '',
      },
    };

    const checkedUsers = users.filter((user: User) => updatedPayees[user.name]?.checked);

    if (checkedUsers.length > 0) {
      const base = Math.floor(100 / checkedUsers.length);
      const remainder = 100 - base * checkedUsers.length;

      checkedUsers.forEach((user: User, idx: number) => {
        updatedPayees[user.name] = {
          checked: true,
          percent: String(base + (idx === checkedUsers.length - 1 ? remainder : 0)),
        };
      });
    }

    if (checkedUsers.length === 0) {
      Object.keys(updatedPayees).forEach((key) => {
        updatedPayees[key] = {
          checked: false,
          percent: '',
        };
      });
    }

    setPayees(updatedPayees);
  };

  const handlePayeePercentChange = (name: string, value: string) => {
    setPayees((prev) => ({
      ...prev,
      [name]: {
        ...prev[name],
        percent: value,
      },
    }));
  };

  const handleEvenDistribution = () => {
    const checkedUsers = users.filter((user: User) => payees[user.name]?.checked);

    if (checkedUsers.length === 0) return;

    const base = Math.floor(100 / checkedUsers.length);
    const remainder = 100 - base * checkedUsers.length;

    const newPayees = { ...payees };

    checkedUsers.forEach((user: User, idx: number) => {
      newPayees[user.name] = {
        checked: true,
        percent: String(base + (idx === checkedUsers.length - 1 ? remainder : 0)),
      };
    });

    setPayees(newPayees);
  };

  return (
    <div className="overflow-y-auto">
      <div className="mx-8 mt-10">
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
              placeholder="合計金額"
              value={totalAmount || ''}
              onChange={(e) => setTotalAmount(e.target.value)}
              required
            />
            <p className="text-xs">円</p>
          </div>
        </div>
        
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
                value={selectedPayers.map((u) => u.id)}
                onChange={handlePayerChange}
                input={<OutlinedInput label="選択してください" />}
                renderValue={(selected) =>
                  (selected as number[])
                    .map((id: number) => users.find((u: User) => u.id === id)?.name || '')
                    .join(', ')
                }
                sx={{ height: 36, backgroundColor: '#F3F4F7', marginLeft: 4, marginRight: 4 }}
                required
              >
                {users.map((user: User) => (
                  <MenuItem key={user.id} value={user.id}>
                    <Checkbox checked={selectedPayers.some((p) => p.id === user.id)} />
                    <ListItemText primary={user.name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          <div className="ml-8 mt-4 space-y-2">
            {selectedPayers.map(({ id, name }) => (
              <div key={id} className="flex items-center space-x-2">
                <span className="w-24 text-xs">{name}</span>
                <input
                  type="number"
                  className="input input-xs w-24 bg-[#F3F4F7] text-xs ml-12"
                  placeholder="立て替え額"
                  value={payerAmounts[id] || ''}
                  onChange={(e) => handlePayerAmountChange(id, e.target.value)}
                  required
                />
                <span className="text-xs">円</span>
              </div>
            ))}
          </div>
        </div> 

        <div className="mb-6">
          <div className="flex items-center mb-1 space-x-2">
            <FaPeopleGroup color="#F58220" className="text-2xl" />
            <label htmlFor="payer_name" className="text-xs">支払い対象者</label>
            <Require />
            <Multiple />
            <button 
              className="text-[10px] bg-[#F3F4F7] border border-[#D9D9D9] ml-8 px-1 hover:cursor-pointer"
              onClick={handleEvenDistribution}
            >
              均等にする
            </button>
          </div>

          <div className="mr-6 ml-8 mt-2 space-y-2">
            {users.map((user: User, idx: number) => {
              const isChecked = payees[user.name]?.checked || false;
              return (
                <div key={idx} className="flex justify-between items-center space-x-2">
                  <div className="flex items-center space-x-2">
                    <input
                      id={`payee-${idx}`}
                      type="checkbox"
                      className="checkbox checkbox-sm bg-[#F3F4F7]"
                      checked={isChecked}
                      onChange={() => handlePayeeCheckChange(user.name)}
                    />
                    <label htmlFor={`payee-${idx}`} className="text-xs">{user.name}</label>
                  </div>

                  {isChecked && (
                    <div className="flex items-center">
                      <input
                        type="number"
                        className="input input-xs w-16 bg-[#F3F4F7] text-xs"
                        value={payees[user.name]?.percent || ''}
                        onChange={(e) => handlePayeePercentChange(user.name, e.target.value)}
                        required
                      />
                      <span className="text-xs ml-1">%</span>
                    </div>
                  )}
                </div>
              );
            })}
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
              placeholder="例: 夕飯代"
              value={content}
              onChange={(e) => setContent(e.target.value)}
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
              dateFormat="YYYY/MM/dd"
              customInput={<CustomDateInput />}
              isClearable
            />
          </div>
        </div>

        <div className="text-center mt-10 space-y-4">
          <button 
            className="w-[80%] font-bold bg-[#F58220] text-white border-2 text-xs px-4 py-2 hover:bg-white hover:text-[#F58220] hover:cursor-pointer hover:border-[#F58220]"
            type="submit"
            onClick={handleCreatePayment}
          >
            登録する
          </button>
          <button 
            className="w-[80%] font-bold bg-[#D9D9D9] text-[#62686C] text-xs px-4 py-2 hover:bg-[#62686C] hover:text-[#D9D9D9] hover:cursor-pointer"
            onClick={() => navigate(`/group/${uuid}`)}
          >
            戻る
          </button>
        </div>

      </div>
    </div>
  )
}

export default GroupNew;