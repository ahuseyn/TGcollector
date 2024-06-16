import dayjs from "dayjs";
import serveFile from "helpers/serveFile";
import { json2csv } from "json-2-csv";

export async function exportCollection(data, name, isFolder) {
  const fileName = name.replace(/[^a-z0-9]/gi, "_").toLowerCase();

  const cleanedData = data.map(({ creationDate, id, ...c }) => ({
    id: id.toString(),
    url: `https://t.me/${c.username}`,
    ...(isFolder
      ? {}
      : { creationDate: dayjs.unix(creationDate).format("YYYY-MM-DD") }),
    ...c,
  }));

  const csvData = await json2csv(cleanedData, {});
  const blob = new Blob([csvData], { type: "text/csv" });
  serveFile(blob, `${fileName}.csv`);
}
