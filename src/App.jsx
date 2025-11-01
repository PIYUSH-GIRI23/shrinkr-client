import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./components/Homepage.jsx";
import Dashboard from "./components/Dashboard.jsx";
import Redirect from "./components/Redirect.jsx";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function App() {
  return (
    <>
    <Router>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route exact path="/dashboard" element={<Dashboard />} />
          <Route path="/:shortCode" element={<Redirect />} />
        </Routes>
    </Router>
    <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  )
}

export default App
