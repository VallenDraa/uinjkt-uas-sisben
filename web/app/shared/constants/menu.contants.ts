import { BellRingIcon, Calendar1Icon, CctvIcon } from "lucide-react";

export const BABY_MENU_ITEMS = [
  {
    name: "Notifikasi Bayi",
    href: "/baby-notifications",
    icon: BellRingIcon,
    description:
      "Menu untuk melihat notifikasi bayi menangis atau tidak nyaman.",
  },
  {
    name: "Monitoring Bayi",
    href: "/baby-monitoring",
    icon: CctvIcon,
    description: "Menu untuk melihat video live bayi dari monitoring device.",
  },
  {
    name: "Jadwal Bayi",
    href: "/baby-schedules",
    icon: Calendar1Icon,
    description:
      "Menu untuk melihat jadwal bayi yang digenerate menggunakan AI.",
  },
];
