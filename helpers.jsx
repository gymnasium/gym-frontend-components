export function htmlDecode(html) {
  let txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
}

// Shamelessly borrowed from @https://dev.to/bybydev/how-to-slugify-a-string-in-javascript-4o9n#comment-2689a
export function slugify(str) {
  str = str.replace(/^\s+|\s+$/g, ''); // trim leading/trailing spaces
  str = str.toLowerCase(); // convert to lowercase
  str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
  .replace(/\s+/g, '-') // collapse whitespace and replace by "-"
  .replace(/-+/g, '-'); // collapse dashes
  return str;
}

export const timestamp = Date.now();
