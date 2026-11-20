import { createContext, useContext, useState } from 'react';
import { apiFetch } from '../api/client.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    const raw = sessionStorage.getItem('g6_usuario');
    return raw ? JSON.parse(raw) : null;
  });

  const [roles, setRoles] = useState(() => {
    const raw = sessionStorage.getItem('g6_roles');
    return raw ? JSON.parse(raw) : [];
  });

  const login = async (correo, contrasena) => {
    const data = await apiFetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ correo, contrasena }),
    });

    sessionStorage.setItem('g6_usuario', JSON.stringify(data.usuario));
    sessionStorage.setItem('g6_roles', JSON.stringify(data.roles));
    setUsuario(data.usuario);
    setRoles(data.roles);
    return data;
  };

  const logout = () => {
    sessionStorage.removeItem('g6_usuario');
    sessionStorage.removeItem('g6_roles');
    setUsuario(null);
    setRoles([]);
  };

  const obtenerRol = (modulo) => {
    const encontrado = roles.find((r) => r.modulo === modulo);
    return encontrado ? encontrado.rol : null;
  };

  const tieneRol = (modulo, rolesPermitidos = []) => {
    const rolActual = obtenerRol(modulo);
    if (!rolActual) return false;
    if (rolesPermitidos.length === 0) return true;
    return rolesPermitidos.includes(rolActual);
  };

  return (
    <AuthContext.Provider value={{ usuario, roles, login, logout, obtenerRol, tieneRol }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);