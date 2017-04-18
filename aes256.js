(function() {
  var cipher, cipher_key, crypto, decipher;

  crypto = require('crypto');

  cipher_key = "%r1Ef9456D";

  cipher = function(txt) {
    var c, crypted;
    c = crypto.createCipher('aes-256-cbc', cipher_key);
    crypted = c.update(txt, 'utf8', 'hex');
    crypted += c.final('hex');
    return crypted;
  };

  decipher = function(crypted) {
    var d, e, txt;
    d = crypto.createDecipher('aes-256-cbc', cipher_key);
    try {
      txt = d.update(crypted, 'hex', 'utf8');
      txt += d.final('utf8');
    } catch (error) {
      e = error;
      txt = null;
    }
    return txt;
  };

  module.exports = {
    cipher: cipher,
    decipher: decipher
  };

}).call(this);
