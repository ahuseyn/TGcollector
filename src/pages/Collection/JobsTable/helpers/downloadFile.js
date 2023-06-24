import { openDB } from "idb";
import { json2csv } from "json-2-csv";
import { toast } from "react-hot-toast";

const replacer = (key, val) => (typeof val === "bigint" ? val.toString() : val);

function bigintConvert(obj) {
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

export async function downloadFile(job, name, format) {
  if (!Boolean(format)) {
    return toast.error("Please choose a format to save");
  }

  const db = await openDB(job);
  const data = await db.getAll("messages");

  const groupedData = data.flat();

  const fileName = name.replace(/[^a-z0-9]/gi, "_").toLowerCase();

  switch (format) {
    case "json":
      {
        const jsonData = JSON.stringify(groupedData, replacer, 2);
        const blob = new Blob([jsonData], { type: "application/json" });
        serveFile(blob, `${fileName}.json`);
      }
      break;
    case "csv":
      {
        const cleanedData = bigintConvert(groupedData);
        const csvData = await json2csv(cleanedData, {});
        const blob = new Blob([csvData], { type: "text/csv" });
        serveFile(blob, `${fileName}.csv`);
      }
      break;
    default:
      toast.error("Please provide a valid file format");
  }
}

function serveFile(blob, filename) {
  // Create a temporary anchor element
  const anchor = document.createElement("a");
  anchor.href = URL.createObjectURL(blob);
  anchor.download = filename;

  // Programmatically trigger the download
  anchor.click();

  // Clean up
  URL.revokeObjectURL(anchor.href);
  anchor.remove();
}
