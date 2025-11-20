async function getTeam(teamId: string) {
  const res = await fetch(`/api/teams/${teamId}`);
  if (!res.ok) return null;
  return res.json();
}

export default async function TeamPage({ params }: { params: { teamId: string } }) {
  const team = await getTeam(params.teamId);
  return (
    <div className="space-y-4">
      <h1 className="text-h1 font-semibold">{team?.team?.name || 'Team'}</h1>
      <div className="card p-4 text-[var(--text-secondary)]">Team details coming soon.</div>
    </div>
  );
}
