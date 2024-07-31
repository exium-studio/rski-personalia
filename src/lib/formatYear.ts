const formatYear = (numParam: number | string | null) => {
  let formattedNum;
  //@ts-ignore
  let num;
  if (typeof numParam === "string") {
    num = parseInt(numParam) as any;
  } else {
    num = numParam;
  }

  if (num === undefined || num === null || Number.isNaN(num)) {
    formattedNum = "";
  } else if (num !== 0) {
    formattedNum = num?.toString();
  } else if (num === 0) {
    formattedNum = "0";
  } else {
    formattedNum = "";
  }

  return formattedNum;
};

export default formatYear;
