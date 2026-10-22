interface Point {
  x: number
  y: number
}

// Trace each cage once so dashes continue across cell seams and around corners.
export function cageOutline(cells: number[]): string {
  const members = new Set(cells)
  const edges: { from: Point; to: Point }[] = []
  for (const cell of [...cells].sort((a, b) => a - b)) {
    const x = cell % 9,
      y = Math.floor(cell / 9)
    if (!members.has(cell - 9))
      edges.push({ from: { x, y }, to: { x: x + 1, y } })
    if (x === 8 || !members.has(cell + 1))
      edges.push({ from: { x: x + 1, y }, to: { x: x + 1, y: y + 1 } })
    if (!members.has(cell + 9))
      edges.push({ from: { x: x + 1, y: y + 1 }, to: { x, y: y + 1 } })
    if (x === 0 || !members.has(cell - 1))
      edges.push({ from: { x, y: y + 1 }, to: { x, y } })
  }
  const paths: string[] = []
  while (edges.length) {
    let edge = edges.shift()!
    const vertices = [edge.from]
    while (edge.to.x !== vertices[0]!.x || edge.to.y !== vertices[0]!.y) {
      vertices.push(edge.to)
      const next = edges.findIndex(
        ({ from }) => from.x === edge.to.x && from.y === edge.to.y
      )
      if (next < 0) break
      edge = edges.splice(next, 1)[0]!
    }
    const corners = vertices.flatMap((point, index) => {
      const previous =
        vertices[(index + vertices.length - 1) % vertices.length]!
      const next = vertices[(index + 1) % vertices.length]!
      const dx = point.x - previous.x,
        dy = point.y - previous.y
      const nx = next.x - point.x,
        ny = next.y - point.y
      if (dx * ny === dy * nx) return []
      return [
        { x: point.x * 100 - (dy + ny) * 6, y: point.y * 100 + (dx + nx) * 6 },
      ]
    })
    paths.push(
      corners
        .map(({ x, y }, index) => `${index ? 'L' : 'M'} ${x} ${y}`)
        .join(' ') + ' Z'
    )
  }
  return paths.join(' ')
}
