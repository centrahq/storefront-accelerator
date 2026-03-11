export const formatMinorToMajor = (amountMinor: number) => (amountMinor / 100).toFixed(2);

const flattenForPost = (data: Record<string, unknown>, prefix: string): Record<string, string> => {
  return Object.entries(data).reduce<Record<string, string>>((acc, [key, value]) => {
    const flatKey = prefix.length ? `${prefix}[${key}]` : key;

    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      return {
        ...acc,
        ...flattenForPost(value as Record<string, unknown>, flatKey),
      };
    }

    return {
      ...acc,
      [flatKey]: String(value),
    };
  }, {});
};

export const postAdditionalDetailsToSuccess = (data: Record<string, unknown>) => {
  const form = document.createElement('form');
  form.setAttribute('action', `${window.location.origin}/success`);
  form.setAttribute('method', 'post');

  const flattenedItems = flattenForPost(data, '');
  const postData = { ...flattenedItems, express: 'true' };

  Object.entries(postData).forEach(([name, value]) => {
    const input = document.createElement('input');
    input.setAttribute('type', 'hidden');
    input.setAttribute('name', name);
    input.setAttribute('value', value);
    form.appendChild(input);
  });

  form.setAttribute('style', 'position:absolute;left:-100px;top:-100px;');
  document.body.appendChild(form);

  return { form, flattenedItems };
};
