import fs from "fs"
import path from "path"

const __dirname = path.dirname(new URL(import.meta.url).pathname)

function stripLooseLootData(looseLoot) {
  return {
    spawnpoints: looseLoot.spawnpoints.map((entry) => ({
      probability: entry.probability,
      template: {
        items: entry.template.Items.map((item) => ({
          _tpl: item._tpl,
        })),
      },
    })),
    spawnpointsForced: looseLoot.spawnpointsForced.map((entry) => ({
      probability: entry.probability,
      template: {
        items: entry.template.Items.map((item) => ({
          _tpl: item._tpl,
        })),
      },
    })),
  }
}

const LOOSE_LOOT_FILENAMES = [
  "looseLoot-bigmap.json",
  "looseLoot-factory4_day.json",
  "looseLoot-factory4_night.json",
  "looseLoot-interchange.json",
  "looseLoot-laboratory.json",
  "looseLoot-lighthouse.json",
  "looseLoot-rezervbase.json",
  "looseLoot-sandbox.json",
  "looseLoot-shoreline.json",
  "looseLoot-tarkovstreets.json",
  "looseLoot-woods.json",
]

const LOOSE_LOOT_DIR = path.join(__dirname, "..", "src", "data", "dynamic-loot")

function main() {
  for (const filename of LOOSE_LOOT_FILENAMES) {
    const filePath = path.join(LOOSE_LOOT_DIR, filename)
    const looseLoot = JSON.parse(fs.readFileSync(filePath))
    const strippedLooseLoot = stripLooseLootData(looseLoot)

    const outfile = path.join(LOOSE_LOOT_DIR, `stripped-${filename}`)
    console.log(`Writing stripped loot data to ${outfile}`)
    fs.writeFileSync(outfile, JSON.stringify(strippedLooseLoot))
  }
}

main()
