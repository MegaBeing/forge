import {
  Boxes,
  Cable,
  Cloud,
  Cpu,
  Database,
  GitBranch,
  Globe,
  HardDrive,
  Layers,
  LucideIcon,
  MemoryStick,
  Monitor,
  Network,
  Router,
  Server,
  Shield,
  Workflow,
  X,
} from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";

type IconOption = {
  id: string;
  label: string;
  Icon: LucideIcon;
};

const iconOptions: IconOption[] = [
  { id: "server", label: "Server", Icon: Server },
  { id: "database", label: "Database", Icon: Database },
  { id: "client", label: "Client", Icon: Monitor },
  { id: "load-balancer", label: "Load Balancer", Icon: GitBranch },
  { id: "cache", label: "Cache", Icon: MemoryStick },
  { id: "router", label: "Router", Icon: Router },
  { id: "network", label: "Network", Icon: Network },
  { id: "gateway", label: "Gateway", Icon: Globe },
  { id: "storage", label: "Storage", Icon: HardDrive },
  { id: "cpu", label: "Compute", Icon: Cpu },
  { id: "cloud", label: "Cloud", Icon: Cloud },
  { id: "security", label: "Security", Icon: Shield },
  { id: "service", label: "Service", Icon: Boxes },
  { id: "cluster", label: "Cluster", Icon: Layers },
  { id: "connection", label: "Connection", Icon: Cable },
  { id: "workflow", label: "Workflow", Icon: Workflow },
];

const colorOptions = [
  "#4ade80",
  "#6c63ff",
  "#38bdf8",
  "#f59e0b",
  "#f87171",
  "#a78bfa",
  "#22d3ee",
  "#fb7185",
];

interface IProps {
  icon: React.ReactNode;
  color: string;
  label?: string;
  variant?: "card" | "icon";
  onIconChange: (icon: React.JSX.Element) => void;
  onColorChange: (color: string, icon: React.JSX.Element) => void;
}

const createIconElement = (Icon: LucideIcon, color: string) => (
  <Icon size={16} color={color} strokeWidth={2.2} />
);

const getInitialIconId = (icon: React.ReactNode) => {
  if (!React.isValidElement(icon)) return iconOptions[0].id;

  const match = iconOptions.find(({ Icon }) => icon.type === Icon);
  return match?.id ?? iconOptions[0].id;
};

