using client.Classes.Game;
using client.Classes.Game.Objects;

using CefSharp;
using CefSharp.WinForms;

using System;
using System.Collections.Generic;
using System.Windows.Forms;

namespace client
{
    public partial class GameWindow : Form
    {
        // Setup CEF stuff

        // Setup JS repo objects
        private AdvancedJavascriptObjectRepository repository = new AdvancedJavascriptObjectRepository();
        private Dictionary<string, object> objects = new Dictionary<string, object>
        {
            { "discord", new DiscordRichPresence() }
        };

        // Setup browser & settings
        private CefSettings settings = new CefSettings()
        {
            WindowlessRenderingEnabled = true
        };
        private ChromiumWebBrowser chromium = new ChromiumWebBrowser();

        // Settings in args, like remote origins n' stuff
        private string[] cefStrArgs =
        {
            "remote-allow-origins,*"
        };

        public GameWindow()
        {
            // Initialize base
            InitializeComponent();

            // Initialize game
            InitializeGame();
        }

        private void InitializeGame()
        {
            // Register all of objects defined to later use it in repo manager
            repository.RegisterObjects(objects);

            // Initializing Chromium
            if (chromium is ChromiumWebBrowser)
            {
                // Initialize our settings for CEF
                for (int i = 0; i < cefStrArgs.Length; i++)
                {
                    string[] setting = cefStrArgs[i].Split(',');

                    settings.CefCommandLineArgs.Add(setting[0], setting[1]);
                }
                Cef.Initialize(settings);

                // Setup custom objects
                repository.BindJavascriptObjects(chromium);

                // Setup 'browser' events
                chromium.IsBrowserInitializedChanged += OnGameReady;

                // Load a game by our scheme URL n' stuff
                chromium.LoadUrl("https://www.google.com/");

                // Set 'browser' visible in window
                chromium.Dock = DockStyle.Fill;
                Controls.Add(chromium);
            }
        }

        private void OnGameReady(object sender, EventArgs args)
        {
            if (chromium is ChromiumWebBrowser && chromium.IsBrowserInitialized)
            {
                // Show dev tools
                #if DEBUG
                    chromium.ShowDevTools();
                #endif
            }
        }
    }
}
