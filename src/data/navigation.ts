type NavigationItem =
  | { label: string; href: string; children?: never }
  | { label: string; href?: never; children: NavigationLink[] };

type NavigationLink = { label: string; href: string };

export const navigationLinks: NavigationItem[] = [
  {
    label: "Aims and Organisation",
    children: [
      { href: "organisation/terms-of-reference", label: "Terms of Reference" },
      { href: "organisation/code-of-conduct", label: "Code of Conduct" },
    ],
  },
  {
    label: "Activities",
    children: [
      { href: "/activities/icc25", label: "ICC 2025" },
      {
        href: "/activities/online-community-meet-ups",
        label: "Online Community Meet-Ups",
      },
      { href: "/activities/archive", label: "Archive" },
    ],
  },
  {
    label: "Resources",
    children: [{ href: "resources/branding", label: "Branding" }],
  },
  { label: "Contact", href: "/#contact" },
];
