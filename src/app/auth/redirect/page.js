// pages/auth/redirect.js
import { useEffect } from "react";

export default function RedirectHandler() {
  useEffect(() => {
    // Exemplo: redirecionar para o app após login com Firebase
    window.location.href = "catalogomakermobile://auth?success=true";
  }, []);

  return <p>Redirecionando de volta para o app...</p>;
}
