import { BrowserRouter, Routes, Route } from "react-router-dom";
   import AuthPage from "./components/AuthPage";
   import Dashboard from "./components/Dashboard";

   export default function App() {
     return (
       <BrowserRouter>
         <Routes>
           <Route path="/" element={<AuthPage />} />
           <Route path="/dashboard" element={<Dashboard />} />
           <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

         </Routes>
       </BrowserRouter>
     );
   }