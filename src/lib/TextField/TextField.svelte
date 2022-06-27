<script lang="ts">
  import { createEventDispatcher } from "svelte";
  export let readonly = false
  export let value: string = ''
  export let errorMessage: string | undefined = ''
  export let label: string = ''
  $: isError = !!errorMessage

  const dispatch = createEventDispatcher()

  $: {
      dispatch('change', {
        target: { value }
      })
  }
</script>

<div>
  <div data-textfield class="relative input input-bordered flex flex-col justify-center h-auto py-0 px-2 {$$props.class}" class:error="{isError}">
    <input data-textfield-input placeholder=" " {readonly} bind:value="{value}" class:translate-y-1="{!!label}"/>
    <span  data-textfield-label>{label}</span>
  </div>
  {#if isError}
    <div data-textfield-error class="text-red-500 before:content-['*'] px-2 text-xs">{errorMessage}</div>
  {/if}
</div>

<style>
  [data-textfield] [data-textfield-label] {
    @apply opacity-30 pointer-events-none absolute transition-transform origin-top-left ;
  }

   [data-textfield] [data-textfield-input]:not(:placeholder-shown) ~ [data-textfield-label],
   [data-textfield]:focus-within [data-textfield-label] {
    @apply -translate-y-1/3 scale-75;
  }

  [data-textfield] > [data-textfield-input] {
    @apply w-full bg-transparent outline-none h-12;
    cursor: inherit;
  }

  [data-textfield-error] {
    @apply outline-red-300;
  }

</style>