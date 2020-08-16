// Adapted from https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
export const shuffle = (a) => {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export const calculateDistance = (a, b) => {
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
};

export const drawGraph = (canvas, graph, inverse = false) => {
  console.log("A graph is being drawn");
  const ctx = canvas.getContext("2d");

  // Clear the canvas first
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Loop through the edges and draw lines
  for (let i = 0; i < graph.edges.length; ++i) {
    ctx.strokeStyle = graph.edges[i].color; // TODO: Use node's color and size
    const sourceId = graph.edges[i].source;
    const targetId = graph.edges[i].target;
    const source = graph.nodes.find((n) => n.id === sourceId);
    const target = graph.nodes.find((n) => n.id === targetId);
    // console.log(source.x * canvas.width, source.y * canvas.height);
    // console.log(target.x * canvas.width, target.y * canvas.height);
    ctx.beginPath();
    ctx.moveTo(source.x * canvas.width, source.y * canvas.height);
    ctx.lineTo(target.x * canvas.width, target.y * canvas.height);
    ctx.stroke();
  }
  // Loop through the nodes and draw circles
  for (let i = 0; i < graph.nodes.length; ++i) {
    ctx.beginPath();
    ctx.fillStyle = "#555";
    ctx.ellipse(
      graph.nodes[i].x * canvas.width,
      graph.nodes[i].y * canvas.height,
      3,
      3,
      0,
      0,
      2 * Math.PI
    );
    ctx.stroke();
    ctx.fill();
  }
};
