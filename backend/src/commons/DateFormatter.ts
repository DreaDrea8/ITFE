/**
 * A class to format dates in various locales and time zones.
 */
export class DateFormatter {
  time: Date;

  /**
   * Creates an instance of DateFormater.
   * @param {Date} [time] - The initial time to use for formatting. Defaults to the current date and time.
   */
  constructor (time?:Date) {
    this.time = time ?? new Date();
  };

  /**
   * Formats the given time or the instance's time in English (US) format with UTC timezone.
   * @param {Date} [time] - The time to format. Defaults to the instance's time.
   * @returns {string} The formatted date string in English (US) format.
   */
  toEnglishFormat = (time?:Date) : string => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'UTC',
    };
    return new Intl.DateTimeFormat('en-EN', options).format(time ?? this.time);
  };

  /**
   * Formats the given time or the instance's time in French format with UTC timezone.
   * @param {Date} [time] - The time to format. Defaults to the instance's time.
   * @returns {string} The formatted date string in French format.
   */
  toFrenchFormat = (time?:Date) : string => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'UTC',
    };
    return new Intl.DateTimeFormat('fr-FR', options).format(time ?? this.time);
  };

  /**
   * Formats the given time or the instance's time in French format with Paris timezone.
   * @param {Date} [time] - The time to format. Defaults to the instance's time.
   * @returns {string} The formatted date string in French format with Paris timezone.
   */
  toFrenchFormatAndFrenchTimeZone = (time?:Date) : string => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'Europe/Paris',
    };
    return new Intl.DateTimeFormat('fr-FR', options).format(time ?? this.time);
  };
}

export default new DateFormatter;