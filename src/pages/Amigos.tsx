"use client";

import Header from "@/components/Header";
import { useEffect, useState } from "react";
import apiClient from "@/apiClient";
import { type IUser } from "@/types";
import { decodeJWT } from "@/utils/helper/decodeJwt";
import { Link, Navigate } from "react-router-dom";
import { useSocket } from "@/hooks/useSocket";

export default function Amigos() {
  const token = sessionStorage.getItem("token");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState<IUser | null | undefined>();
  const [allUsers, setAllUsers] = useState<IUser[]>([]);
  const [friends, setFriends] = useState<IUser[]>([]);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      setUser(decodeJWT(token));
    }
  }, []);

  useEffect(() => {
    if (!user) return;

    const fetchFriendsData = async () => {
      try {
        const token = sessionStorage.getItem("token");

        // 1) Obtener los que NO son amigos
        const { data: noFriendsResp } = await apiClient.get(
          `/user/${user._id}/noFriends`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (noFriendsResp.success) {
          setAllUsers(noFriendsResp.data);
        }

        // 2) Obtener los amigos
        const { data: friendsResp } = await apiClient.get(
          `/user/${user._id}/Friends`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (friendsResp.success) {
          setFriends(friendsResp.data);
        }
      } catch (err) {
        console.error("Error cargando amigos/no-amigos:", err);
      }
    };
    fetchFriendsData();
  }, [user]);

  const socketRef = useSocket();
  const userId = sessionStorage.getItem("id");

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !userId) return;

    socket.emit("joinRoom", { room: userId });
    const handleDeleted = ({ friendId }: { friendId: string }) => {
      console.log("Llego el evento handleDelete");
      setFriends((prev) => prev.filter((f) => f._id !== friendId));
    };

    const handleAdd = (user: IUser) => {
      closeModal();
      console.log("Llegando el evento handleAdd");
      setAllUsers((prev) => prev.filter((f) => f._id !== user._id));
      setFriends([...friends, user]);
    };

    socket.on("friendDeleted", handleDeleted);
    socket.on("friendAdded", handleAdd);

    return () => {
      socket.off("friendDeleted", handleDeleted);
      socket.off("friendAdded", handleAdd);
    };
  }, [socketRef]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const addFriend = async (userId1: string) => {
    const userId2 = sessionStorage.getItem("id");
    const payload = {
      userId1,
      userId2,
    };
    const { data } = await apiClient.post("/friendShip/", payload);

    if (data.success) {
      closeModal();
    }
  };

  const removeFriend = async (userId: string) => {
    await fetch(`${import.meta.env.VITE_BACKEND_URL}/user/${userId}/friend`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    // if (response.status == 204) {
    //   setFriends(friends.filter((x) => x._id != userId));
    // }
  };

  if (!token) return <Navigate to={"/login"} replace />;
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700">
      {/* Header */}
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-xl p-8">
          {/* Header de la página */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                Mis Amigos
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Tienes {friends.length} amigos conectados
              </p>
            </div>
            <button
              onClick={openModal}
              className="bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 dark:from-slate-500 dark:to-slate-600 dark:hover:from-slate-400 dark:hover:to-slate-500 text-white font-medium py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-500 dark:focus:ring-slate-400 focus:ring-offset-2 dark:focus:ring-offset-slate-800 flex items-center space-x-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              <span>Agregar Amigo</span>
            </button>
          </div>

          {/* Lista de amigos */}
          {friends.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-slate-400 dark:text-slate-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
                No tienes amigos aún
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                Comienza agregando algunos amigos para conectarte con ellos
              </p>
              <button
                onClick={openModal}
                className="text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:underline"
              >
                Agregar tu primer amigo
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {friends.map((friend) => (
                <div
                  key={friend._id}
                  className="bg-slate-50 dark:bg-slate-700 rounded-lg p-6 hover:bg-slate-100 dark:hover:bg-slate-600 transition-all duration-200 border border-slate-200 dark:border-slate-600 group"
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="relative">
                      <img
                        src={
                          friend.avatar
                            ? `http://localhost:8080${friend.avatar}`
                            : "/placeholder.svg"
                        }
                        alt={friend.name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-slate-300 dark:border-slate-500"
                      />
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white dark:border-slate-700 rounded-full"></div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors duration-200">
                        {friend.name}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 text-sm">
                        {friend.email}
                      </p>
                      <p className="text-green-600 dark:text-green-400 text-xs font-medium mt-1">
                        En línea
                      </p>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Link
                      to={`/chat/${friend._id}`}
                      className="flex-1 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 text-slate-700 dark:text-slate-200 font-medium py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                      <span>Mensaje</span>
                    </Link>
                    <button
                      onClick={() => removeFriend(friend._id)}
                      className="bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 font-medium py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Modal para agregar amigos */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Overlay */}
            <div
              className="fixed inset-0 bg-slate-500 bg-opacity-75 dark:bg-slate-900 dark:bg-opacity-75 transition-opacity -z-50"
              onClick={closeModal}
            />

            {/* Modal */}
            <div className="inline-block align-bottom bg-white dark:bg-slate-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="bg-white dark:bg-slate-800 px-6 pt-6 pb-4">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    Agregar Amigos
                  </h3>
                  <button
                    onClick={closeModal}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors duration-200"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                {/* Barra de búsqueda */}
                <div className="mb-6">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Buscar usuarios..."
                      className="w-full px-4 py-3 pl-10 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500 dark:focus:ring-slate-400 focus:border-transparent transition-all duration-200"
                    />
                    <svg
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                </div>

                {/* Lista de usuarios disponibles */}
                <div className="max-h-96 overflow-y-auto">
                  {allUsers.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-slate-600 dark:text-slate-400">
                        No hay más usuarios disponibles para agregar
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {allUsers.map((user) => (
                        <div
                          key={user._id}
                          className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors duration-200"
                        >
                          <div className="flex items-center space-x-4">
                            <img
                              src={
                                user.avatar
                                  ? `http://localhost:8080${user.avatar}`
                                  : "/placeholder.svg"
                              }
                              alt={user.name}
                              className="w-12 h-12 rounded-full object-cover border-2 border-slate-300 dark:border-slate-500"
                            />
                            <div>
                              <h4 className="text-lg font-medium text-slate-900 dark:text-slate-100">
                                {user.name}
                              </h4>
                              <p className="text-slate-600 dark:text-slate-400 text-sm">
                                {user.email}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => addFriend(user._id)}
                            className="bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 dark:from-slate-500 dark:to-slate-600 dark:hover:from-slate-400 dark:hover:to-slate-500 text-white font-medium py-2 px-4 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-500 dark:focus:ring-slate-400"
                          >
                            Agregar
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
