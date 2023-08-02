using CefSharp;

namespace client.Classes.Game
{
    public class GameProtocol : ISchemeHandlerFactory
    {
        public const string SchemeName = "game";

        public IResourceHandler Create(IBrowser browser, IFrame frame, string schemeName, IRequest request)
        {
            return new GameResourceSchemeHandler();
        }
    }
}
