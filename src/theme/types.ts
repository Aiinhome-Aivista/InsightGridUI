export type ThemeOption = "light" | "dark";

export type ThemeColorKey =
  | "background"
  | "surface"
  | "primaryText"
  | "secondaryText"
  | "accent"
  | "border";

export type ThemeDefinition = {
  id: ThemeOption;
  label: string;
} & Record<ThemeColorKey, string>;
