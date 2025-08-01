import { useParams } from "react-router-dom";
import DirectChat from "@/components/DirectChat";
import Header from "@/components/Header";

export default function ChatPage() {
  const { otherId } = useParams<{ otherId: string }>();
  const currentUserId = sessionStorage.getItem("id");
  if (!otherId || !currentUserId) {
    return <div>No hay usuario seleccionado</div>;
  }
  return (
    <div className="flex flex-col min-h-screen w-screen bg-gray-200">
      <Header />
      <DirectChat currentUserId={currentUserId} otherUserId={otherId} />
    </div>
  );
}
