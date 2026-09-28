const parseGroupFromMetadata = (metadata: string): string => {
  const key = 'group-title="';
  const idx = metadata.indexOf(key);
  if (idx === -1) return 'Undefined';
  const start = idx + key.length;
  const end = metadata.indexOf('"', start);
  if (end === -1) return 'Undefined';
  return metadata.slice(start, end).trim() || 'Undefined';
};

export const m3u2txt = (m3uArray: string[]) => {
  const groups = new Map<string, string>();

  for (let i = 1; i < m3uArray.length; i += 2) {
    const extinfLine = m3uArray[i];
    const commaIndex = extinfLine.indexOf(',');
    const metadata = commaIndex === -1 ? extinfLine : extinfLine.slice(0, commaIndex).trim();
    const channelName = commaIndex === -1 ? '' : extinfLine.slice(commaIndex + 1).trim();

    const g = parseGroupFromMetadata(metadata);
    const line = `${channelName.replace(/\s+/g, '_')},${m3uArray[i + 1]}\n`;

    const prev = groups.get(g);
    groups.set(g, prev ? prev + line : line);
  }

  let txt = '';
  groups.forEach((v, k) => {
    txt += `${k},#genre#\n${v}\n`;
  });
  return txt.substring(0, txt.length - 2);
};
