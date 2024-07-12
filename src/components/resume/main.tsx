/* eslint-disable antfu/top-level-function */

import { MyInfo, Section } from './component'
import { ColdChain, Weibo } from '~/components/resume/projects'
import { SkillsBe, SkillsFe } from '~/components/resume/skills'

const {
  DEV: isDev,
  RESUME_INFO: resumeInfo = 'Chilfish;131xxxxxx94;xx学院;',
} = import.meta.env

const avatar = isDev
  ? 'http://localhost:5173/private/证件.png'
  : 'https://p.chilfish.top/wechat.webp'

const info = resumeInfo.split(';')

export const ResumeMain = (props: {
  isBe: boolean
}) => (
  <>
    <section class="flex items-center justify-between">
      <MyInfo />

      <img
        class="w-18 rounded-1 object-cover"
        alt="个人照片"
        src={avatar}
      />
    </section>

    <Section title="教育背景">
      <div class="mb-1 center justify-between text-3.5">
        <p class="font-bold">
          { info[2] }
          （本科） 软件工程
        </p>
        <time>2021 - 2025</time>
      </div>
      <p>英语四级证书、蓝桥杯省二等奖</p>
    </Section>

    <Section title="专业技能">
      {props.isBe
        ? <SkillsBe />
        : <SkillsFe />}
    </Section>

    <Section title="项目经历">
      <ul class="projects">
        {props.isBe
          ? (
              <>
                <ColdChain />
                <Weibo />
              </>
            )
          : (
              <>
                <Weibo />
                <ColdChain />
              </>
            )}
      </ul>
    </Section>
  </>
)

export default ResumeMain
