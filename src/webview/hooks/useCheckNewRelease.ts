import { useEffect, useState } from 'react';
import request from '../utils/request';
import { useVersionStore } from '../store';
import { addToast } from '@heroui/react';

export const useCheckNewRelease = (checkInterval = 10 * 60 * 1000) => {
  const [hasNewVersion, setHasNewVersion] = useState(false);
  const [currentVersion, setCurrentVersion] = useState('');
  const [latestVersion, setLatestVersion] = useState('');

  const { frontend_version, set_frontend_version } = useVersionStore();

  const checkVersion = async () => {
    try {
      let localVersion = frontend_version;
      if (!localVersion) {
        // 获取本地版本
        // const localRes = await fetch('./version.txt');
        // localVersion = (await localRes.text()).split(':').pop() || '';
        // set_frontend_version(localVersion);
        localVersion = (process.env.FRONT_APP_VERSION || 'unknown').trim();
        set_frontend_version(localVersion);
      }
      setCurrentVersion(localVersion);

      // 获取远程版本
      const remoteRes = await request({
        url: '/system/versions',
        method: 'GET',
      });
      const remoteVersion = remoteRes.data;
      setLatestVersion(remoteVersion);
      console.log('本地版本', localVersion, '远程版本', remoteVersion);

      // 比较版本
      if (localVersion.trim() !== remoteVersion) {
        addToast({
          title: '有新版本，请尽快升级',
          description:
            '当前版本为' + localVersion + '，最新版本为' + remoteVersion,
          color: 'danger',
          timeout: 5 * 60 * 1000,
        });
        setHasNewVersion(true);
      } else {
        setHasNewVersion(false);
      }
    } catch (error) {
      console.error('检查版本失败:', error);
    }
  };

  useEffect(() => {
    // 立即检查一次
    checkVersion();

    // 设置定时检查
    const timer = setInterval(checkVersion, checkInterval);

    return () => clearInterval(timer);
  }, [checkInterval]);

  return { hasNewVersion, currentVersion, latestVersion };
};
