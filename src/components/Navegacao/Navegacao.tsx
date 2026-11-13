
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Navegacao() {
    const navigate = useNavigate();

    const [isAuthenticated] = useState(() => {
        const isAuth = localStorage.getItem("isAuth");
        const token = localStorage.getItem("token");

        return !!(isAuth && token);
    });

    const nome = localStorage.getItem("nome") || "Usuário";
    const email = localStorage.getItem("email") || "";
    const foto = localStorage.getItem("foto");

    function sair() {
        localStorage.clear();
        navigate("/login");
    }

    return (
        <header style={{
            backgroundColor: "#ec4899",
            height: "70px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 2rem",
            fontFamily: "'Segoe UI', sans-serif"
        }}>

            {/* Logo */}
            <span
                onClick={() => navigate("/")}
                style={{
                    color: "white",
                    fontWeight: "800",
                    fontSize: "1.5rem",
                    cursor: "pointer"
                }}
            >
                PontoTech
            </span>

            {/* Links de navegação */}
            <nav style={{
                display: "flex",
                gap: "2rem",
                alignItems: "center"
            }}>
                <a href="/" style={{
                    color: "white",
                    textDecoration: "none",
                    fontWeight: "500"
                }}>
                    Home
                </a>
            </nav>

            {/* Usuário e botões */}
            <div style={{
                display: "flex",
                gap: "1rem",
                alignItems: "center"
            }}>

                {isAuthenticated ? (
                    <>
                        <div style={{ textAlign: "right" }}>
                            <div style={{
                                color: "white",
                                fontWeight: "600",
                                fontSize: "0.95rem"
                            }}>
                                {nome}
                            </div>

                            {email && (
                                <div style={{
                                    color: "rgba(255,255,255,0.8)",
                                    fontSize: "0.75rem"
                                }}>
                                    {email}
                                </div>
                            )}
                        </div>

                        {/* Foto de perfil */}
                        {foto ? (
                            <img
                                src={foto}
                                alt="Perfil"
                                style={{
                                    width: "38px",
                                    height: "38px",
                                    borderRadius: "50%",
                                    objectFit: "cover",
                                    border: "2px solid white"
                                }}
                            />
                        ) : (
                            <div style={{
                                width: "38px",
                                height: "38px",
                                borderRadius: "50%",
                                backgroundColor: "rgba(255,255,255,0.3)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "white",
                                fontWeight: "700",
                                border: "2px solid white"
                            }}>
                                {nome.charAt(0).toUpperCase()}
                            </div>
                        )}

                        <button
                            onClick={sair}
                            style={{
                                backgroundColor: "white",
                                color: "#ec4899",
                                border: "none",
                                borderRadius: "6px",
                                padding: "8px 20px",
                                fontWeight: "600",
                                cursor: "pointer"
                            }}
                        >
                            Sair
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            onClick={() => navigate("/login")}
                            style={{
                                backgroundColor: "transparent",
                                color: "white",
                                border: "2px solid white",
                                borderRadius: "6px",
                                padding: "8px 20px",
                                fontWeight: "600",
                                cursor: "pointer"
                            }}
                        >
                            Entrar
                        </button>

                        <button
                            onClick={() => navigate("/cadastro")}
                            style={{
                                backgroundColor: "white",
                                color: "#ec4899",
                                border: "none",
                                borderRadius: "6px",
                                padding: "8px 20px",
                                fontWeight: "600",
                                cursor: "pointer"
                            }}
                        >
                            Cadastre-se
                        </button>
                    </>
                )}
            </div>
        </header>
    );
}

export default Navegacao;
