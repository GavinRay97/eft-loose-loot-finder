export interface DynamicLoot {
  spawnpoints: DynamicLootEntry[]
  spawnpointsForced: DynamicLootEntry[]
}

export interface DynamicLootEntry {
  locationId: string
  probability: number
  template: Template
}

export interface Template {
  Id: string
  IsContainer: boolean
  useGravity: boolean
  randomRotation: boolean
  Position: Coordinate
  Rotation: Coordinate
  IsGroupPosition: boolean
  GroupPositions: any[]
  IsAlwaysSpawn: boolean
  Root: string
  Items: Item[]
}

export interface Item {
  _id: string
  _tpl: string
  upd: Upd
}

export interface Upd {
  StackObjectsCount: number
}

export interface Coordinate {
  x: number
  y: number
  z: number
}
