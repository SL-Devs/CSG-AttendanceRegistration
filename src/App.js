import "./App.css";
import { QRhome, SignIn, SignUp, Dashboard } from "./Pages";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <div className="App">
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="qrhome/:id" element={<QRhome />} />
        <Route path="dashboard/:id" element={<Dashboard />} />
      </Routes>
    </div>
  );
}

export default App;
