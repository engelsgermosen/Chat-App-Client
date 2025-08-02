// src/pages/ProfilePage.tsx
import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import apiClient from "@/apiClient";
import Header from "@/components/Header";

interface ProfileData {
  name: string;
  email: string;
  avatar: string; // URL de la imagen actual
}

export default function ProfilePage() {
  const userId = sessionStorage.getItem("id");
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("");
  const [password, setPassword] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Carga inicial del perfil
  useEffect(() => {
    if (!userId) return;
    (async () => {
      try {
        const { data } = await apiClient.get(`/user/${userId}/perfil`);
        if (data.success) {
          setProfile(data.data);
          setName(data.data.name);
          setEmail(data.data.email);
          setAvatar(data.data.avatar);
        } else {
          setError("No se pudo cargar el perfil");
        }
      } catch {
        setError("Error de red al cargar perfil");
      }
    })();
  }, [userId]);

  // Genera vista previa cuando el usuario selecciona un avatar nuevo
  useEffect(() => {
    if (!avatarFile) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(avatarFile);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [avatarFile]);

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setAvatarFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    const formData = new FormData();
    formData.append("name", name);
    formData.append("avatarImg", avatar);
    if (password) formData.append("password", password);
    if (avatarFile) formData.append("avatar", avatarFile);

    try {
      const { data } = await apiClient.put(`/user/${userId}/perfil`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (data.success) {
        setSuccess("Perfil actualizado correctamente");
        setPassword("");
        setAvatarFile(null);
        // Actualizar avatar en la UI si vino cambiado
        if (data.data.avatar) {
          setProfile((prev) =>
            prev ? { ...prev, avatar: data.data.avatar } : prev
          );
        }
      } else {
        setError(data.message || "Error actualizando perfil");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Error de red al guardar");
    }

    setTimeout(() => {
      setError(null);
      setSuccess(null);
    }, 5000);
  };

  if (!profile) {
    return <div className="p-8 text-center">Cargando perfil…</div>;
  }

  return (
    <div className="flex flex-col min-h-screen w-screen">
      <Header />
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-4">Mi Perfil</h1>

        {/* Avatar actual / vista previa */}
        <div className="flex justify-center mb-4">
          <img
            src={`${
              profile.avatar
                ? import.meta.env.VITE_SOCKET_URL + profile.avatar
                : preview
            }`}
            alt="Avatar"
            className="w-24 h-24 rounded-full object-cover"
          />
        </div>

        {error && <p className="text-red-500 mb-2">{error}</p>}
        {success && <p className="text-green-600 mb-2">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email (solo lectura) */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              disabled
              className="mt-1 block w-full bg-gray-100 border border-gray-300 rounded px-3 py-2"
            />
          </div>

          {/* Nombre editable */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Nombre
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Contraseña nueva */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Nueva Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Dejar en blanco para no cambiar"
              className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          {/* Subir nuevo avatar */}
          <div>
            <label
              htmlFor="avatar"
              className="block text-sm font-medium text-gray-700"
            >
              Cambiar Foto de Perfil
            </label>
            <input
              id="avatar"
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="mt-1 block w-full text-gray-700"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Guardar Cambios
          </button>
        </form>
      </div>
    </div>
  );
}
