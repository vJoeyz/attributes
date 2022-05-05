<script type="ts">
  import Attributes from './Config.svelte';
  import { Meta, Template, Story } from '@storybook/addon-svelte-csf';
</script>

<Meta title="Attributes" component={Attributes} />

<Template let:args>
  <Attributes {...args} />
</Template>

<Story
  name="Primary"
  args={{
    attribute: 'fs-cmsload-element',
    value: 'list',
  }}
/>
