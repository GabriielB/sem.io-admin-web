"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useUsuarioContext } from "../../context/usuario-context";
import Image from "next/image";

export default function AdminLayout({ children }: any) {
  const router = useRouter();
  const { usuario, carregado, deslogar } = useUsuarioContext();
  const url = usePathname();

  const handleSair = () => {
    deslogar();
    router.replace("/");
  };

  useEffect(() => {
    if (carregado && !usuario) router.replace("/");
  }, [carregado]);

  return (
    <>
      {carregado && usuario && (
        <main className="d-flex bg-light min-vh-100">
          {/* barra lateral */}
          <aside
            className="bg-white shadow-sm d-flex flex-column justify-content-between px-4 py-4"
            style={{
              width: 260,
              minHeight: "100vh",
              borderRight: "1px solid #e0e0e0",
              paddingRight: "1rem",
            }}
          >
            <div>
              <div className="d-flex flex-column align-items-center mb-4">
                <Image
                  src="/img/SemioPet.svg"
                  alt="SemioPet"
                  width={120}
                  height={70}
                  priority
                  style={{ objectFit: "contain" }}
                />
                <h6 className="mt-3 fw-bold text-primary">Painel Admin</h6>
              </div>

              <ul className="navbar-nav d-flex flex-column gap-3">
                <li>
                  <Link
                    href="/admin/dashboard"
                    className={`nav-link d-flex align-items-center p-3 rounded ${
                      url.includes("dashboard")
                        ? "bg-primary text-white"
                        : "text-dark"
                    }`}
                  >
                    <i className="ni ni-tv-2 fs-5 me-2"></i> Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admin/usuarios"
                    className={`nav-link d-flex align-items-center p-3 rounded ${
                      url.endsWith("usuarios")
                        ? "bg-primary text-white"
                        : "text-dark"
                    }`}
                  >
                    <i className="ni ni-single-02 fs-5 me-2"></i> Usuários
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admin/quizzes"
                    className={`nav-link d-flex align-items-center p-3 rounded ${
                      url.includes("quizzes")
                        ? "bg-primary text-white"
                        : "text-dark"
                    }`}
                  >
                    <i className="ni ni-hat-3 fs-5 me-2"></i> Quizzes
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admin/summaries"
                    className={`nav-link d-flex align-items-center p-3 rounded ${
                      url.includes("summaries")
                        ? "bg-primary text-white"
                        : "text-dark"
                    }`}
                  >
                    <i className="ni ni-single-copy-04 fs-5 me-2"></i> Resumos
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admin/mindmaps"
                    className={`nav-link d-flex align-items-center p-3 rounded ${
                      url.includes("mindmaps")
                        ? "bg-primary text-white"
                        : "text-dark"
                    }`}
                  >
                    <i className="ni ni-map-big fs-5 me-2"></i> Mapas Mentais
                  </Link>
                </li>
              </ul>
            </div>

            <button
              className="btn btn-outline-danger w-100 rounded-pill py-2 d-flex align-items-center justify-content-center mt-4"
              onClick={handleSair}
            >
              <i className="ni ni-user-run me-2"></i> Sair
            </button>
          </aside>

          {/* conteudo principal */}
          <div
            className="flex-grow-1 d-flex flex-column"
            style={{ paddingLeft: "2rem", paddingRight: "2rem" }}
          >
            <nav
              className="navbar navbar-light bg-white shadow-sm px-5 py-3 d-flex justify-content-between align-items-center"
              style={{ marginBottom: "1.5rem", borderRadius: "12px" }}
            >
              <span className="fw-semibold text-dark fs-5">Bem-vindo</span>
              <button
                className="btn btn-sm btn-outline-danger rounded-pill d-flex align-items-center px-3 py-2"
                onClick={handleSair}
              >
                <i className="ni ni-user-run me-1"></i> Sair
              </button>
            </nav>

            <div
              className="container-fluid"
              style={{
                padding: "2rem",
                borderRadius: "16px",
                backgroundColor: "#fff",
                boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                marginBottom: "2rem",
              }}
            >
              {children}
            </div>

            <footer className="text-center text-muted py-3 mt-auto">
              &copy; {new Date().getFullYear()} Sem.io
            </footer>
          </div>
        </main>
      )}
    </>
  );
}
