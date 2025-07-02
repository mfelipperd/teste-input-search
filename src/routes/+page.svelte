<script lang="ts">
  import { goto } from "$app/navigation";

    let nameInput:  string = '';
    let debounceTimeout: ReturnType<typeof setTimeout>;

    function onInput(): void {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      const q = nameInput.trim();
      const currentUrl = new URL(window.location.href);
    
      const newUrl = currentUrl.pathname + (currentUrl.search ? `?${currentUrl.searchParams.toString()}` : '');
      goto(newUrl, {
        replaceState: true,
        noScroll: true,
        keepFocus: true
      });
    }, 700);
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
</main>