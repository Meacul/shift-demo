import { Location } from "../../dataSources/types";

const resolvers = {
    id: (parent: Location): string => {
        return parent.identifier;
    },
    gpsCoordinates: (parent: Location): { latitude: number; longitude: number } => {
        return {
            latitude: parent.gps_coordinates.latitude,
            longitude: parent.gps_coordinates.longitude,
        };
    },
};

export default resolvers;
