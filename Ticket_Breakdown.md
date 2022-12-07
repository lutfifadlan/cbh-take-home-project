# Ticket Breakdown
We are a staffing company whose primary purpose is to book Agents at Shifts posted by Facilities on our platform. We're working on a new feature which will generate reports for our client Facilities containing info on how many hours each Agent worked in a given quarter by summing up every Shift they worked. Currently, this is how the process works:

- Data is saved in the database in the Facilities, Agents, and Shifts tables
- A function `getShiftsByFacility` is called with the Facility's id, returning all Shifts worked that quarter, including some metadata about the Agent assigned to each
- A function `generateReport` is then called with the list of Shifts. It converts them into a PDF which can be submitted by the Facility for compliance.

## You've been asked to work on a ticket. It reads:

**Currently, the id of each Agent on the reports we generate is their internal database id. We'd like to add the ability for Facilities to save their own custom ids for each Agent they work with and use that id when generating reports for them.**


Based on the information given, break this ticket down into 2-5 individual tickets to perform. Provide as much detail for each ticket as you can, including acceptance criteria, time/effort estimates, and implementation details. Feel free to make informed guesses about any unknown details - you can't guess "wrong".


You will be graded on the level of detail in each ticket, the clarity of the execution plan within and between tickets, and the intelligibility of your language. You don't need to be a native English speaker, but please proof-read your work.

## Your Breakdown Here

### Assumptions:
- **ERD**:
![Screenshot 2022-12-08 at 01 35 38](https://user-images.githubusercontent.com/7077041/206267139-6af62101-acc0-4ba0-ab52-734481babe40.png)
- **Sequence Diagram**:
![Screenshot 2022-12-08 at 01 49 51](https://user-images.githubusercontent.com/7077041/206269756-78918645-2f67-482a-8600-b186e04a1813.png)
- Database is non-relational
- `Agent` table columns:
  - id
  - custom_id
  - created_at
  - updated_at
- `Facility` table columns:
  - id
  - name
  - created_at
  - updated_at
- `Shifts` table columns:
  - id
  - shift_date
  - agent_id
  - agent_custom_id
  - agent_name
  - working_hours
  - created_at
  - updated_at
- Agent custom id's is an required input when creating shift and generating reports
- 1 Shift can have more than one Agent with a either same or different number of hours
- The communication protocol between to book agent, post shifts, and generate report is using REST API. And here are some of the existing endpoints:
  - `POST /facilities/shifts` (Post Shift for Clients)
    - Body Request Example:
      ```
      { 
        shift_date: "2022-12-12T17:00:00.000Z"
        shifts: [
          {
            agent_id: "ac231ec5-ed4e-4822-8828-cdc390e45beb",
            working_hours: 4,
            agent_custom_id: "1234"
          },
          {
            agent_id: "7d94cf7e-062f-4913-8cf3-aba501c4cc51",
            working_hours: 8,
            agent_custom_id: "1235"
          }
        }
      }
      ```
  - `POST /facilities/agent-book` (Client Book Agent)
    - Body Request Example:
      ```
      {
        shift_id: "12345",
        agent_id: "ac231ec5-ed4e-4822-8828-cdc390e45beb"
      }
      ```
  - `GET /shifts?facility_id={facility_id}`
  - `POST /reports`
    - Body Request Example:
      ```
      {
        shifts_ids: ["2a941f49-3384-406a-a121-e2f538ea6aec", "d6a68b56-138b-4888-a0ea-18b9590e4a34"]
      }
      ```
  - There is `getShiftById` function available to get shift by shift id

1. **User Story: As a Facility, I want to be able to save custom id for each Agent**
  a. Acceptance Criteria
    - A new field called `custom_id` should be added as a new column in Agent table
    - Facility has the ability to use custom id for agents when the client book them
    - We should be able to get the agent's custom id when querying the Agent table
    - We should be able to get agent's custom id fetching shifts
  b. Time / Effort Estimates
    - 3 days (3 story points) with breakdown:
      - 1 day to update table, request and response of API, and request validator
      - 1 day to update unit test and integration tests
      - 1 day to deploy to dev environment, QA, and release to production
  c. Implementation Details
    - Add a new `custom_id` column in Agent table
    - Update `getShiftsByFacilityId`(equivalent of `getShiftsByFacility`) function to include `agent_custom_id` as the returned value
    - Update `createShift` function to include `agent_custom_id` in the input parameter and also the returned value
    - Update the request validator for creating shift API to also validate `agent_custom_id`
    - Update the return response of Agent API to include `custom_id`
    - Update unit tests for functions that are related to Agent to include `agent_custom_id` field
      - `getShiftsByFacilityId`
      - `createShift`
    - Update integration tests for APIs that have additional request & response for
      - `custom_id` for Agent APIs case
      - `agent_custom_id` for Shift and Facility APIs case


2. **User Story: As a Facility, I want to be able to generate report which have the custom ids that have been set for each Agent**
  a. Acceptance Criteria
    - Facility has the ability to generate report with the list of `shift_id`'
    - The generated report should have `agent_custom_id` value which indicates the custom id for the Agent that has worked in Shifts
    - If one of inputted `shift_id` not exists in the Shift table, it should return shift with the `shift_id` doesn't exists error message
  b. Time / Effort Estimates
    - 5 days (5 story points)
      - 2 days to create generate report function
      - 1 day to
        - create generate report API endpoint
        - create unit tests for generate report function
      - 1 day to create integration tests for generate report API and deploy to dev environment
      - 1 day to QA and release to production
  c. Implementation Details
    - Create generate report function which will do the following:
      - Receive list of shift ids as an input parameter
      - Iterate the list of shift ids and get shifts by calling `getShiftsById` function based on those
        - If the shift doesn't exists, throw error
      - Once you get all of the shifts, create a data structure which contains list of agents that worked on Shift and have following:
        - Agent's name
        - Agent's custom id
        - Agent's sum of working hours in every Shifts
      - Generate PDF with the structured data
    - Create generate report API which body parameter is the list of shift ids
    - Create unit tests for generate report function
    - Create integraton test for generate report API
