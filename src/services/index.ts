import themeChangeService from './themeChangeService';
import selectionService from './selectionService';

/**
 * 服务枚举
 */
export enum ServieEnum {
  // 主题切换服务
  THEME_CHANGE_SERVICE = 'themeChangeService',
  // 选择内容服务
  SELECTION_SERVICE = 'selectionService',
}

/**
 *
 * @param serviceName 服务名称
 * @returns
 */
const registerServices = (serviceName: string[]) => {
  const serviceResponse = {};
  const services = {
    [ServieEnum.THEME_CHANGE_SERVICE]: themeChangeService,
    [ServieEnum.SELECTION_SERVICE]: selectionService,
  };
  serviceName.forEach((name) => {
    if (name in services) {
      serviceResponse[name] = services[name]();
    }
  });
  return serviceResponse;
};

export default registerServices;
