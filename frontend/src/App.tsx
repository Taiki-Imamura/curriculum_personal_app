import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900">
      <Header />
      <RouterProvider router={router} />
      <Footer />
    </div>
  )
}

export default App;
