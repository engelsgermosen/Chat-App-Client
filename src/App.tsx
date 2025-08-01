import { Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Amigos from "./pages/Amigos";
import ChatPage from "./pages/ChatPage";

function App() {
  return (
    <div className="flex flex-col min-h-screen w-screen">
      <Routes>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="amigos" element={<Amigos />} />
        <Route path="/chat/:otherId" element={<ChatPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
