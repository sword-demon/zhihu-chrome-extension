import '@src/Popup.css';
import { t } from '@extension/i18n';
import { PROJECT_URL_OBJECT, useStorage, withErrorBoundary, withSuspense } from '@extension/shared';
import { exampleThemeStorage } from '@extension/storage';
import { cn, ErrorDisplay, LoadingSpinner, ToggleButton } from '@extension/ui';

// 扩展Window接口以支持zhihuStyleInterval属性
declare global {
  interface Window {
    zhihuStyleInterval?: NodeJS.Timeout | null;
  }
}

const notificationOptions = {
  type: 'basic',
  iconUrl: chrome.runtime.getURL('icon-34.png'),
  title: 'Injecting content script error',
  message: 'You cannot inject script here!',
} as const;

const Popup = () => {
  const { isLight } = useStorage(exampleThemeStorage);
  const logo = isLight ? 'popup/logo_vertical.svg' : 'popup/logo_vertical_dark.svg';

  const goGithubSite = () => chrome.tabs.create(PROJECT_URL_OBJECT);

  const injectContentScript = async () => {
    const [tab] = await chrome.tabs.query({ currentWindow: true, active: true });

    if (tab.url!.startsWith('about:') || tab.url!.startsWith('chrome:')) {
      chrome.notifications.create('inject-error', notificationOptions);
    }

    await chrome.scripting
      .executeScript({
        target: { tabId: tab.id! },
        files: ['/content-runtime/example.iife.js', '/content-runtime/all.iife.js'],
      })
      .catch(err => {
        // Handling errors related to other paths
        if (err.message.includes('Cannot access a chrome:// URL')) {
          chrome.notifications.create('inject-error', notificationOptions);
        }
      });
  };

  // 修改知乎样式的函数
  const modifyZhihuStyle = async () => {
    const [tab] = await chrome.tabs.query({ currentWindow: true, active: true });

    // 检查当前页面是否是知乎
    if (!tab.url?.includes('zhihu.com')) {
      chrome.notifications.create('zhihu-style-error', {
        type: 'basic',
        iconUrl: chrome.runtime.getURL('icon-34.png'),
        title: '知乎样式修改错误',
        message: '请先打开知乎网站！',
      });
      return;
    }

    // 直接注入脚本到知乎页面修改logo和标题
    await chrome.scripting
      .executeScript({
        target: { tabId: tab.id! },
        func: () => {
          // 查找知乎logo元素
          const logoSelector = '#root > div > div.css-121i2wa > header > div > a > svg';
          const logoElement = document.querySelector(logoSelector);

          if (logoElement) {
            // 检查是否已经修改过logo
            const isModified = logoElement.getAttribute('data-icon') === 'LarkLogoColorful';

            if (isModified) {
              // 如果已经修改过，恢复原logo
              // 清除轮询定时器
              if (window.zhihuStyleInterval) {
                clearInterval(window.zhihuStyleInterval);
                window.zhihuStyleInterval = null;
                console.log('[知乎样式] 已清除轮询定时器');
              }
              location.reload();
              console.log('[知乎样式] 已恢复原logo');
            } else {
              // 修改logo为飞书logo
              logoElement.outerHTML = `
                <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" data-icon="LarkLogoColorful">
                  <path d="m12.924 12.803.056-.054c.038-.034.076-.072.11-.11l.077-.076.23-.227 1.334-1.319.335-.331c.063-.063.13-.123.195-.183a7.777 7.777 0 0 1 1.823-1.24 7.607 7.607 0 0 1 1.014-.4 13.177 13.177 0 0 0-2.5-5.013 1.203 1.203 0 0 0-.94-.448h-9.65c-.173 0-.246.224-.107.325a28.23 28.23 0 0 1 8 9.098c.007-.006.016-.013.023-.022Z" fill="#00D6B9"></path>
                  <path d="M9.097 21.299a13.258 13.258 0 0 0 11.82-7.247 5.576 5.576 0 0 1-.731 1.076 5.315 5.315 0 0 1-.745.7 5.117 5.117 0 0 1-.615.404 4.626 4.626 0 0 1-.726.331 5.312 5.312 0 0 1-1.883.312 5.892 5.892 0 0 1-.524-.031 6.509 6.509 0 0 1-.729-.126c-.06-.016-.12-.029-.18-.044-.166-.044-.33-.092-.494-.14-.082-.024-.164-.046-.246-.072-.123-.038-.247-.072-.366-.11l-.3-.095-.284-.094-.192-.067c-.08-.025-.155-.053-.234-.082a3.49 3.49 0 0 1-.167-.06c-.11-.04-.221-.079-.328-.12-.063-.025-.126-.047-.19-.072l-.252-.098c-.088-.035-.18-.07-.268-.107l-.174-.07c-.072-.028-.141-.06-.214-.088l-.164-.07c-.057-.024-.114-.05-.17-.075l-.149-.066-.135-.06-.14-.063a90.183 90.183 0 0 1-.141-.066 4.808 4.808 0 0 0-.18-.083c-.063-.028-.123-.06-.186-.088a5.697 5.697 0 0 1-.199-.098 27.762 27.762 0 0 1-8.067-5.969.18.18 0 0 0-.312.123l.006 9.21c0 .4.199.779.533 1a13.177 13.177 0 0 0 7.326 2.205Z" fill="#3370FF"></path>
                  <path d="M23.732 9.295a7.55 7.55 0 0 0-3.35-.776 7.521 7.521 0 0 0-2.284.35c-.054.016-.107.035-.158.05a8.297 8.297 0 0 0-.855.35 7.14 7.14 0 0 0-.552.297 6.716 6.716 0 0 0-.533.347c-.123.089-.243.18-.363.275-.13.104-.252.211-.375.321-.067.06-.13.123-.196.184l-.334.328-1.338 1.321-.23.228-.076.075c-.038.038-.076.073-.11.11l-.057.054a1.914 1.914 0 0 1-.085.08c-.032.028-.063.06-.095.088a13.286 13.286 0 0 1-2.748 1.946c.06.028.12.057.18.082l.142.066c.044.022.091.041.139.063l.135.06.149.067.17.075.164.07c.073.031.142.06.215.088.056.025.116.047.173.07.088.034.177.072.268.107.085.031.168.066.253.098l.189.072c.11.041.218.082.328.12.057.019.11.041.167.06.08.028.155.053.234.082l.192.066.284.095.3.095c.123.037.243.075.366.11l.246.072c.164.048.331.095.495.14.06.015.12.03.18.043.114.029.227.05.34.07.13.022.26.04.389.057a5.815 5.815 0 0 0 .994.019 5.172 5.172 0 0 0 1.413-.3 5.405 5.405 0 0 0 .726-.334c.06-.035.122-.07.182-.108a7.96 7.96 0 0 0 .432-.297 5.362 5.362 0 0 0 .577-.517 5.285 5.285 0 0 0 .37-.429 5.797 5.797 0 0 0 .527-.827l.13-.258 1.166-2.325-.003.006a7.391 7.391 0 0 1 1.527-2.186Z" fill="#133C9A"></path>
                </svg>
              `;

              // 在logo旁边添加"飞书云文档"文字
              const logoLink = document.querySelector('#root > div > div.css-121i2wa > header > div > a');
              if (logoLink) {
                // 检查是否已经添加过文字
                const existingText = logoLink.querySelector('.feishu-text');
                if (!existingText) {
                  const textElement = document.createElement('span');
                  textElement.className = 'feishu-text';
                  textElement.textContent = '飞书云文档';
                  textElement.style.marginLeft = '8px';
                  textElement.style.fontSize = '16px';
                  textElement.style.fontWeight = '500';
                  textElement.style.color = '#1a1a1a';
                  logoLink.appendChild(textElement);
                }
              }

              // 修改所有具有 QuestionHeader-title 类名的元素文本
              const titleElements = document.querySelectorAll('.QuestionHeader-title');
              titleElements.forEach((element, index) => {
                // 检查是否已经修改过
                if (!element.getAttribute('data-modified')) {
                  element.setAttribute('data-modified', 'true');
                  element.textContent = 'xxx项目文档';
                  console.log('[知乎样式] 已修改第' + (index + 1) + '个标题为"xxx项目文档"');
                }
              });

              // 修改CSS变量 --GBL01A 的颜色为黑色，设置Question-mainColumn宽度为100%，并隐藏AnswerItem中的视频和图片
              const style = document.createElement('style');
              style.id = 'zhihu-css-variables';
              style.textContent = `
                :root {
                  --GBL01A: #000000 !important;
                }
                * {
                  --GBL01A: #000000 !important;
                }
                .Question-mainColumn {
                  width: 100% !important;
                }
                .AnswerItem video,
                .AnswerItem img {
                  display: none !important;
                }
              `;
              document.head.appendChild(style);

              // 移除 Question-sideColumn 和 QuestionHeader-side 元素的内容
              const sideColumnElements = document.querySelectorAll('.Question-sideColumn, .QuestionHeader-side');
              sideColumnElements.forEach((element, index) => {
                // 检查是否已经处理过
                if (!element.getAttribute('data-content-removed')) {
                  element.setAttribute('data-content-removed', 'true');
                  element.innerHTML = '';
                  console.log('[知乎样式] 已移除第' + (index + 1) + '个侧边栏元素的内容');
                }
              });

              // 启动轮询隐藏新加载的视频和图片
              if (!window.zhihuStyleInterval) {
                window.zhihuStyleInterval = setInterval(() => {
                  const answerItems = document.querySelectorAll('.AnswerItem');
                  answerItems.forEach(answerItem => {
                    const videos = answerItem.querySelectorAll('video');
                    const images = answerItem.querySelectorAll('img');

                    videos.forEach(video => {
                      if (!video.getAttribute('data-zhihu-hidden')) {
                        video.style.display = 'none';
                        video.setAttribute('data-zhihu-hidden', 'true');
                        console.log('[知乎样式] 轮询隐藏视频元素');
                      }
                    });

                    images.forEach(image => {
                      if (!image.getAttribute('data-zhihu-hidden')) {
                        image.style.display = 'none';
                        image.setAttribute('data-zhihu-hidden', 'true');
                        console.log('[知乎样式] 轮询隐藏图片元素');
                      }
                    });
                  });
                }, 1000);
                console.log('[知乎样式] 已启动轮询隐藏功能，每秒检查新加载的媒体内容');
              }

              console.log('[知乎样式] 已修改为飞书logo、更新标题、修改CSS变量、移除侧边栏内容并启动轮询隐藏');
            }
          } else {
            console.log('[知乎样式] 未找到知乎logo元素');
          }
        },
      })
      .catch(err => {
        console.error('修改知乎logo失败:', err);
        chrome.notifications.create('zhihu-style-error', {
          type: 'basic',
          iconUrl: chrome.runtime.getURL('icon-34.png'),
          title: '知乎样式修改错误',
          message: 'logo修改失败！',
        });
      });
  };

  return (
    <div className={cn('App', isLight ? 'bg-slate-50' : 'bg-gray-800')}>
      <header className={cn('App-header', isLight ? 'text-gray-900' : 'text-gray-100')}>
        <button onClick={goGithubSite}>
          <img src={chrome.runtime.getURL(logo)} className="App-logo" alt="logo" />
        </button>
        <p>
          Edit <code>pages/popup/src/Popup.tsx</code>
        </p>
        <button
          className={cn(
            'mt-4 rounded px-4 py-1 font-bold shadow hover:scale-105',
            isLight ? 'bg-blue-200 text-black' : 'bg-gray-700 text-white',
          )}
          onClick={injectContentScript}>
          {t('injectButton')}
        </button>
        <button
          className={cn(
            'mt-2 rounded px-4 py-1 font-bold shadow hover:scale-105',
            isLight ? 'bg-pink-200 text-black' : 'bg-pink-700 text-white',
          )}
          onClick={modifyZhihuStyle}>
          {t('modifyZhihuStyle')}
        </button>
        <ToggleButton>{t('toggleTheme')}</ToggleButton>
      </header>
    </div>
  );
};

export default withErrorBoundary(withSuspense(Popup, <LoadingSpinner />), ErrorDisplay);
