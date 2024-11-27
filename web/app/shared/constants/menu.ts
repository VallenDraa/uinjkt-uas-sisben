import { BellRingIcon, Calendar1Icon, CctvIcon, HouseIcon } from "lucide-react";

export const BABY_MENU_ITEMS = [
  {
    name: "Notifikasi Bayi",
    href: "/notifications",
    icon: BellRingIcon,
    description:
      "Menu untuk melihat notifikasi bayi menangis atau tidak nyaman.",
  },
  {
    name: "Monitoring Bayi",
    href: "/monitoring",
    icon: CctvIcon,
    description: "Menu untuk melihat video live bayi dari monitoring device.",
  },
  {
    name: "Jadwal Bayi",
    href: "/schedule",
    icon: Calendar1Icon,
    description:
      "Menu untuk melihat jadwal bayi yang digenerate menggunakan AI.",
  },
];
