export const SIERPINSKI_TRIANGLE_CONFIGURATIONS = [
    {
        name: "Gyorsaság",
        type: "slider",
        value: 60,
        minValue: 1,
        maxValue: 200,
        step: 1,
        func: this.sierpinskiTriangleConfigurable.setSpeed
    },
    {
        name: "Pontvastagság",
        type: "slider",
        value: 3,
        minValue: 1,
        maxValue: 10,
        step: 1,
        func: this.sierpinskiTriangleConfigurable.setStrokeWeight
    },
    {
        name: "Pontok közötti távolság",
        type: "slider",
        value: 0.5,
        minValue: 0.1,
        maxValue: 1,
        step: 0.1,
        func: this.sierpinskiTriangleConfigurable.setLerpValue
    },
    {
        name: "Fixált kezdőpontok",
        type: "checkbox",
        value: 1,
        func: this.sierpinskiTriangleConfigurable.setUseFixedPoints
    },
    {
        name: "Háromszög részeinek kijelölése",
        type: "checkbox-tree",
        value: 0,
        func: this.sierpinskiTriangleConfigurable.setCustomColors,
        configurations: [
            {
                name: "Szín 1",
                type: "colorpicker",
                color: "#000",
                func: this.sierpinskiTriangleConfigurable.setColor1
            },
            {
                name: "Szín 2",
                type: "colorpicker",
                color: "#000",
                func: this.sierpinskiTriangleConfigurable.setColor2
            },
            {
                name: "Szín 3",
                type: "colorpicker",
                color: "#000",
                func: this.sierpinskiTriangleConfigurable.setColor3
            }
        ]
    },
    {
        name: "Szín",
        type: "colorpicker",
        color: "#000",
        func: this.sierpinskiTriangleConfigurable.setColor
    }
]