import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type Coordinates = {
  __typename?: 'Coordinates';
  latitude: Scalars['Float']['output'];
  longitude: Scalars['Float']['output'];
};

export type Location = {
  __typename?: 'Location';
  gpsCoordinates: Coordinates;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  removeShiftRequest: ShiftRequest;
  requestShift: ShiftRequest;
  respondToShiftRequest: ShiftRequest;
};


export type MutationRemoveShiftRequestArgs = {
  shiftId: Scalars['ID']['input'];
  workerId: Scalars['ID']['input'];
};


export type MutationRequestShiftArgs = {
  shiftId: Scalars['ID']['input'];
  workerId: Scalars['ID']['input'];
};


export type MutationRespondToShiftRequestArgs = {
  accept: Scalars['Boolean']['input'];
  shiftRequestId: Scalars['ID']['input'];
};

export type Query = {
  __typename?: 'Query';
  locations: Location[];
  shifts: Shift[];
  workers: Worker[];
};

export type Shift = {
  __typename?: 'Shift';
  durationInMinutes: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  location: Location;
  shiftRequests: ShiftRequest[];
  startDate: Scalars['String']['output'];
  startTime: Scalars['String']['output'];
  worker?: Maybe<Worker>;
};

export type ShiftRequest = {
  __typename?: 'ShiftRequest';
  accepted: Scalars['Boolean']['output'];
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  shift: Shift;
  worker: Worker;
};

export type Worker = {
  __typename?: 'Worker';
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  shiftRequests: ShiftRequest[];
};

export type GetWorkersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetWorkersQuery = { __typename?: 'Query', workers: { __typename?: 'Worker', email: string, id: string, name: string, shiftRequests: { __typename?: 'ShiftRequest', accepted: boolean, createdAt: string, shift: { __typename?: 'Shift', id: string } }[] }[] };

export type GetShiftsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetShiftsQuery = { __typename?: 'Query', shifts: { __typename?: 'Shift', id: string, startDate: string, startTime: string, durationInMinutes: number, location: { __typename?: 'Location', id: string, name: string }, shiftRequests: { __typename?: 'ShiftRequest', id: string, createdAt: string, accepted: boolean, worker: { __typename?: 'Worker', id: string, email: string } }[] }[] };


export const GetWorkersDocument = gql`
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
export function useGetWorkersQuery(baseOptions?: Apollo.QueryHookOptions<GetWorkersQuery, GetWorkersQueryVariables>) {
    const options = {...defaultOptions, ...baseOptions}
    return Apollo.useQuery<GetWorkersQuery, GetWorkersQueryVariables>(GetWorkersDocument, options);
}
export function useGetWorkersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetWorkersQuery, GetWorkersQueryVariables>) {
    const options = {...defaultOptions, ...baseOptions}
    return Apollo.useLazyQuery<GetWorkersQuery, GetWorkersQueryVariables>(GetWorkersDocument, options);
}
// @ts-ignore
export function useGetWorkersSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetWorkersQuery, GetWorkersQueryVariables>): Apollo.UseSuspenseQueryResult<GetWorkersQuery, GetWorkersQueryVariables>;
export function useGetWorkersSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetWorkersQuery, GetWorkersQueryVariables>): Apollo.UseSuspenseQueryResult<GetWorkersQuery | undefined, GetWorkersQueryVariables>;
export function useGetWorkersSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetWorkersQuery, GetWorkersQueryVariables>) {
    const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
    return Apollo.useSuspenseQuery<GetWorkersQuery, GetWorkersQueryVariables>(GetWorkersDocument, options);
}
export type GetWorkersQueryHookResult = ReturnType<typeof useGetWorkersQuery>;
export type GetWorkersLazyQueryHookResult = ReturnType<typeof useGetWorkersLazyQuery>;
export type GetWorkersSuspenseQueryHookResult = ReturnType<typeof useGetWorkersSuspenseQuery>;
export type GetWorkersQueryResult = Apollo.QueryResult<GetWorkersQuery, GetWorkersQueryVariables>;
export const GetShiftsDocument = gql`
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
export function useGetShiftsQuery(baseOptions?: Apollo.QueryHookOptions<GetShiftsQuery, GetShiftsQueryVariables>) {
    const options = {...defaultOptions, ...baseOptions}
    return Apollo.useQuery<GetShiftsQuery, GetShiftsQueryVariables>(GetShiftsDocument, options);
}
export function useGetShiftsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetShiftsQuery, GetShiftsQueryVariables>) {
    const options = {...defaultOptions, ...baseOptions}
    return Apollo.useLazyQuery<GetShiftsQuery, GetShiftsQueryVariables>(GetShiftsDocument, options);
}
// @ts-ignore
export function useGetShiftsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetShiftsQuery, GetShiftsQueryVariables>): Apollo.UseSuspenseQueryResult<GetShiftsQuery, GetShiftsQueryVariables>;
export function useGetShiftsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetShiftsQuery, GetShiftsQueryVariables>): Apollo.UseSuspenseQueryResult<GetShiftsQuery | undefined, GetShiftsQueryVariables>;
export function useGetShiftsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetShiftsQuery, GetShiftsQueryVariables>) {
    const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
    return Apollo.useSuspenseQuery<GetShiftsQuery, GetShiftsQueryVariables>(GetShiftsDocument, options);
}
export type GetShiftsQueryHookResult = ReturnType<typeof useGetShiftsQuery>;
export type GetShiftsLazyQueryHookResult = ReturnType<typeof useGetShiftsLazyQuery>;
export type GetShiftsSuspenseQueryHookResult = ReturnType<typeof useGetShiftsSuspenseQuery>;
export type GetShiftsQueryResult = Apollo.QueryResult<GetShiftsQuery, GetShiftsQueryVariables>;