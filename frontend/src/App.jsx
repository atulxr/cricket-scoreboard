import { useEffect, useState } from "react";
import { getMatches, updateMatch, getTeams, createMatch } from "./api";

function App() {
  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);

  const fetchData = async () => {
    const [matchesRes, teamsRes] = await Promise.all([
      getMatches(),
      getTeams(),
    ]);
    setMatches(matchesRes.data);
    setTeams(teamsRes.data);
  };

  // Poll every 5s for "near real-time"
  useEffect(() => {
    fetchData();
    const id = setInterval(fetchData, 5000);
    return () => clearInterval(id);
  }, []);

  const handleScoreUpdate = async (match, field, delta) => {
    const newValue = match[field] + delta;
    await updateMatch(match.id, { [field]: newValue });
    fetchData();
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Cricket Scoreboard</h1>

      <h2>Matches</h2>
      <ul>
        {matches.map((m) => (
          <li
            key={m.id}
            onClick={() => setSelectedMatch(m)}
            style={{
              cursor: "pointer",
              border: "1px solid #ccc",
              padding: 10,
              marginBottom: 10,
            }}
          >
            <strong>
              {m.team_a_name} vs {m.team_b_name}
            </strong>{" "}
            – {m.status}
            <div>
              {m.team_a_name}: {m.runs_team_a}/{m.wickets_team_a} in{" "}
              {m.overs_team_a} overs
            </div>
            <div>
              {m.team_b_name}: {m.runs_team_b}/{m.wickets_team_b} in{" "}
              {m.overs_team_b} overs
            </div>
          </li>
        ))}
      </ul>

      {selectedMatch && (
        <div style={{ marginTop: 20 }}>
          <h2>Update Score: {selectedMatch.team_a_name}</h2>
          <button onClick={() => handleScoreUpdate(selectedMatch, "runs_team_a", 1)}>
            +1 Run (Team A)
          </button>
          <button onClick={() => handleScoreUpdate(selectedMatch, "wickets_team_a", 1)}>
            +1 Wicket (Team A)
          </button>
          {/* Add similar controls for team_b and overs fields */}
        </div>
      )}
    </div>
  );
}

export default App;
