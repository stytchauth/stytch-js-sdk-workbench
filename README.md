# SDK Demo App

This is a full-stack app in React and Express showing how the
[Stytch Javascript SDK](https://stytch.com/docs/sdks/javascript-sdk)
can be used to power authentication for your next project.

## Running your own

1. Create an account at [Stytch](https://stytch.com)
2. You'll need to set three environment variables. All can be found in the 
   [Stytch Dashboard](https://stytch.com/dashboard/api-keys). 
   If you're using Glitch, add them to your `.env` file template.
   - `REACT_APP_STYTCH_PUBLIC_TOKEN`
   - `STYTCH_PROJECT_ID`
   - `STYTCH_PROJECT_SECRET`
3. You'll need to add a few [redirect URLs](https://stytch.com/dashboard/redirect-urls). Replace `$domain` with where the app will run- so `$domain/authenticate` could become `http://localhost:3000/authenticate`
   - `$domain/authenticate?type={}`
   - `$domain/workbench?type={}`
   - You'll want to register these as both `Login` and `Sign-up` URLs in the dashboard.
4. Finall   

### Starting the demo locally
```bash
npm i
REACT_APP_STYTCH_PUBLIC_TOKEN=... STYTCH_PROJECT_ID=... STYTCH_PROJECT_SECRET=... npm start
```
