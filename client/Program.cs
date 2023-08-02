using System;
using System.Threading;
using System.Windows.Forms;

using client.Classes.Anticheat;

namespace client
{
    internal static class Program
    {
        static Mutex mutex;
        static int instanceCount = 0;
        static Guid uuid = Guid.NewGuid();
        static DateTime now = DateTime.UtcNow;

        const int allowedMaxInstances = 3;
        const string identifier = "pro.restarve.client";

        private static void AntiDllInjectionThread()
        {
            AntiCheat.LockDownLibraryLoading_Aggressive(true);
            AntiDebug.ActiveAntiDebuggingProtection();
        }

        private static void StartAnticheat()
        {
            Thread DllInjectionPreventionThread = new Thread(new ThreadStart(AntiDllInjectionThread));
            DllInjectionPreventionThread.Start();

            AntiDebug.AntiDebuggerAttach();
            AntiDebug.HideThreadsFromDebugger();

            PreHandleAnticheat();
        }

        private static void PreHandleAnticheat()
        {
            if (AntiDebug.CloseHandleAntiDebug() || AntiDebug.RemoteDebuggerCheckAntiDebug() || AntiVM.IsVM())
            {
                Environment.Exit(0);
                return;
            }
        }

        public static bool IncrementInstanceCount()
        {
            lock (mutex)
            {
                if (instanceCount >= allowedMaxInstances)
                    return false;

                instanceCount++;
                return true;
            }
        }

        public static void DecrementInstanceCount()
        {
            lock (mutex)
            {
                if (instanceCount > 0)
                    instanceCount--;
            }
        }

        [STAThread]
        static void Main()
        {
            bool created;
            mutex = new Mutex(true, identifier, out created);

            if (!created)
            {
               MessageBox.Show("Another instance of the game is already running.", "Game error", MessageBoxButtons.OK, MessageBoxIcon.Error); ;
               return;
            }

            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);
            Application.Run(new GameWindow());

            StartAnticheat();
            mutex.ReleaseMutex();
        }
    }
}
