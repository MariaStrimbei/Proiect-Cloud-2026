"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      router.push("/login");
    } else {
      const data = await res.json();
      setError(data.error || "Eroare la înregistrare");
    }
    setLoading(false);
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={titleStyle}>Creează cont nou</h1>
        
        {error && <p style={errorStyle}>{error}</p>}
        
        <form onSubmit={handleSubmit} style={formStyle}>
          <input 
            style={inputStyle} 
            type="text" 
            placeholder="Nume complet" 
            required 
            onChange={(e) => setForm({...form, name: e.target.value})} 
          />
          <input 
            style={inputStyle} 
            type="email" 
            placeholder="Adresa email" 
            required 
            onChange={(e) => setForm({...form, email: e.target.value})} 
          />
          <input 
            style={inputStyle} 
            type="password" 
            placeholder="Parolă" 
            required 
            onChange={(e) => setForm({...form, password: e.target.value})} 
          />
          
          <button type="submit" disabled={loading} style={registerButtonStyle}>
            {loading ? "Se procesează..." : "Înregistrare"}
          </button>
        </form>

        <hr style={dividerStyle} />

        <p style={footerTextStyle}>Ai deja un cont?</p>
        <button 
          onClick={() => router.push("/login")} 
          style={loginButtonStyle}
        >
          Mergi la Autentificare
        </button>
      </div>
    </div>
  );
}

// --- Minimalist Styles ---
const containerStyle = { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f0f2f5', fontFamily: 'sans-serif' };
const cardStyle = { background: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px', textAlign: 'center' };
const titleStyle = { marginBottom: '24px', fontSize: '1.5rem', color: '#333' };
const errorStyle = { color: '#ff4d4f', background: '#fff2f0', padding: '10px', borderRadius: '4px', marginBottom: '15px', fontSize: '0.9rem' };
const formStyle = { display: 'flex', flexDirection: 'column', gap: '15px' };
const inputStyle = { padding: '12px', borderRadius: '6px', border: '1px solid #d9d9d9', fontSize: '1rem' };
const registerButtonStyle = { padding: '12px', background: '#1890ff', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' };
const dividerStyle = { margin: '25px 0', border: '0', borderTop: '1px solid #eee' };
const footerTextStyle = { fontSize: '0.9rem', color: '#666', marginBottom: '10px' };
const loginButtonStyle = { padding: '10px', background: 'none', border: '1px solid #1890ff', color: '#1890ff', borderRadius: '6px', cursor: 'pointer', width: '100%', fontWeight: '500' };