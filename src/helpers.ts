export function pause() {
  return new Promise((resolve) => setTimeout(resolve, 100));
}

export function formatDate(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // months are zero-indexed
  const day = date.getDate().toString().padStart(2, "0");

  return `${year}-${month}-${day}`;
}
