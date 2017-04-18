var aes256 = require('../lib/aes256.js');

var minimist = require('minimist');
var fs = require('fs');
var readline = require('readline');

var argv = minimist(process.argv.slice(2), {
    alias: { f: 'filePath'}
});

var input_filePath = argv.filePath;
var result_filePath = input_filePath + '.result';

var result_file = fs.createWriteStream(result_filePath, 'utf-8',{flags: 'w'});

var lineReader = readline.createInterface({
    input: fs.createReadStream(input_filePath)
});

lineReader.on('line', function (line) {
    var columns = line.split('\t');

    var service_id = columns[0];
    var service_name = columns[1];
    var service_contact = columns[2]

    var cipher_contact = service_contact;

    if (service_contact && service_contact != 'NULL') {
        var contact = JSON.parse(service_contact)

        var name = contact.name || '';
        var phone = contact.phone || '';
        var email = contact.email || '';

        var cipher_contact = {
            name : aes256.cipher(name)
            , phone : aes256.cipher(phone)
            , email : aes256.cipher(email)
        };

        cipher_contact = JSON.stringify(cipher_contact);

        console.log("name =" + name + ", phone=" + phone + ", email=" + email + "=> " + cipher_contact);
        console.log("name =" + aes256.decipher(cipher_contact.name) + ", phone=" + aes256.decipher(cipher_contact.phone) + ", email=" + aes256.decipher(cipher_contact.email));
    }

    result_file.write(service_id + '\t' + service_name +  '\t' + service_contact + '\t' + cipher_contact + "\r\n");
});

lineReader.on('close', function() {
    result_file.end(function() {
        console.log("GOOD LUCK!!!");
    });
});
