<script lang="ts">
  import { onMount } from 'svelte';
  import Header from '@src/components/Layout/Header.svelte';
  import Config from '@src/components/Config/Config.svelte';
  import Schema from '@src/components/Schema/Schema.svelte';
  import Tutorial from '@src/components/Layout/Tutorial.svelte';
  import Actions from '@src/components/Layout/AttributeActions.svelte';
  import Loading from '@src/components/Layout/Loading.svelte';
  import Minimize from '@src/components/Layout/Minimize.svelte';
  import Initial from '@src/components/Layout/Initial.svelte';
  import type { AttributeSchema } from '@global/types/schema';
  import type { Attribute, AttributeLoaded } from '@src/types/Schema.types';

  import CMS_COMBINE from '@src/schemas/cms-combine';
  import CMS_FILTER from '@src/schemas/cms-filter';
  import CMS_LOAD from '@src/schemas/cms-load';
  import CMS_NEST from '@src/schemas/cms-nest';
  import CMS_PREV_NEXT from '@src/schemas/cms-previous-next';
  import CMS_SELECT from '@src/schemas/cms-select';
  import CMS_SLIDER from '@src/schemas/cms-slider';
  import CMS_SORT from '@src/schemas/cms-sort';
  import CMS_TABS from '@src/schemas/cms-tabs';
  import COPY_CLIP from '@src/schemas/copy-clip';
  import COUNT_ITEMS from '@src/schemas/count-items';
  import CUSTOM_FAVICON from '@src/schemas/custom-favicon';
  import CUSTOM_SELECT from '@src/schemas/custom-select';
  import SLIDER_DOTS from '@src/schemas/slider-dots';
  import DISABLE_SCROLLING from '@src/schemas/disable-scrolling';
  import LINK_BLOCK_EDIT from '@src/schemas/link-block-edit';
  import MIRROR_CLICK from '@src/schemas/mirror-click';
  import MIRROR_INPUT from '@src/schemas/mirror-input';
  import RICH_TEXT from '@src/schemas/rich-text';
  import RANGE_SLIDER from '@src/schemas/range-slider';
  import CODE_HIGHLIGHT from '@src/schemas/code-highlight';
  import SMART_LIGHTBOX from '@src/schemas/smart-lightbox';

  import { isScriptLoaded } from '@src/services/Attributes/Script/ScriptService'

  import {
    schemas,
    schemaSelected,
    schemaData,
    schemaSettingsKey,
    walkthroughMode,
    WALKTHROUGH_MODES,
    schemaMode,
    SCHEMA_MODES,
    isLoadingWalkthrough,
    isLoadingSchema,
    isValidating,
  } from '@src/stores';

  interface StaticSchema {
    [key: string]: AttributeSchema;
  }

  const staticSchema: StaticSchema = {
    cmscombine: CMS_COMBINE,
    cmsfilter: CMS_FILTER,
    cmsload: CMS_LOAD,
    cmsnest: CMS_NEST,
    cmsprevnext: CMS_PREV_NEXT,
    cmsselect: CMS_SELECT,
    cmsslider: CMS_SLIDER,
    cmssort: CMS_SORT,
    cmstabs: CMS_TABS,
    copyclip: COPY_CLIP,
    countitems: COUNT_ITEMS,
    favcustom: CUSTOM_FAVICON,
    selectcustom: CUSTOM_SELECT,
    sliderdots: SLIDER_DOTS,
    scrolldisable: DISABLE_SCROLLING,
    linkblockedit: LINK_BLOCK_EDIT,
    mirrorclick: MIRROR_CLICK,
    mirrorinput: MIRROR_INPUT,
    richtext: RICH_TEXT,
    rangeslider: RANGE_SLIDER,
    codehighlight: CODE_HIGHLIGHT,
    smartlightbox: SMART_LIGHTBOX,
  };

  async function loadStaticSchema(key: string) {

    schemaData.set(staticSchema[key]);

    await new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });
    $schemaMode = SCHEMA_MODES.READY;

  }

  async function loadSchema(inputFile: string) {


    const request = await fetch(inputFile);
    const data: AttributeSchema = await request.json();

    schemaData.set(data);

    await new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });
    $schemaMode = SCHEMA_MODES.READY;
  }

  async function loadAttributes() {
    const request = await fetch('https://cdn.jsdelivr.net/npm/@finsweet/attributes-docs@1/attributes.json');
    const data = await request.json();

    const attributesWithLoadPromises = data.map(async (attribute: Attribute): Promise<AttributeLoaded> => {
      const schemaFile = `${attribute.baseSrc}/${attribute.schemaSrc}`.replace('@1', '@beta');
      const scriptFile = `${attribute.baseSrc}/${attribute.scriptSrc}`;

      const loaded = await isScriptLoaded(scriptFile);

      return {
        ...attribute,
        schemaFile,
        scriptFile,
        loaded,
      };
    })

    const attributesWithLoad: AttributeLoaded[] = await Promise.all(attributesWithLoadPromises);

    schemas.set(attributesWithLoad);

  }

  onMount(async () => {
    $walkthroughMode = WALKTHROUGH_MODES.INITIALIZING;

    await loadAttributes();

    await new Promise((resolve) => {
      setTimeout(resolve, 2000);
    });

    $walkthroughMode = WALKTHROUGH_MODES.READY;

    const url = new URLSearchParams(window.location.search);
    const selected = url.get('selected');


    if (selected && selected !== '') {
      $schemaSettingsKey = selected;
      $schemaMode = SCHEMA_MODES.LOADING;
      return;
    }

    if ($schemaMode !== SCHEMA_MODES.READY) {
      $schemaMode = SCHEMA_MODES.READY;
    }
  });

  let minimize = false;
  function toggleMinimize() {
    minimize = !minimize;
  }


  $: {
    if ($schemaSelected && $isLoadingWalkthrough === false && $isLoadingSchema === true) {
      $schemaData = null;

      if (Object.keys(staticSchema).includes(($schemaSelected as AttributeLoaded).key)) {
        loadStaticSchema(($schemaSelected as AttributeLoaded).key);
      } else {
        loadSchema(($schemaSelected as AttributeLoaded).schemaFile);
      }

    }
  }

  $: if ($schemaSelected) {
    if (Object.keys(staticSchema).includes(($schemaSelected as AttributeLoaded).key)) {
      loadStaticSchema(($schemaSelected as AttributeLoaded).key);
    } else {
      loadSchema(($schemaSelected as AttributeLoaded).schemaFile);
    }
  }


