export default function getSearchParam(name: string) {
  const urlParams = new URLSearchParams(window.location.search);
  const sp = urlParams.get(name);

  return sp;
}
