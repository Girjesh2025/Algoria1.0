import { getAppVersion } from '../utils/appVersion';

const PageFooter: React.FC = () => {
  const { version } = getAppVersion();

  return (
    <div className="mt-10 text-center text-xs text-gray-500">
      © ALGORIA v{version}. All rights reserved.
    </div>
  );
};

export default PageFooter;
