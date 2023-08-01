using System;
using System.Collections.Generic;
using CefSharp;

namespace client.Classes.Game
{
    public class NamedObjectInfo
    {
        public string Name { get; set; }
        public object Object { get; set; }
    }

    public class AdvancedJavascriptObjectRepository
    {
        private readonly List<NamedObjectInfo> namedObjects;

        public AdvancedJavascriptObjectRepository()
        {
            namedObjects = new List<NamedObjectInfo>();
        }

        public void Register(string name, object obj)
        {
            if (string.IsNullOrWhiteSpace(name))
                throw new ArgumentException("Name must not be empty or null.", nameof(name));

            if (obj == null)
                throw new ArgumentNullException(nameof(obj));

            var existingObject = namedObjects.Find(x => x.Name == name);
            if (existingObject != null)
                throw new ArgumentException($"An object with the name '{name}' is already registered.");

            namedObjects.Add(new NamedObjectInfo { Name = name, Object = obj });
        }

        public void Deregister(string name)
        {
            if (string.IsNullOrWhiteSpace(name))
                throw new ArgumentException("Name must not be empty or null.", nameof(name));

            var existingObject = namedObjects.Find(x => x.Name == name);
            if (existingObject != null)
                namedObjects.Remove(existingObject);
        }

        public object ExecuteMethod(string name, string methodName, object[] parameters)
        {
            if (string.IsNullOrWhiteSpace(name))
                throw new ArgumentException("Name must not be empty or null.", nameof(name));

            var objInfo = namedObjects.Find(x => x.Name == name);
            if (objInfo == null)
                throw new ArgumentException($"Object with the name '{name}' is not registered.");

            var obj = objInfo.Object;
            if (obj == null)
                throw new ArgumentException($"Object with the name '{name}' is null.");

            var method = obj.GetType().GetMethod(methodName);
            if (method == null)
                throw new ArgumentException($"Method '{methodName}' not found in object with name '{name}'.");

            return method.Invoke(obj, parameters);
        }

        public void BindJavascriptObjects(IWebBrowser browser)
        {
            foreach (var objInfo in namedObjects)
            {
                browser.JavascriptObjectRepository.Register(objInfo.Name, objInfo.Object, isAsync: false, options: BindingOptions.DefaultBinder);
            }
        }

        // Helper method to register a list of objects with names
        public void RegisterObjects(Dictionary<string, object> objects)
        {
            foreach (var item in objects)
            {
                Register(item.Key, item.Value);
            }
        }
    }
}