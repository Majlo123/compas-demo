export const getUnixTimestamp = (date: Date): number => Math.floor(date.getTime() / 1000);

export const getCurrentUnixTimestamp = (): number => getUnixTimestamp(new Date());

export const nowUnixSQL = 'EXTRACT(EPOCH FROM now())::INT';

export const parseDurationToSeconds = (duration: string): number => {
  const match = /^(\d+)([smhd])$/.exec(duration);
  if (!match) {
    throw new Error(`Invalid duration format: ${duration}`);
  }

  const value = parseInt(match[1], 10);
  const unit = match[2] as keyof typeof unitMultipliers;

  const unitMultipliers = {
    s: 1,
    m: 60,
    h: 3600,
    d: 86400,
  };

  const multiplier = unitMultipliers[unit];

  if (multiplier === undefined) {
    throw new Error(`Unsupported duration unit: ${unit}`);
  }

  return value * multiplier;
};

export const formatUnixTimestamp = (
  unixTimestamp: number,
  options: {
    timeZone?: string;
    locale?: string;
    includeSeconds?: boolean;
    dateStyle?: 'short' | 'medium' | 'long' | 'full';
    timeStyle?: 'short' | 'medium' | 'long' | 'full';
    showTimeZone?: boolean;
  } = {},
): string => {
  const {
    timeZone = 'UTC',
    locale = 'en-US',
    includeSeconds = false,
    dateStyle = 'medium',
    timeStyle = 'short',
    showTimeZone = true,
  } = options;

  const date = new Date(unixTimestamp * 1000);

  const formatOptions: Intl.DateTimeFormatOptions = {
    timeZone,
    dateStyle,
    timeStyle: includeSeconds ? 'medium' : timeStyle,
  };

  if (showTimeZone && !dateStyle && !timeStyle) {
    formatOptions.timeZoneName = 'short';
  }

  let formattedDate = new Intl.DateTimeFormat(locale, formatOptions).format(date);

  if (showTimeZone) {
    const timeZoneFormatter = new Intl.DateTimeFormat(locale, {
      timeZone,
      timeZoneName: 'short',
    });
    const timeZoneName =
      timeZoneFormatter.formatToParts(date).find((part) => part.type === 'timeZoneName')?.value ||
      timeZone;
    formattedDate += ` ${timeZoneName}`;
  }

  return formattedDate;
};
