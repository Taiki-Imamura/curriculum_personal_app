import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import GroupHeader from '../GroupHeader';

type User = {
  id: number;
  name: string;
};

const GroupLayout = ({ children }: { children: React.ReactNode }) => {
  const { groupId } = useParams<{ groupId: string }>();
  const [groupName, setGroupName] = useState('');
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/groups/${groupId}`);
        if (!res.ok) throw new Error('API error');
        const data = await res.json();
        setGroupName(data.group_name);
        setUsers(data.users);
      } catch (err) {
        console.error('GroupLayout fetch failed:', err);
      }
    };

    if (groupId) fetchGroupData();
  }, [groupId]);

  return (
    <div>
      <GroupHeader groupName={groupName} userNames={users.map(user => user.name)} />
      {children}
    </div>
  );
};

export default GroupLayout;
