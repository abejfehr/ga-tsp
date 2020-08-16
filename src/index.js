import TspRunner from "./tsp-runner";
import { drawGraph } from "./utils";

const graph = {
  nodes: [],
  edges: [],
};

const NUM_EDGES = 20;

// Generate a random graph:
for (let i = 0; i < NUM_EDGES; i++) {
  // const size = Math.random();
  // console.log(size;)
  graph.nodes.push({
    id: "n" + i,
    // label: "Node " + i,
    x: Math.random(),
    y: Math.random(),
    size: 0.2,
    color: "#666",
  });
}

const mainGraphCanvas = document.querySelector("#main-graph-container canvas");
mainGraphCanvas.width = mainGraphCanvas.getBoundingClientRect().width;
mainGraphCanvas.height = mainGraphCanvas.getBoundingClientRect().height;

drawGraph(mainGraphCanvas, graph);

const tspRunner = new TspRunner(graph);

const colors = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "a", "b", "c"].map(
  (k) => `#${k}${k}${k}`
);

let genNumber = 0;

document.querySelector("button").addEventListener("click", () => {
  tspRunner.evolve().then(({ best, scoredPopulation }) => {
    genNumber += 10;
    document.querySelector("#generation-label").innerHTML =
      "Generation " + genNumber;
    if (!graph.edges.length) {
      graph.edges = [];
      for (let i = 0; i < best.length; i++) {
        graph.edges.push({
          id: "e" + i,
          source: best[i],
          target: best[(i + 1) % best.length],
          size: 1,
          color: "#000",
        });
      }
    } else {
      for (let i = 0; i < best.length; ++i) {
        // Make the color slightly lighter
        const colorIndex = colors.findIndex((c) => c === graph.edges[i].color);
        const colorIndexToTransitionTo = Math.min(
          colorIndex + 1,
          colors.length - 1
        );
        graph.edges[i].color = colors[colorIndexToTransitionTo];
        graph.edges[i].size = colors.length - colorIndex;

        if (graph.edges[i].source !== best[i]) {
          graph.edges[i].source = best[i];
          graph.edges[i].color = "#000";
        }
        if (graph.edges[i].target !== best[(i + 1) % best.length]) {
          graph.edges[i].target = best[(i + 1) % best.length];
          graph.edges[i].color = "#000";
        }
      }
    }

    const generateGraphFromPhenotype = (graph, phenotype) => {
      const _graph = JSON.parse(JSON.stringify(graph)); // Clones it

      _graph.edges = [];
      for (let i = 0; i < phenotype.length; i++) {
        _graph.edges.push({
          id: "e" + i,
          source: phenotype[i],
          target: phenotype[(i + 1) % phenotype.length],
          size: 1,
          color: "#000",
        });
      }

      return _graph;
    };

    // Redraw the graph
    drawGraph(mainGraphCanvas, graph);

    // Get the aspect ratio
    const canvasAspectRatio = mainGraphCanvas.width / mainGraphCanvas.height;

    // console.log(scoredPopulation);
    // Get the top 5 of the population and draw them
    const top5 = scoredPopulation
      .sort((a, b) => {
        return -1 * a.score - -1 * b.score;
      })
      .slice(0, 5);

    for (let i = 0; i < top5.length; ++i) {
      const x = document.querySelector(`.top-${i + 1}`);

      const scoreContainer = document.querySelector(`.top-${i + 1} .score`);
      const canvas = x.querySelector("canvas");
      canvas.width = canvas.getBoundingClientRect().width;
      canvas.height = canvas.getBoundingClientRect().width / canvasAspectRatio;
      scoreContainer.innerHTML = "Score: " + ~~(-1 * top5[i].score * 1000);
      const rg = generateGraphFromPhenotype(graph, top5[i].phenotype);
      drawGraph(canvas, rg, true);
    }
  });
});
