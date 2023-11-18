function decryptVigenere(ciphertext, key) {
  const turkish_alphabet = 'abcçdefgğhıijklmnoöprsştuüvyz'; // Turkish alphabet

  let decryptedText = '';
  let keyIndex = 0;

  for (let i = 0; i < ciphertext.length; i++) {
      let cipherChar = ciphertext.charAt(i).toLowerCase();
      let keyChar = key.charAt(keyIndex).toLowerCase();

      if (turkish_alphabet.includes(cipherChar)) {
          let decryptedCharIndex = (turkish_alphabet.indexOf(cipherChar) - turkish_alphabet.indexOf(keyChar) + turkish_alphabet.length) % turkish_alphabet.length;
          decryptedText += turkish_alphabet[decryptedCharIndex];

          keyIndex = (keyIndex + 1) % key.length;
      }
  }

  return decryptedText;
}

function calculateFrequency(text) {
  const turkish_letter_frequencies = {'a': 0.115, 'b': 0.027, 'c': 0.057, 'ç': 0.028, 'd': 0.052, 'e': 0.127, 'f': 0.006, 'g': 0.023, 'ğ': 0.016,
  'h': 0.012, 'ı': 0.093, 'i': 0.101, 'j': 0.002, 'k': 0.056, 'l': 0.070, 'm': 0.031, 'n': 0.066, 'o': 0.092,
  'ö': 0.028, 'p': 0.016, 'r': 0.068, 's': 0.066, 'ş': 0.025, 't': 0.091, 'u': 0.039, 'ü': 0.023, 'v': 0.010,
  'y': 0.034, 'z': 0.018};

  const frequency = {};
  const totalChars = text.length;

  for (let char of text.toLowerCase()) {
      if (turkish_letter_frequencies[char]) {
          frequency[char] = (frequency[char] || 0) + 1;
      }
  }

  for (let char in frequency) {
      frequency[char] = frequency[char] / totalChars;
  }

  return frequency;
}

function kasiskiTest(ciphertext) {
  const MIN_KEY_LENGTH = 3; // Min key length to search for
  const MAX_KEY_LENGTH = 20; // Max key length to search for

  let distances = [];

  for (let keyLength = MIN_KEY_LENGTH; keyLength <= MAX_KEY_LENGTH; keyLength++) {
      let repeatedSequences = {};

      // Find repeated sequences of length keyLength in the ciphertext
      for (let i = 0; i < ciphertext.length - keyLength; i++) {
          let sequence = ciphertext.substr(i, keyLength);
          if (repeatedSequences[sequence]) {
              repeatedSequences[sequence].push(i);
          } else {
              repeatedSequences[sequence] = [i];
          }
      }

      // Calculate the distances between repeated sequences
      let sequenceDistances = [];
      for (let sequence in repeatedSequences) {
          if (repeatedSequences[sequence].length > 1) {
              let distances = [];
              for (let i = 1; i < repeatedSequences[sequence].length; i++) {
                  distances.push(repeatedSequences[sequence][i] - repeatedSequences[sequence][i - 1]);
              }
              sequenceDistances = sequenceDistances.concat(distances);
          }
      }

      // Store the average distance for the current key length
      let averageDistance = sequenceDistances.reduce((acc, val) => acc + val, 0) / sequenceDistances.length;
      distances.push({ keyLength: keyLength, distance: averageDistance });
  }

  // Sort the distances array based on the average distances
  distances.sort((a, b) => a.distance - b.distance);

  // Return the estimated key length
  return distances[0].keyLength;
}

function guessKeyAndDecrypt(ciphertext) {
  const turkish_alphabet = 'abcçdefgğhıijklmnoöprsştuüvyz'; 
  const keyLength = kasiskiTest(ciphertext);

  // Anahtar tahminini yapmak için, her bir grup içindeki harf frekansları hesaplanır.
  let key = '';
  for (let i = 0; i < keyLength; i++) {
      let group = '';
      for (let j = i; j < ciphertext.length; j += keyLength) {
          let char = ciphertext.charAt(j).toLowerCase();
          if (turkish_alphabet.includes(char)) {
              group += char;
          }
      }

      // Grup içindeki harf frekansları hesaplanır
      const groupFrequency = calculateFrequency(group);

      // Türk alfabesinin frekansları içinde en yüksek olan harfi anahtar olarak kabul eder
      const mostFrequentChar = Object.keys(groupFrequency).reduce((a, b) => groupFrequency[a] > groupFrequency[b] ? a : b);
      key += mostFrequentChar;
  }

  // Anahtar tahmin edildikten sonra şifreli metin çözülür
  const decryptedText = decryptVigenere(ciphertext, key);

  return { key, decryptedText };
}

