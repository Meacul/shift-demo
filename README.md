# Shift demo
This is an exercise for using expo for frontend and supabase as a data source.

## Database
Postgres database for this project has been initialized in supabase with the following SQL:
```
CREATE TABLE public.location (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  identifier uuid NOT NULL DEFAULT gen_random_uuid() UNIQUE,
  name text,
  gps_coordinates json,
  CONSTRAINT location_pkey PRIMARY KEY (id)
);
CREATE TABLE public.shift (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  location_id bigint NOT NULL,
  start_date date,
  start_time time without time zone,
  duration_in_minutes bigint,
  identifier uuid DEFAULT gen_random_uuid(),
  CONSTRAINT shift_pkey PRIMARY KEY (id),
  CONSTRAINT shift_locationId_fkey FOREIGN KEY (location_id) REFERENCES public.location(id)
);
CREATE TABLE public.shiftRequest (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  user_id bigint NOT NULL,
  shift_id bigint NOT NULL,
  accepted boolean NOT NULL DEFAULT false,
  identifier uuid DEFAULT gen_random_uuid(),
  CONSTRAINT shiftRequest_pkey PRIMARY KEY (id),
  CONSTRAINT shiftRequest_userId_fkey FOREIGN KEY (user_id) REFERENCES public.user(id),
  CONSTRAINT shiftRequest_shiftId_fkey FOREIGN KEY (shift_id) REFERENCES public.shift(id)
);
CREATE TABLE public.user (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  identifier uuid NOT NULL DEFAULT gen_random_uuid() UNIQUE,
  name text,
  email text NOT NULL UNIQUE,
  CONSTRAINT user_pkey PRIMARY KEY (id)
);
```

## Backend
Created a simple backend for the client using NodeJS and ApolloGraphQL, which connects to supabase database.

## Client
Simple client that uses expo.dev and ApolloGraphQL client.
You can change which user you are acting as, request and remove requests for shifts and read user shift status.
