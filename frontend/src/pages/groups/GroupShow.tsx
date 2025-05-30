import React, { useState, useEffect } from 'react';
import { FaPerson, FaPeopleGroup, FaCreditCard, FaFile, FaLink, FaCalendar } from "react-icons/fa6";
import { useNavigate, useParams } from 'react-router';
import type { Payment, LinkItem } from '../../types/types';
import type { SelectChangeEvent } from '@mui/material';
import LoadingSpinner from '../../components/LoadingSpinner';
import NotFound from '../../NotFound';
import { formatDate } from '../../utils/date';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

const GroupShow = () => {
  const navigate = useNavigate();
  const { uuid, paymentId } = useParams();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [unit, setUnit] = React.useState('');

  useEffect(() => {
    const fetchGroupData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/groups/${uuid}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });
        if (!res.ok) throw new Error('fetchエラー');
        const data = await res.json();
        setPayments(data.payments);
      } catch (err) {
        console.error('グループ情報の取得に失敗しました', err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    if (uuid) fetchGroupData();
  }, [uuid]);

  if (loading) return <LoadingSpinner />;
  if (notFound) return <NotFound />;

  const payment = payments.find(p => Number(p.id) === Number(paymentId));
  if (!payment) return <NotFound />;

  const balances = payment.participants.map((p) => ({
    name: p.user_name,
    balance: (p.paid_amount || 0) - (p.share_amount || 0)
  }));

  const calculateDebts = (balances: { name: string; balance: number }[]) => {
    const payers = balances.filter(b => b.balance > 0).sort((a, b) => b.balance - a.balance);
    const payees = balances.filter(b => b.balance < 0).sort((a, b) => a.balance - b.balance);

    const calculates: { from: string; to: string; amount: number }[] = [];

    let i = 0, j = 0;

    while (i < payers.length && j < payees.length) {
      const payer = payers[i];
      const payee = payees[j];
      const amount = Math.min(payer.balance, -payee.balance);

      if (amount > 0) {
        calculates.push({ from: payee.name, to: payer.name, amount });
        payer.balance -= amount;
        payee.balance += amount;
      }

      if (payer.balance === 0) i++;
      if (payee.balance === 0) j++;
    }

    return calculates;
  };

  const calculates = calculateDebts(balances);

  const handleDelete = async () => {
    if (!confirm("本当に削除しますか？")) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/groups/${uuid}/payments/${paymentId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (!res.ok) throw new Error('削除に失敗しました');

      alert("削除が完了しました");
      navigate(`/group/${uuid}`);
    } catch (err) {
      console.error(err);
      alert("削除に失敗しました。");
    }
  };

  // 金額単位の変更
  const handleUnitChange = (event: SelectChangeEvent) => {
    setUnit(event.target.value);
  };

  // 金額単位に応じて立て替え楽の表示変更
  const formatAmount = (amount: number, unit: string): string => {
    const unitValue = Number(unit) || 1;
    const rounded = Math.round(amount / unitValue) * unitValue;
    return `¥${rounded}`;
  };

  return (
    <div className="overflow-y-auto">
      <div className="mx-10 mt-10 space-y-6">
        <div>
          <div className="flex items-center mb-4 space-x-4">
            <FaPerson color="#F58220" className="text-2xl" />
            <label className="text-xs">立て替え者</label>
          </div>
          {payment.participants.filter(p => p.is_payer).map((p, idx) => (
            <div key={idx} className="flex justify-between items-center w-[77%] ml-10">
              <p className="text-xs mb-2">{p.user_name}</p>
              <p className="text-xs mb-2">¥{p.paid_amount}</p>
            </div>
          ))}
        </div>

        <div>
          <div className="flex items-center mb-4 space-x-4">
            <FaPeopleGroup color="#F58220" className="text-2xl" />
            <label className="text-xs">支払い対象者</label>
          </div>
          {payment.participants.filter(p => p.share_rate > 0).map((p, idx) => (
            <div key={idx} className="grid grid-cols-3 ml-10 mr-3 space-y-2">
              <p className="text-xs">{p.user_name}</p>
              <p className="text-xs ml-4">{p.share_rate}%</p>
              <p className="text-xs text-center">¥{p.share_amount}</p>
            </div>
          ))}
        </div>

        <div>
          <div className="flex items-center space-x-4">
            <FaCreditCard color="#F58220" className="text-2xl" />
            <label className="text-xs">支払い金額</label>
          </div>
          <div className="flex justify-between items-center h-8 mr-6 mb-4">
            <p className="ml-10 text-xs">¥{payment.amount}</p>
            <FormControl variant="standard">
              <InputLabel 
                id="amount-unit-label" 
                sx={{ fontSize: '12px' }}
              >
                金額単位
              </InputLabel>
              <Select
                labelId="amount-unit-label"
                id="amount-unit"
                value={unit}
                onChange={handleUnitChange}
                label="金額単位"
                sx={{ fontSize: '12px' }}
                className="mb-4 pr-8"
              >
                <MenuItem value="">
                  <p>選択してください</p>
                </MenuItem>
                <MenuItem value={1}>1円</MenuItem>
                <MenuItem value={10}>10円</MenuItem>
                <MenuItem value={100}>100円</MenuItem>
                <MenuItem value={1000}>1000円</MenuItem>
              </Select>
            </FormControl>
          </div>
          {calculates.length > 0 && (
            <div className="mb-8">
              
              {calculates.map((c, index) => (
                <div
                  key={index}
                  className="flex ml-8 mr-6 mb-4 px-2 pb-2 justify-between items-center border-b-2 border-gray-200"
                >
                  <div className="flex flex-col items-start">
                    <p className="text-xs">{c.from} → {c.to}</p>
                  </div>
                  <p className="w-[20%] text-xs">{formatAmount(c.amount, unit)}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center mb-4 space-x-4">
            <FaFile color="#F58220" className="text-2xl" />
            <label className="text-xs">内容</label>
          </div>
          <p className="ml-10 mt-1 text-xs">{payment.title}</p>
        </div>

        {payment.paypay_links && payment.paypay_links.length > 0 && (
          <div>
            <div className="flex items-center mb-4 space-x-4">
              <FaLink color="#F58220" className="text-2xl" />
              <label className="text-xs">支払いリンク</label>
            </div>
            <div className="ml-10 space-y-2">
              {payment.paypay_links.map((link: LinkItem, index: number) => {
                const displayedUrl = link.paypay_link.length > 40 ? link.paypay_link.substring(0, 40) + '...' : link.paypay_link;
                return (
                  <li key={index} className="text-xs truncate overflow-hidden whitespace-nowrap">
                    <a
                      href={link.paypay_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#007bff] underline"
                      title={link.paypay_link}
                    >
                      {displayedUrl}
                    </a>
                  </li>
                );
              })}
            </div>
          </div>
        )}

        <div className="mb-6">
          <div className="flex items-center mb-4 space-x-4">
            <FaCalendar color="#F58220" className="text-2xl" />
            <label className="text-xs">支払い日</label>
          </div>
          <p className="ml-10 mt-2 text-xs">{formatDate(payment.paid_at)}</p>
        </div>

        <div className="text-center mt-8 space-y-4">
          <button 
            className="w-[80%] font-bold bg-[#F58220] text-white border-2 text-xs px-4 py-2 hover:bg-white hover:text-[#F58220] hover:cursor-pointer hover:border-[#F58220]"
            onClick={() => navigate(`/group/${uuid}/edit/${paymentId}`)}
          >
            編集する
          </button>
          <button 
            className="w-[80%] font-bold bg-white text-[#EB1010] border-2 text-xs px-4 py-2 hover:bg-[#EB1010] hover:text-white hover:cursor-pointer"
            onClick={handleDelete}
          >
            削除する
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
  );
};

export default GroupShow;