import { useCookies } from '@vueuse/integrations/useCookies'

const cookies = useCookies(['theme'])

export const isDark = useDark({
  valueLight: 'light',
  valueDark: 'dark',
  initialValue: cookies.get('theme') || 'auto',
  storageKey: 'theme',
  disableTransition: false,
  onChanged(_isDark, defaultHandler, mode) {
    cookies.set('theme', mode, {
      expires: new Date('2038-01-19T03:14:07'),
      path: '/',
      maxAge: 60 * 60 * 24 * 365 * 10,
      sameSite: 'strict',
    })
    defaultHandler(mode)
  },
})
