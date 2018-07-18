const bodyParser = require('body-parser');
const express = require('express');
const http = require('http')
const path = require('path');
const convert = require('xml-js');

const app = express();
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/dist/index.html'));
});

const port = process.env.PORT || 3000;
app.set('port', port);

const server = http.createServer(app);
server.listen(port, () => console.log('running'));

let numOfUsers;
let numOfFemales;
let numOfMales;
let firstNames;
let lastNames;
let popInState;
let sortedPopInState;
let femalesInState;
let malesInState;
let ageRange;

app.route('/api/userStats').post((req, res) => {
  if(!req.is('application/json')) {
    res.status(400).send("JSON object is required");
  } else {
    const returnType = processReturnType(req.get('Accept'));
    const output = processJson(req.body, returnType);

    if(returnType === 'text') {
      res.set('Content-Disposition', 'attachment; filename=output.txt');
      res.set('Content-type', 'text/plain');
    } else if(returnType === 'xml') {
      res.set('Content-Type', 'text/xml');
    }


    res.status(200).send(output);
  }
});

function processJson(body, returnType) {
  numOfUsers = 0;
  numOfFemales = 0;
  numOfMales = 0;
  firstNames = {AtoM: 0, NtoZ: 0};
  lastNames = {AtoM: 0, NtoZ: 0};
  popInState = {};
  sortedPopInState;
  femalesInState = {};
  malesInState = {};
  ageRange = [0, 0, 0, 0, 0, 0];
  const results = body.results;

  for(let i in results) {
    const gender = results[i].gender;
    const firstName = results[i].name.first;
    const lastName = results[i].name.last;
    const state = results[i].location.state;
    const age = parseInt(results[i].dob.age);

    numOfUsers++;

    firstName.charAt(0) >= 'a' && firstName.charAt(0) <= 'm' ? firstNames.AtoM++ : firstNames.NtoZ++;
    lastName.charAt(0) >= 'a' && lastName.charAt(0) <= 'm' ? lastNames.AtoM++ : lastNames.NtoZ++;

    popInState[state] == null ? popInState[state] = 1 : popInState[state]++;
    sortedPopInState = sortProperties(popInState);

    if(gender === 'female') {
      numOfFemales++;
      femalesInState[state] == null ? femalesInState[state] = 1 : femalesInState[state]++;

    } else {
      numOfMales++;
      malesInState[state] == null ? malesInState[state] = 1 : malesInState[state]++;
    }

    if(age >= 0 && age <= 20) {
      ageRange[0]++;
    } else if(age <= 40) {
      ageRange[1]++;
    } else if(age <= 60) {
      ageRange[2]++;
    } else if(age <= 80) {
      ageRange[3]++;
    } else if(age <= 100) {
      ageRange[4]++;
    } else if(age > 100) {
      ageRange[5]++;
    }
  }

  if(returnType === 'json') {
    return exportAsJson();
  } else if(returnType === 'text') {
    return exportAsText();
  } else if(returnType === 'xml') {
    return exportAsXml();
  }
}

