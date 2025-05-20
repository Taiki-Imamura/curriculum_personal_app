import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const NotFound = () => {
  const location = useLocation();
  const previousPath = location.state?.from || '/';

  return (
    <div className="text-center mt-20">
      <h1 className="text-2xl font-bold">404 - ページが見つかりません</h1>
      <p className="mt-4">お探しのページは存在しないか、移動しました。</p>
      <Link to={previousPath} className="text-blue-500 underline mt-6 inline-block">
        ホームに戻る
      </Link>
    </div>
  );
};

export default NotFound;
