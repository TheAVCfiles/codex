export type NavItem = { label: string; href: string };

export function SidebarNav({ items }: { items: NavItem[] }) {
  return (
    <nav className="rounded-lg border border-slate-800 bg-slate-900 p-4">
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.href}>
            <a className="text-slate-200 hover:text-white" href={item.href}>
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
