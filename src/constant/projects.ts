import type { Project } from './zodTypes'
import { githubHost, imgHost } from './config'

export const ProjectList: Project[] = [
  {
    name: 'Weibo-archiver',
    description: '将新浪微博导出存档备份的在线工具，趁号被夹没前未雨绸缪 😭',
    banner: `${imgHost}/weibo/cover.webp`,
    url: 'https://weibo-archiver.chilfish.top',
    repo: `${githubHost}/Weibo-archiver`,
  },
  {
    name: 'AnonTweet',
    description: '匿名浏览推特 / X 推文的阅读器，配套 Worker 聚合接口',
    banner: 'https://anon-tweet.chilfish.top/screenshots/pwa-home-wide.png',
    url: 'https://anon-tweet.chilfish.top',
    repo: `${githubHost}/anonTweet`,
  },
  {
    name: 'Tweets Viewer',
    description: '推特存档的阅读器',
    url: 'https://tweet.chilfish.top',
    repo: `${githubHost}/tweets-viewer`,
  },
  {
    name: 'replive-oyu',
    description: '西尾夕香 replive fanclub 存档',
    url: 'https://replive-oyu.chilfish.top',
    repo: `${githubHost}/replive-oyu`,
  },
  {
    name: 'NishioCalendar',
    description: '西尾夕香的活动日历（西尾文明暦）',
    url: 'https://nishio.chilfish.top',
    repo: `${githubHost}/NishioCalendar`,
  },
  {
    name: 'bangdream-capture',
    description: 'BanG Dream! 截图搜寻器',
    url: 'https://bangdream-capture.chilfish.top',
    repo: `${githubHost}/bangdream-capture`,
  },
  {
    name: 'oshitabi',
    description: 'Oshitabi Cam 电子透卡',
    url: 'https://oshitabi.chilfish.top',
    repo: `${githubHost}/oshitabi`,
  },
  {
    name: 'youtube-chat-viewer',
    description: '存档并观看 YouTube 直播弹幕，连未开播的等待室聊天也能抓',
    url: 'https://youtube-chat-viewer.chill4fish.workers.dev',
  },
  {
    name: 'scripts-online',
    description: '在线工具箱，把零散的命令行脚本变成点按钮就能跑的 Web UI',
    url: 'https://scripts.chilfish.top',
  },
  {
    name: 'CameraSync',
    description: '用 USB-C 线把尼康相机的照片同步到 Android 手机，基于 rock3r/CameraSync 重写',
    url: `${githubHost}/CameraSync`,
  },
  {
    name: 'react-router-cossui',
    description: 'React Router v8 + coss-ui + Tailwind v4 的脚手架模板',
    url: `${githubHost}/reacr-router-cossui`,
  },
]

export type BannerProject = Project & { banner: string }

export const BannerProjects = ProjectList.filter((p): p is BannerProject => Boolean(p.banner))
export const OtherProjects = ProjectList.filter(p => !p.banner)
