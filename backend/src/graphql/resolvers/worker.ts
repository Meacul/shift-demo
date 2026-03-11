import { getShiftRequestsForWorker } from "../../dataSources/postgres";
import { ShiftRequest, Worker } from "../../dataSources/types";

const resolvers = {
    shiftRequests: async (parent: Worker, _: any, { dataSources }: any): Promise<ShiftRequest[]> => {
        return getShiftRequestsForWorker(parent.internal_id);
    },
    id: (parent: Worker): string => {
        return parent.identifier;
    }
};

export default resolvers;