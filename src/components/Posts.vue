<script setup lang="ts">
interface Post {
  id: string
  title: string
  url: string
  date: string
}

const posts = useState('posts', () => [] as Post[])

await callOnce(async () => {
  const data = await $fetch<Post[]>('/api/posts')
  posts.value = data
})
</script>

<template>
  <div>
    <TitleBar
      title="Latest Posts"
      url="https://note.chilfish.top/blogs"
    />

    <div class="mt-4 flex flex-col">
      <NuxtLink
        v-for="post in posts"
        :key="post.id"
        :to="post.url"
        :no-rel="true"
        target="_blank"
        class="flex items-center justify-between rounded-md p-4 transition-colors"
        bg="hover:dark-5"
      >
        <div class="font-500">
          {{ post.title }}
        </div>

        <div class="ml-2 min-w-fit text-sm text-gray">
          {{ post.date }}
        </div>
      </NuxtLink>
    </div>
  </div>
</template>
