"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    const res = await signIn("credentials", { 
      email, 
      password, 
      redirect: false 
    });

    if (res.error) {
      setError("Email sau parolă incorectă!");
      setLoading(false);
    } else {
      router.push("/");
      router.refresh();
    }
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={titleStyle}>Autentificare</h1>
        
        {error && <p style={errorStyle}>{error}</p>}
        
        <form onSubmit={handleLogin} style={formStyle}>
          <input 
            style={inputStyle}
            type="email" 
            placeholder="Adresa email" 
            onChange={e => setEmail(e.target.value)} 
            required 
          />
          <input 
            style={inputStyle}
            type="password" 
            placeholder="Parolă" 
            onChange={e => setPassword(e.target.value)} 
            required 
          />
          
          <button type="submit" disabled={loading} style={primaryButtonStyle}>
            {loading ? "Se verifică..." : "Intră în cont"}
          </button>
        </form>

        <hr style={dividerStyle} />

        <p style={footerTextStyle}>Nu ai un cont creat?</p>
        <button 
          onClick={() => router.push("/register")} 
          style={secondaryButtonStyle}
        >
          Creează cont nou
        </button>
      </div>
    </div>
  );
}

// --- Unified Blue Styling ---
const containerStyle = { 
  display: 'flex', 
  justifyContent: 'center', 
  alignItems: 'center', 
  minHeight: '100vh', 
  background: '#f0f2f5', 
  fontFamily: 'sans-serif' 
};

const cardStyle = { 
  background: 'white', 
  padding: '40px', 
  borderRadius: '12px', 
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)', 
  width: '100%', 
  maxWidth: '400px', 
  textAlign: 'center' 
};

const titleStyle = { 
  marginBottom: '24px', 
  fontSize: '1.5rem', 
  color: '#333',
  fontWeight: '600'
};

const errorStyle = { 
  color: '#ff4d4f', 
  background: '#fff2f0', 
  padding: '10px', 
  borderRadius: '4px', 
  marginBottom: '15px', 
  fontSize: '0.9rem',
  border: '1px solid #ffccc7'
};

const formStyle = { 
  display: 'flex', 
  flexDirection: 'column', 
  gap: '15px' 
};

const inputStyle = { 
  padding: '12px', 
  borderRadius: '6px', 
  border: '1px solid #d9d9d9', 
  fontSize: '1rem',
  outline: 'none'
};

const primaryButtonStyle = { 
  padding: '12px', 
  background: '#1890ff', 
  color: 'white', 
  border: 'none', 
  borderRadius: '6px', 
  cursor: 'pointer', 
  fontWeight: 'bold', 
  fontSize: '1rem',
  transition: '0.3s'
};

const dividerStyle = { 
  margin: '25px 0', 
  border: '0', 
  borderTop: '1px solid #eee' 
};

const footerTextStyle = { 
  fontSize: '0.9rem', 
  color: '#666', 
  marginBottom: '10px' 
};

const secondaryButtonStyle = { 
  padding: '10px', 
  background: 'none', 
  border: '1px solid #1890ff', 
  color: '#1890ff', 
  borderRadius: '6px', 
  cursor: 'pointer', 
  width: '100%', 
  fontWeight: '500',
  transition: '0.2s'
};