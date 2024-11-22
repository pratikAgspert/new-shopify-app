import Dagre from '@dagrejs/dagre';

const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
const nodeWidth = 172;
const nodeHeight = 36;

export const getLayoutedElements = (nodes, edges, direction = 'TB') => {
  g.setGraph({ rankdir: direction });

  nodes.forEach((node) =>
    g.setNode(node.id, { width: nodeWidth, height: nodeHeight })
  );
  edges.forEach((edge) => g.setEdge(edge.source, edge.target));

  Dagre.layout(g);

  nodes.forEach((node) => {
    const nodeWithPosition = g.node(node.id);
    node.targetPosition = 'top';
    node.sourcePosition = 'bottom';
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
