import Header from "@/components/Header";
import { useSocket } from "@/hooks/useSocket";
import { decodeJWT } from "@/utils/helper/decodeJwt";
import { useEffect } from "react";
import { Navigate } from "react-router-dom";

const Home = () => {
  const token = sessionStorage.getItem("token");

  const socketRef = useSocket();

  useEffect(() => {
    // const socket = socketRef.current;
    const token = sessionStorage.getItem("token");
    if (token) {
      const user = decodeJWT(token);
      sessionStorage.setItem("id", user._id);
    }
  }, [socketRef]);

  if (!token) return <Navigate to={"/login"} replace />;

  return (
    <div className="flex flex-col h-full">
      <Header />
      <h1 className="text-red-500">Hello world</h1>
    </div>
  );
};

export default Home;
