# Anbac Fit — Habit Companion

A working mobile app built from the `Anbac_Project_Design_01` designs (12 modules). It's a React + TypeScript + Vite PWA: you can install it on a phone's home screen, and it shows inside a phone frame on desktop.

## Run

```bash
npm install
npm run dev        # http://localhost:5173  (also on your LAN IP for testing on a phone)
npm run build      # production build in dist/ (static; host anywhere)
npm run preview    # serve the production build
```

## Demo accounts

| Role  | Email            | Password      |
|-------|------------------|---------------|
| User  | alex@email.com   | password123   |
| Admin | admin@anbac.com  | (any)         |

Data is stored in `localStorage`. To start over, go to **Settings → Demo tools → Reset app data**.

## What's implemented (by design module)

1. **Onboarding**: splash and two slides with Skip.
2. **Sign Up**: validation, duplicate-email error, 4-digit OTP verify, check-email with resend timer, account created, Google sign-in mock.
3. **Login**: wrong-password and auth-failed banner, forgot and reset password, session restore, session expired.
4. **Profile Setup**: 3 steps (profile, goals, metric/imperial body metrics), summary, photo upload with failure state.
5. **Dashboard**: streak ring, today's tasks, challenges, skeleton loading, empty state, sync-failed banner, search with no-results state.
6. **Tasks & Workouts**: task filters and progress logging (earns FitCoins); a weekly planner; a 3-step plan builder for running, walking and cycling; permission screens; live trackers with timer, pause/resume and end (credits FitCoins).
7. **Products**: categories, store with filters and search, product detail (size, colour, FitCoins toggle), wishlist, cart (qty and delete sheet), checkout, order placed/failed, payment failed, orders, and order detail with timeline and cancel.
8. **Rewards**: points balance, join challenges, wallet, transaction history filters, redeem with confirm sheet (deducts balance), refer & earn (copy/share), achievements, expired rewards.
9. **Notifications**: list with skeleton, empty state, enable-notifications screen with toggles.
10. **Settings**: edit profile (offline save error), change password with requirements, biometric security, privacy toggles, data usage, permissions (allow/deny), help, FAQ accordion, contact support with attachment, privacy policy, terms, about, log-out sheet, photo action sheet.
11. **Global states**: success, no internet, something went wrong, no connection, connection failed, empty activity history, delete/logout sheets. **Settings → Demo tools** has an "offline" toggle for testing these.
12. **Admin**: dashboard KPIs, product CRUD (add/edit/delete, image upload, restock), orders with status updates, analytics (range switch and bar chart), inventory alerts, customers (sort and CSV export), push notification composer, cloud storage, admin settings, rewards & discounts, set reward, new campaign.

## Turning it into a native app

The app is a standard Vite web app, so you can wrap it with Capacitor to get Android and iOS builds:

```bash
npm i @capacitor/core @capacitor/cli @capacitor/android
npx cap init "Anbac Fit" com.anbac.fit --web-dir dist
npm run build && npx cap add android && npx cap open android
```

Backend calls (auth, orders, FitCoins) are currently simulated in `src/store.tsx`. To go live, replace them with your API or Firebase.
