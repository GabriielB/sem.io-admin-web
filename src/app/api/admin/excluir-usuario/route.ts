import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// client para garantir o funciona do supa base 2.0
const supabaseAdmin = createClient(
  process.env.SUPABASE_PROJECT_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId } = body;

    console.log("🔐 ID recebido:", userId);

    if (!userId) {
      return NextResponse.json(
        { sucesso: false, error: "ID ausente" },
        { status: 400 }
      );
    }

    // func para verificar se o usuário existe no auth
    const { data: allUsers, error: listError } =
      await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 100 });

    const userExists = allUsers?.users?.find((u) => u.id === userId);
    if (!userExists) {
      console.error("Usuário não encontrado no Auth");
      return NextResponse.json(
        { sucesso: false, error: "Usuário não encontrado no Auth" },
        { status: 404 }
      );
    }

    // exclui da tabela users
    await supabaseAdmin.from("users").delete().eq("id", userId);

    // exclui da autenticação
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(
      userId
    );

    if (authError) {
      console.error("❌ Erro ao excluir no auth:", authError.message);
      return NextResponse.json(
        { sucesso: false, error: authError.message },
        { status: 500 }
      );
    }

    console.log("✅ Usuário excluído com sucesso");
    return NextResponse.json({ sucesso: true });
  } catch (err: any) {
    console.error("❌ Erro interno:", err);
    return NextResponse.json(
      { sucesso: false, error: "Erro interno" },
      { status: 500 }
    );
  }
}
