import type { UserRole } from "@/types";

interface RoleSelectorProps {
  value: UserRole;
  onChange: (role: UserRole) => void;
}

const roles = [
  {
    id: "rider" as const,
    label: "Rider",
    description: "Explorează trasee, rezervă sesiuni și discută cu proprietari",
    icon: "🏍️",
    accent: "border-yamaha/50 bg-yamaha/10",
    activeAccent: "border-yamaha ring-2 ring-yamaha/30",
  },
  {
    id: "host" as const,
    label: "Proprietar",
    description: "Listează trasee, gestionează rezervări și vezi statistici",
    icon: "📍",
    accent: "border-ktm/50 bg-ktm/10",
    activeAccent: "border-ktm ring-2 ring-ktm/30",
  },
];

export function RoleSelector({ value, onChange }: RoleSelectorProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {roles.map((role) => {
        const isActive = value === role.id;
        return (
          <button
            key={role.id}
            type="button"
            onClick={() => onChange(role.id)}
            className={`press flex flex-col items-start rounded-xl border p-4 text-left transition-all duration-200 ${role.accent} ${isActive ? role.activeAccent : ""}`}
          >
            <span className="mb-2 text-2xl">{role.icon}</span>
            <span className="font-heading font-semibold">{role.label}</span>
            <span className="mt-1 text-xs text-muted-foreground">
              {role.description}
            </span>
          </button>
        );
      })}
    </div>
  );
}
