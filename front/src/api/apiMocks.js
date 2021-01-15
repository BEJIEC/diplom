export let settings = {
    isWarState: true,
    equipmentsBase: [
        {
            id: 0,
            name: 'AK-74'
        },
        {
            id: 1,
            name: 'Стіл'
        }
    ]
}

export let fromServerMilBases = [
    {
        id: 0,
        name: 'A2724',
        type: 'combat',
        mustBeEquipment: [
            {
                id: 0,
                name: 'AK-74',
                quantity: 200
            }
        ],
        availability: [
            {
                id: 0,
                name: 'AK-74',
                quantity: 150
            }
        ],
        region: {
            lat: 20,
            lng: 20
        }
    },
    {
        id: 1,
        name: 'VITI',
        type: 'studying',
        mustBeEquipment: [
            {
                id: 1,
                name: 'Стіл',
                quantity: 100
            }
        ],
        availability: [
            {
                id: 1,
                name: 'Стіл',
                quantity: 100
            }
        ],
        region: {
            lat: 15,
            lng: 15
        }
    }
]

export let fromServerMilWarehouses = [
    {
        id: 0,
        name: 'Склад-1',
        availability: [
            {
                id: 0,
                name: 'AK-74',
                quantity: 300
            },
            {
                id: 1,
                name: 'Стіл',
                quantity: 100
            }
        ],
        region: {
            lat: 14,
            lng: 15
        }
    }
]

export let fromServerPrioritized = [
    {
        id: 0,
        name: 'A2724',
        priority: 4
    },
    {
        id: 1,
        name: 'VITI',
        priority: 2
    },
    {
        id: 2,
        name: 'A2724',
        priority: 1
    },
    {
        id: 3,
        name: 'VITI',
        priority: 3
    },
    {
        id: 4,
        name: 'A2724',
        priority: 2
    },
    {
        id: 5,
        name: 'VITI',
        priority: 2
    },
    {
        id: 6,
        name: 'A2724',
        priority: 0
    },
    {
        id: 7,
        name: 'VITI',
        priority: 1
    }
]
