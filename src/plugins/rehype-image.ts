import type { Root, RootContent, RootContentMap } from 'hast'
import { imgHost, isDev, localImgHost } from '../constant/config'

function addPropsToImg(props: any, isRss: boolean = false) {
  let src = props.src as string

  if (src.startsWith('/'))
    src = `${imgHost}${src}`
  else if (!isDev && src.startsWith(localImgHost))
    src = src.replace(localImgHost, imgHost)

  const imgProp = {
    ...props,
    decoding: 'async',
    loading: 'lazy',
    referrerPolicy: 'same-origin',
    src: isRss ? src : '/placeholder.webp',
    dataSrc: isRss ? undefined : src,
    alt: isRss ? props.alt : 'image',
  }
  return imgProp as any
}

export default function rehypeImage(
  options: {
    node: RootContent | Root
    parent?: RootContent | Root
    isRss: boolean
  },
) {
  const { node, parent, isRss } = options
  if (!node || node.type !== 'element')
    return node

  const isRawImg
      = node.tagName === 'p'
      && node.children.length >= 1
      && node.children[0].type === 'element'
      && node.children[0].tagName === 'img'

  if (isRawImg) {
    node.tagName = 'figure'
    const img = node.children[0] as RootContentMap['element']
    const alt = img.properties.alt
    img.properties = addPropsToImg(img.properties, isRss)

    const figcaption = {
      type: 'element',
      tagName: 'figcaption',
      properties: {},
      children: [{ type: 'text', value: alt }],
    } as RootContentMap['element']

    node.children.push(figcaption)
  }
  else if (
    parent?.type === 'element'
    && parent.tagName === 'figure'
    && node.tagName === 'img'
    && !node.properties.dataSrc
  ) {
    node.properties = addPropsToImg(node.properties, isRss)
  }
  return node
}
