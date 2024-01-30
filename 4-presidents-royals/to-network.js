import familyTree from "./ice_and_fire_final.json" assert { type: "json" };
import { writeFile } from "fs";

function generateNetworkData(inputArray) {
  const nodes = inputArray.map((item) => ({ id: item.name, data: item }));
  const links = inputArray
    .flatMap((item) => {
      const { name, father, mother, fatherRumored, motherRumored, spouse } =
        item;

      return [
        { source: name, target: father, type: "father" },
        { source: name, target: mother, type: "mother" },
        { source: name, target: fatherRumored, type: "fatherRumored" },
        { source: name, target: motherRumored, type: "motherRumored" },
        { source: name, target: spouse, type: "spouse" },
      ];
    })
    .filter((link) => link.target !== null);

  return { nodes, links };
}

const { nodes, links } = generateNetworkData(familyTree);

writeFile("network-data.json", JSON.stringify({ nodes, links }), (err) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log("File has been created");
});
