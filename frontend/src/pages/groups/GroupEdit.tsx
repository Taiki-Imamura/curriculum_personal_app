import { useState, useEffect } from 'react';
import Require from '../../components/Require';
import Optional from '../../components/Optional';
import Multiple from '../../components/Multiple';
import { FaPerson, FaPeopleGroup, FaCreditCard, FaFile, FaLink, FaCalendar } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";
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
import { useNavigate, useParams } from 'react-router';
import type { User, Payment, Participant, LinkItem } from '../../types/types';
import LoadingSpinner from '../../components/LoadingSpinner'
import NotFound from '../../NotFound';

const GroupEdit = () => {
  const navigate = useNavigate();
  const { uuid, paymentId } = useParams();

  const [totalAmount, setTotalAmount] = useState('');
  const [selectedPayers, setSelectedPayers] = useState<{ id: number; name: string }[]>([]);
  const [payerAmounts, setPayerAmounts] = useState<{ [id: number]: string }>({});
  const [payees, setPayees] = useState<{ [name: string]: { checked: boolean; percent: string } }>({});
  const [content, setContent] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [linkItems, setLinkItems] = useState<LinkItem[]>([
    { paypay_link: "", display_on_list: false },
  ]);

  useEffect(() => {
    const fetchGroupData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/groups/${uuid}`);
        if (!res.ok) throw new Error('getエラー');
        const data = await res.json();
        setUsers(data.users);
        
        const targetPayment = data.payments.find((p: Payment) => p.id === Number(paymentId));
        if (!targetPayment) return setNotFound(true);

        setTotalAmount(String(targetPayment.amount));
        setContent(targetPayment.title);
        setSelectedDate(new Date(targetPayment.paid_at));

        const payers = targetPayment.participants.filter((p: Participant) => p.is_payer);
        setSelectedPayers(payers.map((p: Participant) => ({ id: p.user_id, name: p.user_name })));
        setPayerAmounts(Object.fromEntries(payers.map((p: Participant) => [p.user_id, String(p.paid_amount)])));

        const newPayees: { [name: string]: { checked: boolean; percent: string } } = {};
        targetPayment.participants.forEach((p: Participant) => {
          newPayees[p.user_name] = {
            checked: true,
            percent: p.share_rate !== null ? String(p.share_rate) : '',
          };
        });
        setPayees(newPayees);

        if (targetPayment.paypay_links && Array.isArray(targetPayment.paypay_links)) {
          setLinkItems(targetPayment.paypay_links.map(link => ({
            paypay_link: link.paypay_link || "",
            display_on_list: link.display_on_list || false,
          })));
        }
      } catch (err) {
        console.error(err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    if (uuid && paymentId) fetchGroupData();
  }, [uuid, paymentId]);

  if (loading) return <LoadingSpinner />;
  if (notFound) return <NotFound />;

  const handleUpdatePayment = async () => {
    const trimmedTotalAmount = totalAmount.trim();
    const totalAmountNumber = Number(trimmedTotalAmount);
    const filteredLinkItems = linkItems.filter(item => item.paypay_link.trim() !== "");

    if (!trimmedTotalAmount || isNaN(totalAmountNumber) || totalAmountNumber <= 0) {
      alert("合計金額を正しく入力してください");
      return;
    }

    if (selectedPayers.length === 0) {
      alert("立て替え者を選択してください");
      return;
    }

    if (!content) {
      alert("内容を記入してください")
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
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/groups/${uuid}/payments/${paymentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          payment: {
            id: paymentId,
            total_amount: trimmedTotalAmount,
            content,
            paid_at: selectedDate ? selectedDate.toISOString().split('T')[0] : Date.now(),
            paypay_links: filteredLinkItems,
            payment_participants: users
              .filter((user) =>
                selectedPayers.some(p => p.id === user.id) ||
                payeeParticipants.some(p => p.name === user.name)
              )
              .map((user) => {
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

      if (!res.ok) throw new Error("支払い更新に失敗しました");

      const data = await res.json();
      console.log("支払い更新成功", data);
      alert("支払い更新に成功しました");
      navigate(`/group/${uuid}/show/${paymentId}`);
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
    const selectedUsers = users.filter((user) => selectedIds.includes(user.id));
    setSelectedPayers(selectedUsers);

    const trimmedTotalAmount = totalAmount.trim();
    const totalAmountNumber = Number(trimmedTotalAmount);

    let updatedPayerAmounts: { [id: number]: string } = {};
    if (!isNaN(totalAmountNumber) && totalAmountNumber > 0 && selectedUsers.length > 0) {
      const baseAmount = Math.floor(totalAmountNumber / selectedUsers.length);
      const remainder = totalAmountNumber - baseAmount * selectedUsers.length;

      selectedUsers.forEach((user, idx) => {
        updatedPayerAmounts[user.id] = String(baseAmount + (idx === selectedUsers.length - 1 ? remainder : 0));
      });
    } else {
      updatedPayerAmounts = Object.fromEntries(
        selectedUsers.map((user) => [user.id, payerAmounts[user.id] || ''])
      );
    }
    setPayerAmounts(updatedPayerAmounts);

    const updatedPayees = { ...payees };

    selectedUsers.forEach((user) => {
      if (!updatedPayees[user.name]) {
        updatedPayees[user.name] = {
          checked: true,
          percent: '',
        };
      } else {
        updatedPayees[user.name].checked = true;
      }
    });

    const checkedUsers = users.filter((user) => updatedPayees[user.name]?.checked);
    if (checkedUsers.length > 0) {
      const basePercent = Math.floor(100 / checkedUsers.length);
      const remainder = 100 - basePercent * checkedUsers.length;

      checkedUsers.forEach((user, idx) => {
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

    setPayees(updatedPayees);
    evenDistribution(updatedPayees);
  };

  const evenDistribution = (currentPayees: typeof payees) => {
    const checkedUsers = users.filter((user) => currentPayees[user.name]?.checked);

    if (checkedUsers.length === 0) {
      Object.keys(currentPayees).forEach((key) => {
        currentPayees[key] = {
          checked: false,
          percent: '',
        };
      });
      setPayees({...currentPayees});
      return;
    }

    const basePercent = Math.floor(100 / checkedUsers.length);
    const remainder = 100 - basePercent * checkedUsers.length;

    checkedUsers.forEach((user) => {
      currentPayees[user.name] = {
        checked: true,
        percent: String(basePercent),
      };
    });

    for (let i = 0; i < remainder; i++) {
      const index = i % checkedUsers.length;
      currentPayees[checkedUsers[index].name].percent = String(Number(currentPayees[checkedUsers[index].name].percent) + 1);
    }

    let loop = true;
    const maxIterations = 1000;
    let iterationCount = 0;

    while (loop && iterationCount < maxIterations) {
      loop = false;
      iterationCount++;

      let totalPercent = 0;
      checkedUsers.forEach((user) => {
        totalPercent += Number(currentPayees[user.name].percent);
      });
      const averagePercent = totalPercent / checkedUsers.length;

      checkedUsers.forEach((user) => {
        const percent = Number(currentPayees[user.name].percent);
        const diff = percent - averagePercent;

        if (Math.abs(diff) > 1) {
          loop = true;

          const adjustAmount = Math.min(Math.abs(diff) / 2, 1);
          const adjustDirection = diff > 0 ? -adjustAmount : adjustAmount;

          currentPayees[user.name].percent = String(percent + adjustDirection);
        }
      });
    }

    setPayees({ ...currentPayees });

    if (iterationCount === maxIterations) {
      console.warn("偶数分布アルゴリズムが最大反復に達した。完全にバランスが取れていない可能性がある。");
    }
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
    const checkedUsers = users.filter((user) => payees[user.name]?.checked);

    if (checkedUsers.length === 0) return;

    const basePercent = Math.floor(100 / checkedUsers.length);
    const remainder = 100 - basePercent * checkedUsers.length;

    const newPayees: Record<string, { checked: boolean; percent: string }> = { ...payees };

    checkedUsers.forEach((user) => {
      newPayees[user.name] = {
        checked: true,
        percent: String(basePercent),
      };
    });

    for (let i = 0; i < remainder; i++) {
      const index = i % checkedUsers.length;
      newPayees[checkedUsers[index].name].percent = String(Number(newPayees[checkedUsers[index].name].percent) + 1);
    }

    let loop = true;
    const maxIterations = 1000;
    let iterationCount = 0;

    while (loop && iterationCount < maxIterations) {
      loop = false;
      iterationCount++;

      let totalPercent = 0;
      checkedUsers.forEach((user) => {
        totalPercent += Number(newPayees[user.name].percent);
      });
      const averagePercent = totalPercent / checkedUsers.length;

      checkedUsers.forEach((user) => {
        const percent = Number(newPayees[user.name].percent);
        const diff = percent - averagePercent;

        if (Math.abs(diff) > 1) {
          loop = true;

          const adjustAmount = Math.min(Math.abs(diff) / 2, 1);
          const adjustDirection = diff > 0 ? -adjustAmount : adjustAmount;

          newPayees[user.name].percent = String(percent + adjustDirection);
        }
      });
    }

    setPayees(newPayees);

    if (iterationCount === maxIterations) {
      console.warn("偶数分布アルゴリズムが最大反復に達した。完全にバランスが取れていない可能性がある。");
    }
  };

  const handleLinkChange = (index: number, key: keyof LinkItem, value: string | boolean) => {
    const updated = [...linkItems];
    updated[index][key] = value as never;
    setLinkItems(updated);
  };

  const addLinkItem = () => {
    setLinkItems([...linkItems, { paypay_link: "", display_on_list: false }]);
  };

  const removeLinkItem = (index: number) => {
    const updated = linkItems.filter((_, i) => i !== index);
    setLinkItems(updated);
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
                    .map((id) => users.find((u) => u.id === id)?.name || '')
                    .join(', ')
                }
                sx={{ height: 36, backgroundColor: '#F3F4F7', marginLeft: 4, marginRight: 4 }}
                required
              >
                {users.map((user) => (
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
            {users.map((user, idx) => {
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
            <FaLink color="#F58220" className="text-2xl" />
            <label className="text-xs">支払い先リンク</label>
            <Optional />
          </div>

          <p className="text-[9px] text-center text-red-500 ml-2">※一覧画面にもリンクを表示したい場合はチェックを入れてください</p>

          {linkItems.map((item, index) => (
            <div key={index} className="flex items-center space-x-4 ml-8 my-2">
              <input
                type="text"
                className="input input-sm w-[70%] bg-[#F3F4F7] py-2"
                value={item.paypay_link}
                onChange={(e) => handleLinkChange(index, "paypay_link", e.target.value)}
                placeholder="https://qr.paypay.ne.jp/"
              />
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  className="checkbox checkbox-sm bg-[#F3F4F7]"
                  checked={item.display_on_list}
                  onChange={(e) => handleLinkChange(index, "display_on_list", e.target.checked)}
                />
              </label>
              <button
                onClick={() => removeLinkItem(index)}
                className="text-red-500 hover:text-red-700"
                aria-label="削除"
              >
                <MdDelete size={24} />
              </button>
            </div>
          ))}

          <button
            onClick={addLinkItem}
            className="ml-8 mt-2 text-xs text-blue-600 hover:underline"
          >
            ＋ リンクを追加
          </button>
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
            onClick={handleUpdatePayment}
          >
            更新する
          </button>
          <button 
            className="w-[80%] font-bold bg-[#D9D9D9] text-[#62686C] text-xs px-4 py-2 hover:bg-[#62686C] hover:text-[#D9D9D9] hover:cursor-pointer"
            onClick={() => navigate(`/group/${uuid}/show/${paymentId}`)}
          >
            戻る
          </button>
        </div>

      </div>
    </div>
  )
};

export default GroupEdit;