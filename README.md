# Stytch Javascript SDK workbench
![sdk](https://user-images.githubusercontent.com/100632220/169575067-d9410b44-f10a-4ef3-af42-311817f4e595.png)
This is React app showing how the
[Stytch Javascript SDK](https://stytch.com/docs/sdks/javascript-sdk)
can be used to power authentication for your next project along with
Netlify's [functions](https://www.netlify.com/products/functions/)


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
