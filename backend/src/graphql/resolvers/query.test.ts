import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';

// database id is internal_id in datasource results, but database identifier is id in graphql results
const users = [{"id":"1","identifier":"f3e797d6-a26f-40f3-b566-21d6d74cc16b","name":"Alice Johnson","email":"alice.johnson@example.com"},{"id":"2","identifier":"d1a950c9-08b7-4ec6-b20f-d667990cbada","name":"Bob Smith","email":"bob.smith@example.com"},{"id":"3","identifier":"cd6ac2e7-69e9-4ff0-9506-55cd1abb1a93","name":"Charlie Brown","email":"charlie.brown@example.com"},{"id":"4","identifier":"1143cd1f-3de9-4722-95da-d8296f5e6ea7","name":"Diana Prince","email":"diana.prince@example.com"},{"id":"5","identifier":"7e375b90-d8c6-431b-aed4-43088181f71a","name":"Edward Norton","email":"edward.norton@example.com"},{"id":"6","identifier":"b944a02e-86a2-4eb0-96e5-548a5420a71b","name":"Fiona Green","email":"fiona.green@example.com"},{"id":"7","identifier":"3fb9d7c8-fc21-482f-8f6c-5768c728b8f2","name":"George Lucas","email":"george.lucas@example.com"},{"id":"8","identifier":"f64742f1-f324-4190-a4a9-1504f2e172ce","name":"Helen Troy","email":"helen.troy@example.com"},{"id":"9","identifier":"c6250904-2ffd-4e61-867f-5710c05d8d11","name":"Ian Fleming","email":"ian.fleming@example.com"},{"id":"10","identifier":"0f7017ae-3510-4d30-ae66-231323cf0764","name":"Julia Roberts","email":"julia.roberts@example.com"}];
const locations = [{"identifier":"f5a3fb0e-c3f0-4bb6-97dc-fd70a49b71ba","name":"Warehouse A","gps_coordinates":{"latitude":37.7749,"longitude":-122.4194}},{"identifier":"18889c66-0e34-4b23-b4a8-b88c7d6f6a36","name":"Warehouse B","gps_coordinates":{"latitude":34.0522,"longitude":-118.2437}},{"identifier":"59fc3e3c-35a9-437c-824f-d26f43c1604f","name":"Warehouse C","gps_coordinates":{"latitude":40.7128,"longitude":-74.006}}];
const shifts = [{"id":"1","identifier":"44ce79a9-b900-49c8-aee1-40a418c4603a","location_id":"1","start_date":"2026-03-10T00:00:00.000Z","start_time":"08:00:00","duration_in_minutes":"240"},{"id":"2","identifier":"5f9fec12-040f-4879-8642-9c2998a536ed","location_id":"1","start_date":"2026-03-10T00:00:00.000Z","start_time":"09:00:00","duration_in_minutes":"270"},{"id":"3","identifier":"aad661a9-2ffc-4d81-8c87-bc1b6707a0b4","location_id":"1","start_date":"2026-03-10T00:00:00.000Z","start_time":"10:00:00","duration_in_minutes":"300"},{"id":"4","identifier":"300a3753-1f19-4c2f-a18d-6b9b291488f7","location_id":"1","start_date":"2026-03-10T00:00:00.000Z","start_time":"11:00:00","duration_in_minutes":"330"},{"id":"5","identifier":"c35f9851-bd57-41d3-8b3b-06604bdd2e03","location_id":"2","start_date":"2026-03-10T00:00:00.000Z","start_time":"12:00:00","duration_in_minutes":"360"},{"id":"6","identifier":"5227550f-255c-4317-a58d-44467c29ca65","location_id":"2","start_date":"2026-03-10T00:00:00.000Z","start_time":"13:00:00","duration_in_minutes":"390"},{"id":"7","identifier":"4a15d229-27b4-4b15-9ae7-450948b2c254","location_id":"2","start_date":"2026-03-10T00:00:00.000Z","start_time":"14:00:00","duration_in_minutes":"420"},{"id":"8","identifier":"8facc68b-0248-46c0-b56f-66c07426b53c","location_id":"2","start_date":"2026-03-10T00:00:00.000Z","start_time":"15:00:00","duration_in_minutes":"450"},{"id":"9","identifier":"dfa7dbdf-f3e2-4244-911a-e78a0e7202a7","location_id":"3","start_date":"2026-03-10T00:00:00.000Z","start_time":"16:00:00","duration_in_minutes":"480"},{"id":"10","identifier":"5d7c2609-1862-490f-90d2-e148d9129cec","location_id":"3","start_date":"2026-03-10T00:00:00.000Z","start_time":"17:00:00","duration_in_minutes":"240"},{"id":"11","identifier":"2e426364-01f4-4b7f-a897-ecbfddb9f992","location_id":"3","start_date":"2026-03-10T00:00:00.000Z","start_time":"18:00:00","duration_in_minutes":"270"},{"id":"12","identifier":"41436c1d-4168-4f0b-9f9d-4b7cf93bd7d9","location_id":"3","start_date":"2026-03-10T00:00:00.000Z","start_time":"19:00:00","duration_in_minutes":"300"}];

