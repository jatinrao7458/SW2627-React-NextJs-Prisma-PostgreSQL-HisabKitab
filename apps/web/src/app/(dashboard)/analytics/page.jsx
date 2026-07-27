import { getTransactions } from "@/actions/analytics";
import AnalyticsView from "./AnalyticsView";

export const dynamic = "force-dynamic";

// Trigger recompile
export default async function AnalyticsPage({ searchParams }) {
  const params = await searchParams;
  const range = params?.range || "All Time";
  const transactions = await getTransactions(range);

  return (
    <AnalyticsView initialTransactions={transactions} />
  );
}
