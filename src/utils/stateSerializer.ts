import type { Game } from '../types/game'

export const StringifyGameState = (gameState: Map<string, Game>): string => {
  return JSON.stringify([...gameState])
}

export const ParseGameState = (gameState: string): Map<string, Game> => {
  return new Map(JSON.parse(gameState))
}
