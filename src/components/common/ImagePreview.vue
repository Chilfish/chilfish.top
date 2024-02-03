<script setup lang="ts">
import { NImage } from 'naive-ui'

const src = ref('')

onMounted(() => {
  const imgs = document.querySelectorAll('figure img') as NodeListOf<HTMLImageElement>
  const imgPreview = document.querySelector('#img-preview img') as HTMLImageElement

  imgs.forEach((img) => {
    img.onclick = () => {
      src.value = img.src
      setTimeout(() => {
        imgPreview.click()
      }, 100)
    }
  })
})
</script>

<template>
  <div
    class="absolute h-0 w-0"
  >
    <NImage
      id="img-preview"
      :src="src"
      :preview-src="src"
    />
  </div>
</template>
