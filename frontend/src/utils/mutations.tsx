import { gql } from "@apollo/client";

export const REQUEST_SHIFT = gql`
    mutation RequestShift($workerId: ID!, $shiftId: ID!) {
        requestShift(workerId: $workerId, shiftId: $shiftId) {
            id
            createdAt
        }
    }
`;

export const REMOVE_SHIFT_REQUEST = gql`
    mutation RemoveShiftRequest($workerId: ID!, $shiftId: ID!) {
        removeShiftRequest(workerId: $workerId, shiftId: $shiftId) {
            id
            createdAt
        }
    }
`;
