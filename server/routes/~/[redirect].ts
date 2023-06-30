import { redirectMap } from '~/constants'

export default defineEventHandler((event) => {
  const { res, req } = event.node
  const dest = redirectMap.find(r => `/~${r.from}` === req.url) ?? { to: '/' }

  res.writeHead(301, { Location: dest.to })
  res.end()
})
