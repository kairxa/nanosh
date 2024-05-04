import { supportBpRecoA } from '@nanosh/calculator/actions/rnd/research/files/100'
import { supportBpRecoB } from '@nanosh/calculator/actions/rnd/research/files/101'
import { finesseProtocol } from '@nanosh/calculator/actions/rnd/research/files/128'
import { equilibrium } from '@nanosh/calculator/actions/rnd/research/files/129'
import { hyperhealAmpoule } from '@nanosh/calculator/actions/rnd/research/files/252'
import { apexBioEnhancement } from '@nanosh/calculator/actions/rnd/research/files/G11'
import { nanoshAssimilationProtocol } from '@nanosh/calculator/actions/rnd/research/files/NAP'
import { placeholder } from '@nanosh/calculator/actions/rnd/research/files/placeholder'
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
    {
      type: new Set<ProjectTypes>(['Bio']),
      progressNeeded: 12,
      completedCallback: apexBioEnhancement,
    },
  ],
  [
    'File 128 - Finesse Protocol',
    {
      type: new Set<ProjectTypes>(['TechGi']),
      progressNeeded: 14,
      completedCallback: finesseProtocol,
    },
  ],
  [
    'File 129 - Equilibrium Drive',
    {
      type: new Set<ProjectTypes>(['TechGi']),
      progressNeeded: 17,
      completedCallback: equilibrium,
    },
  ],
  [
    'File 252 - HyperHeal Ampoule',
    {
      type: new Set<ProjectTypes>(['Bio']),
      progressNeeded: 8,
      completedCallback: hyperhealAmpoule,
    },
  ],
  [
    'File 253 - Lifesaver Initiative',
    {
      type: new Set<ProjectTypes>(['Bio']),
      progressNeeded: 10,
      // TODO: CHANGE COMPLETED CALLBACK
      completedCallback: placeholder,
    },
  ],
  [
    'File 254 - Operational Surge Paradigm',
    {
      type: new Set<ProjectTypes>(['TechGi']),
      progressNeeded: 10,
      // TODO: CHANGE COMPLETED CALLBACK
      completedCallback: placeholder,
    },
  ],
  [
    'File 311 - Provisioning Overhaul',
    {
      type: new Set<ProjectTypes>(['TechGi']),
      progressNeeded: 10,
      // TODO: CHANGE COMPLETED CALLBACK
      completedCallback: placeholder,
    },
  ],
  [
    'File E120 - Solo Comfort Initiative',
    {
      type: new Set<ProjectTypes>(['TechGi']),
      progressNeeded: 7,
      // TODO: CHANGE COMPLETED CALLBACK
      completedCallback: placeholder,
    },
  ],
  [
    'File 100 - Support Blueprints Recovery A',
    {
      type: new Set<ProjectTypes>(['TechGi']),
      progressNeeded: 8,
      completedCallback: supportBpRecoA,
    },
  ],
  [
    'File 101 - Support Blueprints Recovery B',
    {
      type: new Set<ProjectTypes>(['TechGi']),
      progressNeeded: 8,
      completedCallback: supportBpRecoB,
    },
  ],
  [
    'File 112 - EisenSchlag Modul',
    {
      type: new Set<ProjectTypes>(['TechGi']),
      progressNeeded: 14,
      // TODO: CHANGE COMPLETED CALLBACK
      completedCallback: placeholder,
    },
  ],
  [
    'File 113 - Biogenic Aim Assist',
    {
      type: new Set<ProjectTypes>(['Bio', 'TechGi']),
      progressNeeded: 14,
      // TODO: CHANGE COMPLETED CALLBACK
      completedCallback: placeholder,
    },
  ],
  [
    'File 456 - Kabuto Boost',
    {
      type: new Set<ProjectTypes>(['TechGi']),
      progressNeeded: 14,
      // TODO: CHANGE COMPLETED CALLBACK
      completedCallback: placeholder,
    },
  ],
  [
    'File 010 - M22 "Buzzard" Precision Upgrade',
    {
      type: new Set<ProjectTypes>(['TechGi']),
      progressNeeded: 15,
      // TODO: CHANGE COMPLETED CALLBACK
      completedCallback: placeholder,
    },
  ],
  [
    'File 011 - M22 "Buzzard" Strike Optimization',
    {
      type: new Set<ProjectTypes>(['TechGi']),
      progressNeeded: 13,
      // TODO: CHANGE COMPLETED CALLBACK
      completedCallback: placeholder,
    },
  ],
  [
    'File 012 - M22 "Buzzard" Defensive Retrofit',
    {
      type: new Set<ProjectTypes>(['TechGi']),
      progressNeeded: 17,
      // TODO: CHANGE COMPLETED CALLBACK
      completedCallback: placeholder,
    },
  ],
  [
    'File 055 - Hoppers Space Optimization',
    {
      type: new Set<ProjectTypes>(['TechGi']),
      progressNeeded: 6,
      // TODO: CHANGE COMPLETED CALLBACK
      completedCallback: placeholder,
    },
  ],
  [
    'File 711 - Praetorians Suit Force Distribution',
    {
      type: new Set<ProjectTypes>(['TechGi']),
      progressNeeded: 18,
      // TODO: CHANGE COMPLETED CALLBACK
      completedCallback: placeholder,
    },
  ],
  [
    "File 712 - Ysara's Snare",
    {
      type: new Set<ProjectTypes>(['Bio', 'TechGi']),
      progressNeeded: 16,
      // TODO: CHANGE COMPLETED CALLBACK
      completedCallback: placeholder,
    },
  ],
  [
    'File NAP - Nanosh Assimilation Protocol',
    {
      type: new Set<ProjectTypes>(['TechGi']),
      progressNeeded: 25,
      completedCallback: nanoshAssimilationProtocol,
    },
  ],
])
