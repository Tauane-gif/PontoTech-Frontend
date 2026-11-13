
import { type JSX } from "react";
import { useNavigate } from "react-router-dom";

function BoasVindas(): JSX.Element {
    const navigate = useNavigate();

    return (
        <main style={{
            minHeight: '88vh',
            backgroundColor: '#fff0f6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '40px 20px'
        }}>
            <div>
                <h1 style={{
                    fontSize: '3.5rem',
                    fontWeight: 900,
                    marginBottom: '16px',
                    color: '#333'
                }}>
                    BEM-VINDO AO <span style={{ color: '#ec4899' }}>PONTOTECH</span>
                </h1>

                <p style={{
                    fontSize: '1rem',
                    color: '#666',
                    maxWidth: '500px',
                    margin: '0 auto 32px',
                    lineHeight: 1.7
                }}>
                    Tecnologia, praticidade e inovação em um só lugar.
                    Conheça nossa plataforma e descubra tudo o que podemos oferecer!
                </p>

                <button
                    onClick={() => navigate('/login')}
                    style={{
                        backgroundColor: '#ec4899',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '14px 36px',
                        fontSize: '1rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                    }}
                >
                    Comece agora
                </button>
            </div>
        </main>
    );
}

export default BoasVindas;
