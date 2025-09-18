# Game Logic Architecture - Event Sourcing Pattern

## Why This Pattern?

Grug have problem: Game state big (50KB+). Every action need clone state for safety. Clone expensive. Send full state to client bad (fog of war). What do?

Grug realize: If random number generator deterministic (same seed = same result), then game deterministic too. This mean we not need save state - just save what player do!

## Core Idea: Actions as Truth

Instead of saving game state after every action, we save the ACTION itself. Game state just temporary thing we calculate from list of actions.

Think like recipe book:
- Bad way: Take photo of cake after each step
- Good way: Write down what you did (add egg, mix flour, bake 30min)

With recipe (action log), you can always remake exact same cake!

## How It Work

### 1. Every Action Get Logged
When player do something, we save:
- **Who** did it (username)
- **When** they did it (timestamp)  
- **What** they did (action name)
- **How** they did it (parameters like "move Solas to bridge")

This tiny! Maybe 100 bytes vs 50,000 bytes for full state.

### 2. Deterministic Random = Magic
We use special random number generator that take string seed:
```
seed = "gameID-timestamp-username"
```

Same seed ALWAYS give same random numbers. This mean:
- Combat damage rolls always same
- Card shuffles always same  
- Random events always same

No cheating possible - server can replay and check!

### 3. Replay From Beginning
To get current game state:
1. Start with initial game state (deterministic from gameID)
2. Play each action in order with same PRNG seed
3. End up with exact same state every time

Like movie that you fast-forward through - always end at same frame!

## Benefits for Grug

### Storage Efficient
- 1000 actions = ~100KB
- Storing 1000 states = ~50MB
- That 500x smaller!

### Perfect History
Every game have complete audit trail. Can answer:
- "Why my character dead?" - Look at damage actions
- "Where my resources go?" - Look at spend actions  
- "Who move my ship?" - Look at movement actions

### Time Travel Debugging
Bug happen at turn 247? No problem:
1. Replay to turn 246
2. Step through turn 247 slowly
3. See exactly what break

### Cheat Prevention
Player claim "I didn't do that"? Server replay their actions with their seed. If result different, they tampered with client. Ban hammer!

### Network Efficient
Don't send full state to client (especially with fog of war). Just send:
- What changed (delta)
- What they can see (filtered)

Client pretty dumb - just show animations and UI updates.

## Trade-offs (Nothing Free)

### CPU vs Storage
- Save storage (action logs small)
- Use more CPU (replay to get state)

But Grug smart! Use cache:
- Keep recent game states in memory
- Only replay from last checkpoint
- Clear old games from cache

### Complexity
Must be VERY careful:
- Every action MUST be deterministic
- NEVER use `Math.random()` - always use seeded PRNG
- Order of operations matter (sort maps before iterating)
- Float math can be tricky (different CPU = different result)

### Recovery Harder
If action log corrupted at action 500, game broken from that point forward. With state snapshots, could recover from action 499 snapshot.

Solution: Periodic state snapshots (every 100 actions) as backup.

## Implementation Strategy

### Phase 1: Foundation
1. Make all actions deterministic
2. Add action logging to every action
3. Create replay system
4. Test determinism (replay should give exact same state)

### Phase 2: Optimization
1. Add state caching (keep recent games in memory)
2. Add periodic snapshots (every 100 actions)
3. Compress old action logs
4. Add fast-forward replay (skip animations)

### Phase 3: Features
1. Add replay viewer for players
2. Add tournament replay system
3. Add "share replay" for bug reports
4. Add analytics from action patterns

## For Nakama Specifically

Nakama give us:
- Storage API (for action logs)
- Match state (for cache)
- Authoritative server (prevent cheating)

We give Nakama:
- Tiny storage requirements
- Easy horizontal scaling (stateless)
- Built-in anti-cheat
- Perfect game analytics

## Remember

This pattern powerful but need discipline:
- EVERY action must be logged
- EVERY random must use seed
- EVERY iteration must be ordered
- EVERY float must be careful

Break one rule = break determinism = break everything.

But if follow rules, get time machine for free!

## Common Pitfalls

### Map Iteration
Go maps iterate in random order! Must sort keys first.

### Time-based Logic  
"Do X after 5 seconds" break determinism. Use game ticks instead.

### External Data
API calls, file reads, current time - all break determinism. Capture result in action log.

### Parallel Processing
Goroutines process in unpredictable order. Process sequentially for determinism.

### Float Arithmetic
Different CPU do float math differently. Use fixed-point math or be very careful.

## Summary

Event sourcing turn storage problem into CPU problem. For turn-based game, this good trade! Player wait 100ms for turn processing no problem. Database storing 500x less data = big win.

Just remember: With great determinism come great responsibility. One `Math.random()` and everything break!