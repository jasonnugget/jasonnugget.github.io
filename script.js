const canvas = document.querySelector("#bgCanvas")
const ctx = canvas.getContext("2d")
canvas.width = window.innerWidth
canvas.height = window.innerHeight

let drawing = false

canvas.addEventListener("mousedown", (e) => {
    if(e.button !== 0) return
    drawing = true
    ctx.beginPath() // starts drawing
    ctx.moveTo(e.offsetX, e.offsetY) // moves pen to start (where cursor is at)
    ctx.lineTo(e.offsetX, e.offsetY)
    ctx.stroke()
})

canvas.addEventListener("mousemove", (e) => {
    if(drawing !== true) return
    ctx.lineTo(e.offsetX, e.offsetY) // draws line to where mouse is at
    ctx.stroke() // makes it visible
})

canvas.addEventListener("mouseup", () => {
    if(drawing === true) {
        drawing = false;
    }
})
