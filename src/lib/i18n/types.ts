export type Locale = "en" | "es";

export interface Dictionary {
  shell: {
    themeToggleLabel: string;
    themeLight: string;
    themeDark: string;
    themeSystem: string;
    localeToggleLabel: string;
  };
  nav: {
    home: string;
    docs: string;
    components: string;
    demo: string;
  };
  footer: {
    packagesHeading: string;
    copyright: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    previewLabel: string;
    previewTitle: string;
    previewButton: string;
  };
  stats: {
    componentFamiliesLabel: string;
    platformsLabel: string;
    themesLabel: string;
  };
  features: {
    heading: string;
    forms: { title: string; description: string };
    tables: { title: string; description: string };
    player: { title: string; description: string };
    uploads: { title: string; description: string };
    theming: { title: string; description: string };
  };
  install: {
    heading: string;
    description: string;
  };
  gallery: {
    heading: string;
    description: string;
    ctaLabel: string;
  };
  placeholder: {
    docsTitle: string;
    componentsTitle: string;
    demoTitle: string;
    comingSoon: string;
  };
  notFound: {
    title: string;
    description: string;
    backToHome: string;
  };
}
