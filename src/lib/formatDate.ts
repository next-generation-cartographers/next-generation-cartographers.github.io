/**
 * Formats a date string into a more readable format.
 * @param dateString A date string in ISO format (e.g., "2023-10-01T12:00:00Z").
 * @returns The formatted date string.
 */
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    throw new Error("Invalid date string provided");
  }
  return new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
};

export default formatDate;
