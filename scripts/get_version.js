const shell = require('shelljs');
const chalk = require('chalk');
const isDev = process.env.NODE_ENV === 'development';
const dateFormat = (date, format = 'yyyy-MM-dd hh:mm:ss') => {
  if (typeof date === 'string') {
    var mts = date.match(/(\/Date\((\d+)\)\/)/);
    if (mts && mts.length >= 3) {
      date = parseInt(mts[2]);
    } else {
      date = parseInt(date);
    }
  }
  date = new Date(date);
  if (!date || date.toUTCString() === 'Invalid Date') {
    return '';
  }
  var map = {
    M: date.getMonth() + 1, // 月份
    d: date.getDate(), // 日
    h: date.getHours(), // 小时
    m: date.getMinutes(), // 分
    s: date.getSeconds(), // 秒
    q: Math.floor((date.getMonth() + 3) / 3), // 季度
    S: date.getMilliseconds(), // 毫秒
  };
  format = format.replace(/([yMdhmsqS])+/g, function (all, t) {
    var v = map[t];
    if (v !== undefined) {
      if (all.length > 1) {
        v = '0' + v;
        v = v.substr(v.length - 2);
      }
      return v;
    } else if (t === 'y') {
      return (date.getFullYear() + '').substr(4 - all.length);
    }
    return all;
  });
  return format;
};

const getCommitHash = (len) => {
  if (!shell.which('git')) {
    console.warn(chalk.yellow(`【⚠️警告】未发现git`));
    return 'unknown: git-not-found';
  }
  // git命令输出的stdout有换行符，trim移除之
  // format里H是全hash，h是短hash(前7位)。但是为了和ci上的hash(前8位)对应做了点变通
  const fullHash = shell
    .exec('git show -s --format=%H', { silent: true })
    ?.toString()
    ?.trim();
  const fallback = 'unknown: no stdout';
  if (Number.isInteger(len) && len >= 1) {
    return fullHash?.slice(0, len) ?? fallback;
  }
  return fullHash ?? fallback;
};

const getProjectVersion = () => {
  const baseVersion = require('../package.json').version;
  const dateString = dateFormat(Date.now(), 'yyyy-MM-dd').replace(/-/g, '');
  return `${baseVersion}-${dateString}-${isDev ? 'dev' : getCommitHash(8)}`.trim();
};

exports.getCommitHash = getCommitHash;
exports.getProjectVersion = getProjectVersion;
