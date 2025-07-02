/** @type {import('./$types').PageLoad} */
export async function load({ url, fetch }) {
  const name = url.searchParams.get("name") ?? "";
  if (!name) {
    return { name: "", age: null };
  }

  const response = await fetch(
    `https://api.agify.io?name=${encodeURIComponent(name)}`
  );
  const data = await response.json();

  return {
    name: data.name,
    age: data.age,
  };
}
