import { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { cn } from '../utils/cn';

interface VersionInfo {
  version: string;
  changelog: string[];
}

const VersionDisplay: React.FC = () => {
  const [versionInfo, setVersionInfo] = useState<VersionInfo>({
    version: '8.7.0',
    changelog: []
  });
  const { isDark } = useTheme();

  useEffect(() => {
    // In a real application, this would fetch from the version.json file
    // For now, we'll set it statically
    setVersionInfo({
      version: '8.7.0',
      changelog: [
        "Implemented Signal Report page with filter functionality",
        "Added Dashboard, Strategy, Live Strategy, Live Signals, and Trades pages",
        "Created responsive sidebar and header with theme-based styling",
        "Implemented DMAT connection toggle functionality",
        "Added real-time clock and market index display"
      ]
    });
  }, []);

  return (
    <div className={cn(
      "text-center text-xs",
      isDark ? "text-teal-300" : "text-teal-200"
    )}>
      <div className="mb-1">Algoria Trading</div>
      <div>v{versionInfo.version}</div>
    </div>
  );
};

export default VersionDisplay;
