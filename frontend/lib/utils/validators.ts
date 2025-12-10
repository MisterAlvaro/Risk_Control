export const isRequired = (value: string) => value.trim().length > 0;

export const isNumber = (value: string) => !Number.isNaN(Number(value));

