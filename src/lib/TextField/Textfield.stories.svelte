<script lang="ts">
  import { Meta, Template, Story } from '@storybook/addon-svelte-csf';
  import TextField from './TextField.svelte';
  
</script>

<Meta title="TextField" component="{TextField}" />

<Template let:args>
  <TextField {...args}/>
</Template>

<Story  name ="primary" args={{label: 'TextField'}} />
