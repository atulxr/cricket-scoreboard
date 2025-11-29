import { useEffect, useState } from "react";
import {
  MantineProvider,
  Container,
  Title,
  Text,
  Card,
  Loader,
  Stack,
} from "@mantine/core";
import { TEAMS } from "./data/teams";
import "flag-icons/css/flag-icons.min.css";
import "./app.css"; // <-- import global styles

// helper: map full name from backend -> flag + shortName
function getTeamInfo(name) {
  const t = TEAMS.find((team) => team.name === name);
  if (!t) {
    return {
      name,
      shortName: name,
      flag: "",
    };
  }
  return t;
}

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

  if (loading)
    return (
      <MantineProvider>
        <div className="app-bg">
          <Container className="app-content app-container" py="xl">
            <Loader size="lg" />
            <Text mt="md">Loading matches...</Text>
          </Container>
        </div>
      </MantineProvider>
    );

  if (error)
    return (
      <MantineProvider>
        <div className="app-bg">
          <Container className="app-content app-container" py="xl">
            <Text color="red" size="lg">
              Error: {error}
            </Text>
          </Container>
        </div>
      </MantineProvider>
    );

  return (
    <MantineProvider>
      <div className="app-bg">
        <Container className="app-content app-container" py="xl">
          <Title order={1} mb="xl" className="title-white">
            Cricket Scoreboard
          </Title>

          {matches.length === 0 && <Text>No matches found.</Text>}

          <Stack className="app-stack">
            {matches.map((m) => {
              const teamA = getTeamInfo(m.team_a_name);
              const teamB = getTeamInfo(m.team_b_name);

              return (
                <Card
                  key={m.id}
                  shadow="md"
                  padding="lg"
                  radius="md"
                  withBorder
                >
                  <Title order={3}>
                    <span className={`fi fi-${teamA.flag} flag-icon`} />
                    {teamA.shortName} ({teamA.name}) vs{" "}
                    <span className={`fi fi-${teamB.flag} flag-icon`} />
                    {teamB.shortName} ({teamB.name})
                  </Title>

                  <Text mt="sm" fw={500}>
                    Status: {m.status}
                  </Text>

                  <Text mt="xs">
                    <span className={`fi fi-${teamA.flag} flag-icon`} />
                    {teamA.shortName}: <strong>{m.runs_team_a}</strong> /{" "}
                    {m.wickets_team_a} in {m.overs_team_a} overs
                  </Text>

                  <Text mt="xs">
                    <span className={`fi fi-${teamB.flag} flag-icon`} />
                    {teamB.shortName}: <strong>{m.runs_team_b}</strong> /{" "}
                    {m.wickets_team_b} in {m.overs_team_b} overs
                  </Text>
                </Card>
              );
            })}
          </Stack>
        </Container>
      </div>
    </MantineProvider>
  );
}

export default App;
