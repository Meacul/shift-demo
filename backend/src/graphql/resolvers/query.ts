import { getWorkers, getLocations, getShifts } from "../../dataSources/postgres";

export const Query = {
    workers: async (_: any, __: any, { dataSources }: any) => {
        return getWorkers();
    },
    locations: async (_: any, __: any, { dataSources }: any) => {
        return getLocations();
    },
    shifts: async (_: any, __: any, { dataSources }: any) => {
        return getShifts();
    },
}