// Örnek Kullanım:
const ciphertext = "zngpımnpgnegşccvcyczvçosnföojepivfbbnşunküoznşarnrojoinbeojekgşccvcyczvçoonrhtgapüfteasşyıjnpeıjşşüapöbgşfivröşşrynkidrüşşrcrfnvccvvcaığmojpçporpsynghsivrymsvfevpolngğihkjnacryifenpnaeıjşküüunpeıleoirvuaühçcghpovküsuğiunğiscöşşvrösmifneufuühhftılşaenscfkzccsrujzöücvaliığkoeeşzvrzniveejsdeeşşveneeiyığşzoıgzıüüğoopneçiengufgpscfjebşülnjjuebgmicpezrrüsugmpnybeeğlfzmğjoejçilbscdidnfüighçcisnfnğüöizarskşdüpvçfanieifıfjoejççföejğisnfşzcrezşmpscnghsltdnpşığssenercddrüsenşmönciımuigfçükcvshfirorighççrüüçhilnleoinfvijnsvftpsysrömiıbübseeeznrcygnplıhüfgejizlmjvfoııpvüzçvfezpiübvcyndafüfgejipjeğidccvmiopvepmünvrrücşrünljoipçpocğçyıüfçükcvshfirorighççrckçirrscyıröocijıfmcpıpmisnfşsjıfhfömğüfiçsbsrööngmefişueeşfdeünscöznrcygnrüüvhugcvcsüöşarnroyıckvcugıgüorrskngmmnzdnfnafıeeiunjyolıfşpengnemsönvfıeğisnfşsubğhfjmğmfjtrçfanşştersucpıjnodngiıuıünpbvskfhdverüsvjoeıtnpğpsymühvorüüvfrrygiprhcyfstfgsnroıgcpzşyrçscgcpçvrüüçyoglvviglvcpğsnçböpshfdmğmfgnföoeığvidzvmoipççfgvvpolngşscdünpchçpiifçcmühvoıüjçcokngkognmnrcöfşgcpzşyrçscsnlvyıcvfnvcçveokzçcsüömşvsasvftpsmiivggjiıüiabsüikcüçdofgçüodnlüilrvhugımşscçıyilngzvyeğşervpzşcybfpmönnpğshvooıçdilnaşkcfççtjçsüıüüküiifnübgrsuarhccgmzvviepvcoeışarnrünşfırfşğpsygcpzşyrçscsnlvyıcvfnvcnlivrrsudüüçyidığmocyfnvcsçubieşşrügvufezpiübçsçfanizrfeeefumjüfiıaşacrıpvüzçvıüöçriuıyşscdpirgmrkfcyscföeğmiznfidgmrisrsüioköncfsnfnşsnföojepivfbbnşunkşdüzçdacügnpkıeüoghvçrğjsyrrygszlmjivyıöndüsçüodnğzçrvpzşdbfecibğgşlıeyteşdşjcügirrücyırcvutsnefvmpndrrücyırçvcrüygnycnuşşcpeizrrsyngbğşçüükşaüşfvfjmynrjıynycçfnarvscrrssyrcvsyyfbyciuemssbdksşbiıpvüstşrüüçyogfçeoirveippvcognüzliaüişjeğidcfsufgpcpnlıeytynjşzcrönanfçefdfçciövvükcüçdofgçüodujzöüzvurcifnvcfçlofnğmirpscfdçnufimüipclvmivpvciötğnrcöpgvnzoüsüömnıcüpgpjıeüojeğçiznmşscsünmühvoofnrivyıöndüsçüodzvaşuıjzrrsscfkzccsrgcğirpsynghsfefeğnrürsyrrüüzplşjiüişzcffmgseuebnıüiçvopnknıcssvodefişbsüigcpçvyüpönaüöğzrğoçuküpçdsüpvcoötğüighçcisnfnşyıfnğükvzıröfişfmljoengiırrfivbçveokzçcsüömşvyışıilıeyodbğşçüükşaüvçöanfçükcvshfirorighççrckçjuebggpbvsöitrçdogıeivkmğöignlşsdeğüfimşşrcrknrvesüoöımüiinşizrücüfimgnemsfivbçfihrkchfdefidrsöntgepaşoıjvirhcyfmrneçrhvmigfçcgcpzşyrçscsnlvyıcvfşlcfıücfbbircsvöierçdacüşadeışşvstfgsnsmgvdnpnğmrbfvcçveogıkileepiğrkcivlmünlüüfnvrümivröünçrrvmişıeeoi";
const result = guessKeyAndDecrypt(ciphertext);
console.log("Guessed Key:", result.key);
console.log("Decrypted Text:", result.decryptedText);
