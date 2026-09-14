// ==========================================
// MAP AND ROBOT STATE
// ==========================================

const MapLevels = [
    //Level 1
    {
        mapping : [
            [0, 0, 0,],
            [1, 1, 2 ],
            [0, 0, 0 ]

        ],
        initial : {x: 0, y: 1, direction: 90},
        message : true
    },
    {
        mapping : [
            [0, 1, 0,],
            [1, 1, 1 ],
            [0, 2, 0 ]

        ],
        initial : {x: 0, y: 1, direction: 90},
        message : true
    }

]