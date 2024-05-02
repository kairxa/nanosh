import {
  type ProjectDetails,
  type ProjectNames,
  type ProjectTypes,
} from '@nanosh/types/projects'

export const Projects: Map<ProjectNames, ProjectDetails> = new Map<
  ProjectNames,
  ProjectDetails
>([
  [
    'File G11 - Apex Bio Enhancement',
    { type: new Set<ProjectTypes>(['Bio']), progressNeeded: 12 },
  ],
  [
    'File 128 - Finesse Protocol',
    { type: new Set<ProjectTypes>(['TechGi']), progressNeeded: 14 },
  ],
  [
    'File 129 - Equilibrium Drive',
    { type: new Set<ProjectTypes>(['TechGi']), progressNeeded: 17 },
  ],
  [
    'File 252 - HyperHeal Ampoule',
    { type: new Set<ProjectTypes>(['Bio']), progressNeeded: 8 },
  ],
  [
    'File 253 - Lifesaver Initiative',
    { type: new Set<ProjectTypes>(['Bio']), progressNeeded: 10 },
  ],
  [
    'File 254 - Operational Surge Paradigm',
    { type: new Set<ProjectTypes>(['TechGi']), progressNeeded: 10 },
  ],
  [
    'File 311 - Provisioning Overhaul',
    { type: new Set<ProjectTypes>(['TechGi']), progressNeeded: 10 },
  ],
  [
    'File E120 - Solo Comfort Initiative',
    { type: new Set<ProjectTypes>(['TechGi']), progressNeeded: 7 },
  ],
  [
    'File 100 - Support Blueprints Recovery A',
    { type: new Set<ProjectTypes>(['TechGi']), progressNeeded: 8 },
  ],
  [
    'File 101 - Support Blueprints Recovery B',
    { type: new Set<ProjectTypes>(['TechGi']), progressNeeded: 8 },
  ],
  [
    'File 112 - EisenSchlag Modul',
    { type: new Set<ProjectTypes>(['TechGi']), progressNeeded: 14 },
  ],
  [
    'File 113 - Biogenic Aim Assist',
    { type: new Set<ProjectTypes>(['Bio', 'TechGi']), progressNeeded: 14 },
  ],
  [
    'File 456 - Kabuto Boost',
    { type: new Set<ProjectTypes>(['TechGi']), progressNeeded: 14 },
  ],
  [
    'File 010 - M22 "Buzzard" Precision Upgrade',
    { type: new Set<ProjectTypes>(['TechGi']), progressNeeded: 15 },
  ],
  [
    'File 011 - M22 "Buzzard" Strike Optimization',
    { type: new Set<ProjectTypes>(['TechGi']), progressNeeded: 13 },
  ],
  [
    'File 012 - M22 "Buzzard" Defensive Retrofit',
    { type: new Set<ProjectTypes>(['TechGi']), progressNeeded: 17 },
  ],
  [
    'File 055 - Hoppers Space Optimization',
    { type: new Set<ProjectTypes>(['TechGi']), progressNeeded: 6 },
  ],
  [
    'File 711 - Praetorians Suit Force Distribution',
    { type: new Set<ProjectTypes>(['TechGi']), progressNeeded: 18 },
  ],
  [
    "File 712 - Ysara's Snare",
    { type: new Set<ProjectTypes>(['Bio', 'TechGi']), progressNeeded: 16 },
  ],
  [
    'File NAP - Nanosh Assimilation Protocol',
    { type: new Set<ProjectTypes>(['TechGi']), progressNeeded: 25 },
  ],
])
