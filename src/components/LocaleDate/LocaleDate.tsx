const dateTimeFormatter = new Intl.DateTimeFormat(navigator.languages, {
  dateStyle: 'medium',
  timeStyle: 'short',
});

export const LocaleDate = ({ date }: { date: string }) => {
  return dateTimeFormatter.format(new Date(date));
};
