import { Location, locations } from "./locations";

export type Shift = {
    id: string;
    startDate: string;
    startTime: string;
    durationInMinutes: number;
    location: {
        id: string;
        name: string;
        gpsCoordinates: {
            latitude: number;
            longitude: number;
        };
    };
    shiftRequests: Array<{
        id: string;
        createdAt: string;
        accepted: boolean;
        worker: {
            id: string;
            email: string;
        };
    }>;
};

export type ShiftDisplayData = {
    id: string;
    timeString: string;
    locationName: string;
};