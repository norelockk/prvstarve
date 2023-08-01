using System;

namespace client.Classes.Game.Objects
{
    public class DiscordRichPresence
    {
        private DiscordRichManager manager = new DiscordRichManager();

        public ulong clientId;

        public DiscordRichPresence()
        {
            clientId = manager.discordClientId;

            Console.WriteLine("got", clientId);
        }

        public void Update(string str)
        {
            if (manager is DiscordRichManager)
            {
                manager.Update(str);
            }
        }

        public void UpdateWithPlayers(int players, int max)
        {
            if (manager is DiscordRichManager)
            {
                manager.UpdateParty(players, max);
            }
        }
    }
}
