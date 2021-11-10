import moment from "moment";

export function formatAndValidDateISO(date: string) {
  const dateMomentObject = moment(date, "DD/MM/YYYY");

  const dateObject = dateMomentObject.toDate();

  const parsedDate = moment(dateObject).format("YYYY-MM-DD");

  return {
    parsedDate: parsedDate,
    isDate: !!dateMomentObject.isValid(),
  };
}
