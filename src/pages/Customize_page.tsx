import { useEffect, useState } from 'react';
import { ThemeDefinition, ThemeOption, themes, useTheme } from '../theme';

const themeCards: ThemeDefinition[] = Object.values(themes);

export default function Customize_page() {
  const { theme: appliedThemeData, themeName: appliedTheme, setTheme } = useTheme();
  const [selectedTheme, setSelectedTheme] = useState<ThemeOption>(appliedTheme);

  useEffect(() => {
    setSelectedTheme(appliedTheme);
  }, [appliedTheme]);

  return (
    <div
      className="flex min-h-full w-full items-center justify-center px-4 py-10"
      style={{ backgroundColor: appliedThemeData.background }}
    >
      <div
        className="w-full max-w-4xl rounded-3xl border p-8 shadow-2xl"
        style={{ backgroundColor: appliedThemeData.surface, borderColor: appliedThemeData.border }}
      >
        <header
          className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
          style={{ color: appliedThemeData.primaryText }}
        >
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-wide"
              style={{ color: appliedThemeData.secondaryText }}
            >
              Appearance
            </p>
            <h1 className="text-2xl font-bold" style={{ color: appliedThemeData.primaryText }}>
              Choose Theme
            </h1>
            <p className="text-sm" style={{ color: appliedThemeData.secondaryText }}>
              Switch between light and dark presets.
            </p>
          </div>

        </header>

        <section className="mt-8 grid gap-6 md:grid-cols-2">
          {themeCards.map((theme) => {
            const isSelected = theme.id === selectedTheme;
            return (
              <button
                key={theme.id}
                type="button"
                onClick={() => setSelectedTheme(theme.id)}
                className={`rounded-2xl border p-6 text-left transition hover:shadow-lg ${isSelected ? 'ring-2' : ''
                  }`}
                style={{
                  borderColor: isSelected ? appliedThemeData.accent : appliedThemeData.border,
                  boxShadow: isSelected ? `0 0 0 4px ${appliedThemeData.accent}1a` : undefined,
                  backgroundColor: appliedThemeData.surface,
                  color: appliedThemeData.primaryText,
                }}
              >
                <div
                  className="flex h-32 w-full items-center justify-center rounded-2xl"
                  style={{ backgroundColor: theme.background, color: theme.primaryText }}
                >
                  <span className="text-sm font-semibold uppercase tracking-wide">
                    {theme.label}
                  </span>
                </div>
                <p className="mt-4 text-sm" style={{ color: appliedThemeData.secondaryText }}>
                  {theme.id === 'light' ? 'Soft neutrals and bright surfaces.' : 'Deep tones with high contrast.'}
                </p>
              </button>
            );
          })}
        </section>

        <footer
          className="mt-8 flex flex-col gap-3 text-sm md:flex-row md:items-center md:justify-between"
          style={{ color: appliedThemeData.secondaryText }}
        >
          <span>
            Applied theme:{' '}
            <strong style={{ color: appliedThemeData.primaryText }}>{appliedTheme}</strong>
          </span>
          <div className="flex gap-3">
            <button
              type="button"
              className="rounded-2xl border px-4 py-2 font-semibold"
              style={{ borderColor: appliedThemeData.border, color: appliedThemeData.primaryText }}
              onClick={() => setSelectedTheme(appliedTheme)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="rounded-2xl px-4 py-2 font-semibold text-white"
              style={{ backgroundColor: appliedThemeData.accent }}
              onClick={() => setTheme(selectedTheme)}
            >
              Apply Changes
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}