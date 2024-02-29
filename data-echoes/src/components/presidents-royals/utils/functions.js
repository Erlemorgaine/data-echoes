export function calculateGenerations(people) {
  const findPersonByName = (name) => people.find((person) => person.data.name === name)

  const calculateGenerationsForPerson = (person, visited = new Set()) => {
    // Avoid infinite recursion due to circular references
    if (visited.has(person.id)) {
      return 0
    }
    visited.add(person.id)

    const { mother, father, motherRumored, fatherRumored } = person.data
    let generations = 0

    // Check each parent and calculate their generations recursively
    ;[mother, father, motherRumored, fatherRumored].forEach((parentName) => {
      if (parentName) {
        const parent = findPersonByName(parentName)
        if (parent) {
          generations = Math.max(generations, 1 + calculateGenerationsForPerson(parent, visited))
        }
      }
    })

    person.data.generationsBefore = generations
    return generations
  }

  // Calculate generations for each person
  people.forEach((person) => calculateGenerationsForPerson(person))
}

export function calculateMostGenerationsSpouse(people) {
  const findPersonByName = (name) => people.find((person) => person.data.name === name);

  people.forEach((person) => {
    if (Array.isArray(person.data.spouse)) {
      let mostGenerations = 0;
      person.data.spouse.forEach((spouseName) => {
        const spouse = findPersonByName(spouseName);
        if (spouse && spouse.data.generationsBefore > mostGenerations) {
          mostGenerations = spouse.data.generationsBefore;
        }
      });
      person.data.mostGenerationsSpouse = mostGenerations;
    }
  });
}
