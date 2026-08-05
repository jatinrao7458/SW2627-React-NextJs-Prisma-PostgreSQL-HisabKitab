import LedgerView from "./LedgerView";

export const dynamic = "force-dynamic";

export default async function LedgerPage({ searchParams }) {
  const params = await searchParams;
  const range = params?.range || "All Time";

  return (
    <LedgerView range={range} />
  );
}
