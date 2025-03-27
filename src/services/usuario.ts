import { supabase } from "@/config/supabase";

const UsuarioService = {
  logar: async (
    email: string,
    senha: string
  ): Promise<{ usuario?: any; sucesso: boolean; admin?: boolean }> => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });

    if (error || !data.user) return { sucesso: false };

    // faz uma verificação para ver se esta presente na tabela admin
    const { data: adminData } = await supabase
      .from("admins")
      .select("*")
      .eq("id", data.user.id)
      .single();

    if (!adminData) {
      return { sucesso: true, usuario: data.user, admin: false };
    }

    return { sucesso: true, usuario: data.user, admin: true };
  },

  recuperarSenha: async (email: string): Promise<{ sucesso: boolean }> => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    return { sucesso: !error };
  },

  buscarUsuarios: async (): Promise<any[]> => {
    const { data, error } = await supabase.from("users").select("*");
    return data || [];
  },

  buscar: async (id: string): Promise<any> => {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .single();

    return data || null;
  },

  cadastrar: async (usuario: any): Promise<{ sucesso: boolean }> => {
    const { email, senha, username } = usuario;

    const { data, error } = await supabase.auth.signUp({
      email,
      password: senha,
    });

    if (error || !data.user) return { sucesso: false };

    // func para atualizar o username apos cria-lo
    const { error: updateError } = await supabase
      .from("users")
      .update({ username })
      .eq("id", data.user.id);

    return { sucesso: !updateError };
  },

  excluir: async (usuario: any): Promise<{ sucesso: boolean }> => {
    try {
      const res = await fetch("/api/admin/excluir-usuario", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: usuario.id }),
      });

      const data = await res.json();
      return { sucesso: data.sucesso };
    } catch (err) {
      console.error("Erro ao excluir:", err);
      return { sucesso: false };
    }
  },
};

export const useUsuarioService = () => UsuarioService;
