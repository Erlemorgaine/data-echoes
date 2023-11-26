import { tsv } from "d3-fetch";
import fs from "fs";

const data = await tsv(
  "https://raw.githubusercontent.com/tomasonjo/blog-datasets/main/ice_fire/characters.tsv"
);

// From the original data, only keep relationship columns.
// Remove predecessor, we want to focus on family relations
const relationshipColumns = ["spouse", "mother", "father", "successor"];

// Replace all non-existent data for null,
const relevantData = data.map((d) => ({
  name: d.name,
  allegiance: removeUrl(setNullValues(d.allegiance)),
  spouse: removeUrl(setNullValues(d.spouse)),
  father: removeUrl(setNullValues(d.father)),
  mother: removeUrl(setNullValues(d.mother)),
  predecessor: removeUrl(setNullValues(d.predecessor)),
  successor: removeUrl(setNullValues(d.successor)),
  url: d.url,
}));

const dataWithRelations = relevantData.filter((d) =>
  relationshipColumns.some((r) => d[r])
);

fs.writeFile(
  "./ice-and-fire.json",
  JSON.stringify(dataWithRelations),
  (err) => {
    if (err) console.log(err);
    else {
      console.log("File written successfully\n");
    }
  }
);

// TODO: Some names are double (Aegon Frey), check how to handle

function setNullValues(value) {
  if (!value || value === "[]") {
    return null;
  }

  return value;
}

function removeUrl(value) {
  if (value) {
    const cleanValueArr = value
      .trim()
      .replace(/\s?http:\/\/awoiaf.westeros.org\/index\.php\//g, "")
      .replaceAll("[", "")
      .replaceAll("]", "")
      .replaceAll("'", "")
      .replaceAll("%27", "'")
      .replaceAll("_", " ")
      .split(",")
      .map((w) => w.trim());

    return [...new Set(cleanValueArr)];
  }

  return value;
}
