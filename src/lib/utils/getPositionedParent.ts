function getPostionedParent(element: HTMLElement) {

  let parent = element.parentElement
  while(!!parent) {
    const position = getComputedStyle(parent).position 
    if(position !== 'static') return parent
    parent = parent.parentElement
  }

  return document.documentElement
}

export default getPostionedParent