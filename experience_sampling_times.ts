function random_times(day: Date, number_of_times: number): Array<Date> {
  let dates: Array<Date> = [];
  let day_ = new Date(day);
  let earliest_time = new Date(day_);
  earliest_time.setHours(9, 0, 0, 0);
  let latest_time = new Date(day_);
  latest_time.setHours(22, 0, 0, 0);
  for (let i = 0; i < number_of_times; i++) {
    let date_to_add = random_time(day_, earliest_time, latest_time);
    dates.push(date_to_add);
  }
  return dates.sort();
}

function random_time(day: Date, earliest_time: Date, latest_time: Date): Date {
  let time =
    earliest_time.getTime() +
    Math.random() * (latest_time.getTime() - earliest_time.getTime());
  let random_time = new Date(time);
  return random_time;
}

// function withinRange(candidateTime: Date, array: Array<Date>, range: ) {
//     for (let i = 0; i < array.length; i++) {
//       if (Math.abs(array[i] - candidateTime) <= 1) {
//         return true;
//       }
//     }
//     return false;
//   }

export { random_times, random_time };
