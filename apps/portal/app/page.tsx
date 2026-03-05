import { Button, MetricCard, SidebarNav } from "@studioos/ui";
import { calculateOperatingIncome } from "@studioos/ledger";

export default function Page() {
  const operatingIncome = calculateOperatingIncome({ revenue: 120000, expenses: 82000 });

  return (
    <main className="mx-auto grid max-w-5xl gap-4 p-8 md:grid-cols-[220px_1fr]">
      <SidebarNav
        items={[
          { label: "Dashboard", href: "/" },
          { label: "Ledger", href: "/ledger" },
          { label: "Roster", href: "/roster" }
        ]}
      />
      <section className="space-y-4">
        <MetricCard title="Operating income" value={`$${operatingIncome.toLocaleString()}`} />
        <Button>Review ledger</Button>
      </section>
    </main>
  );
}
