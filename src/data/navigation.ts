type NavigationItem =
  | { label: string; href: string; children?: never }
  | { label: string; href?: never; children: NavigationLink[] };

type NavigationLink = { label: string; href: string };

export const navigationLinks: NavigationItem[] = [
  {
    label: "About",
    children: [
      {
        href: "/about/terms-of-reference",
        label: "Terms of Reference",
      },
      {
        href: "https://github.com/next-generation-cartographers/ngc-code-of-conduct/blob/c93c4b538c1127c7eddd17bf96c7863675d70940/code-of-conduct.pdf",
        label: "Code of Conduct",
      },
    ],
  },
  {
    label: "Activities",
    children: [
      { href: "/activities/icc-2025", label: "ICC 2025" },
      {
        href: "/activities/online-community-meet-ups",
        label: "Online Community Meet-Ups",
      },
      { href: "/activities/archive", label: "Archive" },
    ],
  },
  {
    label: "Resources",
    children: [
      { href: "/resources/papers", label: "Papers and Publications" },
      { href: "/resources/branding", label: "Branding" },
      {
        href: "/resources/eurocarto-2024-contributions",
        label: "Young scholar voices (EuroCarto 24)",
      },
    ],
  },
  { label: "Contact", href: "/#contact" },
];
