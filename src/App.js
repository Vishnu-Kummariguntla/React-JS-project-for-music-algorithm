import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, NavLink, useNavigate } from "react-router-dom";

function useEntries() {
  const [entries, setEntries] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("entries")) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("entries", JSON.stringify(entries));
  }, [entries]);

  return { entries, setEntries };
}

function Tabs() {
  const base = "px-3 py-2 rounded";
  const active = "bg-black text-white";
  const inactive = "bg-gray-200 text-black";
  return (
    <nav style={{ display: "flex", gap: 8, marginBottom: 16 }}>
      <NavLink to="/" end className={({ isActive }) => `${base} ${isActive ? active : inactive}`}>Entries</NavLink>
      <NavLink to="/add" className={({ isActive }) => `${base} ${isActive ? active : inactive}`}>Add Entry</NavLink>
      {/* Add more tabs as needed */}
    </nav>
  );
}

function EntriesList({ entries }) {
  if (!entries.length) return <p>No entries yet. Click “Add Entry” to create one.</p>;
  return (
    <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: 12 }}>
      {entries.map((e, i) => (
        <li key={i} style={{ border: "1px solid #ddd", borderRadius: 12, padding: 12 }}>
          <h3 style={{ margin: 0 }}>{e.title}</h3>
          <small>{e.date}</small>
          <p style={{ marginTop: 8, whiteSpace: "pre-wrap" }}>{e.content}</p>
          {e.category && <span style={{ fontSize: 12, opacity: 0.8 }}>Category: {e.category}</span>}
        </li>
      ))}
    </ul>
  );
}

function AddEntry({ onAdd }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    const newEntry = {
      title: title.trim(),
      content: content.trim(),
      category: category.trim(),
      date: new Date().toLocaleString()
    };
    onAdd(newEntry);
    navigate("/"); // go back to Entries tab
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12, maxWidth: 600 }}>
      <label>
        Title
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Homework reminder"
          style={{ width: "100%", padding: 8, borderRadius: 8, border: "1px solid #ccc" }}
          required
        />
      </label>

      <label>
        Category (optional)
        <input
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="e.g., Math, Science"
          style={{ width: "100%", padding: 8, borderRadius: 8, border: "1px solid #ccc" }}
        />
      </label>

      <label>
        Entry
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your entry here…"
          rows={6}
          style={{ width: "100%", padding: 8, borderRadius: 8, border: "1px solid #ccc" }}
          required
        />
      </label>

      <button
        type="submit"
        style={{ padding: "10px 14px", borderRadius: 10, border: "none", background: "black", color: "white" }}
      >
        Save Entry
      </button>
    </form>
  );
}

export default function App() {
  const { entries, setEntries } = useEntries();

  function addEntry(e) {
    setEntries((prev) => [e, ...prev]);
  }

  return (
    <Router>
      <div style={{ maxWidth: 900, margin: "24px auto", padding: "0 16px" }}>
        <h1 style={{ marginBottom: 8 }}>My Journal</h1>
        <Tabs />
        <Routes>
          <Route path="/" element={<EntriesList entries={entries} />} />
          <Route path="/add" element={<AddEntry onAdd={addEntry} />} />
        </Routes>
      </div>
    </Router>
  );
}
