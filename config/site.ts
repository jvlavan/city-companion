export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "City Companion ",
  description: "Get to know your nearby places",
  navItems: [
    {
      label: "Hospital",
      href: "/search/hospital",
    },
    {
      label: "Temple",
      href: "/search/temple",
    },
    {
      label: "Turf",
      href: "/search/turf",
    },
    {
      label: "Hotel",
      href: "/search/hotel",
    },

    {
      label: "ATM",
      href: "/search/atm",
    },
  ],
  navMenuItems: [
    {
      label: "Hospital",
      href: "/search/hospital",
    },
    {
      label: "Temple",
      href: "/search/temple",
    },
    {
      label: "Turf",
      href: "/search/turf",
    },
    {
      label: "Hotel",
      href: "/search/hotel",
    },
    {
      label: "ATM",
      href: "/search/atm",
    },
  ],
  links: {
    github: "https://github.com/nextui-org/nextui",
    twitter: "https://twitter.com/getnextui",
    docs: "https://nextui.org",
    discord: "https://discord.gg/9b6yyZKmH4",
    sponsor: "https://patreon.com/jrgarciadev",
  },
};
