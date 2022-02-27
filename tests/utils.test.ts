import { distanceAB, addXYvars, multiplyXYVars, divideXYVars, magnitude, normalize, rotate } from "../src/game/physics/utils"

test("test distanceAB 1", () => {
    expect(distanceAB({ x: 2, y: 3 }, { x: 2, y: 3 })).toEqual(0)
})

test("test distanceAB 2", () => {
    expect(distanceAB({ x: -1, y: 12 }, { x: 12, y: -1 })).toBeGreaterThan(18)
})

test("test distanceAB 3", () => {
    expect(distanceAB({ x: 0, y: 0 }, { x: 12, y: -1 })).toBeGreaterThan(12)
})

test("test distanceAB 4", () => {
    for (let a = 1; a < 10; a++) {
        for (let b = 1; b < 10; b++) {
            expect(distanceAB({ x: a, y: a }, { x: b, y: b })).toBeGreaterThanOrEqual(0);
        }
    }
})


//addXYvars

test("test addXYvars 1", () => {
    const data = addXYvars({ x: 1, y: 3 }, { x: 14, y: 2 })
    expect(data).toEqual({ x: 15, y: 5 })
})

test("test addXYvars 2", () => {
    const data = addXYvars({ x: -1, y: 0 }, { x: 1, y: 0 })
    expect(data).toEqual({ x: 0, y: 0 })
})

// test("test addXYvars 3", () => {
//     const data = addXYvars()
//     expect(data).toEqual({ x: 0, y: 0 })
// })

test("test addXYvars 4", () => {
    const data = addXYvars({ x: -1, y: 0 }, { x: 1, y: 14 }, { x: -1, y: 0 }, { x: -1, y: 12 },)
    expect(data).toEqual({ x: -2, y: 26 })
})

//multiplyXYVar

test("test multiplyXYVar 1", () => {
    expect(multiplyXYVars({ x: 3, y: 2 }, { x: 0, y: 0 })).toEqual({ x: 0, y: 0 })
})

test("test multiplyXYVar 2", () => {
    expect(multiplyXYVars({ x: 10, y: 10 }, { x: 12.3, y: 13.3 })).toEqual({ x: 123, y: 133 })
})

test("test multiplyXYVar 3", () => {
    for (let a = 1; a < 10; a++) {
        for (let b = -10; b < 0; b++) {
            let data = multiplyXYVars({ x: a, y: a }, { x: a, y: b })
            expect(data.x).toBeGreaterThan(0);
            expect(data.y).toBeLessThan(0)
        }
    }
})

test("test multiplyXYVar 4", () => {
    for (let a = -10; a <= 0; a++) {
        for (let b = -10; b <= 0; b++) {
            let data = multiplyXYVars({ x: a, y: b }, { x: a, y: b })
            expect(data.x).toBeGreaterThanOrEqual(0);
            expect(data.y).toBeGreaterThanOrEqual(0)
        }
    }
})

//divideXYVars

test("test divideXYVars 1", () => {
    const data = divideXYVars({ x: 3, y: 2 }, { x: 0, y: 0 })
    expect(data).toEqual({ x: Infinity, y: Infinity })
})

test("test divideXYVars 2", () => {
    const data = divideXYVars({ x: 45, y: 30 }, { x: 15, y: 15 })
    expect(data).toEqual({ x: 3, y: 2 })
})

test("test divideXYVars 3", () => {
    const data = divideXYVars({ x: 12, y: 0 }, { x: 12, y: 12 })
    expect(data).toEqual({ x: 1, y: 0 })
})

test("test divideXYVars 4", () => {
    for (let a = 1; a < 10; ++a) {
        let data = divideXYVars({ x: a, y: a }, { x: a, y: a })
        expect(data.x).toEqual(1)
        expect(data.y).toEqual(1)
    }
})

//magnitude

test("test magnitude 1", () => {
    expect(magnitude({ x: 3, y: 2 })).toEqual(Math.sqrt(3 * 3 + 2 * 2))
})

test("test magnitude 2", () => {
    expect(magnitude({ x: 0, y: 0 })).toEqual(0)
})

test("test magnitude 3", () => {
    for (let a = 1; a < 10; ++a) {
        expect(magnitude({ x: a, y: a })).toEqual(Math.sqrt(a * a + a * a))
    }
})

test("test magnitude 4", () => {
    for (let a = 1; a < 10; ++a) {
        for (let b = 1; b < 10; ++b) {
            expect(magnitude({ x: a, y: b })).toEqual(Math.sqrt(a * a + b * b))
        }
    }
})

//normalize

test("test normalize 1", () => {
    let vector = { x: 12, y: 2 }
    let data = normalize(vector)
    let lengthVector = magnitude(vector)
    expect(data).toEqual({ x: vector.x / lengthVector, y: vector.y / lengthVector })
})

test("test normalize 2", () => {
    let vector = { x: 0, y: 0 }
    let data = normalize(vector)
    let lengthVector = magnitude(vector)
    expect(data).toEqual({ x: vector.x / lengthVector, y: vector.y / lengthVector })
})

test("test normalize 3", () => {
    let vector = { x: 12.343432423432, y: 14.78963122323 }
    let data = normalize(vector)
    let lengthVector = magnitude(vector)
    expect(data).toEqual({ x: vector.x / lengthVector, y: vector.y / lengthVector })
})

test("test normalize 4", () => {
    for (let a = 1; a < 10; ++a) {
        for (let b = 1; b < 10; ++b) {
            let vector = { x: a, y: b }
            let data = normalize(vector)
            let lengthVector = magnitude(vector)
            expect(data).toEqual({ x: vector.x / lengthVector, y: vector.y / lengthVector })
        }
    }
})

//rotate

test("test rotate 1", () => {
    let vector = { x: 0, y: 0 }
    let angle = 12
    expect(rotate(vector, angle)).toEqual({
        x: vector.x * Math.cos(angle) - vector.y * Math.sin(angle),
        y: vector.x * Math.sin(angle) + vector.y * Math.cos(angle)
    })
})

// test("test rotate 2", () => {
//     let vector = { x: null, y: null }
//     let angle = 12
//     expect(rotate(vector, angle)).toEqual({
//         x: vector.x * Math.cos(angle) - vector.y * Math.sin(angle),
//         y: vector.x * Math.sin(angle) + vector.y * Math.cos(angle)
//     })
// })

test("test rotate 3", () => {
    let vector = { x: -2.435453456564234242, y: 2.435453456564234242 }
    let angle = 8983
    expect(rotate(vector, angle)).toEqual({
        x: vector.x * Math.cos(angle) - vector.y * Math.sin(angle),
        y: vector.x * Math.sin(angle) + vector.y * Math.cos(angle)
    })
})

test("test rotate 4", () => {
    let angle = 90;
    for (let a = 230; a < 300; ++a) {
        for (let b = 120; b < 130; ++b) {
            let vector = { x: a, y: b }
            angle = angle + 30
            expect(rotate(vector, angle)).toEqual({
                x: vector.x * Math.cos(angle) - vector.y * Math.sin(angle),
                y: vector.x * Math.sin(angle) + vector.y * Math.cos(angle)
            })
        }
    }
})