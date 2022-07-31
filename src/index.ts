const demoRegistry = [
  {
    name: 'cube-task',
    import() {
      import('./demo/cube-task')
    },
  },
  {
    name: 'transformation-matrix',
    import() {
      import('./demo/transformation-matrix')
    },
  },
]

function createDemoList() {
  const ul = document.createElement('ul')
  demoRegistry.forEach((demo) => {
    const a = document.createElement('a')
    a.text = demo.name
    a.href = `./${demo.name}`
    const li = document.createElement('li')
    li.appendChild(a)
    ul.appendChild(li)
  })
  document.body.appendChild(ul)
}

function getPathName() {
  const match = document.location.pathname.match(/\/([^\/]*)$/)
  return match ? match[1] : ''
}

function showDemo(pathName: string) {
  const demo = demoRegistry.find((demo) => demo.name === pathName)
  if (demo) {
    demo.import()
  }
}

function main() {
  const pathName = getPathName()
  if (pathName) {
    showDemo(pathName)
  } else {
    createDemoList()
  }
}

main()
