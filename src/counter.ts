export function setupCounter(element: HTMLButtonElement) {
  let counter = 0;
  const setCounter = (count: number) => {
    counter = count;
    element.innerHTML = `count is ${counter}`;
  };
  element.addEventListener('click', () => setCounter(counter + 1));
  setCounter(0);
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  const button = document.getElementById('counter-button') as HTMLButtonElement;
  if (button) {
    setupCounter(button);
  }
});
