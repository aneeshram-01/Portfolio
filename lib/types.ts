// Shared runtime interfaces used across components.

export interface ThemeApi {
  setTheme: (v: 'light' | 'dark') => void;
  getTheme: () => 'light' | 'dark';
  setMode: (v: 'os' | 'web') => void;
  getMode: () => 'os' | 'web';
  setWallpaper: (v: string) => void;
  getWallpaper: () => string;
  setVariant: (v: 'paper' | 'glass') => void;
  getVariant: () => 'paper' | 'glass';
  setAccent: (v: string) => void;
  getAccent: () => string;
}

export interface DesktopApi extends ThemeApi {
  openApp: (id: string) => void;
  closeApp: (id: string) => void;
  reorganizeIcons: () => void;
  refreshDesktop: () => void;
  closeAllWindows: () => void;
}

export interface TweakValues {
  variant: 'paper' | 'glass';
  dark: boolean;
  wallpaper: string;
  accent: string;
  dockPosition: string;
  showGrid: boolean;
}

export type SetTweak = (
  keyOrEdits: keyof TweakValues | Partial<TweakValues>,
  val?: TweakValues[keyof TweakValues]
) => void;
