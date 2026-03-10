import { Location, locations } from "./locations";

export type Shift = {
    id: string,
    from: string, // yyyy-mm-ddThh:mm
    to: string, // yyyy-mm-ddThh:mm
    location: Location,
}

const shiftTemplates = [
    { id: 'morning', from: '2024-07-01T06:00', to: '2024-07-01T14:00' },
    { id: 'evening', from: '2024-07-01T14:00', to: '2024-07-01T22:00' },
    { id: 'night', from: '2024-07-01T22:00', to: '2024-07-02T06:00' },
];

export const shifts: Shift[] = Object.entries(locations).flatMap(([locationId, location]) =>
    shiftTemplates.map((shift) => ({
        id: `${locationId}-${shift.id}`,
        from: shift.from,
        to: shift.to,
        location,
    }))
);
