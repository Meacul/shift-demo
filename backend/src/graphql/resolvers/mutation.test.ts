import { afterAll, beforeAll, beforeEach, describe, expect, it } from '@jest/globals';

const workerId = 'f3e797d6-a26f-40f3-b566-21d6d74cc16b';
const shiftId = '44ce79a9-b900-49c8-aee1-40a418c4603a';

describe('Mutation GraphQL integration', () => {
    const originalNodeEnv = process.env.NODE_ENV;
    let apolloServer: typeof import('../apolloServer').apolloServer;
    let removeAllShiftRequests: typeof import('../../dataSources/postgres').removeAllShiftRequests;

    beforeAll(async () => {
        process.env.NODE_ENV = 'development';
        process.env.PORT ??= '4000';
        process.env.API_KEY ??= 'test-api-key';

        ({ apolloServer } = await import('../apolloServer'));
        ({ removeAllShiftRequests } = await import('../../dataSources/postgres'));
        await apolloServer.start();
    });

    beforeEach(async () => {
        await removeAllShiftRequests();
    });

    afterAll(async () => {
        process.env.NODE_ENV = originalNodeEnv;
        await apolloServer.stop();
    });

    it('creates a shift request through the GraphQL server', async () => {
        const response = await apolloServer.executeOperation({
            query: `
                mutation RequestShift($workerId: ID!, $shiftId: ID!) {
                    requestShift(workerId: $workerId, shiftId: $shiftId) {
                        id
                        createdAt
                        accepted
                    }
                }
            `,
            variables: { workerId, shiftId },
        });

        expect(response.body.kind).toBe('single');
        if (response.body.kind !== 'single') {
            throw new Error('Expected a single GraphQL result');
        }

        expect(response.body.singleResult.errors).toBeUndefined();
        expect(response.body.singleResult.data).toEqual({
            requestShift: {
                id: expect.any(String),
                createdAt: expect.any(String),
                accepted: false,
            },
        });
    });

    it('returns the same shift request when removing it through the GraphQL server', async () => {
        const createResponse = await apolloServer.executeOperation({
            query: `
                mutation RequestShift($workerId: ID!, $shiftId: ID!) {
                    requestShift(workerId: $workerId, shiftId: $shiftId) {
                        id
                        createdAt
                        accepted
                    }
                }
            `,
            variables: { workerId, shiftId },
        });

        expect(createResponse.body.kind).toBe('single');
        if (createResponse.body.kind !== 'single') {
            throw new Error('Expected a single GraphQL result');
        }

        const createdRequest = createResponse.body.singleResult.data?.requestShift;

        const removeResponse = await apolloServer.executeOperation({
            query: `
                mutation RemoveShiftRequest($workerId: ID!, $shiftId: ID!) {
                    removeShiftRequest(workerId: $workerId, shiftId: $shiftId) {
                        id
                        createdAt
                        accepted
                    }
                }
            `,
            variables: { workerId, shiftId },
        });

        expect(removeResponse.body.kind).toBe('single');
        if (removeResponse.body.kind !== 'single') {
            throw new Error('Expected a single GraphQL result');
        }

        expect(removeResponse.body.singleResult.errors).toBeUndefined();
        expect(removeResponse.body.singleResult.data).toEqual({
            removeShiftRequest: createdRequest,
        });
    });

    it('updates acceptance through the GraphQL server', async () => {
        const createResponse = await apolloServer.executeOperation({
            query: `
                mutation RequestShift($workerId: ID!, $shiftId: ID!) {
                    requestShift(workerId: $workerId, shiftId: $shiftId) {
                        id
                    }
                }
            `,
            variables: { workerId, shiftId },
        });

        expect(createResponse.body.kind).toBe('single');
        if (createResponse.body.kind !== 'single') {
            throw new Error('Expected a single GraphQL result');
        }

        const requestShift = createResponse.body.singleResult.data?.requestShift as { id: string } | undefined;
        expect(requestShift).toBeDefined();
        if (!requestShift) {
            throw new Error('Expected requestShift to be defined');
        }

        const createdRequestId = requestShift.id;
        const respondResponse = await apolloServer.executeOperation({
            query: `
                mutation RespondToShiftRequest($shiftRequestId: ID!, $accept: Boolean!) {
                    respondToShiftRequest(shiftRequestId: $shiftRequestId, accept: $accept) {
                        id
                        createdAt
                        accepted
                    }
                }
            `,
            variables: { shiftRequestId: createdRequestId, accept: true },
        });

        expect(respondResponse.body.kind).toBe('single');
        if (respondResponse.body.kind !== 'single') {
            throw new Error('Expected a single GraphQL result');
        }

        expect(respondResponse.body.singleResult.errors).toBeUndefined();
        expect(respondResponse.body.singleResult.data).toEqual({
            respondToShiftRequest: {
                id: createdRequestId,
                createdAt: expect.any(String),
                accepted: true,
            },
        });
    });
});
