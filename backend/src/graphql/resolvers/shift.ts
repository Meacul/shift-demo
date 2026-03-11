import { getShiftRequestsForShift, getLocationById } from "../../dataSources/postgres";
import { Location, Shift, ShiftRequest } from "../../dataSources/types";

const resolvers = {
    shiftRequests: async (parent: Shift, _: any, { dataSources }: any): Promise<ShiftRequest[]> => {
        return getShiftRequestsForShift(parent.internal_id);
    },
    location: async (parent: Shift, _: any, { dataSources }: any): Promise<Location | null> => {
        return getLocationById(parent.location_id);
    },
    id: (parent: Shift): string => {
        return parent.identifier;
    },
    startDate: (parent: Shift): string => {
        return new Date(parent.start_date).toISOString().split("T")[0];
    },
    startTime: (parent: Shift): string => {
        return parent.start_time;
    },
    durationInMinutes: (parent: Shift): number => {
        return parent.duration_in_minutes;
    }
};

export default resolvers;
