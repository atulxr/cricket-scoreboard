import { useEffect, useState } from "react";
import {
  MantineProvider,
  Container,
  Title,
  Text,
  Card,
  Loader,
  Stack,
  Group,
  Badge,
} from "@mantine/core";
import { TEAMS } from "./data/teams";
import "flag-icons/css/flag-icons.min.css";
import "./app.css";

// helper: map full name from backend -> flag + shortName
function getTeamInfo(name) {
  const t = TEAMS.find((team) => team.name === name);
  if (!t) {
    return {
      name: name || "TBD",
      shortName: name ? String(name).slice(0, 3).toUpperCase() : "TBD",
      flag: "",
    };
  }
  return t;
}

function safeName(n) {
  return n && String(n).trim() !== "" ? String(n) : "TBD";
}

function strikerSummary(m) {
  const name = safeName(m.striker_name);
  const runs = Number.isFinite(m.striker_runs) ? m.striker_runs : 0;
  const balls = Number.isFinite(m.striker_balls) ? m.striker_balls : 0;
  return { name, stats: `${runs} (${balls})` };
}

function nonStrikerSummary(m) {
  const name = safeName(m.non_striker_name);
  const runs = Number.isFinite(m.non_striker_runs) ? m.non_striker_runs : 0;
  const balls = Number.isFinite(m.non_striker_balls) ? m.non_striker_balls : 0;
  return { name, stats: `${runs} (${balls})` };
}

function bowlerSummary(m) {
  const name = safeName(m.bowler_name);
  // bowler_overs may be stored as string like "2.3" — keep as-is but fallback
  const overs =
    m.bowler_overs !== undefined && m.bowler_overs !== null
      ? String(m.bowler_overs)
      : "0.0";
  const runs = Number.isFinite(m.bowler_runs) ? m.bowler_runs : 0;
  const wickets = Number.isFinite(m.bowler_wickets) ? m.bowler_wickets : 0;
  return { name, stats: `${overs} overs • ${runs}-${wickets}` };
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

              const striker = strikerSummary(m);
              const nonStriker = nonStrikerSummary(m);
              const bowler = bowlerSummary(m);

              return (
                <Card key={m.id} shadow="md" padding="lg" radius="md" withBorder>
                  <Title order={3}>
                    <span className={`fi fi-${teamA.flag} flag-icon`} />
                    {teamA.shortName} ({teamA.name}) vs{" "}
                    <span className={`fi fi-${teamB.flag} flag-icon`} />
                    {teamB.shortName} ({teamB.name})
                  </Title>

                  <Text mt="sm" fw={500}>
                    Status: {m.status || "TBD"}
                  </Text>

                  <Text mt="xs">
                    <span className={`fi fi-${teamA.flag} flag-icon`} />
                    {teamA.shortName}: <strong>{m.runs_team_a ?? 0}</strong> /{" "}
                    {m.wickets_team_a ?? 0} in {m.overs_team_a ?? "0.0"} overs
                  </Text>

                  <Text mt="xs">
                    <span className={`fi fi-${teamB.flag} flag-icon`} />
                    {teamB.shortName}: <strong>{m.runs_team_b ?? 0}</strong> /{" "}
                    {m.wickets_team_b ?? 0} in {m.overs_team_b ?? "0.0"} overs
                  </Text>

                  <Group position="apart" mt="md" spacing="lg">
                    <div>
                      <Text size="sm" color="dimmed">
                        Batsmen
                      </Text>

                      <Group spacing="sm" mt="xs" align="center">
                        <Badge variant="filled">Striker</Badge>
                        <div>
                          <Text weight={600}>{striker.name}</Text>
                          <Text size="sm" color="dimmed">
                            {striker.stats}
                          </Text>
                        </div>
                      </Group>

                      <Group spacing="sm" mt="xs" align="center">
                        <Badge variant="outline">Non-striker</Badge>
                        <div>
                          <Text weight={600}>{nonStriker.name}</Text>
                          <Text size="sm" color="dimmed">
                            {nonStriker.stats}
                          </Text>
                        </div>
                      </Group>
                    </div>

                    <div style={{ textAlign: "right" }}>
                      <Text size="sm" color="dimmed">
                        Bowler
                      </Text>

                      <Group spacing="sm" mt="xs" position="right" align="center">
                        <div>
                          <Text weight={600}>{bowler.name}</Text>
                          <Text size="sm" color="dimmed">
                            {bowler.stats}
                          </Text>
                        </div>
                      </Group>
                    </div>
                  </Group>
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
