import type { getCollection } from "astro:content";

type EventDateTime = Awaited<
  ReturnType<typeof getCollection<"events">>
>[number]["data"]["dateTime"];

export const getEventDuration = (
  eventDateTime: EventDateTime,
  timeZone: string
) => {
  if (!eventDateTime) {
    throw new Error("No date available");
  }

  const [start, end] = Object.values(eventDateTime).map((d) => new Date(d));
  const startString = start.toLocaleString(undefined, {
    timeZone,
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
  const endString = end.toLocaleString(undefined, {
    timeZone,
    hour: "numeric",
    minute: "numeric",
    timeZoneName: "short",
  });
  return `${startString}-${endString}`;
};
