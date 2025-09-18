# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Nanosh is a backend server for a digital board game. Originally built with TypeScript on Bun runtime, the project is transitioning to Go with Nakama game server for improved performance and multiplayer capabilities. The project uses Redis for database operations.

## Development Commands

### TypeScript/Bun Commands (Legacy)
```bash
# Run all tests
bun test

# Run a specific test file
bun test path/to/file.test.ts

# Run tests matching a pattern
bun test --grep "pattern"

# Run TypeScript compiler check
bunx tsc --noEmit
```

### Go/Nakama Commands (Current)
```bash
# Run Go tests from src/nakama directory
cd src/nakama && go test ./gamelogic/...

# Run specific test package
cd src/nakama && go test ./gamelogic/calculator/expedition/init/loot -v

# Run tests with specific pattern
cd src/nakama && go test ./gamelogic/... -run TestName -v

# Build Nakama module
cd src/nakama && go build -buildmode=plugin -o ./modules/nanosh.so
```

### Dependencies
```bash
# TypeScript/Bun dependencies
bun install
bun add package-name
bun add -d package-name

# Go dependencies (managed via go.mod)
go mod tidy
go mod download
```

## Architecture

### TypeScript to Go/Nakama Transition

The project is migrating from TypeScript to Go with Nakama for better performance and native multiplayer support:

#### TypeScript Structure (Legacy - `src/`)
- **Location**: `src/calculator/`, `src/types/`, `src/utils/`
- **Pattern**: Functional approach with immutable state updates
- **Testing**: Bun test runner with `.test.ts` files

#### Go/Nakama Structure (Current - `src/nakama/`)
- **Location**: `src/nakama/gamelogic/`
  - `calculator/` - Game actions and logic (mirrors TS structure)
  - `types/` - Go structs for game entities
  - `utils/` - Utility functions (random, dice, wounds, etc.)
  - `errors/` - Custom error definitions
- **Pattern**: Similar functional approach, adapted for Go
- **Testing**: Go's built-in testing with `_test.go` files
- **Module**: `nanosh/nakama-modules/gamelogic` package structure

### Core Structure
- **Game State Management**:
  - TypeScript: `src/types/game.ts` with `Game` interface
  - Go: `src/nakama/gamelogic/types/game.go` with `Game` struct
- **Action System**:
  - TypeScript: `src/calculator/actions/room/action.ts`
  - Go: `src/nakama/gamelogic/calculator/actions/room/action.go`
- **Type Safety**:
  - TypeScript: Interfaces in `src/types/`
  - Go: Structs in `src/nakama/gamelogic/types/`

### Key Patterns
- **Action Functions**:
  - TypeScript: Returns `[newState | null, error | null]` tuple
  - Go: Returns `(*types.Game, error)` - cleaner Go idiom
- **State Immutability**: Both versions create new state rather than mutating
- **Test Structure**:
  - TypeScript: `.test.ts` files using Bun
  - Go: `_test.go` files using Go testing package
- **Path Aliases**:
  - TypeScript: `@nanosh/*` alias
  - Go: Standard Go import paths `nanosh/nakama-modules/gamelogic/...`
- **Deterministic Random Generation**:
  - TypeScript: `seedrandom(\`${gameID}-${invokeTime}\`)`
  - Go: `random.CreateSeededPRNG(gameID, invokeTime, username)` with SHA256 hashing
- **Error Handling**:
  - TypeScript: Tuple return with error as second element
  - Go: Standard Go error as second return value

### Database
- Redis connection is configured in `src/database/redis.ts`
- Default connection: `redis://localhost:6379`

### Game Mechanics
- **Characters**: Managed via a Map with character names as keys
- **Sectors**: Hierarchical structure with Supersectors containing Subsectors
- **Actions**: Consume Action Points (AP) and may require specific conditions
- **Cycles**: Game progresses through day/cycle system

## Testing Approach
- Unit tests for individual actions using mock game states
- Tests verify both success cases and error conditions
- Initial game state generator available at `src/utils/initialState/game.ts`

## ESLint Configuration
- Uses `@typescript-eslint` parser and plugin
- Enforces removal of unused imports
- Variables/args prefixed with `_` are ignored for unused checks

## Implementation Status & Documentation

**📋 For detailed implementation tracking, see `IMPLEMENTATION-STATUS.md` which provides comprehensive status of all functions, systems, and mechanics.**

