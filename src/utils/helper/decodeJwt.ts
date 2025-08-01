export function decodeJWT(token: string) {
  // 1) Separa por puntos
  const partes = token.split(".");
  if (partes.length !== 3) throw new Error("Token JWT inválido");

  // 2) Decodifica Base64Url (reemplazamos URL-safe chars)
  const payloadBase64 = partes[1].replace(/-/g, "+").replace(/_/g, "/");

  // 3) atob convierte Base64 a string; luego parse JSON
  const jsonPayload = decodeURIComponent(
    atob(payloadBase64)
      .split("")
      .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
      .join("")
  );

  return JSON.parse(jsonPayload);
}
