using CefSharp;

using System;
using System.IO;
using System.Reflection;

namespace client.Classes.Game
{
    public class GameResourceSchemeHandler : ResourceHandler
    {
        public override CefReturnValue ProcessRequestAsync(IRequest request, ICallback callback)
        {
            Uri u = new Uri(request.Url);
            String file = u.Authority + u.AbsolutePath;

            Assembly ass = Assembly.GetExecutingAssembly();
            String resourcePath = ass.GetName().Name + "." + file.Replace("/", ".");

            if (ass.GetManifestResourceStream(resourcePath) != null)
            {
                Stream = ass.GetManifestResourceStream(resourcePath);

                switch (Path.GetExtension(file))
                {
                    case ".html":
                        MimeType = "text/html";
                        break;
                    case ".js":
                        MimeType = "text/javascript";
                        break;
                    case ".png":
                        MimeType = "image/png";
                        break;
                    case ".jpg":
                    case ".jpeg":
                        MimeType = "image/jpeg";
                        break;
                    case ".gif":
                        MimeType = "image/gif";
                        break;
                    default:
                        MimeType = "application/octet-stream";
                        break;
                }

                callback.Continue();
                return CefReturnValue.Continue;
            }

            callback.Dispose();
            return CefReturnValue.Cancel;
        }
    }
}
