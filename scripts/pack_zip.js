const archiver = require('archiver');
const fs = require('fs-extra');
const path = require('path');


// 获取当前时间戳 YYYYMMDDHHMM
const getTimestamp = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}${month}${day}${hours}${minutes}`;
  };

// 获取项目根目录（scripts的上一级）
const rootDir = path.join(__dirname, '..');

// 读取原始 package.json
const packageJson = require(path.join(rootDir, 'package.json'));

// 创建新的 package.json，只保留 lodash 依赖(扩展需要)
const newPackageJson = {
  ...packageJson,
  dependencies: {
    lodash: packageJson.dependencies?.lodash || undefined
  },
  // 移除 devDependencies
  devDependencies: undefined
};

// 创建输出目录
const releaseDir = path.join(rootDir, 'release');
fs.ensureDirSync(releaseDir);


// 写入新的 package.json 到临时位置
const tempPackagePath = path.join(releaseDir, 'package.json');
fs.writeJsonSync(tempPackagePath, newPackageJson, { spaces: 2 });

// 创建 zip 文件
const output = fs.createWriteStream(path.join(releaseDir, `articode_${newPackageJson.version}_${getTimestamp()}.zip`));
const archive = archiver('zip', {
  zlib: { level: 9 } // 最高压缩级别
});

output.on('close', () => {
  console.log('打包完成！文件大小：' + archive.pointer() + ' bytes');
  // 清理临时文件
  fs.removeSync(tempPackagePath);
});

archive.on('error', (err) => {
  throw err;
});

// 开始打包
archive.pipe(output);

// 添加 dist 目录（从根目录路径）
archive.directory(path.join(rootDir, 'dist/'), 'dist');

// 添加修改后的 package.json
archive.file(tempPackagePath, { name: 'package.json' });

archive.finalize();