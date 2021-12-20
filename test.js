let dates = ["alex", "bob", "carl"];
console.log(dates);

dates = dates.filter((_, idx) => idx !== 1);
console.log(dates);
