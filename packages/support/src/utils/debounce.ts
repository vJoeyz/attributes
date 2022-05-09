export default function debounce(timer: NodeJS.Timeout, v: () => void) {
  clearTimeout(timer);
  timer = setTimeout(() => {
    v();
  }, 250);
}
