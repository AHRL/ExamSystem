setTimeout(() => {
    console.log(0)
}, 1000)

new Promise((resolve, reject) => {
    console.log(1)
    resolve()
})
.then(() => {
    setTimeout(() => {
        console.log(3)
    }, 0)
    console.log(4)
})

process.nextTick(() => {
    console.log(5)
})

setTimeout((() => {
    console.log(6)
    return () => {
        console.log(7)
    }
})(), 2000)

setTimeout(() => {
    console.log(8)
}, 0)