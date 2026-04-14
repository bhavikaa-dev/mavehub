import { useEffect, useState } from 'react'
import { getEmployees } from '../services/employeeService'

function buildTree(employees) {
  const map = {}
  const roots = []

  employees.forEach(e => {
    map[e.id] = { ...e, children: [] }
  })

  employees.forEach(e => {
    if (e.manager_id && map[e.manager_id]) {
      map[e.manager_id].children.push(map[e.id])
    } else {
      roots.push(map[e.id])
    }
  })

  return roots
}

// ✅ NEW: convert tree → levels (for horizontal layout)
function getLevels(tree) {
  const levels = []

  function traverse(nodes, level = 0) {
    if (!levels[level]) levels[level] = []

    nodes.forEach(node => {
      levels[level].push(node)
      if (node.children && node.children.length > 0) {
        traverse(node.children, level + 1)
      }
    })
  }

  traverse(tree)
  return levels
}

export default function Hierarchy() {
  const [employees, setEmployees] = useState([])

  useEffect(() => {
    const load = async () => {
      const data = await getEmployees()
      setEmployees(data || [])
    }
    load()
  }, [])

  const tree = buildTree(employees)
  const levels = getLevels(tree)

  return (
    <div className="fade-in">
      <div className="section-header">
        <div>
          <div className="section-title">Hierarchy</div>
          <div className="section-meta">ORG STRUCTURE</div>
        </div>
      </div>

      <div className="org-tree h-[75vh] overflow-auto p-5">

        {levels.map((level, i) => (
          <div key={i} className="flex justify-center gap-10 mb-10 flex-wrap">

            {level.map((node) => (
              <div
                key={node.id}
                className="org-card p-3 shadow-sm hover:shadow-md transition"
                style={{
                  background: '#ffffff',
                  color: '#111827',
                  border: '1px solid #e5e7eb',
                  borderRadius: '10px',
                  minWidth: '140px',
                  textAlign: 'center'
                }}
              >
                <div className="name font-semibold">{node.name}</div>
                <div className="role text-sm text-gray-500">{node.role}</div>
                <div className="team text-xs text-gray-400">{node.team}</div>
              </div>
            ))}

          </div>
        ))}

      </div>
    </div>
  )
}