</script>


<div
  id="walkthrough"
  data-testid="walkthrough"
  class="walkthrough"
  class:minimize={minimize === true}
>
  <Loading isLoading={$isLoadingWalkthrough || $isLoadingSchema || $isValidating}/>
  <Minimize toggleMinimize={toggleMinimize} isMinimized={minimize} />
  <div id="wizard-internal" class="walkthrough_interface">
    <Header>
      <div>Attributes Automated Support</div> <Tutorial/>
    </Header>
    <Config />
    {#if $schemaSettingsKey}
      <Schema/>
    {:else}
      <Initial/>
    {/if}
  </div>
  {#if $schemaSettingsKey}
    <Actions/>
  {/if}
</div>

<style>
  @font-face {
    font-family: 'Open Sans';
    font-style: normal;
    font-weight: 300;
    src: local('Open Sans Light'),
      local('OpenSans-Light'),
      url(https://fonts.gstatic.com/s/opensans/v13/DXI1ORHCpsQm3Vp6mXoaTXhCUOGz7vYGh680lGh-uXM.woff)
      format('woff');
  }

  @font-face {
    font-family: 'Open Sans';
    font-style: normal;
    font-weight: 400;
    src: local('Open Sans'),
    local('OpenSans'),
    url(https://fonts.gstatic.com/s/opensans/v13/cJZKeOuBrn4kERxqtaUH3T8E0i7KZn-EPnyo3HZu7kw.woff) format('woff');
  }

  @font-face {
    font-family: 'Open Sans';
    font-style: normal;
    font-weight: 600;
    src: local('Open Sans Semibold'),
    local('OpenSans-Semibold'),
    url(https://fonts.gstatic.com/s/opensans/v13/MTP_ySUJH_bn48VBG8sNSnhCUOGz7vYGh680lGh-uXM.woff)
    format('woff');
  }

  .walkthrough {
    position: fixed;
    left: auto;
    font-family: 'Open Sans';
    top: 0%;
    right: 0%;
    bottom: 0%;
    display: flex;
    width: 30rem;
    height: 100vh;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    background-color: #252525;
    line-height: 1.5;
    z-index: 9999;
    transition: all 1s ease-in-out;
  }

  .walkthrough.minimize {
    right: -30rem;
    transition: all 1s ease-in-out;
  }

  .walkthrough_interface {
    position: relative;
    left: auto;
    top: 0%;
    right: 0%;
    bottom: 0%;
    overflow: auto;
    width: 30rem;
    padding-bottom: 5rem;
    flex: 1;
    background-color: #252525;
    color: #ccc;
    box-sizing: border-box;
  }

  .walkthrough_interface::-webkit-scrollbar {
    width: 1rem;
  }
  /*track*/
  .walkthrough_interface::-webkit-scrollbar-track {
    background:rgb(0, 0, 0);
  }
  /*thumb*/
  .walkthrough_interface::-webkit-scrollbar-thumb {
    background: #474747;
  }

</style>
