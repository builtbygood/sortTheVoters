$(function() {
  const houseVoters = $.merge(houseList, previousHouseList);
  const senateVoters = $.merge(senateList, previousSenateList);
  let voters;
  let houseResult;
  let senateResult;
  let output;

  $('#submitBtn').on('click', function() {
    houseVotes();
    senateVotes();

    const houseCount = houseResult.split(/(<\/b>)/).length - 1;
    const senateCount = senateResult.split(/(<\/b>)/).length - 1;

    if (houseCount > senateCount) {
      $('#count-results').html(houseResult);
    } else {
      $('#count-results').html(senateResult);
    }
  });

  function houseVotes() {
    voters = [];

    $.each(houseVoters, function(index, val) {
      voters.push(val);
    });

    sortVotes();
    houseResult = output;
  }

  function senateVotes() {
    voters = [];

    $.each(senateVoters, function(index, val) {
      voters.push(val);
    });

    sortVotes();
    senateResult = output;
  }

  function sortVotes() {
    var input = $('#voters')
      .val()
      .replace(/,|--|\.|(\r\n|\n|\r)/g, ' ');
    var input = input.replace(/\s[(]/g, '(');
    var input = input.replace(/\s[A-Z]\s/g, '');
    var input = input.replace(/Mr\s/g, 'Mr.');
    var input = input.replace(/Mr\.\s/g, 'Mr.');

    const SUFFIXES = ['Sr.', 'Jr.', 'II', 'III', 'IV'];

    let input_array = input.split(' ');

    for (let i = 0; i < input_array.length; i++) {
      if (SUFFIXES.indexOf(input_array[i]) !== -1) {
        input_array[i - 1] = `${input_array[i - 1]} ${input_array[i]}`;
        input_array.splice(i, 1);
      }
    }

    $.each(voters, function(i, vals) {
      $.each(input_array, function(j, Val) {
        if (input_array[j].indexOf('(') > 0) {
          if (Val.match(vals.District) && Val.match(vals.Last)) {
            if (vals.Party == 'R') {
              input_array[j] = `<b style='color:red;'>${Val},` + `</b>`;
            } else {
              input_array[j] = `<b style='color:blue;'>${Val},` + `</b>`;
            }
          }
        } else if (Val == vals.Last) {
          if (vals.Party == 'R') {
            input_array[j] = `<b style='color:red;'>${Val},` + `</b>`;
          } else {
            input_array[j] = `<b style='color:blue;'>${Val},` + `</b>`;
          }
        }
      });
    });

    (output = input_array.join(' ')),
      (output = output.replace(/[(]/g, ' (')),
      (output = output.replace(/Mr\./g, 'Mr. ')),
      (output = output.replace(/Yeas/g, '<br><br> <b>Yeas:</b> <br>')),
      (output = output.replace(/Nays/g, '<br><br> <b>Nays:</b> <br>')),
      (output = output.replace(/Absent/g, '<br><br> <b>Absent</b>')),
      (output = output.replace(/DISCLAIMER/g, '<br><br> <b>DISCLAIMER</b>'));
  }
});
