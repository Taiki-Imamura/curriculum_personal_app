const Footer = () => {
  return (
    <footer>
      <div className="bg-[#F58220] shadow-sm dark:bg-gray-800">
        <div className="flex font-bold justify-center text-white text-xs space-x-20 py-5">
          <a href="/" className="ml-4">利用規約</a>
          <a href="/" className="ml-8">プライバシーポリシー</a>
        </div>
      </div>
      <div className="bg-[#62686C] shadow-sm dark:bg-gray-800">
        <div className="flex justify-center text-white text-xs">
          <p className="ml-4 py-2">© 2025 ワリペイ</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;