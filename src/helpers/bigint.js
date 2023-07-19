export function bigintConvert(obj) {
  if (typeof obj === "object" && obj !== null) {
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        obj[key] = bigintConvert(obj[key]);
      }
    }
  } else if (typeof obj === "bigint") {
    obj = obj.toString();
  }
  return obj;
}

export const replacer = (key, val) =>
  typeof val === "bigint" ? val.toString() : val;
