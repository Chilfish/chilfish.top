import { Index, Show } from 'solid-js';

interface SocialProps {
  data: {
    icon: string;
    link: string;
    class: string;
    text?: string;
  };
}

const SocialItem = (props: SocialProps) => {
  const { data } = props;
  return (
    <a
      class={`inline-flex px-3 py-2 mt-2 mr-2 rounded-md bg-gray-50 transition-colors decoration-none ${data.class} hover:text-white dark:bg-gray-50/10`}
      href={data.link}
      target="_blank"
    >
      <div text-xl>
        <div class={data.icon} />
      </div>
      <Show when={data.text}>
        <div text-sm ml-1>
          {data.text}
        </div>
      </Show>
    </a>
  );
};

export default () => {
  const socialLists = [
    {
      text: 'Blog',
      link: 'https://note.chilfish.top',
      icon: 'i-ri-book-2-line',
      class: 'hover:bg-gray-700 dark:hover:bg-white dark:hover:text-gray-900',
    },
    {
      text: '',
      link: 'https://github.com/Chilfish',
      icon: 'i-ri-github-fill',
      class: 'hover:bg-gray-700 dark:hover:bg-white dark:hover:text-gray-900',
    },
    {
      text: '',
      link: 'mailto:chill4fish@gmail.com',
      icon: 'i-ri-mail-fill',
      class: 'hover:bg-[#E84234]',
    },
    {
      text: '',
      link: 'https://twitter.com/chilllish',
      icon: 'i-fa-brands-twitter',
      class: 'hover:bg-[#00ACEE]',
    },
    {
      text: '',
      link: 'https://weibo.com/chilfish',
      icon: 'i-fa-brands-weibo',
      class: 'hover:bg-[#FF8200]',
    },
    {
      text: '',
      link: 'https://space.bilibili.com/259486090',
      icon: 'i-ri-bilibili-fill',
      class: 'hover:bg-[#fb7299]',
    },
    {
      text: '',
      link: 'https://www.zhihu.com/people/Walmart_Zelo',
      icon: 'i-ri-zhihu-fill',
      class: 'hover:bg-[#558EFF]',
    },
  ];

  return (
    <div mt-4>
      <Index each={socialLists}>{(item) => <SocialItem data={item()} />}</Index>
    </div>
  );
};
