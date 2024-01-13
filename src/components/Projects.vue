<script setup lang="ts">
import type { Project } from '~/constants'

const projects = useState('projects', () => ([] as Project[]))

await callOnce(async () => {
  const { data } = await useFetch<Project[]>('/api/project')
  data.value && (projects.value = data.value)
})
</script>

<template>
  <div class="py-8">
    <h1
      class="flex items-center text-2xl font-bold"
    >
      <span>Projects</span>
      <NuxtLink
        :no-rel="true"
        to="https://github.com/Chilfish?tab=repositories&type=source"
        class="i-tabler-arrow-up-right w-8" ml-auto icon inline-block h-8
        target="_blank"
        text="gray hover:light"
      />
    </h1>

    <div
      grid="~ cols-1 sm:cols-2"
      class="mt-6 gap-4"
    >
      <nuxt-link
        v-for="project in projects"
        :key="project.id"
        :to="project.url"
        :no-rel="true"
        target="_blank"
        class="flex flex-col gap-2 rounded-md px-4 py-6 transition-colors"
        bg="dark-7 hover:dark-8"
      >
        <NuxtImg
          :src="project.banner"
          :alt="project.name"
          :height="120"
          loading="lazy"
          class="rounded-md"
        />

        <div class="text-xl">
          {{ project.name }}
        </div>
        <div class="text-sm">
          {{ project.description }}
        </div>

        <div class="flex items-center text-3">
          <div
            :style="{
              'background-color': project.color,
            }"
            class="mr-1 mt-1 inline-block h-3 w-3 rounded-full shadow-inner"
          />
          <span class="mr-3">
            {{ project.language }}
          </span>

          <span class="i-tabler-star mr-1 mt-0.5 icon h-3 w-3" />
          <span>
            {{ project.stars }}
          </span>

          <span class="i-tabler-license ml-3 mr-1 mt-0.5 icon h-3 w-3" />
          <span>{{ project.license }}</span>
        </div>
      </nuxt-link>
    </div>
  </div>
</template>
