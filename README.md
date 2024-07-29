# Stytch Javascript SDK workbench
![sdk](https://user-images.githubusercontent.com/100632220/169575067-d9410b44-f10a-4ef3-af42-311817f4e595.png)
This is React app showing how the
[Stytch Javascript SDK](https://stytch.com/docs/sdks/javascript-sdk)
can be used to power authentication for your next project along with
Netlify's [functions](https://www.netlify.com/products/functions/)


## Running your own

1. Create an account at [Stytch](https://stytch.com).
2. You'll need to set three environment variables. All can be found in the
   [Stytch Dashboard](https://stytch.com/dashboard/api-keys). Create a `.env` file by copying `.env.template` in the root directory, and add the API keys from your Dashboard:
   ```
   cp .env.template .env
   ```
3. Add redirect URLs within the [Stytch Dashboard](https://stytch.com/dashboard/redirect-urls). Replace `$domain` with where the app will run- so `$domain/authenticate` could become `http://localhost:3000/authenticate`
   - `$domain/authenticate?type={}`
   - `$domain/workbench?type={}`
   - You'll want to register these as both `Login` and `Sign-up` URLs in the dashboard.
4. Finally, you'll need to [authorize the SDK](https://stytch.com/dashboard/sdk-configuration) to access your account information.

### Starting the demo locally

```bash
npm i
npm run build
npm run client
```

### Questions?

Feel free to reach out any time at support@stytch.com or in our [Slack](https://stytch.com/docs/resources/support/overview).