export default function IconColorSelector({
  icon,
  color,
  label = "Node Appearance",
  variant = "card",
  onIconChange,
  onColorChange,
}: IProps) {
  const [open, setOpen] = useState(false);
  const [selectedIconId, setSelectedIconId] = useState(() => getInitialIconId(icon));

  useEffect(() => {
    setSelectedIconId(getInitialIconId(icon));
  }, [icon]);

  const selectedIcon = useMemo(
    () => iconOptions.find((option) => option.id === selectedIconId) ?? iconOptions[0],
    [selectedIconId]
  );

  const updateIcon = (iconId: string, nextColor = color) => {
    const nextIcon = iconOptions.find((option) => option.id === iconId) ?? iconOptions[0];
    setSelectedIconId(nextIcon.id);
    onIconChange(createIconElement(nextIcon.Icon, nextColor));
  };

  const updateColor = (nextColor: string) => {
    const nextIcon = iconOptions.find((option) => option.id === selectedIconId) ?? iconOptions[0];
    onColorChange(nextColor, createIconElement(nextIcon.Icon, nextColor));
  };

  const trigger =
    variant === "icon" ? (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="grid size-10 shrink-0 place-items-center rounded-lg border transition hover:scale-[1.03] hover:shadow-[0_0_18px_rgba(108,99,255,0.18)] focus:outline-none focus:ring-2 focus:ring-violet-300/40"
        style={{
          backgroundColor: `${color}1f`,
          borderColor: `${color}66`,
          color,
        }}
        title="Change node icon and color"
      >
        {icon}
      </button>
    ) : (
      <div>
        <p className="mb-2 font-['JetBrains_Mono',monospace] text-[0.62rem] font-medium uppercase tracking-[0.16em] text-white/40">
          {label}
        </p>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex w-full items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition hover:border-violet-300/50 hover:bg-white/[0.09] hover:shadow-[0_0_18px_rgba(108,99,255,0.16)]"
        >
          <span className="flex min-w-0 items-center gap-3">
            <span
              className="grid size-10 shrink-0 place-items-center rounded-lg border"
              style={{
                backgroundColor: `${color}1f`,
                borderColor: `${color}66`,
                color,
              }}
            >
              {createIconElement(selectedIcon.Icon, color)}
            </span>
            <span className="min-w-0">
              <span className="block truncate font-['JetBrains_Mono',monospace] text-sm font-medium text-white">
                {selectedIcon.label}
              </span>
              <span className="mt-1 block font-['JetBrains_Mono',monospace] text-[0.65rem] uppercase tracking-[0.12em] text-white/40">
                {color}
              </span>
            </span>
          </span>
          <span className="rounded-full border border-violet-300/20 bg-violet-300/10 px-2.5 py-1 font-['JetBrains_Mono',monospace] text-[0.6rem] uppercase tracking-[0.14em] text-violet-200">
            Edit
          </span>
        </button>
      </div>
    );

  return (
    <>
      {trigger}

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-3 backdrop-blur-sm sm:items-center">
          <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-[#0e0e12] shadow-[0_24px_80px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.08)]">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div>
                <p className="font-['JetBrains_Mono',monospace] text-[0.62rem] font-medium uppercase tracking-[0.16em] text-violet-300">
                  Appearance
                </p>
                <h3 className="mt-1 font-['JetBrains_Mono',monospace] text-base font-medium text-white">
                  Icon and Color
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="grid size-9 place-items-center rounded-lg border border-white/10 bg-white/[0.04] text-white/60 transition hover:bg-white/[0.08] hover:text-white"
                aria-label="Close icon selector"
              >
                <X size={16} />
              </button>
            </div>

            <div className="max-h-[70vh] overflow-y-auto p-5">
              <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8">
                {iconOptions.map(({ id, label, Icon }) => {
                  const selected = id === selectedIconId;

                  return (
                    <button
                      key={id}
                      type="button"
                      title={label}
                      onClick={() => updateIcon(id)}
                      className={`grid aspect-square place-items-center rounded-lg border transition ${
                        selected
                          ? "border-violet-300/70 bg-violet-300/20 text-white shadow-[0_0_18px_rgba(108,99,255,0.24)]"
                          : "border-white/5 bg-black/20 text-white/75 hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
                      }`}
                    >
                      <Icon size={22} color={selected ? color : "currentColor"} strokeWidth={2.1} />
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.04] p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="font-['JetBrains_Mono',monospace] text-[0.62rem] font-medium uppercase tracking-[0.16em] text-white/40">
                    Node Color
                  </p>
                  <span className="font-['JetBrains_Mono',monospace] text-[0.65rem] uppercase tracking-[0.12em] text-white/50">
                    {color}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {colorOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => updateColor(option)}
                      className={`size-9 rounded-lg border transition ${
                        option === color
                          ? "border-white/80 shadow-[0_0_18px_rgba(255,255,255,0.18)]"
                          : "border-white/10 hover:border-white/50"
                      }`}
                      style={{ backgroundColor: option }}
                      aria-label={`Use color ${option}`}
                    />
                  ))}
                  <label className="flex h-9 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 font-['JetBrains_Mono',monospace] text-[0.65rem] uppercase tracking-[0.12em] text-white/50">
                    Custom
                    <input
                      type="color"
                      value={color}
                      onChange={(event) => updateColor(event.target.value)}
                      className="size-6 cursor-pointer rounded border-0 bg-transparent p-0"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
