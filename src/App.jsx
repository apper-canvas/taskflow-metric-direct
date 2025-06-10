import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Layout from './Layout'
import HomePage from '@/components/pages/HomePage';
import NotFoundPage from '@/components/pages/NotFoundPage';
import { routes } from './config/routes'

function App() {
  return (
    <BrowserRouter>
      <ToastContainer 
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        className="z-[9999]"
        toastClassName="bg-white shadow-lg border border-gray-200"
        progressClassName="bg-primary"
      />
      
      <Routes>
        <Route path="/" element={<Layout />}>
<Route index element={<HomePage />} />
          <Route path="home" element={<HomePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App