import 'webextension-polyfill';
import { exampleThemeStorage } from '@extension/storage';

exampleThemeStorage.get().then(theme => {
  console.log('theme', theme);
});

// 监听标签页更新，控制插件图标显示
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // 检查是否是知乎问答页面
  if (tab.url && tab.url.includes('https://www.zhihu.com/question/')) {
    // 显示插件图标
    chrome.action.enable(tabId);
  } else {
    // 隐藏插件图标
    chrome.action.disable(tabId);
  }
});

// 监听标签页激活，控制插件图标显示
chrome.tabs.onActivated.addListener(async activeInfo => {
  const tab = await chrome.tabs.get(activeInfo.tabId);
  if (tab.url && tab.url.includes('https://www.zhihu.com/question/')) {
    // 显示插件图标
    chrome.action.enable(activeInfo.tabId);
  } else {
    // 隐藏插件图标
    chrome.action.disable(activeInfo.tabId);
  }
});

console.log('Background loaded');
console.log("Edit 'chrome-extension/src/background/index.ts' and save to reload.");
