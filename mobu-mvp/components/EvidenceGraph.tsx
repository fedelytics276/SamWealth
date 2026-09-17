import { useCallback, useState } from 'react'
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  ConnectionMode,
  MarkerType,
} from 'react-flow-renderer'
import { X, ExternalLink, FileText, BarChart3, TrendingUp } from 'lucide-react'

interface EvidenceNode {
  id: string
  type: string
  title: string
  summary: string
  confidence: number
  source?: string
  details?: string
}

interface EvidenceGraphProps {
  nodes: EvidenceNode[]
  edges: Array<{ from: string; to: string; label?: string }>
}

// Custom node colors based on type
const getNodeColor = (type: string) => {
  const colors: Record<string, string> = {
    recommendation: '#2563eb', // blue
    financial: '#059669', // green
    market: '#7c3aed', // purple
    technical: '#dc2626', // red
    sentiment: '#ea580c', // orange
    regulatory: '#0891b2', // cyan
  }
  return colors[type] || '#6b7280' // gray as fallback
}

const getNodeIcon = (type: string) => {
  switch (type) {
    case 'recommendation':
      return TrendingUp
    case 'financial':
      return BarChart3
    case 'technical':
      return BarChart3
    default:
      return FileText
  }
}

export default function EvidenceGraph({ nodes: evidenceNodes, edges: evidenceEdges }: EvidenceGraphProps) {
  const [selectedNode, setSelectedNode] = useState<EvidenceNode | null>(null)

  // Convert evidence nodes to React Flow nodes
  const flowNodes: Node[] = evidenceNodes.map((node, index) => ({
    id: node.id,
    type: 'default',
    data: { 
      label: node.title,
      node: node,
    },
    position: { 
      x: (index % 3) * 300 + 100, 
      y: Math.floor(index / 3) * 200 + 100,
    },
    style: {
      background: getNodeColor(node.type),
      color: 'white',
      border: '2px solid white',
      borderRadius: '8px',
      padding: '10px',
      fontSize: '12px',
      fontWeight: '600',
      minWidth: '180px',
    },
  }))

  // Convert evidence edges to React Flow edges
  const flowEdges: Edge[] = evidenceEdges.map((edge, index) => ({
    id: `e${index}`,
    source: edge.from,
    target: edge.to,
    label: edge.label,
    type: 'smoothstep',
    animated: true,
    style: { stroke: '#94a3b8', strokeWidth: 2 },
    labelStyle: { fill: '#475569', fontSize: 10, fontWeight: 600 },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: '#94a3b8',
    },
  }))

  const [nodes, setNodes, onNodesChange] = useNodesState(flowNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(flowEdges)

  const onNodeClick = useCallback((_event: any, node: Node) => {
    const evidenceNode = evidenceNodes.find(n => n.id === node.id)
    if (evidenceNode) {
      setSelectedNode(evidenceNode)
    }
  }, [evidenceNodes])

  const NodeIcon = selectedNode ? getNodeIcon(selectedNode.type) : FileText

  return (
    <div className="relative w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        connectionMode={ConnectionMode.Loose}
        fitView
        attributionPosition="bottom-left"
      >
        <Background color="#e2e8f0" gap={16} />
        <Controls />
      </ReactFlow>

      {/* Node Details Panel */}
      {selectedNode && (
        <div className="absolute top-4 right-4 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden animate-fadeIn">
          {/* Header */}
          <div 
            className="p-4 text-white"
            style={{ backgroundColor: getNodeColor(selectedNode.type) }}
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center space-x-2">
                <NodeIcon className="h-5 w-5" />
                <span className="text-xs font-semibold uppercase tracking-wide opacity-90">
                  {selectedNode.type}
                </span>
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-white/80 hover:text-white transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <h3 className="text-lg font-bold">{selectedNode.title}</h3>
          </div>

          {/* Content */}
          <div className="p-4 space-y-4">
            {/* Confidence Score */}
            <div>
              <p className="text-xs text-gray-500 mb-2">Confidence Score</p>
              <div className="flex items-center space-x-3">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${selectedNode.confidence * 100}%`,
                      backgroundColor: getNodeColor(selectedNode.type),
                    }}
                  />
                </div>
                <span className="text-sm font-bold text-gray-900">
                  {(selectedNode.confidence * 100).toFixed(0)}%
                </span>
              </div>
            </div>

            {/* Summary */}
            <div>
              <p className="text-xs text-gray-500 mb-2">Summary</p>
              <p className="text-sm text-gray-700 leading-relaxed">
                {selectedNode.summary}
              </p>
            </div>

            {/* Details */}
            {selectedNode.details && (
              <div>
                <p className="text-xs text-gray-500 mb-2">Details</p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {selectedNode.details}
                </p>
              </div>
            )}

            {/* Source */}
            {selectedNode.source && (
              <div>
                <p className="text-xs text-gray-500 mb-2">Source</p>
                <a
                  href="#"
                  className="flex items-center space-x-2 text-sm text-primary-600 hover:text-primary-700 font-medium"
                  onClick={(e) => e.preventDefault()}
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>{selectedNode.source}</span>
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
