import { useEffect, useState } from "react";

function App() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/matches/");
        if (!res.ok) {
          throw new Error("Failed to fetch matches");
        }
        const data = await res.json();
        setMatches(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) return <div>Loading matches...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{ padding: 20 }}>
      <h1>Cricket Scoreboard</h1>

      {matches.length === 0 && <p>No matches found.</p>}

      {matches.map((m) => (
        <div
          key={m.id}
          style={{
            border: "1px solid #ccc",
            padding: 10,
            marginBottom: 10,
          }}
        >
          <h2>
            {m.team_a_name} vs {m.team_b_name}
          </h2>
          <p>Status: {m.status}</p>
          <p>
            {m.team_a_name}: {m.runs_team_a}/{m.wickets_team_a} in{" "}
            {m.overs_team_a} overs
          </p>
          <p>
            {m.team_b_name}: {m.runs_team_b}/{m.wickets_team_b} in{" "}
            {m.overs_team_b} overs
          </p>
        </div>
      ))}
    </div>
  );
}

export default App;
