"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    if (res.ok) router.push("/login");
    else alert("Eroare la înregistrare!");
  };

  return (
    <div style={{ padding: "40px", maxWidth: "400px", margin: "0 auto", fontFamily: "Arial" }}>
      <h2>Creare Cont</h2>
      <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <input placeholder="Nume" style={inputStyle} onChange={e => setForm({...form, name: e.target.value})} required />
        <input type="email" placeholder="Email" style={inputStyle} onChange={e => setForm({...form, email: e.target.value})} required />
        <input type="password" placeholder="Parolă" style={inputStyle} onChange={e => setForm({...form, password: e.target.value})} required />
        <button type="submit" style={btnStyle}>Înregistrare</button>
      </form>
    </div>
  );
}

const inputStyle = { padding: "10px", border: "1px solid #ccc" };
const btnStyle = { padding: "10px", backgroundColor: "#333", color: "#fff", cursor: "pointer" };