// const a = ['red', 'blue', 'yellow', 'yet']
const a = ['abc']
// console.log(a.includes('red'))
a.map(b => {
  // console.log(b)
})
let b = 'ac'
// b = [b]
// console.log(typeof (b))

if (typeof (b) === 'string') {
  // console.log('L=1')

}

const validTeams = ['red', 'blue', 'yellow', 'yet']
const f = ['red', 'blue', 'green']
let g = f.filter(teamName => {
  return validTeams.includes(teamName)

})
let h = g.map(teamName => ({ team: teamName }))
// .map(teamName => (// console.log(teamName)))
// console.log(g)
// console.log(h)


let q = ['127.0.0.3']
let w = '127.0.0.4'
q.push(w)
// console.log(q)