function exportAsJson() {
  const jsonContent = {
    'Percentage female versus male': {
      'female': numberAsPercent(numOfFemales / numOfUsers),
      'male': numberAsPercent(numOfMales / numOfUsers)
    },
    'Percentage of first names that start with A-M versus N-Z': {
      'A-M': numberAsPercent(firstNames.AtoM / numOfUsers),
      'N-Z': numberAsPercent(firstNames.NtoZ / numOfUsers)
    },
    'Percentage of last names that start with A-M versus N-Z': {
      'A-M': numberAsPercent(lastNames.AtoM / numOfUsers),
      'N-Z': numberAsPercent(lastNames.NtoZ / numOfUsers)
    },
    'Percentage of people in the 10 most populous states': {
      'state1': {
        name: sortedPopInState[0][0],
        percentage: numberAsPercent(sortedPopInState[0][1] / numOfUsers)
      },
      'state2': {
        name: sortedPopInState[1][0],
        percentage: numberAsPercent(sortedPopInState[1][1] / numOfUsers)
      },
      'state3': {
        name: sortedPopInState[2][0],
        percentage: numberAsPercent(sortedPopInState[2][1] / numOfUsers)
      },
      'state4': {
        name: sortedPopInState[3][0],
        percentage: numberAsPercent(sortedPopInState[3][1] / numOfUsers)
      },
      'state5': {
        name: sortedPopInState[4][0],
        percentage: numberAsPercent(sortedPopInState[4][1] / numOfUsers)
      },
      'state6': {
        name: sortedPopInState[5][0],
        percentage: numberAsPercent(sortedPopInState[5][1] / numOfUsers)
      },
      'state7': {
        name: sortedPopInState[6][0],
        percentage: numberAsPercent(sortedPopInState[6][1] / numOfUsers)
      },
      'state8': {
        name: sortedPopInState[7][0],
        percentage: numberAsPercent(sortedPopInState[7][1] / numOfUsers)
      },
      'state9': {
        name: sortedPopInState[8][0],
        percentage: numberAsPercent(sortedPopInState[8][1] / numOfUsers)
      },
      'state10': {
        name: sortedPopInState[9][0],
        percentage: numberAsPercent(sortedPopInState[9][1] / numOfUsers)
      }
    },
    'Percentage of females in the 10 most populous states': {
      'state1': {
        name: sortedPopInState[0][0],
        percentage: numberAsPercent(femalesInState[sortedPopInState[0][0]] / numOfUsers)
      },
      'state2': {
        name: sortedPopInState[1][0],
        percentage: numberAsPercent(femalesInState[sortedPopInState[1][0]] / numOfUsers)
      },
      'state3': {
        name: sortedPopInState[2][0],
        percentage: numberAsPercent(femalesInState[sortedPopInState[2][0]] / numOfUsers)
      },
      'state4': {
        name: sortedPopInState[3][0],
        percentage: numberAsPercent(femalesInState[sortedPopInState[3][0]] / numOfUsers)
      },
      'state5': {
        name: sortedPopInState[4][0],
        percentage: numberAsPercent(femalesInState[sortedPopInState[4][0]] / numOfUsers)
      },
      'state6': {
        name: sortedPopInState[5][0],
        percentage: numberAsPercent(femalesInState[sortedPopInState[5][0]] / numOfUsers)
      },
      'state7': {
        name: sortedPopInState[6][0],
        percentage: numberAsPercent(femalesInState[sortedPopInState[6][0]] / numOfUsers)
      },
      'state8': {
        name: sortedPopInState[7][0],
        percentage: numberAsPercent(femalesInState[sortedPopInState[7][0]] / numOfUsers)
      },
      'state9': {
        name: sortedPopInState[8][0],
        percentage: numberAsPercent(femalesInState[sortedPopInState[8][0]] / numOfUsers)
      },
      'state10': {
        name: sortedPopInState[9][0],
        percentage: numberAsPercent(femalesInState[sortedPopInState[9][0]] / numOfUsers)
      }
    },
    'Percentage of males in the 10 most populous states': {
      'state1': {
        name: sortedPopInState[0][0],
        percentage: numberAsPercent(malesInState[sortedPopInState[0][0]] / numOfUsers)
      },
      'state2': {
        name: sortedPopInState[1][0],
        percentage: numberAsPercent(malesInState[sortedPopInState[1][0]] / numOfUsers)
      },
      'state3': {
        name: sortedPopInState[2][0],
        percentage: numberAsPercent(malesInState[sortedPopInState[2][0]] / numOfUsers)
      },
      'state4': {
        name: sortedPopInState[3][0],
        percentage: numberAsPercent(malesInState[sortedPopInState[3][0]] / numOfUsers)
      },
      'state5': {
        name: sortedPopInState[4][0],
        percentage: numberAsPercent(malesInState[sortedPopInState[4][0]] / numOfUsers)
      },
      'state6': {
        name: sortedPopInState[5][0],
        percentage: numberAsPercent(malesInState[sortedPopInState[5][0]] / numOfUsers)
      },
      'state7': {
        name: sortedPopInState[6][0],
        percentage: numberAsPercent(malesInState[sortedPopInState[6][0]] / numOfUsers)
      },
      'state8': {
        name: sortedPopInState[7][0],
        percentage: numberAsPercent(malesInState[sortedPopInState[7][0]] / numOfUsers)
      },
      'state9': {
        name: sortedPopInState[8][0],
        percentage: numberAsPercent(malesInState[sortedPopInState[8][0]] / numOfUsers)
      },
      'state10': {
        name: sortedPopInState[9][0],
        percentage: numberAsPercent(malesInState[sortedPopInState[9][0]] / numOfUsers)
      }
    },
    'Age ranges': {
      '0-20': numberAsPercent(ageRange[0] / numOfUsers),
      '21-40': numberAsPercent(ageRange[1] / numOfUsers),
      '41-60': numberAsPercent(ageRange[2] / numOfUsers),
      '61-80': numberAsPercent(ageRange[3] / numOfUsers),
      '81-100': numberAsPercent(ageRange[4] / numOfUsers),
      '100+': numberAsPercent(ageRange[5] / numOfUsers),
    }
  };

  return jsonContent;
}

