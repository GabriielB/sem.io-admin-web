"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/config/supabase";

type UsuarioContextType = {
  usuario: any;
  setUsuario: (u: any) => void;
  carregado: boolean;
  deslogar: () => void;
};

const UsuarioContext = createContext<UsuarioContextType>({
  usuario: "",
  setUsuario: () => {},
  carregado: false,
  deslogar: () => {},
});

export const UsuarioProvider = ({ children }: any) => {
  const [usuario, _setUsuario] = useState<any>("");
  const [carregado, setCarregado] = useState(false);

  const setUsuario = (usuario: any) => {
    localStorage.setItem("usuario", JSON.stringify(usuario));
    _setUsuario(usuario);
  };

  const deslogar = async () => {
    localStorage.removeItem("usuario");
    await supabase.auth.signOut();
    _setUsuario("");
  };

  useEffect(() => {
    const recuperarUsuario = async () => {
      const local = localStorage.getItem("usuario");
      if (local) {
        _setUsuario(JSON.parse(local));
      } else {
        const { data, error } = await supabase.auth.getUser();
        if (data?.user) _setUsuario(data.user);
      }
      setCarregado(true);
    };

    recuperarUsuario();
  }, []);

  return (
    <UsuarioContext.Provider
      value={{ usuario, setUsuario, carregado, deslogar }}
    >
      {children}
    </UsuarioContext.Provider>
  );
};

export const useUsuarioContext = () => {
  return useContext(UsuarioContext);
};
