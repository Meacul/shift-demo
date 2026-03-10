import graphql from 'graphql-tag';

export const schema = graphql`
type Worker {
    id: ID!
    name: String!
    email: String!
    shiftRequests: [ShiftRequest!]!
}

type Coordinates {
    latitude: Float!
    longitude: Float!
}

type Location {
    id: ID!
    name: String!
    gpsCoordinates: Coordinates!
}

type Shift {
    id: ID!
    worker: Worker
    location: Location!
    startDate: String!
    startTime: String!
    durationInMinutes: Int!
    shiftRequests: [ShiftRequest!]!
}

type ShiftRequest {
    id: ID!
    createdAt: String!
    worker: Worker!
    shift: Shift!
    accepted: Boolean!
}

type Query {
    workers: [Worker!]!
    locations: [Location!]!
    shifts: [Shift!]!
}

type Mutation {
    requestShift(workerId: ID!, shiftId: ID!): ShiftRequest!
    removeShiftRequest(workerId: ID!, shiftId: ID!): ShiftRequest!
    respondToShiftRequest(shiftRequestId: ID!, accept: Boolean!): ShiftRequest!
}
`;