import React, { useEffect, useState } from "react";
import Papa from "papaparse";

export default function App() {
  const [songs, setSongs] = useState([]);
  const [open, setOpen] = useState({}); // index -> true/false

  useEffect(() => {
    fetch("/data/youtube-top-100-songs-2025.csv")
      .then((r) => r.text())
      .then((text) => {
        Papa.parse(text, {
          header: true,
          skipEmptyLines: true,
          complete: ({ data }) => setSongs(data),
        });
      });
  }, []);

  const toggle = (i) => setOpen((o) => ({ ...o, [i]: !o[i] }));

  return (
    <div style={{ padding: 24 }}>
      <h1>Top YouTube Songs (2025)</h1>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {songs.map((s, i) => (
          <li
            key={i}
            style={{
              marginBottom: 18,
              borderBottom: "1px solid #eee",
              paddingBottom: 12,
            }}
          >
            <div style={{ fontWeight: 700 }}>{s.title}</div>
            <div>Channel: {s.channel}</div>
            <div>Views: {Number(s.view_count ?? 0).toLocaleString()}</div>
            <button onClick={() => toggle(i)} style={{ marginTop: 8 }}>
              {open[i] ? "Hide lyrics" : "Show lyrics"}
            </button>
            {open[i] && (
              <pre
                style={{
                  whiteSpace: "pre-wrap",
                  background: "#f8f9fa",
                  padding: 10,
                  marginTop: 8,
                  borderRadius: 8,
                  border: "1px solid #e5e7eb",
                }}
              >
                {s.description || "No lyrics/description found."}
              </pre>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
