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
import "flag-icons/css/flag-icons.min.css"; // <-- IMPORTANT

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
        <Container size="sm" py="xl">
          <Loader size="lg" />
          <Text mt="md">Loading matches...</Text>
        </Container>
      </MantineProvider>
    );

  if (error)
    return (
      <MantineProvider>
        <Container size="sm" py="xl">
          <Text color="red" size="lg">
            Error: {error}
          </Text>
        </Container>
      </MantineProvider>
    );

  return (
    <MantineProvider>
      <Container size="sm" py="xl">
        <Title order={1} mb="xl">
          Cricket Scoreboard
        </Title>

        {matches.length === 0 && <Text>No matches found.</Text>}

        <Stack>
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
                  {/* Header with flag-icons */}
                  <span className={`fi fi-${teamA.flag} flag-icon`} />{" "}
                  {teamA.shortName} ({teamA.name}) vs{" "}
                  <span className={`fi fi-${teamB.flag} flag-icon`} />{" "}
                  {teamB.shortName} ({teamB.name})
                </Title>

                <Text mt="sm" fw={500}>
                  Status: {m.status}
                </Text>

                <Text mt="xs">
                  <span className={`fi fi-${teamA.flag} flag-icon`} />{" "}
                  {teamA.shortName}:{" "}
                  <strong>{m.runs_team_a}</strong> / {m.wickets_team_a} in{" "}
                  {m.overs_team_a} overs
                </Text>

                <Text mt="xs">
                  <span className={`fi fi-${teamB.flag} flag-icon`} />{" "}
                  {teamB.shortName}:{" "}
                  <strong>{m.runs_team_b}</strong> / {m.wickets_team_b} in{" "}
                  {m.overs_team_b} overs
                </Text>
              </Card>
            );
          })}
        </Stack>
      </Container>
    </MantineProvider>
  );
}

export default App;
