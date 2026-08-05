import DashboardView from "./DashboardView";

export const dynamic = "force-dynamic";

export default async function DashboardPage({ searchParams }) {
  const params = await searchParams;
  const range = params?.range || "All Time";

  return (
    <DashboardView range={range} />
  );
}