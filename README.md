# Mini Creator Dashboard

A Next.js dashboard for managing and analyzing creator data, built with **shadcn/ui** and **Tailwind CSS**.

## Setup Instructions

1.  **Clone the repository** (or unzip):
    ```bash
    cd <project-folder>
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Run the development server**:
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) with your browser.

4.  **Run Unit Tests**:
    This project uses Jest to test core logic (sorting, filtering, metrics).
    ```bash
    npm test
    ```

## Tech Stack

*   **Framework**: Next.js (App Router)
*   **Language**: TypeScript
*   **Styling**: Tailwind CSS, CSS Modules (for custom animations)
*   **UI Components**: shadcn/ui (100% usage, no external table libraries)
*   **Testing**: Jest

## Decisions & Assumptions

### 1. Sorting Logic (Stable & Deterministic)
*   **Requirement**: Sorting must be stable.
*   **Implementation**: A multi-level sort strategy is used in `lib/creators.ts`.
    1.  **Primary Sort**: Sorts by the selected key (Followers, Revenue) in the chosen direction.
    2.  **Tie-Breaker 1**: If primary values are equal, sort by **Name (Ascending)**.
    3.  **Tie-Breaker 2**: If names are also equal (obviously possible), sort by **ID (Ascending)**.
*   **Why?**: This ensures the list order never "jumps" randomly when values are identical, providing a polished user experience.

### 2. Derived Metrics
*   **Avg Revenue per Active Creator**: Calculated as `Total Revenue of Active Creators / Count of Active Creators`.
*   **Edge Case**: If there are 0 active creators, the dashboard safeguards against division-by-zero, returning `0` instead of `NaN`.
*   **Data Scope**: Metrics are calculated based on the *currently filtered view*. This means the summary cards will update to reflect the subset of creators currently displayed in the table.

### 3. UI/UX Design ("Donezo" Theme)
*   **Theme**: Adhered to a "Donezo" inspired aesthetic with deep greens and gradients.
*   **Visual Hierarchy**:
    *   **Primary Card**: The "Total Creators" card uses a rich green gradient to stand out as the main KPI.
    *   **Rounded Corners**: Used `rounded-2xl` and `rounded-full` for inputs to create a friendly, modern interface.
    *   **Feedback**: Active states, simple hover effects, and clear badges for "Active/Inactive" status.

## Scalability: Supporting 10k Creators

If this dashboard needed to support **10,000+ creators**, several changes would be required to maintain performance and UX:

### 1. Server-Side Pagination & Filtering (Critical)
*   **Current**: We load all data into Client State (`useState`). heavy for 10k rows.
*   **Change**: Move filtering, sorting, and pagination to the **Backend (API + Database)**.
*   **Why**: Sending 10k objects (approx 1-2MB JSON) slows initial load. Filtering on the client blocks the main thread.

### 2. UI Virtualization
*   **Current**: The DOM renders a `<tr>` for every visible creator.
*   **Change**: Implement **Virtual Scrolling** (e.g., `react-window` or `tanstack-virtual`) for the table.
*   **Why**: Renders only the ~20 rows visible on screen, keeping the DOM light even if the list has 10,000 items.

### 3. Search Optimization
*   **Current**: Filters immediately on every keystroke.
*   **Change**: Implement **Debouncing** (wait 300ms after typing stops) before triggering the filter/API call.
*   **Why**: Prevents 10,000 calculations per keystroke, avoiding UI freeze.

### 4. Caching
*   **Change**: Use tools like `TanStack Query` (React Query) to cache data server-side and manage loading states efficiently.
