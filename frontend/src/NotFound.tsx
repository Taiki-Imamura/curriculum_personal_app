import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">404</h1>
      <p className="mb-4">ページが見つかりませんでした。</p>
      <button
        className="bg-[#F58220] text-white px-4 py-2 rounded hover:bg-[#E5731F]"
        onClick={() => navigate('/')}
      >
        トップページに戻る
      </button>
    </div>
  );
};

export default NotFound;
