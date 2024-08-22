import { parse } from "csv-parse";
import fs from "node:fs";

const csvPath = new URL("MOCK_DATA.csv", import.meta.url);

let stream = fs.createReadStream(csvPath);

let parsed = stream.pipe(
  parse({
    delimiter: ",",
    skip_empty_lines: true,
    from_line: 2,
  })
);

for await (const [title, description] of parsed) {
  console.log("title", title, "description", description);
  await fetch("http://localhost:3333/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title,
      description,
    }),
  });
}
