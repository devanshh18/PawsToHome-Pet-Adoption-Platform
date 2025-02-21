// Age formatting function
export function formatPetAge(years, months) {
  let category = "";

  if (years === 0 && months > 0) {
    category = "Baby";
  } else if (years >= 1 && years <= 3) {
    category = "Young";
  } else if (years >= 4 && years <= 7) {
    category = "Adult";
  } else {
    category = "Senior";
  }

  let formattedAge = `${
    years > 0 ? years + " year" + (years > 1 ? "s" : "") : ""
  } ${
    months > 0 ? months + " month" + (months > 1 ? "s" : "") : ""
  } old, ${category}`.trim();
  return formattedAge;
}