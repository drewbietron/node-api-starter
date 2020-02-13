export default function cleanText(str: string) {
  if (!str) return '';
  return str
    .replace(/(\r\n|\n|\r)/gm, '')
    .replace(/&amp;/g, '&')
    .replace(/ +(?= )/g, '')
    .trim();
}
