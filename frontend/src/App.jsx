import Login from "./pages/Login";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SignUp from "./pages/SignUp/Signup";
import EmailVerification from "./pages/EmailVerfication";

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/emailverification" element={<EmailVerification />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
