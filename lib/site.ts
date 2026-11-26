/**
 * Personal links. Everything here is hidden when the page is opened with
 * ?showcase=true (the mode used for marketplace portfolio screenshots).
 *
 * The email is read from NEXT_PUBLIC_CONTACT_EMAIL so it never sits in the
 * repository. Leave it unset and the email button simply does not render.
 */
export const site = {
  name: { en: "Mohamed Sameeh", ar: "محمد سميح" },
  mark: { en: "sameeh", ar: "سميح" },
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "",
  github: "https://github.com/MohamedSameeh",
  linkedin: "https://linkedin.com/in/mohamed-sameeh-28011a16a",
  year: 2026,
} as const;