function exportAsText() {
  let text = 'Percentage female versus male: ' + numberAsPercent(numOfFemales / numOfUsers) + ' vs ' + numberAsPercent(numOfMales / numOfUsers) + '\n' +
    'Percentage of first names that start with A-M versus N-Z: ' + numberAsPercent(firstNames.AtoM / numOfUsers) + ' vs ' + numberAsPercent(firstNames.NtoZ / numOfUsers) + '\n' +
    'Percentage of last names that start with A-M versus N-Z: ' + numberAsPercent(lastNames.AtoM / numOfUsers) + ' vs ' + numberAsPercent(lastNames.NtoZ / numOfUsers) + '\n' +
    'Percentage of people in the 10 most populous states:\n' +
    sortedPopInState[0][0] + ' : ' +  numberAsPercent(sortedPopInState[0][1] / numOfUsers) + '\n' +
    sortedPopInState[1][0] + ' : ' +  numberAsPercent(sortedPopInState[1][1] / numOfUsers) + '\n' +
    sortedPopInState[2][0] + ' : ' +  numberAsPercent(sortedPopInState[2][1] / numOfUsers) + '\n' +
    sortedPopInState[3][0] + ' : ' +  numberAsPercent(sortedPopInState[3][1] / numOfUsers) + '\n' +
    sortedPopInState[4][0] + ' : ' +  numberAsPercent(sortedPopInState[4][1] / numOfUsers) + '\n' +
    sortedPopInState[5][0] + ' : ' +  numberAsPercent(sortedPopInState[5][1] / numOfUsers) + '\n' +
    sortedPopInState[6][0] + ' : ' +  numberAsPercent(sortedPopInState[6][1] / numOfUsers) + '\n' +
    sortedPopInState[7][0] + ' : ' +  numberAsPercent(sortedPopInState[7][1] / numOfUsers) + '\n' +
    sortedPopInState[8][0] + ' : ' +  numberAsPercent(sortedPopInState[8][1] / numOfUsers) + '\n' +
    sortedPopInState[9][0] + ' : ' +  numberAsPercent(sortedPopInState[9][1] / numOfUsers) + '\n' +
    'Percentage of females in the 10 most populous states:\n' +
    sortedPopInState[0][0] + ' : ' +  numberAsPercent(femalesInState[sortedPopInState[0][0]] / numOfUsers) + '\n' +
    sortedPopInState[1][0] + ' : ' +  numberAsPercent(femalesInState[sortedPopInState[1][0]] / numOfUsers) + '\n' +
    sortedPopInState[2][0] + ' : ' +  numberAsPercent(femalesInState[sortedPopInState[2][0]] / numOfUsers) + '\n' +
    sortedPopInState[3][0] + ' : ' +  numberAsPercent(femalesInState[sortedPopInState[3][0]] / numOfUsers) + '\n' +
    sortedPopInState[4][0] + ' : ' +  numberAsPercent(femalesInState[sortedPopInState[4][0]] / numOfUsers) + '\n' +
    sortedPopInState[5][0] + ' : ' +  numberAsPercent(femalesInState[sortedPopInState[5][0]] / numOfUsers) + '\n' +
    sortedPopInState[6][0] + ' : ' +  numberAsPercent(femalesInState[sortedPopInState[6][0]] / numOfUsers) + '\n' +
    sortedPopInState[7][0] + ' : ' +  numberAsPercent(femalesInState[sortedPopInState[7][0]] / numOfUsers) + '\n' +
    sortedPopInState[8][0] + ' : ' +  numberAsPercent(femalesInState[sortedPopInState[8][0]] / numOfUsers) + '\n' +
    sortedPopInState[9][0] + ' : ' +  numberAsPercent(femalesInState[sortedPopInState[9][0]] / numOfUsers) + '\n' +
    'Percentage of males in the 10 most populous states:\n' +
    sortedPopInState[0][0] + ' : ' +  numberAsPercent(malesInState[sortedPopInState[0][0]] / numOfUsers) + '\n' +
    sortedPopInState[1][0] + ' : ' +  numberAsPercent(malesInState[sortedPopInState[1][0]] / numOfUsers) + '\n' +
    sortedPopInState[2][0] + ' : ' +  numberAsPercent(malesInState[sortedPopInState[2][0]] / numOfUsers) + '\n' +
    sortedPopInState[3][0] + ' : ' +  numberAsPercent(malesInState[sortedPopInState[3][0]] / numOfUsers) + '\n' +
    sortedPopInState[4][0] + ' : ' +  numberAsPercent(malesInState[sortedPopInState[4][0]] / numOfUsers) + '\n' +
    sortedPopInState[5][0] + ' : ' +  numberAsPercent(malesInState[sortedPopInState[5][0]] / numOfUsers) + '\n' +
    sortedPopInState[6][0] + ' : ' +  numberAsPercent(malesInState[sortedPopInState[6][0]] / numOfUsers) + '\n' +
    sortedPopInState[7][0] + ' : ' +  numberAsPercent(malesInState[sortedPopInState[7][0]] / numOfUsers) + '\n' +
    sortedPopInState[8][0] + ' : ' +  numberAsPercent(malesInState[sortedPopInState[8][0]] / numOfUsers) + '\n' +
    sortedPopInState[9][0] + ' : ' +  numberAsPercent(malesInState[sortedPopInState[9][0]] / numOfUsers) + '\n' +
    'Percentage of people in the following age ranges:\n' +
    '0-20: ' + numberAsPercent(ageRange[0] / numOfUsers) + '\n' +
    '21-40: ' + numberAsPercent(ageRange[1] / numOfUsers) + '\n' +
    '41-60: ' + numberAsPercent(ageRange[2] / numOfUsers) + '\n' +
    '61-80: ' + numberAsPercent(ageRange[3] / numOfUsers) + '\n' +
    '81-100: ' + numberAsPercent(ageRange[4] / numOfUsers) + '\n' +
    '100+: ' + numberAsPercent(ageRange[5] / numOfUsers) + '\n';

  return text;

}

function exportAsXml() {
  const jsonObject = exportAsJson();
  const options = {compact: true, ignoreComment: true, spaces: 4};
  const xmlText = convert.js2xml(jsonObject, options);

  return xmlText;
}

function processReturnType(type) {
  switch(type) {
    case 'text/plain':
      return 'text';
    case 'text/xml':
      return 'xml';
    default:
      return 'json';
  }
}

function sortProperties(obj)
{
  let sortable = [];

  for(let key in obj) {
    if(obj.hasOwnProperty(key)) {
      sortable.push([key, obj[key]]);
    }
  }

  sortable.sort((a, b) => { return b[1] - a[1] });

  return sortable;
}

function numberAsPercent(num) {
  return isNaN(num) ? '0.00%' : (num * 100).toFixed(2) + '%';
}
