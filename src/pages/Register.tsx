import { ThemeToggle } from "@/components/theme-toggle";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

interface IRegister {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  confirm: string;
}

export default function Register() {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const [dataRegister, setDataRegister] = useState<IRegister>({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDataRegister({
      ...dataRegister,
      [name]: value,
    });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (dataRegister.password !== dataRegister.confirm) {
      setError("No coinciden las contraseñas");
      return;
    }

    if (!imageFile) {
      setError("Debes seleccionar una imagen de perfil");
      return;
    }

    const formData = new FormData();
    formData.append(
      "name",
      `${dataRegister.firstname} ${dataRegister.lastname}`
    );
    formData.append("email", dataRegister.email);
    formData.append("password", dataRegister.password);
    formData.append("avatar", imageFile);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/auth/register`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (data.success) {
        navigate("/");
        return;
      } else {
        setError(data.message);
        setTimeout(() => setError(null), 4000);
      }
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div>
      <div className="fixed top-6 right-12">
        <ThemeToggle />
      </div>
      <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700 py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200 dark:border-slate-700 shadow-2xl rounded-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              Crear Cuenta
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Completa los datos para crear tu nueva cuenta
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label
                  htmlFor="avatar"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                >
                  Foto de perfil
                </label>
                <input
                  id="avatar"
                  name="avatar"
                  accept="image/*"
                  onChange={handleFileChange}
                  type="file"
                  placeholder="Img"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500 dark:focus:ring-slate-400 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                >
                  Nombre
                </label>
                <input
                  id="firstName"
                  name="firstname"
                  value={dataRegister.firstname}
                  onChange={handleChange}
                  type="text"
                  placeholder="Juan"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500 dark:focus:ring-slate-400 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                >
                  Apellido
                </label>
                <input
                  id="lastName"
                  name="lastname"
                  value={dataRegister.lastname}
                  onChange={handleChange}
                  type="text"
                  placeholder="Pérez"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500 dark:focus:ring-slate-400 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={dataRegister.email}
                onChange={handleChange}
                placeholder="tu@ejemplo.com"
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500 dark:focus:ring-slate-400 focus:border-transparent transition-all duration-200"
                required
              />
            </div>

            {/* Password Fields */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
              >
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                name="password"
                value={dataRegister.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500 dark:focus:ring-slate-400 focus:border-transparent transition-all duration-200"
                required
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
              >
                Confirmar Contraseña
              </label>
              <input
                id="confirmPassword"
                type="password"
                name="confirm"
                value={dataRegister.confirm}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500 dark:focus:ring-slate-400 focus:border-transparent transition-all duration-200"
                required
              />
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start">
              <input
                id="terms"
                type="checkbox"
                className="h-4 w-4 mt-1 text-slate-600 bg-slate-50 dark:bg-slate-700 border-slate-300 dark:border-slate-600 rounded focus:ring-slate-500 dark:focus:ring-slate-400 focus:ring-2"
                required
              />
              <label
                htmlFor="terms"
                className="ml-3 text-sm text-slate-600 dark:text-slate-400"
              >
                Acepto los{" "}
                <a
                  href="#"
                  className="text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:underline font-medium transition-colors duration-200"
                >
                  términos y condiciones
                </a>{" "}
                y la{" "}
                <a
                  href="#"
                  className="text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:underline font-medium transition-colors duration-200"
                >
                  política de privacidad
                </a>
              </label>
            </div>

            {/* Submit Button */}
            {error && (
              <div>
                <p className="text-red-500 text-center">{error}</p>
              </div>
            )}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 dark:from-slate-500 dark:to-slate-600 dark:hover:from-slate-400 dark:hover:to-slate-500 text-white font-medium py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-500 dark:focus:ring-slate-400 focus:ring-offset-2 dark:focus:ring-offset-slate-800"
            >
              Crear Cuenta
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              ¿Ya tienes una cuenta?{" "}
              <Link
                to="/login"
                className="text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:underline font-medium transition-colors duration-200"
              >
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
