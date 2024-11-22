import Dagre from '@dagrejs/dagre';

const graph = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));

const nodeWidth = 172;
const nodeHeight = 50;

export const getLayoutedElements = (nodes, edges, direction = 'TB') => {
  graph.setGraph({ rankdir: direction });
  const isHorizontal = direction === 'LR';

  nodes.forEach((node) =>
    graph.setNode(node.id, { width: nodeWidth, height: nodeHeight })
  );

  edges.forEach((edge) =>
    graph.setEdge(edge.source, edge.target, { height: 50 })
  );

  Dagre.layout(graph);

  nodes.forEach((node) => {
    const nodeWithPosition = graph.node(node.id);

    node.targetPosition = isHorizontal ? 'left' : 'top';
    node.sourcePosition = isHorizontal ? 'right' : 'bottom';

    node.position = {
      x: nodeWithPosition.x - nodeWidth / 2,
      y: nodeWithPosition.y - nodeHeight / 2,
    };

    return node;
  });

  return {
    nodes,
    edges,
  };
};

export const getUpdateWorkflowLayoutedElements = (
  nodes,
  edges,
  direction = 'TB'
) => {
  graph.setGraph({ rankdir: direction });
  const isHorizontal = direction === 'LR';

  nodes.forEach((node) => graph.setNode(node.id, { width: 150, height: 50 }));

  edges.forEach((edge) =>
    graph.setEdge(edge.source, edge.target, { height: 50 })
  );

  Dagre.layout(graph);

  nodes.forEach((node) => {
    const { x, y } = graph.node(node.id);

    node.targetPosition = isHorizontal ? 'left' : 'top';
    node.sourcePosition = isHorizontal ? 'right' : 'bottom';

    node.position = {
      x,
      y,
    };

    return node;
  });

  return {
    nodes,
    edges,
  };
};

export const areAllNodesConnected = (nodes, edges) => {
  // Create a set to store unique connected nodes
  const connectedNodes = new Set();

  // Iterate through connections and add connected nodes to the set
  edges.forEach((edge) => {
    connectedNodes.add(edge.source);
    connectedNodes.add(edge.target);
  });

  // Check if every node has at least one connection
  return nodes.every((node) => connectedNodes.has(node.id));
};
