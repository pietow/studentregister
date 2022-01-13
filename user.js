const readline = require('readline');
const fs = require('fs');
rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


function promiseSequence(promiseMaker) {
    const inputs = ['fname:\n', 'lname:\n', 'age:\n', 'grade:\n']
    function handleNextInput(outputs) {
        if (inputs.length === 0) {
            return outputs
        } else {
            let nextInput = inputs.shift()
            return promiseMaker(nextInput).then(output => {
                if (nextInput === 'age:\n' && (output < 18 || output > 100 || isNaN(output))) {
                    inputs.unshift(nextInput)
                } else if (nextInput === 'grade:\n' && (output < 0 || output > 100 || isNaN(output))) {
                    inputs.unshift(nextInput)
                } else {
                    return outputs.concat(output)
                }
                return outputs
            }).then(handleNextInput)
        }
    }
    return Promise.resolve([]).then(handleNextInput)

}

function getEntry(message) {
    return new Promise((resolve, reject) => {
        rl.question(message, data => {
            if (data === 'exit') {
                reject('closed by the user')
            } else {
                resolve(data)
            }
        })
    })
}

function save(obj) {
    const jsonText = fs.readFileSync('students.json', 'utf8');
    let arr;
    if (jsonText.trim() === '') {
        arr = [];
    } else {
        arr = JSON.parse(jsonText);
    }
    // add the obj to arr
    arr.push(obj);
    fs.writeFileSync('students.json', JSON.stringify(arr));
    return arr;
}

promiseSequence(getEntry).then(bodies => {
    const [fname, lname, age, grade] = bodies
    const student = { fname, lname, age, grade }
    const allStudents = save(student)
    console.log(allStudents)
    process.exit();

}).catch(console.error)
