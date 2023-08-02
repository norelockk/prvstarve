using System;
using System.Threading;
using System.Windows.Forms;

using client.Classes.Anticheat;

namespace client
{
    internal static class Program
    {
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

            HandleAnticheat();
        }

        private static void HandleAnticheat()
        {
            // Anti debug
            if (AntiDebug.CloseHandleAntiDebug() || AntiDebug.RemoteDebuggerCheckAntiDebug())
            {
                Environment.Exit(0);
            }

            // Anti VM
            if (AntiVM.IsVM())
            {
                MessageBox.Show("Game does not support virtualization", "Virtual environment detected", MessageBoxButtons.OK, MessageBoxIcon.Exclamation);
                Environment.Exit(0);
            }
        }

        [STAThread]
        static void Main()
        {
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);
            Application.Run(new GameWindow());

            StartAnticheat();
        }
    }
}
