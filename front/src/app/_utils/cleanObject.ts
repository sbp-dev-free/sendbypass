export function cleanObject(obj: Record<string, any>): Record<string, any> {
  const cleanedObj: Record<string, any> = {};

  Object.keys(obj).forEach((key) => {
    let value = obj[key];

    if (Array.isArray(value)) {
      value = value
        .filter((item) => item !== undefined && item !== null && item !== '')
        .map((item) => (typeof item === 'object' ? cleanObject(item) : item));
    } else if (typeof value === 'object' && value !== null) {
      value = cleanObject(value);
    }

    if (
      value !== undefined &&
      value !== null &&
      value !== '' &&
      !(Array.isArray(value) && value.length === 0) &&
      !(
        typeof value === 'object' &&
        !Array.isArray(value) &&
        Object.keys(value).length === 0
      )
    ) {
      cleanedObj[key] = value;
    }
  });

  return cleanedObj;
}
