using DiscordRPC;
using DiscordRPC.Message;
using System;

namespace client.Classes.Game
{
    public class DiscordRichManager
    {
        public ulong discordClientId;
        private readonly string Identifier = "1117724387215429632";

        private DiscordRpcClient client;
        private RichPresence presence = new RichPresence()
        {
            Assets = new Assets()
            {
                LargeImageKey = "hello",
            },
            Timestamps = new Timestamps()
            {
                Start = DateTime.UtcNow
            },
            State = "Loading",
            Details = "Starting the game"
        };

        public DiscordRichManager()
        {
            client = new DiscordRpcClient(Identifier);

            Initialize();
        }

        private void OnRPCReady(object sender, ReadyMessage e)
        {
            discordClientId = e.User.ID;
            Console.WriteLine($"RPC user ready: {e.User.Username}, {e.User.ID}");
        }

        private void Initialize()
        {
            if (client is DiscordRpcClient)
            {
                // Initialize RPC
                client.Initialize();

                if (client.IsInitialized)
                {
                    // Setup events
                    client.OnReady += OnRPCReady;

                    // Set default RPC data
                    client.SetPresence(presence);
                }
            }
        }

        public void Update(string str)
        {
            string[] strParams = str.Split(',');
            if (strParams.Length > 2)
            {
                throw new ArgumentException($"Excepted to be only 2 strings, got ${strParams.Length - 2} more useless strings");
            }

            if (client is DiscordRpcClient)
            {
                presence.Details = strParams[0];

                if (strParams.Length > 1)
                {
                    presence.State = strParams[1];
                }

                client.SetPresence(presence);
            }
        }

        public void UpdateParty(int players, int maxPlayers)
        {
            if (client is DiscordRpcClient)
            {
                if (client.CurrentPresence.Party is Party)
                {
                    Party party = new Party()
                    {
                        ID = Secrets.CreateFriendlySecret(new Random()),
                        Max = maxPlayers,
                        Size = players
                    };

                    presence.Party = party;
                } else
                {
                    presence.Party = new Party()
                    {
                        ID = Secrets.CreateFriendlySecret(new Random()),
                        Max = maxPlayers,
                        Size = players
                    };
                }

                client.SetPresence(presence);
            }
        }
    }
}