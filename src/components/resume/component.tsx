/* eslint-disable antfu/top-level-function */
import type { SetupContext } from 'vue'
import { myJob } from './'

const {
  RESUME_INFO: resumeInfo = 'Chilfish;131xxxxxx94;xx学院;广州;',
} = import.meta.env

const info = resumeInfo.split(';')
// const age = new Date().getFullYear() - 2003

export const MyInfo = () => (
  <div class="center-col items-start gap-4">
    <h2 class="font-bold">
      <span class="mr-4 text-5">
        {info[0]}
      </span>
      <span class="text-3.4">
        {myJob()}
      </span>
    </h2>

    <div
      class="resume-info flex flex-wrap gap-4"
    >
      <div>
        <i class="i-tabler:user" />
        <span>
          男
          <span class="mx-1">|</span>
          {info[3]}
        </span>
      </div>

      <div>
        <i class="i-tabler-phone" />
        <span>{info[1]}</span>
      </div>

      <div>
        <i class="i-tabler:mail" />
        <a
          href="mailto:chill4fish@gmail.com"
        >
          chilfish@qq.com
        </a>
      </div>

      <div>
        <i class="i-tabler:brand-github" />
        <a
          href="https://github.com/Chilfish"
          target="_blank"
        >
          https://github.com/Chilfish
        </a>
      </div>
    </div>
  </div>
)

interface TProjectTitle {
  title: string
  date?: string
  url?: string
  stars?: number | string
}

export const ProjectTitle = (
  props: TProjectTitle,
  { slots }: SetupContext,
) => (
  <>
    <div class="project-title">
      <div class="flex flex-wrap items-center justify-start">
        {props.url
          ? (
              <a href={props.url} target="_blank">
                {props.title}
              </a>
            )
          : (
              <span class="_title">
                {props.title}
              </span>
            )}

      </div>
      <time>{props.date}</time>
    </div>

    {props.url && (
      <p class="center justify-start">
        <span class="mr-2 font-bold">Github: </span>
        {props.url}

        {props.stars && (
          <span class="ml-2 icon-box inline-flex gap-1px">
            <i class="i-tabler:star" />
            <span>
              {`${props.stars} Stars`}
            </span>
          </span>
        )}
      </p>
    )}
    {slots.default?.()}
  </>
)

export const Section = (
  props: {
    title: string
  },
  { slots }: SetupContext,
) => (
  <section>
    <h2 class="resume-title">
      {props.title}
    </h2>
    {slots.default?.()}
  </section>
)
