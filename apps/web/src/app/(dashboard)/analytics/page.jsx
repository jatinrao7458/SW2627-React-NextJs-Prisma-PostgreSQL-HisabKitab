import AnalyticsView from "./AnalyticsView";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage({ searchParams }) {
  const params = await searchParams;
  const range = params?.range || "All Time";

  return (
    <AnalyticsView range={range} />
  );
}
