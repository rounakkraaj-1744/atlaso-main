import {
  Boxes,
  History,
  LayoutDashboard,
  PlaySquare,
  Settings,
} from "lucide-react";

export const PRIMARY_NAVIGATION = [
  { label: "Sandbox", href: "/dashboard", icon: LayoutDashboard },
  { label: "Resources", href: "/dashboard#resources", icon: Boxes },
  { label: "Timeline", href: "/dashboard#timeline", icon: History },
  { label: "Scenarios", href: "/dashboard#scenarios", icon: PlaySquare },
  { label: "Settings", href: "/settings", icon: Settings },
] as const;