### Comprehensive Documentation
The project includes detailed documentation in the `docs/` folder, split from the original 21MB Nanosh-2.md file:
- **game-rules/**: Core game rules and win/loss conditions
- **mechanics/**: Character, ship, and Nanosh mechanics
- **databases/**: Character profiles, items, projects, skills, and traits
- **reference/**: Subsector lists and game templates

### Current Implementation Completeness

#### ✅ Fully Implemented Systems
- **Action System**: 30+ actions across all ship rooms with comprehensive tests
- **Core Mechanics**: Status effects (8 types), wound system, AP generation/usage
- **Character System**: 13 characters with skills, traits, and equipment
- **Items System**: 39 items across all categories (weapons, armor, meds, food, etc.)
- **Ship Systems**: Room management, modifiers, cargo, fighter/expo crafts
- **Nanosh Opposition**: Tracking, bases, outposts, assimilation protocol
- **Sector System**: 130 subsectors across 12 supersectors with grid positioning
- **Project System**: 20 research projects with full callback implementations

#### ✅ Recently Completed Systems (Go/Nakama)

**Complete Expedition System** - Full reimplementation in Go with comprehensive card library:

**Expedition Loot Cards** (28 total):
- **Basic Loot** (`src/nakama/gamelogic/calculator/expedition/init/loot/`):
  - Power Cache - 4-8 eCells
  - Energy Stash - 3-6 eCells
  - Hidden Food Stash - 3-4 random food items to cargo
  - Abandoned Cache - 6-10 Rations
  - Edible Berries - 3-6 Rations
  - Useful Scraps - 8-16 Supplies
  - Trinkets And Baubles - 10-20 Supplies
  - A Small Lead - 1 Basic Intel
  - Scarce Trail - 0-1 Basic Intel
- **Nanosh Outpost Intact** (`src/nakama/gamelogic/calculator/expedition/nanosh/outpost/intact/loot/`):
  - Small Clue - 1 Basic Intel
  - Nanosh Scraps - 12-24 Supplies
  - Still Usable eCells - 6-12 eCells
- **Nanosh Outpost Destroyed** (`src/nakama/gamelogic/calculator/expedition/nanosh/outpost/destroyed/loot/`):
  - Good Recon - 1 Basic Intel
  - Salvageable Nanosh Devices - 3-9 eCells
- **Nanosh Generic** (`src/nakama/gamelogic/calculator/expedition/nanosh/generic/`):
  - Nanosh Tech - 1 Nanosh Datapad (ItemMiscNanoshDatapad) to cargo

**Expedition Ally Cards** (8 total):
- **Basic Allies** (`src/nakama/gamelogic/calculator/expedition/init/ally/`):
  - Specialists - 1-2 civitates (+1-2 more with Silver skill)
  - Rally in the Open - 1 Praetorian (+1-2 civitates with Silver skill)
  - Survivor From Another Legion - 1 Praetorian
  - Hopeful Refugees - 3-6 civitates

**Expedition Encounter Cards** (9 total):
- **Basic Encounters** (`src/nakama/gamelogic/calculator/expedition/init/encounter/`):
  - Some Nanosh Scouts - 2-3 ground threat
  - A Wandering Nanosh Squad - 4-5 ground threat
- **Nanosh Outpost Intact** (`src/nakama/gamelogic/calculator/expedition/nanosh/outpost/intact/encounter/`):
  - Patrolling Nanosh Scout - 1-2 ground threat
  - Nanosh Hidden Panel - 1-2 ground threat (halved and removed from existing if Engineer/Technician skill present)

**Expedition Event Cards** (5 total):
- **Basic Events** (`src/nakama/gamelogic/calculator/expedition/init/event/`):
  - Hazardous Terrain - Damage blitzhopper OR wound 1-3 characters
  - Such A Long Day - Add attrition to 1-2 expedition members
  - A Doomsayer Arises - Add 1 Nanosh Sympathy
- **Nanosh Outpost Intact** (`src/nakama/gamelogic/calculator/expedition/nanosh/outpost/intact/event/`):
  - Targeted Order - 1 blitzhopper damage (negated if Mechpilot skill present)

**Expedition Ambush Cards** (3 total):
- **Nanosh Outpost Intact** (`src/nakama/gamelogic/calculator/expedition/nanosh/outpost/intact/ambush/`):
  - Drones Patrol - 50% chance to inflict 1 light wound to random character

**Advanced Expedition Mechanics:**
- **Skill-Based Conditional Logic**: Cards check for Silver, Mechpilot, Engineer, Technician skills
- **Complex Threat Manipulation**: Ceiling division math for threat halving (Nanosh Hidden Panel)
- **ExpoCraft Health Management**: Blitzhopper damage with health bounds checking
- **Character Wound System**: Automatic light-to-critical conversion and death handling
- **Random Item Generation**: Deterministic food item selection with unique IDs
- **Cargo Management**: Space checking and item addition to ship cargo
- **Resource Management**: eCells, Supplies, Rations, Intel, Civitates, Praetorians

**Wound System Utilities (`src/nakama/gamelogic/utils/wounds/`):**
- Automatic conversion: 3 light wounds → 1 critical wound
- Death conditions: Total of (critical + stabilized critical) ≥ 3
- Proper death handling:
  - Remove from `game.Characters`
  - Add to `game.CharactersDead`
  - Remove from `game.Expedition.Members`
- Functions with and without death checking variants
- Full integration with expedition events

#### 🔴 Systems Under Development

- **Battle System**: NOT IMPLEMENTED
  - No battle resolution mechanics currently exist
  - Weapon effects are defined but not functional
  - See WEAPON-MECHANICS.md for planned weapon integration

#### 🔧 Previously Added Implementations (TypeScript)

**Project System - All missing callbacks implemented:**
- File 253 - Lifesaver Initiative (medical items)
- File 254 - Operational Surge Paradigm (AP boost)
- File 311 - Provisioning Overhaul (resource efficiency)
- File E120 - Solo Comfort Initiative (status effect reduction)
- File 112 - EisenSchlag Modul (turret enhancements)
- File 113 - Biogenic Aim Assist (weapon accuracy)
- File 456 - Kabuto Boost (defensive systems)
- Files 010-012 - M22 "Buzzard" fighter upgrades
- File 055 - Hoppers Space Optimization (inventory expansion)
- File 711 - Praetorians Suit (ground combat)
- File 712 - Ysara's Snare (tactical superiority)

**Expedition System - Core mechanics implemented:**
- Launch actions (`src/calculator/actions/expocrafts-bay/launch.ts`)
- Ground team phase actions (`src/calculator/actions/expedition/`)
  - designate-leader.ts (select expedition leader)
  - go.ts (draw cards and explore)
  - exit.ts (return to ship)
  - assault.ts (transition to battle phase)
- New expedition cards (`src/calculator/expo/cards/effects/`)
  - empty-ruins.ts (scavenging supplies)
  - abandoned-cache.ts (supplies + eCells)
  - nanosh-patrol.ts (ground threat encounters)
  - civilian-shelter.ts (civitates + intel)
  - supply-depot.ts (major resource gains)
- Enhanced expedition interface (`src/types/expedition.ts`)
- Comprehensive test coverage for all new expedition functionality

**Additional Missing Implementations - Now completed:**
- Storage actions (`src/calculator/actions/storage/`)
  - stash.ts (move items from character to ship cargo)
  - retrieve.ts (move items from ship cargo to character)
- Ship room damage effects (`src/calculator/ship/unique/armory/broken.ts`)
- Skill implementations (`src/calculator/actions/modifiers/skills/silver.ts`)
- Trait implementations (`src/calculator/actions/modifiers/traits/ace.ts`)
- Project integration fixes (File 311 - Provisioning Overhaul now properly integrated)
- Complete TypeScript typing corrections for expedition system

### Known Implementation Challenges & Performance Considerations

#### 🔴 Critical Issues
1. **Deep Cloning Overhead**: Every action clones entire game state via `structuredClone(state)`
2. **State Validation**: No runtime validation of game state integrity
3. **Redis Serialization**: Large game states may hit memory limits

#### 🟡 Moderate Issues
1. **O(n) Operations**: Linear searches through collections, no indexing
2. **State Size Growth**: Modifiers accumulate without cleanup for expired entries
3. **Tight Coupling**: Actions directly manipulate state structure

#### 🟢 Architectural Strengths
- Excellent test coverage (450+ tests passing across TypeScript and Go)
- Consistent error handling patterns (`[newState | null, error | null]` in TS, `(*Game, error)` in Go)
- Strong type safety (TypeScript interfaces + Go structs)
- Deterministic testing with fixed seeds
- Immutable state updates prevent accidental mutations
- Comprehensive expedition system with 43+ cards across 5 categories

### Performance Optimization Recommendations

#### High Priority
1. **Implement incremental state updates** instead of full cloning
2. **Add state validation schemas** to prevent invalid game states  
3. **Add bounds checking** for resources and inventory limits

#### Medium Priority
1. **Optimize frequent lookup operations** with indexing
2. **Standardize error handling** patterns across all modules
3. **Add input validation** for security and robustness

#### Low Priority
1. **Refactor to Command Pattern** for better action encapsulation
2. **Add state compression** for Redis storage optimization
3. **Implement connection pooling** for Redis operations

### Code Quality Standards
- All new actions must include corresponding `.test.ts` files
- Follow existing patterns for state mutation and error handling
- Use path aliases (`@nanosh/*`) for all imports
- Maintain deterministic test behavior with fixed seeds
- Ensure TypeScript strict mode compliance

## Memory Log
- LibPo is Liberation point
- When reading docs, ignore "Back to Phases" or similar phrases because it's just a link to another header

## Go/Nakama Migration Notes

### Conversion Guidelines
1. **File Structure**: Mirror TypeScript structure in Go (e.g., `calculator/actions/` → `calculator/actions/`)
2. **Naming Conventions**:
   - Go files: snake_case.go (e.g., `hazardous_terrain.go`)
   - Go functions: PascalCase for exported (e.g., `HazardousTerrain`)
   - Go tests: function_test.go pattern
3. **State Management**:
   - TypeScript: Clone entire state with `structuredClone()`
   - Go: Still cloning for now, but more efficient patterns available
4. **Random Generation**:
   - Always use `random.CreateSeededPRNG()` with gameID, invokeTime, username
   - Use `random.GetRandomString()` for IDs
   - Use `dice.RollRange()` for random ranges
5. **Error Handling**:
   - Define custom errors in `errors/` package
   - Return early on errors (Go idiom)
6. **Testing**:
   - Table-driven tests preferred in Go
   - Use subtests with `t.Run()`
   - Always test deterministic behavior with same seeds