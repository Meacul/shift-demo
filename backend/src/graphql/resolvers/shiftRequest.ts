import { getShiftByInternalId, getWorkerByInternalId } from "../../dataSources/postgres";
import { Shift, ShiftRequest, Worker } from "../../dataSources/types";

const resolvers = {
    id: (parent: ShiftRequest): string => {
        return parent.identifier;
    },
    createdAt: (parent: ShiftRequest): string => {
        return parent.created_at;
    },
    worker: async (parent: ShiftRequest): Promise<Worker | null> => {
        return getWorkerByInternalId(parent.user_id);
    },
    shift: async (parent: ShiftRequest): Promise<Shift | null> => {
        return getShiftByInternalId(parent.shift_id);
    },
};

export default resolvers;
