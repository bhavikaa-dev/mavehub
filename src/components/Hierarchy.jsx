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

function Node({ node }) {
  return (
    <li className="list-none">
      <div className="org-card"
      style={{
        background: '#ffffff',
        color: '#111827',
        border: '1px solid #e5e7eb',
        borderRadius: '10px'
}}
>
        <div className="name">{node.name}</div>
        <div className="role">{node.role}</div>
        <div className="team">{node.team}</div>
      </div>
      {node.children.length > 0 && (
        <ul className="flex flex-col gap-3 ml-6 border-1 pl-4 mt-2">
          {node.children.map(child => (
            <Node key={child.id} node={child} />
          ))}
        </ul>
      )}
    </li>
  )
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

  return (
  <div className="fade-in">
    <div className="section-header">
      <div>
        <div className="section-title">Hierarchy</div>
        <div className="section-meta">ORG STRUCTURE</div>
      </div>
    </div>

    <div className="org-tree h-[75vh] overflow-y-auto p-5">
      <ul className="flex flex-col gap-6">
        {tree.map((root) => (
          <Node key={root.id} node={root} />
        ))}
      </ul>
    </div>
  </div>
)
}
