export type Worker = {
    internal_id: string;
    identifier: string;
    name: string;
    email: string;
}

export type Location = {
    identifier: string;
    name: string;
    gps_coordinates: {
        latitude: number;
        longitude: number;
    };
}

export type Shift = {
    internal_id: string;
    location_id: string;
    identifier: string;
    start_date: Date;
    start_time: string;
    duration_in_minutes: number;
}

export type ShiftRequest = {
    internal_id: string;
    identifier: string;
    created_at: string;
    user_id: string;
    shift_id: string;
    accepted: boolean;
}
