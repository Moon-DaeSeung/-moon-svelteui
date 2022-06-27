<script lang="ts">
  import { Meta, Template, Story } from '@storybook/addon-svelte-csf';
  import ViewBox from './Draggable.svelte';
</script>

<Meta title="ViewBox" component="{ViewBox}" />

<Template let:args>
  <div class="bg-blue-100 h-screen relative">
    <ViewBox {...args}>
      <span class="text-9xl mx-auto">Hi</span>
    </ViewBox>
  </div>
</Template>u

<Story name ="primary"/>