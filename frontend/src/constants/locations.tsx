export type Location = {
    gpsCoordinates: {
        latitude: number,
        longitude: number
    }
    name: string
};

export const locations: Location[] = [
    {
        name: 'Warehouse A',
        gpsCoordinates: {
            latitude: 37.7749,
            longitude: -122.4194,
        }
    },
    {
        name: 'Warehouse B',
        gpsCoordinates: {
            latitude: 34.0522,
            longitude: -118.2437,
        }
    }
]