const expectedWorkers = users.map(({ identifier, name, email }) => ({
    id: identifier,
    name,
    email,
}));

const expectedLocations = locations.map(({ identifier, name, gps_coordinates }) => ({
    id: identifier,
    name,
    gpsCoordinates: gps_coordinates,
}));

const expectedShifts = shifts.map(({ identifier, start_date, start_time, duration_in_minutes }) => ({
    id: identifier,
    startDate: start_date.split('T')[0], // Convert to YYYY-MM-DD format
    startTime: start_time,
    durationInMinutes: Number(duration_in_minutes),
}));

describe('Query GraphQL integration', () => {
    const originalNodeEnv = process.env.NODE_ENV;
    let apolloServer: typeof import('../apolloServer').apolloServer;

    beforeAll(async () => {
        process.env.NODE_ENV = 'development';
        process.env.PORT ??= '4000';
        process.env.API_KEY ??= 'test-api-key';

        ({ apolloServer } = await import('../apolloServer'));
        await apolloServer.start();
    });

    afterAll(async () => {
        process.env.NODE_ENV = originalNodeEnv;
        await apolloServer.stop();
    });

    it('returns workers through the GraphQL server', async () => {
        const response = await apolloServer.executeOperation({
            query: `
                query Workers {
                    workers {
                        id
                        name
                        email
                    }
                }
            `,
        });

        expect(response.body.kind).toBe('single');
        if (response.body.kind !== 'single') {
            throw new Error('Expected a single GraphQL result');
        }

        expect(response.body.singleResult.errors).toBeUndefined();
        expect(response.body.singleResult.data).toEqual({
            workers: expectedWorkers,
        });
    });

    it('returns locations through the GraphQL server', async () => {
        const response = await apolloServer.executeOperation({
            query: `
                query Locations {
                    locations {
                        id
                        name
                        gpsCoordinates {
                            latitude
                            longitude
                        }
                    }
                }
            `,
        });

        expect(response.body.kind).toBe('single');
        if (response.body.kind !== 'single') {
            throw new Error('Expected a single GraphQL result');
        }

        expect(response.body.singleResult.errors).toBeUndefined();
        expect(response.body.singleResult.data).toEqual({
            locations: expectedLocations,
        });
    });

    it('returns shifts through the GraphQL server', async () => {
        const response = await apolloServer.executeOperation({
            query: `
                query Shifts {
                    shifts {
                        id
                        startDate
                        startTime
                        durationInMinutes
                    }
                }
            `,
        });

        expect(response.body.kind).toBe('single');
        if (response.body.kind !== 'single') {
            throw new Error('Expected a single GraphQL result');
        }

        expect(response.body.singleResult.errors).toBeUndefined();
        expect(response.body.singleResult.data).toEqual({
            shifts: expectedShifts,
        });
    });
});
