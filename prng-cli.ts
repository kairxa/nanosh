import seedrandom from 'seedrandom'

function random() {
  const prng = seedrandom(process.argv[2])
  const iteration = parseInt(process.argv[3], 10) || 1

  for (let i = 0; i < iteration; i++) {
    console.log(prng())
  }
}

random()
