using client.Classes.Game;
using client.Classes.Game.Objects;

using CefSharp;
using CefSharp.WinForms;

using System;
using System.Diagnostics;
using System.Windows.Forms;
using System.Collections.Generic;

namespace client
{
    public partial class GameWindow : Form
    {
        private protected readonly string gameUrlPath = "game://game/index.html";
        private protected readonly string[] cefStrArgs =
        {
            "remote-allow-origins,*"
        };

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

                // Register custom browser protocol
                settings.RegisterScheme(new CefCustomScheme
                {
                    SchemeName = GameProtocol.SchemeName,
                    SchemeHandlerFactory = new GameProtocol()
                }); 

                Cef.Initialize(settings);

                // Setup custom objects
                repository.BindJavascriptObjects(chromium);

                // Setup 'browser' events
                chromium.IsBrowserInitializedChanged += OnGameReady;

                // Load a game by our scheme URL n' stuff
                chromium.LoadUrl(gameUrlPath);

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
