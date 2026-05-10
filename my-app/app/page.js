"use client";
import { useState, useEffect, useCallback } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const userEmail = session?.user?.email;

  const [tasks, setTasks] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ task: "", priority: "Low", description: "" });
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  const fetchWeather = useCallback(async () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m,relative_humidity_2m`
        );
        const data = await res.json();
        setWeather(data.current);
      } catch (error) {
        console.error("Eroare meteo:", error);
      }
    });
  }, []);

  const fetchHolidays = useCallback(async () => {
    try {
      const now = new Date();
      const validFrom = now.toISOString().split('T')[0];
      const nextYear = new Date();
      nextYear.setFullYear(now.getFullYear() + 1);
      const validTo = nextYear.toISOString().split('T')[0];

      const response = await fetch(
        `https://openholidaysapi.org/PublicHolidays?countryIsoCode=RO&languageIsoCode=RO&validFrom=${validFrom}&validTo=${validTo}`
      );
      if (response.ok) {
        const data = await response.json();
        setHolidays(data);
      }
    } catch (error) {
      console.error("Eroare sărbători:", error);
    }
  }, []);

  const loadData = useCallback(async () => {
    if (!userEmail) return; 
    try {
      const res = await fetch(`/api/records?email=${userEmail}`);
      if (res.ok) {
        const data = await res.json();
        setTasks(data);
      }
    } catch (err) {
      console.error("Eroare date:", err);
    }
  }, [userEmail]);

  useEffect(() => {
    if (session) {
      loadData();
      fetchHolidays();
      fetchWeather();
    }
  }, [session, loadData, fetchHolidays, fetchWeather]);

  const handleSave = async (e) => {
    e.preventDefault();
    const payload = { ...form, user: session.user.name, userEmail: session.user.email };
    try {
      const method = editingId ? "PATCH" : "POST";
      const res = await fetch("/api/records", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingId ? { id: editingId, ...payload } : payload)
      });
      if (res.ok) {
        setEditingId(null);
        setForm({ task: "", priority: "Low", description: "" });
        loadData();
      }
    } catch (err) { console.error(err); }
  };

  const toggleDone = async (task) => {
    try {
      const res = await fetch("/api/records", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: task._id, completed: !task.completed }),
      });
      if (res.ok) loadData();
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    if (confirm("Ștergi acest task?")) {
      await fetch(`/api/records?id=${id}`, { method: "DELETE" });
      loadData();
    }
  };

  if (status === "loading") return <div style={loadingStyle}>Se încarcă aplicația...</div>;
  if (!session) return null;

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <div>
          <h1 style={logoStyle}>Task Manager</h1>
          {weather && (
            <div style={weatherHeaderStyle}>
              București: <strong>{weather.temperature_2m}°C</strong> 
              <span style={weatherDetailStyle}>🌬️ {weather.wind_speed_10m} km/h | 💧 {weather.relative_humidity_2m}%</span>
            </div>
          )}
        </div>
        <div style={userActionsStyle}>
          <span>Salut, <strong>{session.user.name}</strong></span>
          <button onClick={() => signOut({ callbackUrl: "/login" })} style={logoutButtonStyle}>Logout</button>
        </div>
      </header>

      <main style={mainContentStyle}>
        <section style={sectionStyle}>
          <h3 style={sectionTitleStyle}>🇷🇴 Sărbători legale viitoare</h3>
          <div style={holidayScrollStyle}>
            {holidays.map((h) => (
              <div key={h.id} style={holidayItemStyle}>
                <span style={holidayNameStyle}>{h.name[0]?.text}</span>
                <span style={holidayDateStyle}>{new Date(h.startDate).toLocaleDateString('ro-RO')}</span>
              </div>
            ))}
          </div>
        </section>

        <div style={gridStyle}>
   
          <section style={cardStyle}>
            <h2 style={sectionTitleStyle}>{editingId ? "✏️ Editează Task" : "➕ Task nou"}</h2>
            <form onSubmit={handleSave} style={formStyle}>
              <input style={inputStyle} placeholder="Ce ai de făcut?" value={form.task} onChange={e => setForm({...form, task: e.target.value})} required />
              <select style={inputStyle} value={form.priority} onChange={e => setForm({...form, priority: e.target.value})}>
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
              <textarea style={{...inputStyle, height: '80px'}} placeholder="Detalii suplimentare..." value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
              <button type="submit" style={submitButtonStyle}>{editingId ? "Actualizează" : "Adaugă în listă"}</button>
            </form>
          </section>

       
          <section style={cardStyle}>
            <h2 style={sectionTitleStyle}>📋 Listă task-uri</h2>
            <div style={tableWrapperStyle}>
              <table style={tableStyle}>
                <thead>
                  <tr style={tableHeaderRowStyle}>
                    <th>Status</th>
                    <th>Task & Descriere</th>
                    <th>Prioritate</th>
                    <th style={{textAlign: 'right'}}>Acțiuni</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((t) => (
                    <tr key={t._id} style={tableRowStyle}>
                      <td style={{ width: "50px" }}>
                        <input type="checkbox" checked={t.completed || false} onChange={() => toggleDone(t)} style={checkboxStyle} />
                      </td>
                      <td style={{ ...taskNameStyle, textDecoration: t.completed ? "line-through" : "none", color: t.completed ? "#999" : "#333" }}>
                        <div style={{ fontWeight: "600", fontSize: "0.95rem" }}>{t.task}</div>
                        {t.description && (
                          <div style={{ fontSize: "0.8rem", color: t.completed ? "#bbb" : "#666", marginTop: "4px", fontStyle: "italic" }}>
                            {t.description}
                          </div>
                        )}
                      </td>
                      <td>
                        <span style={getPriorityStyle(t.priority)}>{t.priority}</span>
                      </td>
                      <td style={{textAlign: 'right'}}>
                        <button onClick={() => { setEditingId(t._id); setForm({task:t.task, priority:t.priority, description:t.description}) }} style={editBtnStyle}>Edit</button>
                        <button onClick={() => handleDelete(t._id)} style={deleteBtnStyle}>Șterge</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

const getPriorityStyle = (p) => {
  const colors = { High: '#ff4d4f', Medium: '#faad14', Low: '#52c41a' };
  return { padding: '3px 8px', borderRadius: '12px', fontSize: '0.7rem', color: '#fff', background: colors[p] || '#ccc', fontWeight: 'bold' };
};

const containerStyle = { fontFamily: "'Inter', sans-serif", background: "#f0f2f5", minHeight: "100vh", color: "#1a1a1a" };
const loadingStyle = { textAlign: "center", padding: "100px", fontSize: "1.2rem", color: "#666" };
const headerStyle = { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem 5%", background: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", position: "sticky", top: 0, zIndex: 10 };
const logoStyle = { margin: 0, fontSize: "1.4rem", color: "#1890ff", fontWeight: "800" };
const weatherHeaderStyle = { fontSize: "0.85rem", color: "#666", marginTop: "4px" };
const weatherDetailStyle = { marginLeft: "12px", paddingLeft: "12px", borderLeft: "1px solid #ddd" };
const userActionsStyle = { display: "flex", alignItems: "center", gap: "20px", fontSize: "0.9rem" };
const logoutButtonStyle = { padding: "6px 16px", background: "transparent", border: "1px solid #ff4d4f", color: "#ff4d4f", borderRadius: "6px", cursor: "pointer" };
const mainContentStyle = { maxWidth: "1200px", margin: "0 auto", padding: "2rem 5%" };
const sectionStyle = { marginBottom: "2rem" };
const sectionTitleStyle = { fontSize: "1rem", fontWeight: "600", marginBottom: "1.2rem", color: "#444" };
const holidayScrollStyle = { display: "flex", gap: "12px", overflowX: "auto", paddingBottom: "10px" };
const holidayItemStyle = { minWidth: "180px", background: "#fff", padding: "12px", borderRadius: "10px", boxShadow: "0 2px 4px rgba(0,0,0,0.04)", borderLeft: "4px solid #1890ff" };
const holidayNameStyle = { display: "block", fontSize: "0.85rem", fontWeight: "600", marginBottom: "4px" };
const holidayDateStyle = { fontSize: "0.75rem", color: "#888" };
const gridStyle = { display: "grid", gridTemplateColumns: "1fr 2fr", gap: "2rem" };
const cardStyle = { background: "#fff", padding: "1.5rem", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" };
const formStyle = { display: "flex", flexDirection: "column", gap: "12px" };
const inputStyle = { padding: "10px", borderRadius: "8px", border: "1px solid #d9d9d9", fontSize: "0.9rem" };
const submitButtonStyle = { padding: "12px", background: "#1890ff", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600" };
const tableWrapperStyle = { overflowX: "auto" };
const tableStyle = { width: "100%", borderCollapse: "collapse" };
const tableHeaderRowStyle = { borderBottom: "2px solid #f0f0f0", textAlign: "left", fontSize: "0.85rem", color: "#888" };
const tableRowStyle = { borderBottom: "1px solid #f0f0f0" };
const taskNameStyle = { padding: "12px 8px" };
const checkboxStyle = { width: "18px", height: "18px", cursor: "pointer" };
const editBtnStyle = { background: "none", border: "none", color: "#1890ff", cursor: "pointer", marginRight: "10px", fontSize: "0.85rem" };
const deleteBtnStyle = { background: "none", border: "none", color: "#ff4d4f", cursor: "pointer", fontSize: "0.85rem" };