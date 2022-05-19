# Stytch Javascript SDK workbench

This is React app showing how the
[Stytch Javascript SDK](https://stytch.com/docs/sdks/javascript-sdk)
can be used to power authentication for your next project along with
Netlify's [functions](https://www.netlify.com/products/functions/)

<img width="1728" alt="workbench" src="https://user-images.githubusercontent.com/104386276/169409251-f70b468f-21c9-494e-a723-5055621f1d21.png">


## Running your own

1. Create an account at [Stytch](https://stytch.com).
2. You'll need to set three environment variables. All can be found in the
   [Stytch Dashboard](https://stytch.com/dashboard/api-keys).
   Create a `.env` file in the project root directory, and add them as shown .
   - `REACT_APP_STYTCH_PUBLIC_TOKEN`
   - `STYTCH_PROJECT_ID`
   - `STYTCH_PROJECT_SECRET`
3. Add redirect URLs within the [Stytch Dashboard](https://stytch.com/dashboard/redirect-urls). Replace `$domain` with where the app will run- so `$domain/authenticate` could become `http://localhost:3000/authenticate`
   - `$domain/authenticate?type={}`
   - `$domain/workbench?type={}`
   - You'll want to register these as both `Login` and `Sign-up` URLs in the dashboard.
4. Finally, you'll need to [authorize the SDK](https://stytch.com/dashboard/sdk-configuration) to access your account information.
   Add your `$domain` from before, and enable the Email magic links and Manage user data products.

### Starting the demo locally

```bash
npm i
npm run start
```

### Questions?

Feel free to reach out any time at support@stytch.com or in our [Slack](https://join.slack.com/t/stytch/shared_invite/zt-nil4wo92-jApJ9Cl32cJbEd9esKkvyg)
