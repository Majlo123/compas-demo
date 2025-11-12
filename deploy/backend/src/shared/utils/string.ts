export const slugifyText = (text: string): string => {
  return text
    .replace(/^\s+|\s+$/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

export const isJsonString = (str: any): boolean => {
  try {
    const json = JSON.parse(str);

    if (!json) {
      return false;
    }

    return typeof json === 'object';
  } catch (e) {
    return false;
  }
};

export const isEmail = (text: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text);
};

export const lowercaseFirstLetter = (str: string): string => {
  return str.charAt(0).toLowerCase() + str.slice(1);
};
