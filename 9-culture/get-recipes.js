const fs = require("fs");
const { google } = require("googleapis");

require("dotenv").config();

const apiKey = process.env.GOOGLE_SEARCH_API_KEY;
const searchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID;

const customsearch = google.customsearch({
  version: "v1",
  auth: apiKey,
});

const searchStrings = [
  "tongseng kambing recipe",
  "telur dadar recipe",
  "tempe bacem recipe",
  "orak arik telur recipe",
  "telur balado recipe",
  "kering tempe recipe",
  "gulai kambing recipe",
  "nasi kebuli recipe",
  "orek tempe recipe",
  "oseng-oseng tempe recipe",
  "sapi lada hitam recipe",
  "tempe mendoan recipe",
  "udang asam manis recipe",
  "opor ayam recipe",
  "tongseng sapi recipe",
  "udang balado recipe",
  "pepes tahu recipe",
  "pepes tahu  recipe",
  "udang saus tiram recipe",
  "perkedel tahu recipe",
  "nasi goreng kambing recipe",
  "tahu isi recipe",
  "sate kambing recipe",
  "asem-asem recipe",
  "pindang ikan recipe",
  "soto ayam recipe",
  "tahu cabe garam recipe",
  "tumis tempe kacang panjang recipe",
  "tongkol suwir recipe",
  "sambal goreng udang recipe",
  "udang saus padang recipe",
  "rendang daging sapi recipe",
  "mie ayam recipe",
  "tumis udang recipe",
  "martabak tahu recipe",
  "udang telur asin recipe",
  "tahu telur recipe",
  "telur bumbu bali recipe",
  "tempe goreng tepung recipe",
  "sapo tahu recipe",
  "tempe melet recipe",
  "rawon sapi recipe",
  "udang crispy recipe",
  "pindang telur recipe",
  "sambal goreng tempe recipe",
  "tempe goreng recipe",
  "krengsengan kambing recipe",
  "tengkleng kambing recipe",
  "udang pedas manis recipe",
  "mendol tempe recipe",
  "nugget tempe recipe",
  "perkedel tempe recipe",
  "daging sapi lada hitam recipe",
  "tongseng ayam recipe",
  "tahu gejrot recipe",
  "udang goreng tepung recipe",
  "udang saus mentega recipe",
  "kari kambing recipe",
  "orek tempe basah recipe",
  "tempe jeletot recipe",
  "mangut lele recipe",
  "nasi goreng udang recipe",
  "oseng-oseng tempe kacang panjang recipe",
  "tahu fantasi recipe",
  "gurame asam manis recipe",
  "udang goreng mentega recipe",
  "ayam goreng recipe",
  "tempe goreng telur recipe",
  "kering tempe teri recipe",
  "bakso ayam recipe",
  "ayam crispy recipe",
  "ayam kecap recipe",
  "balado telur recipe",
  "semur daging sapi recipe",
  "sop ayam recipe",
];

const appendToFile = (fileName, data) => {
  fs.appendFile(fileName, data, (err) => {
    if (err) throw err;
    console.log("Data appended to file");
  });
};

const searchAndAppendLinks = async () => {
  const recipesWithLinks = [];

  for (const searchString of searchStrings) {
    console.log("Search for " + searchString);

    const res = await customsearch.cse.list({
      cx: searchEngineId,
      q: searchString,
    });

    const links = res.data.items.map((item) => item.link).slice(0, 3);

    recipesWithLinks.push({
      recipe: searchString,
      links: links,
    });
  }

  appendToFile("searchResults.json", JSON.stringify(recipesWithLinks));
};

searchAndAppendLinks();
