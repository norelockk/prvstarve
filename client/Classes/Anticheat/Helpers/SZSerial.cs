using System.Text;
using System.Management;
using System.Security.Cryptography;

namespace client.Classes.Anticheat.Helpers
{
    public class SZSerial
    {
        private protected static readonly string Hash = "AloxxISReallySlave_HE_SOLD_HIMSELF";

        private protected static string CreateHash(string ToHash)
        {
            byte[] KeyToHashWith = Encoding.ASCII.GetBytes(Hash);
            HMACSHA256 SHA256Hashing = new HMACSHA256();
            SHA256Hashing.Key = KeyToHashWith;

            var TheHash = SHA256Hashing.ComputeHash(Encoding.UTF8.GetBytes(ToHash));
            StringBuilder builder = new StringBuilder();

            for (int i = 0; i < TheHash.Length; i++)
            {
                builder.Append(TheHash[i].ToString("x2"));
            }

            string FinalHash = builder.ToString();
            return FinalHash;
        }

        public static string GetHardwareID()
        {
            string CPUID = null;
            string GPUID = null;

            ManagementObjectSearcher CPU = new ManagementObjectSearcher("SELECT * FROM Win32_Processor");
            ManagementObjectCollection GetCPU = CPU.Get();
            foreach (ManagementObject CPUId in GetCPU)
            {
                CPUID = CPUId["ProcessorType"].ToString() + CPUId["ProcessorId"].ToString();
            }

            ManagementObjectSearcher BIOS = new ManagementObjectSearcher("SELECT * FROM Win32_BIOS");
            ManagementObjectCollection GetBIOS = BIOS.Get();
            foreach (ManagementObject BIOSId in GetBIOS)
            {
                GPUID = BIOSId["Manufacturer"].ToString() + BIOSId["Version"].ToString();
            }

            return CreateHash(CPUID + GPUID);
        }
    }
}
