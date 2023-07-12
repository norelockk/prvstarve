(function FRAMEWORK__BOOTSTRAP() {
  // garbage to make it harder to debug
  const _tD = "T";
  const _pA = "p";
  const _sA = "s";
  const _kA = "k";
  const _oC = "o";
  const _eeC = "e";
  const _eC = "e";
  const _mA = "m";
  const _dC = "d";
  const _dD = "D";
  const _aA = "a";
  const _aD = "A";
  const _aAD = "A";
  const _gA = "g";
  const _nC = "n";
  const _cC = "c";
  const _cA = "c";
  const _lD = "L";
  const _llD = "L";
  const _oD = "O";
  const _ooD = "O";
  const _iD = "I";
  const _pD = "P";
  const _ppD = "P";
  const _uD = "_";

  const fR = 'r';
  const fS = 's';
  const fW = 'w';
  const fM = 'm';
  const fA = 'a';
  const fV = 'v';
  const fI = 'i';
  const fT = 't';
  const fH = 'h';
  const fC = 'c';
  const fG = 'g';
  const fE = 'e';
  const fD = 'd';
  const fO = 'o';
  
  const emitFullWord = fE + fM + fI + fT;
  const encodeFullWord = _eC + _nC + _cC + _oC + _dC + _eeC;
  const msgpackFullWord = _mA + _sA + _gA + _pA + _aA + _cA + _kA;
  const restarveFullWord = fR + fE + fS + fT + fA + fR + fV + fE;
  const watchdogFullWord = fW + fA + fT + fC + fH + fD + fO + fG;
  const lolipopDataFullWord = _lD + _oD + _llD + _iD + _pD + _ooD + _ppD + _uD + _dD + _aD + _tD + _aAD;

  //----------------------------------------------------------------
  // Constants
  //----------------------------------------------------------------

  const SECRET = [
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

  const CHECKS = {
    'LOLIPOP_BUILD_HASH': 'eccbf20de'
  };

  //----------------------------------------------------------------
  // WebSocket messages encrypting
  //----------------------------------------------------------------

  /**
   * @function generateOffsets
   * @param length {number} length of array
   * @param numOffsets {number} number of offsets
   * @memberof pro.restarve.utils.encryption
   * @returns {Array.<number>}
   */
  const generateOffsets = (length, numOffsets) => {
    const offsets = [];

    for (let i = 0; i < length; i++)
      offsets.push(i % numOffsets);

    return offsets;
  };

  /**
   * @function encrypt
   * @param data {any} - data to encrypt
   * @memberof pro.restarve.utils.encryption
   * @returns {Uint16Array}
   */
  const encrypt = data => {
    const plain = JSON.stringify(data);
    const offsets = generateOffsets(plain.length, SECRET.length);
    const encrypted = [];
  
    for (let i = 0; i < plain.length; i++) {
      const charCode = plain.charCodeAt(i);

      const keyIndex = (i + offsets[i % offsets.length]) % SECRET.length;
      const keyChar = SECRET[keyIndex].charAt(i % SECRET[keyIndex].length);
      const key = keyChar.charCodeAt(0);
      
      encrypted.push(charCode ^ key);
    }
  
    return new Uint16Array(encrypted);
  };

  /**
   * @function ANTI_DEBUG
   * @description Prevents debug output
   */
  const ANTI_DEBUG = () => (eval('debugger'), setTimeout(ANTI_DEBUG));

  //----------------------------------------------------------------
  // WebSocket hooks implementation
  //----------------------------------------------------------------

  const INJECT_HOOKS = () => {
    // Existing non-hooked functions
    const wsSend = WebSocket.prototype.send;

    /**
     * @hook WebSocket.prototype.send
     * @param data {any} - data to send
     * @memberof pro.restarve.hooks.WebSocket
     * @description Hook for sending from normal standard data to an xor encrypted with random offsets
     */
    WebSocket.prototype.send = function(data) {
      let encrypted;
  
      if (msgpackFullWord in window) {
        try {
          encrypted = window[msgpackFullWord][encodeFullWord](encrypt(data));
        } catch (e) {
          throw null;
        }
      } else encrypted = encrypt(data);
  
      return wsSend.apply(this, [encrypted]);
    };
  };

  //----------------------------------------------------------------
  // Bootstrap (the one who decides to run)
  //----------------------------------------------------------------
  
  function bootstrap() {
    // Framework data verification
    if (lolipopDataFullWord in window) {
      for (const [ key, value ] of Object.entries(CHECKS)) {
        if (key in window[lolipopDataFullWord])  {
          const original = window[lolipopDataFullWord][key];
          console.log('original', original);
          console.log('supposed', CHECKS[key]);

          const vaild = typeof original === typeof value && original === value;  

          // If the original data isn't vaild
          // report to watchdog and let'em cook what he wants
          if (!vaild) {
            if (restarveFullWord in window) {
              const report = {
                vp: vaild,
                sz: '',
                ld: window[lolipopDataFullWord],
              };

              window[restarveFullWord][emitFullWord](watchdogFullWord, report);
            }
            
            throw 'framework verification error';
          }
        }
      }
    }

    // Apply framework functionalities
    ANTI_DEBUG();
    INJECT_HOOKS();
  }

  bootstrap();
})();