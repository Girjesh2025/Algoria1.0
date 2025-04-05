export interface VersionInfo {
  version: string;
  changelog: string[];
}

export const getAppVersion = (): VersionInfo => {
  // In a real application, we would fetch this from version.json
  // For now, we'll return it directly
  return {
    version: '8.7.0',
    changelog: [
      "Implemented Signal Report page with filter functionality",
      "Added Dashboard, Strategy, Live Strategy, Live Signals, and Trades pages",
      "Created responsive sidebar and header with theme-based styling",
      "Implemented DMAT connection toggle functionality",
      "Added real-time clock and market index display"
    ]
  };
};
