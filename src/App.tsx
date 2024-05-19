import { useEffect, useState } from "react"
import "./App.css"

import { default as CUSTOMS_LOOT } from "./data/dynamic-loot/stripped-looseLoot-bigmap.json"
import { default as FACTORY_DAY_LOOT } from "./data/dynamic-loot/stripped-looseLoot-factory4_day.json"
import { default as FACTORY_NIGHT_LOOT } from "./data/dynamic-loot/stripped-looseLoot-factory4_night.json"
import { default as INTERCHANGE_LOOT } from "./data/dynamic-loot/stripped-looseLoot-interchange.json"
import { default as LAB_LOOT } from "./data/dynamic-loot/stripped-looseLoot-laboratory.json"
import { default as LIGHTHOUSE_LOOT } from "./data/dynamic-loot/stripped-looseLoot-lighthouse.json"
import { default as RESERVE_LOOT } from "./data/dynamic-loot/stripped-looseLoot-rezervbase.json"
import { default as SANDBOX_LOOT } from "./data/dynamic-loot/stripped-looseLoot-sandbox.json"
import { default as SHORELINE_LOOT } from "./data/dynamic-loot/stripped-looseLoot-shoreline.json"
import { default as TARKOV_STREETS_LOOT } from "./data/dynamic-loot/stripped-looseLoot-tarkovstreets.json"
import { default as WOODS_LOOT } from "./data/dynamic-loot/stripped-looseLoot-woods.json"

const MAP_NAME_TO_LOOT: Record<string, StrippedDynamicLoot> = {
  Customs: CUSTOMS_LOOT as StrippedDynamicLoot,
  Interchange: INTERCHANGE_LOOT as StrippedDynamicLoot,
  Reserve: RESERVE_LOOT as StrippedDynamicLoot,
  Shoreline: SHORELINE_LOOT as StrippedDynamicLoot,
  Woods: WOODS_LOOT as StrippedDynamicLoot,
  "Factory (Day)": FACTORY_DAY_LOOT as StrippedDynamicLoot,
  "Factory (Night)": FACTORY_NIGHT_LOOT as StrippedDynamicLoot,
  Lab: LAB_LOOT as StrippedDynamicLoot,
  Lighthouse: LIGHTHOUSE_LOOT as StrippedDynamicLoot,
  "Streets of Tarkov": TARKOV_STREETS_LOOT as StrippedDynamicLoot,
  "Ground Zero": SANDBOX_LOOT as StrippedDynamicLoot,
}

interface LootEntryInfo {
  probability: number
}

function findDynamicLootEntriesById(
  dynamicLoot: Record<string, StrippedDynamicLoot>,
  itemId: string
): Record<string, LootEntryInfo[]> {
  const matchingEntries = {} as Record<string, LootEntryInfo[]>
  for (const [locationId, loot] of Object.entries(dynamicLoot)) {
    const spawnpoints = loot.spawnpoints.concat(loot.spawnpointsForced) as StrippedDynamicLootEntry[]
    const entries = spawnpoints
      .filter((entry) => entry.template.items.some((item) => item._tpl === itemId))
      .map((entry) => ({
        probability: entry.probability,
      }))
    if (entries.length > 0) {
      matchingEntries[locationId] = entries as LootEntryInfo[]
    }
  }
  return matchingEntries
}

interface StrippedDynamicLoot {
  spawnpoints: StrippedDynamicLootEntry[]
  spawnpointsForced: StrippedDynamicLootEntry[]
}

interface StrippedDynamicLootEntry {
  probability: number
  template: {
    items: Array<{
      _tpl: string
    }>
  }
}

function LootEntryTable({ entries }: { entries: Record<string, SearchResult> }): JSX.Element {
  return (
    <table>
      <thead>
        <tr>
          <th>Location</th>
          <th>Total Entries</th>
          <th>Average Probability</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(entries).map(([locationId, { totalEntries, averageProbability }]) => (
          <tr key={locationId}>
            <td>{locationId}</td>
            <td>{totalEntries}</td>
            <td>{averageProbability.toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

interface SearchResult {
  totalEntries: number
  averageProbability: number
}

function App() {
  const [itemId, setItemId] = useState("5c0530ee86f774697952d952") // LEDX
  const [matchingEntries, setMatchingEntries] = useState<Record<string, SearchResult> | null>(null)

  useEffect(() => {
    const found = findDynamicLootEntriesById(MAP_NAME_TO_LOOT, itemId)
    const results: Record<string, SearchResult> = {}
    for (const [locationId, entries] of Object.entries(found)) {
      results[locationId] = {
        totalEntries: entries.length,
        averageProbability: entries.reduce((acc, entry) => acc + entry.probability, 0) / entries.length,
      }
    }
    setMatchingEntries(results)
  }, [itemId])

  return (
    <>
      <div>
        <h1>EFT Dynamic Loot Finder</h1>
        <p>This is a simple tool to help you find where a specific item can spawn on each map in Escape from Tarkov.</p>
        <p>To get started, enter the item ID of the item you're looking for in the input below.</p>

        <h2>Search</h2>
        <label htmlFor="itemId" style={{ margin: 10 }}>
          <b>Item ID:</b>
        </label>
        <input type="text" value={itemId} onChange={(e) => setItemId(e.target.value)} placeholder="Enter item ID..." />

        <h2>Results</h2>
        {/* Center the results table */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          {matchingEntries ? <LootEntryTable entries={matchingEntries} /> : <p>Loading...</p>}
        </div>
      </div>
    </>
  )
}

export default App
