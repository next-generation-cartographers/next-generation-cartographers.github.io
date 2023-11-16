// shuffle li's in "shuffle" wrapper

// Fisher-Yates shuffle
function shuffle(arr) {
  let currentIndex = arr.length;
  let randomIndex;
  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [arr[currentIndex], arr[randomIndex]] = [
      arr[randomIndex],
      arr[currentIndex],
    ];
  }
  return arr;
}

for (let wrapper of document.querySelectorAll(".shuffle")) {
  let lis = shuffle(Array.from(wrapper.querySelectorAll("li")));
  for (let li of lis) {
    li.parentElement.appendChild(li);
  }
}

// grey out list elements with past events

let DAYS_PAST = 7;
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
