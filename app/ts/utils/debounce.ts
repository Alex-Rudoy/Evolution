export function debounce(f: Function, ms: number) {
  let isCooldown = false;

  return function fn(this: any, ...args: any) {
    if (isCooldown) return;

    f.apply(this, args);

    isCooldown = true;

    setTimeout(() => {
      isCooldown = false;
      return isCooldown;
    }, ms);
  };
}
