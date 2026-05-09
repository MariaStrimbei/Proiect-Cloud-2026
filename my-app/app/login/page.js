"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await signIn("credentials", { email, password, redirect: false });
    if (res.error) alert("Date incorecte!");
    else router.push("/"); 
  };

  return (
    <div style={{ padding: "40px", maxWidth: "400px", margin: "0 auto", fontFamily: "Arial" }}>
      <h2>Login</h2>
      <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <input type="email" placeholder="Email" style={inputStyle} onChange={e => setEmail(e.target.value)} required />
        <input type="password" placeholder="Parolă" style={inputStyle} onChange={e => setPassword(e.target.value)} required />
        <button type="submit" style={btnStyle}>Intră în cont</button>
      </form>
    </div>
  );
}

const inputStyle = { padding: "10px", border: "1px solid #ccc" };
const btnStyle = { padding: "10px", backgroundColor: "#333", color: "#fff", cursor: "pointer" };