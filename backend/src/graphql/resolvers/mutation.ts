import { ShiftRequest, Worker } from "../../dataSources/types";
import { createShiftRequest, removeShiftRequest, respondToShiftRequest } from "../../dataSources/postgres";

export const Mutation = {
    requestShift: async (_: any, { workerId, shiftId }: { workerId: string, shiftId: string }, { dataSources }: any): Promise<ShiftRequest> => {
        const shiftRequest = await createShiftRequest(workerId, shiftId);
        return shiftRequest;
    },
    removeShiftRequest: async (_: any, { workerId, shiftId }: { workerId: string, shiftId: string }, { dataSources }: any): Promise<ShiftRequest> => {
        const shiftRequest = await removeShiftRequest(workerId, shiftId);
        return shiftRequest;
    },
    respondToShiftRequest: async (_: any, { shiftRequestId, accept }: { shiftRequestId: string, accept: boolean }, { dataSources }: any): Promise<ShiftRequest> => {
        const shiftRequest = await respondToShiftRequest(shiftRequestId, accept);
        return shiftRequest;
    }
};