import dayjs from "dayjs";
import { json2csv } from "json-2-csv";
import serveFile from "./serveFile";

export async function exportCollection(data, name) {
  const fileName = name.replace(/[^a-z0-9]/gi, "_").toLowerCase();

  const cleanedData = data.map((c) => ({
    ...c,
    id: c.id.toString(),
    creationDate: dayjs.unix(c.creationDate).format("YYYY-MM-DD"),
  }));

  const csvData = await json2csv(cleanedData, {});
  const blob = new Blob([csvData], { type: "text/csv" });
  serveFile(blob, `${fileName}.csv`);
}
