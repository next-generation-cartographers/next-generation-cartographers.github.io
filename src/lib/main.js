// grey out list elements with past events

let DAYS_PAST = 2;
let TIME_PAST = DAYS_PAST * 24 * 60 * 60 * 1000;

for (let event of document.querySelectorAll(".events li")) {
  // find everything that looks like a date
  let dates = event.textContent.match(/\d\d?\.\s?\d\d?\.\s?\d\d\d\d\W/g);
  if (dates) {
    dates = dates
      .map((d) => d.split(".").map((s) => s.trim()))
      .map((d) => new Date(d[2] + "-" + d[1] + "-" + d[0]))
      .sort((a, b) => b - a); // latest date first
    if (dates[0].getTime() + TIME_PAST < Date.now()) {
      event.classList.add("past");
    }
  }
}

// put older news items into a separate list
// this separate list is collapsed by default
// there is a button to expand this list

const newsList = document.querySelector("ul#news");
const news = Array.from(newsList.querySelectorAll("& > li"));
const maximumItems = 2;
const olderNews = news.slice(maximumItems);

news.forEach((item, i) => {
  if (i + 1 > maximumItems) item.remove();
});

const olderNewsList = document.createElement("ul");
olderNewsList.id = "older-news";
olderNewsList.style.display = "none";

const button = document.createElement("button");
button.style.display = "block";
button.style.margin = "0 auto";
button.textContent = "Show older news";
button.addEventListener("click", () => {
  olderNewsList.style.display = "block";
  button.remove();
});

olderNewsList.append(...olderNews);

newsList.parentNode.insertBefore(olderNewsList, newsList.nextSibling);
newsList.parentNode.insertBefore(button, newsList.nextSibling);
