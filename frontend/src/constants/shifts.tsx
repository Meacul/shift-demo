import { Location, locations } from "./locations";

type Shift = {
    from: string, // yyyy-mm-ddThh:mm
    to: string, // yyyy-mm-ddThh:mm
    location: Location,
}

const shiftTemplates = [
    { from: '2024-07-01T06:00', to: '2024-07-01T14:00' },
    { from: '2024-07-01T14:00', to: '2024-07-01T22:00' },
    { from: '2024-07-01T22:00', to: '2024-07-02T06:00' },
];

export const shifts: Shift[] = Object.values(locations).flatMap((location) =>
    shiftTemplates.map((shift) => ({
        ...shift,
        location,
    }))
);

export const convertShiftTimeToHumanReadable = (time: string) => {
    const date = new Date(time);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};
