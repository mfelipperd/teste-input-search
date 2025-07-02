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
    interface HistoryEntry { name: string; age: number; }
    let history: HistoryEntry[] = [];
     let dark: boolean = false;


      
  onMount(() => {
    nameInput = data.name || '';
    previousName = data.name || '';
    previousAge = data.age;
     dark = localStorage.getItem('theme') === 'dark';
    document.documentElement.classList.toggle('dark', dark);
  });

   function toggleTheme(): void {
    dark = !dark;
    localStorage.setItem('theme', dark ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', dark);
  }
  
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
    if (previousName) {
      history = [{ name: previousName, age: previousAge as number }, ...history];
    }
    previousName = currentName;
    previousAge = data.age;
  }

  function remove(index: number): void {
    history = history.filter((_, i) => i !== index);
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
   {#if history.length}
    <div class="history">
      {#each history as entry, i}
        <div class="card history-card">
          <button class="remove-btn" on:click={() => remove(i)}>×</button>
          <p>🧙‍♀️ Estimativa para <strong>{entry.name}</strong>: <strong>{entry.age} anos</strong></p>
          <progress max="100" value={entry.age}></progress>
        </div>
      {/each}
    </div>
  {/if}

  <button class="theme-toggle" on:click={toggleTheme} aria-label="Toggle theme">
    {#if dark}
      🌙
    {:else}
      ☀️
    {/if}
  </button>
</main>