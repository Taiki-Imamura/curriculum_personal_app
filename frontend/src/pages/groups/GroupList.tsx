import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router';
import type { User, Payment, Debt } from '../../types/types';
import { formatDate } from '../../utils/date';
import LoadingSpinner from '../../components/LoadingSpinner';
import NotFound from '../../NotFound';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

const GroupList = () => {
  const navigate = useNavigate();
  const { uuid } = useParams();
  const [users, setUsers] = useState<User[]>([]);
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
        setUsers(data.users);
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

  // 合計金額
  const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);

  // 立て替え額
  function calculateDebts(payments: Payment[], users: User[]): Debt[] {
  const intermediateDebts: Debt[] = [];

  for (const payment of payments) {
    const localBalances: Record<number, number> = {};

    for (const participant of payment.participants) {
      const userId = participant.user_id;
      const delta = participant.paid_amount - participant.share_amount;
      localBalances[userId] = (localBalances[userId] || 0) + delta;
    }

    const creditors = Object.entries(localBalances)
      .filter(([, balance]) => balance > 0)
      .map(([userId, balance]) => ({ userId: Number(userId), balance }));

    const debtors = Object.entries(localBalances)
      .filter(([, balance]) => balance < 0)
      .map(([userId, balance]) => ({ userId: Number(userId), balance }));

    for (const debtor of debtors) {
      let remaining = -debtor.balance;

      for (const creditor of creditors) {
        if (remaining === 0) break;
        if (creditor.balance === 0) continue;

        const payAmount = Math.min(remaining, creditor.balance);

        intermediateDebts.push({
          from: users.find(u => u.id === debtor.userId)!.name,
          to: users.find(u => u.id === creditor.userId)!.name,
          amount: payAmount,
        });

        creditor.balance -= payAmount;
        remaining -= payAmount;
      }
    }
  }

  const summary: { [key: string]: number } = {};
  const nameToId: { [name: string]: number } = {};
  users.forEach(u => { nameToId[u.name] = u.id; });

  intermediateDebts.forEach(debt => {
    const [id1, id2] = [nameToId[debt.from], nameToId[debt.to]];
    const [from, to] = id1 < id2 ? [debt.from, debt.to] : [debt.to, debt.from];
    const key = `${from}|${to}`;

    summary[key] = (summary[key] || 0) + (id1 < id2 ? debt.amount : -debt.amount);
  });

  const finalDebts: Debt[] = [];

  Object.entries(summary).forEach(([key, netAmount]) => {
    if (netAmount === 0) return;
    const [from, to] = key.split("|");
    if (netAmount > 0) {
      finalDebts.push({ from, to, amount: netAmount });
    } else {
      finalDebts.push({ from: to, to: from, amount: -netAmount });
    }
  });

  return finalDebts;
}
  const debts = calculateDebts(payments, users);

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
      <h1 className="text-2xl text-center font-bold mt-10">支払いを記録しよう！</h1>

      <div className="text-center">
        <button 
          className="w-[80%] font-bold text-[#F58220] border border-2 text-xs my-4 px-4 py-2 hover:bg-[#F58220] hover:text-white"
          onClick={() => navigate(`/group/${uuid}/new`, { state: { users } })}
        >
          支払いを記録する
        </button>


        {payments.map((payment) => (
          <div key={payment.id} className="flex justify-between items-center border-b-2 border-gray-200 mx-6 mt-6 px-2 pb-2">
            <div className="flex flex-col items-start w-[60%]">
              <p className="text-sm">{payment.title}</p>
              <p className="text-start text-[10px] text-gray-500">
                立て替え: {payment.participants.filter((p) => p.is_payer).map((p) => p.user_name).join('・')}
              </p>
              <p className="text-start text-[10px] text-gray-500">
                {payment.participants.map(p => p.user_name).join('・')}
              </p>
              <p className="text-xs text-gray-500">{formatDate(payment.paid_at)}</p>
            </div>
            <p className="w-[20%] text-sm">¥{payment.amount}</p>
            <button 
              className="bg-[#F58220] rounded-md font-bold text-[10px] text-white px-2 py-1 hover:cursor-pointer"
              onClick={() => navigate(`/group/${uuid}/show/${payment.id}`)}
            >
              詳細
            </button>
          </div>
        ))}

        <div className="mt-10 mb-6">
          <p className="text-start text-sm font-bold mb-2 px-12">合計金額</p>
          <p className="font-bold text-2xl">¥{totalAmount}</p>
        </div>

        {debts.length > 0 && (
          <div className="mb-6">
            <div className="flex justify-between items-center mr-12">
              <p className="text-start text-sm font-bold my-4 px-12">立て替え額</p>
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
            {debts.map((debt, index) => (
              <div
                key={index}
                className="flex mx-10 px-2 justify-between items-center border-b-2 border-gray-200 mb-4 pb-2"
              >
                <div className="flex flex-col items-start">
                  <p className="text-xs">{debt.from} → {debt.to}</p>
                </div>
                <p className="w-[20%] text-xs">{formatAmount(debt.amount, unit)}</p>
              </div>
            ))}
          </div>
        )}

        <div className="mt-10 mb-6 mx-4">
          {payments.map((payment) => {
            const displayableLinks = payment.paypay_links?.filter((link) => link.display_on_list);

            return (
              displayableLinks && displayableLinks.length > 0 && (
                <div key={payment.id} className="mt-6">
                  <p className="ml-8 text-start text-sm font-bold">支払いリンク</p>
                  <ul className="mt-1 space-y-2">
                    {displayableLinks.map((link, index) => {
                      const displayedUrl =
                        link.paypay_link.length > 50
                          ? link.paypay_link.substring(0, 50) + '...'
                          : link.paypay_link;
                      return (
                        <li key={index} className="text-xs text-start ml-8 mt-2">
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
                  </ul>
                </div>
              )
            );
          })}
        </div>
      </div>
    </div>
  )
}

export default GroupList;