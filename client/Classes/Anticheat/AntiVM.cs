using System;
using System.Management;
using System.Runtime.InteropServices;
using System.ServiceProcess;
using System.Threading;

namespace client.Classes.Anticheat
{
    public class AntiVM
    {
        [DllImport("kernel32.dll", SetLastError = true)]
        private static extern IntPtr GetModuleHandleW(string lib);

        [DllImport("kernel32.dll", SetLastError = true)]
        private static extern IntPtr GetProcAddress(IntPtr ModuleHandle, string Function);

        private static bool IsSandboxiePresent()
        {
            if (GetModuleHandleW("SbieDll.dll").ToInt32() != 0)
                return true;
            return false;
        }

        private static bool IsComodoSandboxPresent()
        {
            if (GetModuleHandleW("cmdvrt32.dll").ToInt32() != 0)
                return true;
            return false;
        }

        private static bool IsQihoo360SandboxPresent()
        {
            if (GetModuleHandleW("SxIn.dll").ToInt32() != 0)
                return true;
            return false;
        }

        private static bool IsCuckooSandboxPresent()
        {
            if (GetModuleHandleW("cuckoomon.dll").ToInt32() != 0)
                return true;
            return false;
        }

        private static bool IsEmulationPresent()
        {
            long Tick = Environment.TickCount;
            Thread.Sleep(500);
            long Tick2 = Environment.TickCount;
            if (((Tick2 - Tick) < 500L))
            {
                return true;
            }
            return false;
        }

        private static bool IsWinePresent()
        {
            IntPtr ModuleHandle = GetModuleHandleW("kernel32.dll");
            if (GetProcAddress(ModuleHandle, "wine_get_unix_file_name").ToInt32() != 0)
                return true;
            return false;
        }

        private static bool IsVMPresent()
        {
            using (ManagementObjectSearcher ObjectSearcher = new ManagementObjectSearcher("Select * from Win32_ComputerSystem"))
            {
                using (ManagementObjectCollection ObjectItems = ObjectSearcher.Get())
                {
                    foreach (ManagementBaseObject Item in ObjectItems)
                    {
                        string ManufacturerString = Item["Manufacturer"].ToString().ToLower();
                        string ModelName = Item["Model"].ToString();
                        if ((ManufacturerString == "microsoft corporation" && ModelName.ToUpperInvariant().Contains("VIRTUAL") || ManufacturerString.Contains("vmware")))
                        {
                            return true;
                        }
                    }
                }
            }

            ServiceController[] GetServicesOnSystem = ServiceController.GetServices();
            foreach (ServiceController CompareServicesNames in GetServicesOnSystem)
            {
                string[] Services = { "vmbus", "VMBusHID", "hyperkbd" };
                foreach (string ServicesToCheck in Services)
                {
                    if (CompareServicesNames.ServiceName.Contains(ServicesToCheck))
                        return true;
                }
            }
            return false;
        }

        public static bool IsVM()
        {
            if (IsSandboxiePresent() || IsWinePresent() || IsComodoSandboxPresent() || IsCuckooSandboxPresent() || IsQihoo360SandboxPresent() || IsEmulationPresent() || IsVMPresent())
            {
                return true;
            }

            return false;
        }
    }
}
