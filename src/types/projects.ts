import type { Game } from './game'
import type { DefaultCalculatorReturnType } from './generic'

export type ProjectNames =
  | 'File G11 - Apex Bio Enhancement'
  | 'File 128 - Finesse Protocol'
  | 'File 129 - Equilibrium Drive'
  | 'File 252 - HyperHeal Ampoule'
  | 'File 253 - Lifesaver Initiative'
  | 'File 254 - Operational Surge Paradigm'
  | 'File 311 - Provisioning Overhaul'
  | 'File E120 - Solo Comfort Initiative'
  | 'File 100 - Support Blueprints Recovery A'
  | 'File 101 - Support Blueprints Recovery B'
  | 'File 112 - EisenSchlag Modul'
  | 'File 113 - Biogenic Aim Assist'
  | 'File 456 - Kabuto Boost'
  | 'File 010 - M22 "Buzzard" Precision Upgrade'
  | 'File 011 - M22 "Buzzard" Strike Optimization'
  | 'File 012 - M22 "Buzzard" Defensive Retrofit'
  | 'File 055 - Hoppers Space Optimization'
  | 'File 711 - Praetorians Suit Force Distribution'
  | `File 712 - Ysara's Snare`
  | 'File NAP - Nanosh Assimilation Protocol'

export type ProjectTypes = 'Bio' | 'TechGi'

export interface ProjectDetails {
  type: Set<ProjectTypes>
  progressNeeded: number
  completedCallback: (state: Game) => DefaultCalculatorReturnType
}

export interface ProjectProgress {
  progressCurrent: number
}
