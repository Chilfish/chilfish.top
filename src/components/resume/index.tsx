let job = ''
export function myJob(isBe?: boolean) {
  if (typeof isBe === 'boolean') {
    job = isBe === true
      ? 'Java 后端开发工程师'
      : 'Web 前端开发工程师'
  }
  return job
}
