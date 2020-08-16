import GA from "geneticalgorithm";
import { calculateDistance, shuffle } from "../utils";
const GENERATIONS_PER_CYCLE = 10;

export default class TspRunner {
  constructor(graph) {
    this.nodesById = {};
    const allNodes = graph.nodes.map((node) => {
      this.nodesById[node.id] = node;
      return node.id;
    });

    this.memo = {}; // for the fitness function

    const population = Array(100)
      .fill()
      .map(() => shuffle(allNodes));

    const CONFIG = {
      mutationFunction: this.mutationFunction.bind(this),
      crossoverFunction: this.crossoverFunction.bind(this),
      fitnessFunction: this.fitnessFunction.bind(this),
      population,
      populationSize: 500,
    };

    this.geneticAlgorithm = GA(CONFIG);

    // console.log("Starting with:");
    // console.log(population);
    this.best = [];
    this.previousBestScore = 0;
    this.generation = 1;

    // console.log("Distance is " + -1 * this.fitnessFunction(this.best));
  }

  evolve() {
    return new Promise((resolve) => {
      for (var i = 0; i < GENERATIONS_PER_CYCLE; i++) {
        this.geneticAlgorithm.evolve();
      }
      var score = this.geneticAlgorithm.bestScore();

      this.previousBestScore = score;

      this.best = this.geneticAlgorithm.best();

      resolve({
        best: this.best,
        scoredPopulation: this.geneticAlgorithm.scoredPopulation(),
      });
    });
  }

  mutationFunction(phenotype) {
    var gene1_index = Math.floor(Math.random() * phenotype.length);
    var gene2_index = Math.floor(Math.random() * phenotype.length);
    var temp = phenotype[gene1_index];
    phenotype[gene1_index] = phenotype[gene2_index];
    phenotype[gene2_index] = temp;
    //console.log("mutant = " + JSON.stringify(phenotype))
    return phenotype;
  }

  helper_concat(index, phenotypeA, phenotypeB) {
    return phenotypeA
      .slice(0, index)
      .concat(phenotypeB.slice(index))
      .concat(phenotypeA.slice(index));
  }

  helper_removeDuplicates(phenotype) {
    var duplicates = {};
    return phenotype.filter(function (item) {
      if (duplicates[JSON.stringify(item)]) {
        return false;
      } else {
        duplicates[JSON.stringify(item)] = true;
        return true;
      }
    });
  }

  crossoverFunction(phenotypeA, phenotypeB) {
    var index = Math.round(Math.random() * phenotypeA.length);

    const phenotypeX = this.helper_removeDuplicates(
      this.helper_concat(index, phenotypeA, phenotypeB)
    );
    const phenotypeY = this.helper_removeDuplicates(
      this.helper_concat(index, phenotypeB, phenotypeA)
    );

    // move, copy, or append some values from a to b and from b to a
    return [phenotypeX, phenotypeY];
  }

  fitnessFunction(phenotype) {
    if (this.memo[phenotype.join("")]) {
      console.log("cache hit!");
      return this.memo[phenotype.join("")];
    }

    var prev = phenotype[0];
    //console.log("The phenotype are " + JSON.stringify(phenotype))
    var distances = phenotype.slice(1).map(function (item) {
      const result = [prev, item];
      prev = item;
      return result;
    });
    //console.log("The distances are " + JSON.stringify(distances))
    var distance = distances.reduce((total, item) => {
      //console.log("item = " + JSON.stringify(item) )

      const coords1 = this.nodesById[item[0]];
      const coords2 = this.nodesById[item[1]];
      return total + calculateDistance(coords1, coords2);
    }, 0);
    //console.log("total = " + distance )
    this.memo[JSON.stringify(phenotype)] = -1 * distance;

    return -1 * distance;
  }
}
