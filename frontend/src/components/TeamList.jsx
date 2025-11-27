import { TEAMS } from "./data/teams";

function TeamList() {
  return (
    <ul>
      {TEAMS.map((team) => (
        <li key={team.id}>
          {team.flag} {team.name} ({team.shortName})
        </li>
      ))}
    </ul>
  );
}
