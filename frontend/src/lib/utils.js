/**
 * Concatenates class names, filtering out falsy values.
 * Useful for dynamic Tailwind class merging.
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}
