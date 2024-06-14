import type { Character } from '@nanosh/types/character'
import type seedrandom from 'seedrandom'
import GetRandomBool from './getRandomBool'

export default function GetAgileLWBlock(
  character: Character,
  prng: seedrandom.PRNG,
): boolean {
  if (!character.skills.has('skill.agile')) return false

  return GetRandomBool(prng)
}
