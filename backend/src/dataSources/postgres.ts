import postgres from "postgres";
import config from "../config";
import { Location, Worker, Shift, ShiftRequest } from "./types";

const sql = postgres({
    host: config.databaseUrl,
    port: config.databasePort,
    username: config.databaseUser,
    password: config.databasePassword,
    database: config.databaseName,
    prepare: false,
});

export const shutdownPostgres = async (): Promise<void> => {
    await sql.end();
}

export const getWorkers = async (): Promise<Worker[]> => {
    const result = await sql<Worker[]>`SELECT id as internal_id, identifier, name, email FROM public.user`;
    
    return result as Worker[];
}

export const getWorkerByIdentifier = async (identifier: string): Promise<Worker | null> => {
    const result = await sql<Worker[]>`SELECT id as internal_id, identifier, name, email FROM public.user WHERE identifier = ${identifier}`;
    return result[0] || null;
}

export const getWorkerByInternalId = async (internalId: string): Promise<Worker | null> => {
    const result = await sql<Worker[]>`SELECT id as internal_id, identifier, name, email FROM public.user WHERE id = ${internalId}`;
    return result[0] || null;
}

export const getLocations = async (): Promise<Location[]> => {
    const result = await sql<Location[]>`SELECT identifier, name, gps_coordinates FROM public.location`;
    return result as Location[];
}

export const getLocationById = async (id: string): Promise<Location | null> => {
    const result = await sql<Location[]>`SELECT identifier, name, gps_coordinates FROM public.location WHERE id = ${id}`;
    return result[0] || null;
}

export const getShifts = async (): Promise<Shift[]> => {
    const result = await sql<Shift[]>`SELECT id as internal_id, identifier, location_id, start_date, start_time, duration_in_minutes FROM public.shift`;
    return result as Shift[];
}

export const getShiftByInternalId = async (internalId: string): Promise<Shift | null> => {
    const result = await sql<Shift[]>`SELECT id as internal_id, identifier, location_id, start_date, start_time, duration_in_minutes FROM public.shift WHERE id = ${internalId}`;
    return result[0] || null;
}

export const getShiftRequestsForShift = async (shiftId: string): Promise<ShiftRequest[]> => {
    const shift_id = shiftId;
    const result = await sql<ShiftRequest[]>`SELECT id as internal_id, identifier, created_at, user_id, shift_id, accepted FROM public.shift_request WHERE shift_id = ${shift_id}`;
    return result as ShiftRequest[];
}

export const getShiftRequestsForWorker = async (workerId: string): Promise<ShiftRequest[]> => {
    const user_id = workerId;
    const result = await sql<ShiftRequest[]>`SELECT id as internal_id, identifier, created_at, user_id, shift_id, accepted FROM public.shift_request WHERE user_id = ${user_id}`;
    return result as ShiftRequest[];
}

export const removeAllShiftRequests = async (): Promise<void> => {
    await sql`DELETE FROM public.shift_request`;
}

export const createShiftRequest = async (workerIdentifier: string, shiftIdentifier: string): Promise<ShiftRequest> => {
    const [worker] = await sql<{ id: number }[]>`
        SELECT id FROM public.user WHERE identifier = ${workerIdentifier}
    `;
    
    if (!worker) {
        throw new Error(`Worker with identifier ${workerIdentifier} not found`);
    }
    
    // Similarly for shift
    const [shift] = await sql<{ id: number }[]>`
        SELECT id FROM public.shift WHERE identifier = ${shiftIdentifier}
    `;
    
    if (!shift) {
        throw new Error(`Shift with identifier ${shiftIdentifier} not found`);
    }
    
    // Now insert the shift request
    const [shiftRequest] = await sql<ShiftRequest[]>`
        INSERT INTO public.shift_request (user_id, shift_id, accepted)
        VALUES (${worker.id}, ${shift.id}, false)
        RETURNING id as internal_id, identifier, created_at, user_id, shift_id, accepted
    `;
    
    return shiftRequest;
}

export const removeShiftRequest = async (workerIdentifier: string, shiftIdentifier: string): Promise<ShiftRequest> => {
    // TODO: Transaction to ensure consistency
    const [worker] = await sql<{ id: number }[]>`
        SELECT id FROM public.user WHERE identifier = ${workerIdentifier}
    `;
    
    if (!worker) {
        throw new Error(`Worker with identifier ${workerIdentifier} not found`);
    }
    
    // Similarly for shift
    const [shift] = await sql<{ id: number }[]>`
        SELECT id FROM public.shift WHERE identifier = ${shiftIdentifier}
    `;
    
    if (!shift) {
        throw new Error(`Shift with identifier ${shiftIdentifier} not found`);
    }
    
    // Now insert the shift request
    const [shiftRequest] = await sql<ShiftRequest[]>`
        SELECT id as internal_id, identifier, created_at, user_id, shift_id, accepted FROM public.shift_request
        WHERE user_id = ${worker.id} AND shift_id = ${shift.id}
    `;
    
    return shiftRequest;
}

export const respondToShiftRequest = async (identifier: string, accept: boolean): Promise<ShiftRequest> => {
    const [shiftRequest] = await sql<ShiftRequest[]>`
        UPDATE public.shift_request SET accepted = ${accept}
        WHERE identifier = ${identifier}
        RETURNING id as internal_id, identifier, created_at, user_id, shift_id, accepted
    `;
    if (!shiftRequest) {
        throw new Error(`Shift request with identifier ${identifier} not found`);
    }
    return shiftRequest;
}
