<script lang="ts">
  import { getPostionedParent } from '$lib/utils';
  import interact from 'interactjs'
  import { onMount, tick } from 'svelte';
  let viewBoxEl: HTMLDivElement
  export let width = 300
  export let height = 150
  export let min = 0.5
  export let max = 2
  let scale = 1
  const edgesConfig = {
    top: true, left: true, bottom: true, right: true
  }
  let mouted = false
  let quadrant = "1"
  let isTransitioning = false
  const position = {top: 0, left: 0}

  const moveToCorner = async (value: string, isTransitioningValue: boolean = true) => {
    if(value !== quadrant) quadrant = value
    isTransitioning = isTransitioningValue
    await tick()
    const target = viewBoxEl
    const viewBoxRect = viewBoxEl.getBoundingClientRect()
    const parent = getPostionedParent(viewBoxEl)
    const parentRect = parent.getBoundingClientRect()

    switch(value) {
      case "1":
        target.style.transformOrigin = "right top"
        position.top = 0
        position.left = parentRect.width - viewBoxRect.width
        break
      case "2":
        target.style.transformOrigin = "left top"
        position.top = 0
        position.left = 0
        break
      case "3":
        target.style.transformOrigin = "left bottom"
        position.left = 0
        position.top = parentRect.height - viewBoxRect.height
        break
      case "4":
        target.style.transformOrigin = "right bottom"
        position.top = parentRect.height - viewBoxRect.height
        position.left = parentRect.width - viewBoxRect.width
        break
    }
  }
  $: mouted && moveToCorner(quadrant)

  const clamp = (minValue: number, maxValue:number, item: number) => {
    return item > maxValue ? maxValue : item < minValue ? minValue : item
  }

  const validate = (item: number) => {
    return item <= max && item >= min && Math.abs(item - scale) > 0.01
  }

  onMount(() => {
    mouted = true
    interact(viewBoxEl)
    .resizable({
      edges: edgesConfig,
      listeners: {
        move (event) {
          const {edges, rect} = event

          if(edges.left || edges.right) {
            if(!validate(rect.width/width)) return 
            scale = rect.width/width
          } else if(edges.top || edges.bottom ) {
            if(!validate(rect.height/height)) return 
            scale = rect.height/height
          } else {
            return
          }
          moveToCorner(quadrant, false)
        }
      },
      inertia: true
    })
    .draggable({
      onstart() {
        isTransitioning = false
      },
      onend (event: any) {
        const parent = getPostionedParent(viewBoxEl)
        const viewBoxRect = viewBoxEl.getBoundingClientRect()
        const parentRect = parent.getBoundingClientRect()
        const viewBoxCenter = {
          x: viewBoxRect.x + viewBoxRect.width / 2,
          y: viewBoxRect.y + viewBoxRect.height / 2,
        }
        const parentCenter = {
          x: parentRect.x + parentRect.width / 2,
          y: parentRect.y + parentRect.height / 2
        }
        const[x,y] =[ viewBoxCenter.x - parentCenter.x, -viewBoxCenter.y + parentCenter.y]
        if(x > 0 && y> 0) {
          //1사분면
          moveToCorner("1")
        } else if (x <= 0 && y > 0 ) {
          //2사분면
          moveToCorner("2")
        } else if (x <= 0 && y <=0) {
          //3사분면
          moveToCorner("3")
        } else {
          //4사분면
          moveToCorner("4")
        }
      },
      listeners: {
        move (event: any) {
          position.top += event.dy
          position.left += event.dx
        },
      },
      inertia: true,
      modifiers: [
        interact.modifiers.restrictRect({
          restriction: 'parent',
          endOnly: true
        })
      ]
    })
    viewBoxEl.addEventListener('transitionend', () => {
      isTransitioning = false
    })
  })

  onMount(() => {
    const observer = new ResizeObserver(() => {
      moveToCorner(quadrant, false)
    })
    observer.observe(getPostionedParent(viewBoxEl)) 
  })


</script>

<div 
  bind:this="{viewBoxEl}" 
  style="{`width: ${width}px; height: ${height}px; top: ${position.top}px; left: ${position.left}px; transform: scale(${scale}); transition: ${isTransitioning ? "top 1s, left 1s" : ""}`}" 
  class="bg-red-100 flex flex-col absolute origin-top-left" >
  <slot/>
</div>