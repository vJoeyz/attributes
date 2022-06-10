export default function debounce(timer: number, v: () => void) {
  clearTimeout(timer);
  timer = setTimeout(() => {
    v();
  }, 250);
}
