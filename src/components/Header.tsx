"use client";

import { decodeJWT } from "@/utils/helper/decodeJwt";
import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { ThemeToggle } from "./theme-toggle";
import { type IUser } from "../types/index.ts";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<IUser | null | undefined>();

  const navigate = useNavigate();

  useEffect(() => {
    const get = async () => {
      const token = sessionStorage.getItem("token");
      if (token) {
        setUser(await decodeJWT(token));
      }
    };
    get();
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    sessionStorage.clear();
    return navigate("/login");
  };

  return (
    <header className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo y navegación izquierda */}
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <Link to={"/"}>
              <div className="flex-shrink-0">
                <span className="text-xl font-bold bg-gradient-to-r from-slate-600 to-slate-800 dark:from-slate-300 dark:to-slate-100 bg-clip-text text-transparent">
                  MiApp
                </span>
              </div>
            </Link>

            {/* Navegación principal - Desktop */}
            <nav className="hidden md:flex space-x-6">
              <NavLink
                to={"/amigos"}
                className="text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200 font-medium"
              >
                Amigos
              </NavLink>
              <a
                href="#"
                className="text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200 font-medium"
              >
                Proyectos
              </a>
              <a
                href="#"
                className="text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200 font-medium"
              >
                Tareas
              </a>
              <a
                href="#"
                className="text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200 font-medium"
              >
                Reportes
              </a>
            </nav>
          </div>

          {/* Menú derecha */}

          <div className="flex items-center space-x-4">
            {/* Notificaciones */}
            <ThemeToggle />

            {/* Dropdown del usuario */}
            <div className="relative">
              <button
                onClick={toggleMenu}
                className="flex items-center space-x-2 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-500 dark:focus:ring-slate-400"
              >
                <div
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-400 to-slate-600 dark:from-slate-500 dark:to-slate-700 bg-cover bg-center border-2 border-slate-300 dark:border-slate-600"
                  style={{
                    backgroundImage: user?.avatar
                      ? `url(${import.meta.env.VITE_SOCKET_URL}${user.avatar})`
                      : undefined,
                  }}
                >
                  {!user?.avatar && (
                    <div className="w-full h-full flex items-center justify-center text-white text-sm font-medium">
                      U
                    </div>
                  )}
                </div>
                <svg
                  className={`w-4 h-4 text-slate-600 dark:text-slate-400 transition-transform duration-200 ${
                    isMenuOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 py-2 z-50">
                  <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                      {user?.name}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {user?.email}
                    </p>
                  </div>
                  <Link
                    to={"/perfil"}
                    className="flex items-center px-4 py-3 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-100 transition-colors duration-200"
                  >
                    <svg
                      className="w-4 h-4 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    Mi Perfil
                  </Link>

                  <a
                    href="#"
                    className="flex items-center px-4 py-3 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-100 transition-colors duration-200"
                  >
                    <svg
                      className="w-4 h-4 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    Configuración
                  </a>

                  <a
                    href="#"
                    className="flex items-center px-4 py-3 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-100 transition-colors duration-200"
                  >
                    <svg
                      className="w-4 h-4 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Ayuda
                  </a>

                  <div className="border-t border-slate-200 dark:border-slate-700 mt-2 pt-2">
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-300 transition-colors duration-200"
                    >
                      <svg
                        className="w-4 h-4 mr-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      Cerrar Sesión
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Botón menú móvil */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-all duration-200"
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
                  d={
                    isMobileMenuOpen
                      ? "M6 18L18 6M6 6l12 12"
                      : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Menú móvil */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 dark:border-slate-700 py-4">
            <nav className="flex flex-col space-y-2">
              <a
                href="#"
                className="text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200 font-medium"
              >
                Dashboard
              </a>
              <a
                href="#"
                className="text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200 font-medium"
              >
                Proyectos
              </a>
              <a
                href="#"
                className="text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200 font-medium"
              >
                Tareas
              </a>
              <a
                href="#"
                className="text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200 font-medium"
              >
                Reportes
              </a>
            </nav>
          </div>
        )}
      </div>

      {/* Overlay para cerrar el menú al hacer clic fuera */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </header>
  );
}
