# SDK demo app

This is React app showing how the
[Stytch Javascript SDK](https://stytch.com/docs/sdks/javascript-sdk)
can be used to power authentication for your next project along with
Netlify's [functions](https://www.netlify.com/products/functions/)

## Running your own

1. Create an account at [Stytch](https://stytch.com).
2. You'll need to set three environment variables. All can be found in the
   [Stytch Dashboard](https://stytch.com/dashboard/api-keys).
   Add them to your `.env` file.
   - `REACT_APP_STYTCH_PUBLIC_TOKEN`
   - `STYTCH_PROJECT_ID`
   - `STYTCH_PROJECT_SECRET`
3. You'll need to add a few [redirect URLs](https://stytch.com/dashboard/redirect-urls). Replace `$domain` with where the app will run- so `$domain/authenticate` could become `http://localhost:3000/authenticate`
   - `$domain/authenticate?type={}`
   - `$domain/workbench?type={}`
   - You'll want to register these as both `Login` and `Sign-up` URLs in the dashboard.
4. Finally, you'll need to [authorize the SDK](https://stytch.com/dashboard/sdk-configuration) to access your account information.
   Add your `$domain` from before, and enable each product you plan on using.

### Starting the demo locally

```bash
npm i
npm run start
```

### Deploying on Netlify

TODO


### Support

Feel free to reach out any time at support@stytch.com