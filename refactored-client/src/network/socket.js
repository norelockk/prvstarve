export default function GCCSocket() {
  // Magic secret key
  const secrets = [
    '9d0d52222fb0db0ea661c756f1c56e39',
    '9072b56081cfad5966a0d8052abfc42e',
    'fb2f5573344e036a02da636225b189af',
    '1fd8e8ca4709708e5473cf718b7fe8ff',
    '0304bb20667d850e368ac28bf5fcd8dc',
    '9c33965500bff6fee698fa1d3f862f4e',
    '1bb6ec76d1b1c1cb865e959f2ba35b80',
    'edbddcf7240a9aeacff9c331acc7a2a3',
    '73d9a41733d0edb816465d4b293919b0',
    '197aec4567749ee6e67a732b3b569c75',
    'e623ed33ee1c73fae8eb64a2d950d33c',
    '59240a02a84ddea8c0cc0ab5731cb874',
    'c449d52da354b9c428cf9359afcabc31',
    'd5183f8dfebb214bfd4853ae462c3650',
    'da40d2e694f51fa0ba09529a14ef5221',
    'f56dd11621fa1d94a9a2eede6339f012',
    'f22e4d42012a59fd3b89a895a0f884b1',
    '0ccdf5f07d55f8882199335e0a34c2eb',
    'ade4954cad0a75181dd92fc6c913efa5',
    'b5452b9774372cd2556c8e2fe5875ffa',
    '2fa700f47c52a843ca8ac03825f8eb58',
    'bdfc9fb6f14db87576c50cb26faed3ec',
    'f3ba071d70acdab8ff3b790d9e4e240a',
    '9bbe8a6f08e6103caa5960e8d6e8a2da',
    'e0f94e8fc4afd011ed113d136ff03e46',
    'f228d63570d72742a162b5cf530a63fc',
    'e348c3aeda8be9d43cb4287e0212e2d0',
    '5c5ebca171b7031a637ac5010f8d0b1f',
    '6e3c9009391c5f6f95cc4855c4cb7fb5',
    'fda81973f984d19729eb5eb70574163a'
  ];

  const Utils = {
    gOff: function (length, offsetNum) {
      const offsets = [];
      for (let i = 0; i < length; i++)
        offsets.push(i % offsetNum * 32);

      return offsets;
    }
  };

  return new Proxy(window.WebSocket, {
    construct(target, args) {
      const send = target.prototype.send;
      target.prototype.send = function(data) {
        const encrypted = [];

        const inputBytes = Uint8Array.from([...data].map((char) => char.charCodeAt(0)));
        const offsets = Utils.gOff(inputBytes.length, secrets.length);
    
        for (let i = 0; i < inputBytes.length; i++) {
          const byte = inputBytes[i];
          const keyIndex = (i + offsets[i % offsets.length]) % secrets.length;
          const keyChar = secrets[keyIndex].charAt(i % secrets[keyIndex].length);
          const key = keyChar.charCodeAt(0);
          const encryptedByte = byte ^ key;
          const xoredEncryptedByte = encryptedByte ^ key;
    
          encrypted.push(xoredEncryptedByte);
        }
    
        return send.apply(this, [new Uint16Array(encrypted)]);
      };

      // Call instance
      const instance = new target(...args);

      // Binary type
      instance.binaryType = "arraybuffer";

      // Return an WS instance
      return instance;
    }
  });
}