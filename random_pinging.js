function randomTime(startHour, endHour) {
  var number = startHour + Math.random() * (endHour - startHour);
  return number;
}

var times = [];

while (times.length < 4) {
  candidateTime = randomTime(9, 23);
  if (!withinRange(candidateTime, times)) {
    times.push(candidateTime);
  }
}

times.sort(function (a, b) {
  return a - b;
});

function withinRange(candidateTime, array) {
  for (let i = 0; i < array.length; i++) {
    if (Math.abs(array[i] - candidateTime) <= 1) {
      return true;
    }
  }
  return false;
}

function convertTimesToReadable(time) {
  var hour = Math.floor(time);
  var minutes = Math.round((time % 1) * 60);
  minutes = minutes < 10 ? "0" + minutes : minutes;
  var readableTime = hour + ":" + minutes;
  return readableTime;
}

let timesReadable = [];
for (let i = 0; i < times.length; i++) {
  timesReadable.push(convertTimesToReadable(times[i]));
}

console.log(timesReadable);
