import { gql } from "@apollo/client";

export const GET_WORKERS = gql`
    query GetWorkers {
        workers {
            email
            id
            name
            shiftRequests {
                accepted
                createdAt
                shift {
                    id
                }
            }
        }
    }
`;

export const GET_SHIFTS = gql`
    query GetShifts {
        shifts {
            id
            startDate
            startTime
            durationInMinutes
            location {
                id
                name
            }
            shiftRequests {
                id
                createdAt
                accepted
                worker {
                    id
                    email
                }
            }
        }
    }
`;