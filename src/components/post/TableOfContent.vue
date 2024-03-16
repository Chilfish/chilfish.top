<script setup lang="ts">
import type { MarkdownHeading } from 'astro'

const props = defineProps<{
  headers: MarkdownHeading[]
  maxDeep: number
}>()

const filteredHeaders = props.headers.filter(header => header.depth <= props.maxDeep)

const headings = ref<Element[]>([])
const tocItems = ref<Element[]>([])

let prevItem: Element | null = null

const handler = useThrottleFn(() => {
  return headings.value.forEach((heading, idx) => {
    const headingTop = heading.getBoundingClientRect().top
    const tocItem = tocItems.value[idx + 1]

    if (headingTop <= 0 && tocItem) {
      if (idx < headings.value.length - 1)
        prevItem?.classList.remove('active')

      prevItem = tocItem
      tocItem.classList.add('active')
    }
  })
}, 100)

function addAnchor() {
  headings.value.forEach((heading) => {
    const anchor = document.createElement('a')
    anchor.className = 'anchor'
    anchor.href = `#${heading.id}`
    anchor.textContent = '#'
    heading.innerHTML = anchor.outerHTML + heading.innerHTML
  })
}

onMounted(() => {
  headings.value = Array.from(document.querySelectorAll('h2, h3, h4, h5'))

  handler()
  addAnchor()
  useEventListener(document, 'scroll', handler)
})
</script>

<template>
  <aside
    class="mb-4 hidden w-1/5 flex-1 transition-opacity"
    uno-md="block"
  >
    <nav class="toc">
      <span class="mb-2 text-xl font-bold">
        目录
      </span>
      <ol class="h-85vh overflow-y-auto pb-4">
        <li
          v-for="header in filteredHeaders"
          ref="tocItems"
          :key="header.slug"
          :class="`toc-depth-${header.depth} line-height-6 mt-2 underline`"
          uno-text="3.5 hover:blue-500"
        >
          <a :href="`#${header.slug}`">
            {{ header.text }}
          </a>
        </li>
      </ol>
    </nav>
  </aside>
</template>

<style lang="scss">
.toc {
  position: sticky;
  top: 4rem;
  li.active {
    --uno: text-blue;
  }
}
.toc-depth-3 {
  padding-left: 1.5rem;
}
.toc-depth-4 {
  padding-left: 2rem;
}
.toc-depth-5 {
  padding-left: 2.5rem;
}
.toc-depth-6 {
  padding-left: 2.6rem;
}
</style>
