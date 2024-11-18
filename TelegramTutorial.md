# Setting Up Telegram Web App Integration

## 1. Create a Telegram Bot

1. Open Telegram and search for [@BotFather](https://t.me/BotFather)
2. Start a chat and use the `/newbot` command
3. Follow the prompts to:
   - Set a name for your bot
   - Choose a username (must end in 'bot')
4. Save the HTTP API token provided - you'll need this later

## 2. Configure Web App Settings

1. Return to @BotFather
2. Use `/mybots` command
3. Select your bot
4. Choose "Bot Settings" > "Web App Settings"
5. Send the URL where your app will be hosted
   - For development: Use your local development URL
   - For production: Use your deployed URL

## 3. Set Up Menu Button

1. In @BotFather, select "Menu Button"
2. Choose "Configure Menu Button"
3. Send your Web App URL
4. Set button text (e.g., "Open App")

## 4. Implementation Details

The current implementation already includes:

- `@twa-dev/sdk` for Telegram Web App integration
- Automatic user authentication via `useTelegramUser` hook
- Referral system integration
- Seamless data passing between Telegram and the app

## 5. Testing Your Web App

1. Open your bot in Telegram
2. Click the Menu Button
3. The app should open with automatic authentication
4. User data will be available through `WebApp.initDataUnsafe.user`

## 6. Security Considerations

- Always validate Telegram Web App initialization data
- Use HTTPS for production
- Never expose your bot token in client-side code
- Implement rate limiting for referral system

## 7. Features Available

The current implementation provides:

- Automatic user authentication
- User profile data access
- Referral system with unique codes
- Share functionality via Telegram
- Native Telegram UI integration

## 8. Troubleshooting

Common issues and solutions:

1. Web App not opening:
   - Verify URL in BotFather settings
   - Ensure HTTPS in production

2. User data not available:
   - Check if app is opened within Telegram
   - Verify WebApp initialization

3. Share not working:
   - Confirm bot has proper permissions
   - Check inline query settings in BotFather

## 9. Best Practices

1. Always handle cases where:
   - App is opened outside Telegram
   - User data is not available
   - Network errors occur

2. Use Telegram UI components when available
3. Follow Telegram design guidelines
4. Implement proper error handling

## 10. Additional Resources

- [Telegram Bot API Documentation](https://core.telegram.org/bots/api)
- [Telegram Web App Documentation](https://core.telegram.org/bots/webapps)
- [@twa-dev/sdk Documentation](https://github.com/twa-dev/sdk)