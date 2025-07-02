<script lang="ts">
  import './+page.css';
  import { goto } from '$app/navigation';
  import type { PageData } from './$types';
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  export let data: PageData;

    let nameInput:  string = '';
    let debounceTimeout: ReturnType<typeof setTimeout>;
    let previousName: string = '';
    let previousAge: number | null = null;


      
  onMount(() => {
    nameInput = data.name || '';
    previousName = data.name || '';
    previousAge = data.age;

  });
  
    function onInput(): void {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      const q = nameInput.trim();
      const currentUrl = new URL(window.location.href);
       if (q) {
        currentUrl.searchParams.set('name', q);
      } else {
        currentUrl.searchParams.delete('name');
      }
      const newUrl = currentUrl.pathname + (currentUrl.search ? `?${currentUrl.searchParams.toString()}` : '');
      goto(newUrl, {
        replaceState: true,
        noScroll: true,
        keepFocus: true
      });
    }, 700);
  }

    $: currentName = $page.url.searchParams.get('name') || '';

      $: if (
    currentName &&
    currentName !== previousName &&
    data.age !== null
  ) {
   
    previousName = currentName;
    previousAge = data.age;
  }

</script>
<main>
     <h1>Descubra a idade pelo nome</h1>

  <label for="name">Digite um nome:</label>
    <input
    id="name"
    type="text"
    bind:value={nameInput}
    on:input={onInput}
    placeholder="ex: Ana"
    autocomplete="off"
  />
   {#if data.age === null}
    <p>Digite um nome acima e aguarde…</p>
  {:else}
    <div class="card">
      <p>🧙‍♀️ Estimativa para <strong>{data.name}</strong>: <strong>{data.age} anos</strong></p>
      <progress max="100" value={data.age}></progress>
    </div>
  {/if}
</main>