type GroupHeaderProps = {
  groupName: string;
  userNames: string[];
};

const GroupHeader = ({ groupName, userNames }: GroupHeaderProps) => {
  return (
    <header className="bg-[#F58220] text-white px-4 pb-2">
      <h2 className="text-lg font-bold ml-4">{groupName}</h2>
      <h3 className="text-xs mt-1 ml-4">{userNames.join('・')}</h3>
    </header>
  );
};

export default GroupHeader;