import type { getCollection } from "astro:content";

type EventDateTime = Awaited<
  ReturnType<typeof getCollection<"events">>
>[number]["data"]["dateTime"];

export const getEventDuration = (eventDateTime: EventDateTime) => {
  const timeZone = "UTC";
  const locale = "en-US";
  const [start, end] = Object.values(eventDateTime).map((d) => new Date(d));
  const startString = start.toLocaleString(locale, {
    timeZone,
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
  const endString = end.toLocaleString(locale, {
    timeZone,
    hour: "numeric",
    minute: "numeric",
  });
  return `${startString}-${endString}`;
};
