let inputField = document.querySelector(".input");
let precedance = new Map([['+', 1], ['-', 1], ['*', 2], ['/', 2], ['^', 3]]);
inputField.value = '((1^2)+3)-4*5/6';
console.log(precedance);
// function applyHoverEffect(element) {
//   element.classlist.add("button_hover")
// }
inputField.addEventListener("keypress", (e) => {
  console.log(e.key);
  if (e.key == "Enter") {
    e.preventDefault();
    compute();
  }
})
document.querySelectorAll("button").forEach((element) => {
  element.addEventListener("mouseover", (e) => {
    e.preventDefault();
    element.classList.add("button_hover");
  })
  element.addEventListener("mouseout", (e) => {
    e.preventDefault();
    element.classList.remove("button_hover");
  })
  element.addEventListener("mousedown", (e) => {
    let action = element.getAttribute("data-action") ?? element.innerText;
    if (action == "clear") {
      inputField.value = '';
    } else if (action == "back") {
      inputField.value = inputField.value.slice(0, inputField.value.length - 1);
    } else if (action == "result") {
      compute();
    } else {
      inputField.value += action;
      inputField.focus();
      inputField.selectionStart = inputField.value.length;
    }
  })
});

let reg_op = /[\(\)\-\+\/\^\*]/;
function compute() {
  let input = inputField.value;
  let reg = /[\/\w\-\+\(\)\^\*\.]/g;
  let inputArray = input.match(reg);
  inputArray = getNumber(inputArray);
  let result = 0;
  inputArray = getpostfix(inputArray);
  let i = 0;
  while (inputArray.length > 1) {
    if (typeof inputArray[i] != 'number') {
      if (inputArray[i] == '+') {
        result = inputArray[i - 2] + inputArray[i - 1];
        inputArray.fill(result, i, i + 1);
        inputArray = removeElementIndex(inputArray, [i - 1, i - 2]);
      }
      if (inputArray[i] == '-') {
        result = inputArray[i - 2] - inputArray[i - 1];
        inputArray.fill(result, i, i + 1);
        inputArray = removeElementIndex(inputArray, [i - 1, i - 2]);
      }
      if (inputArray[i] == '*') {
        result = inputArray[i - 2] * inputArray[i - 1];
        inputArray.fill(result, i, i + 1);
        inputArray = removeElementIndex(inputArray, [i - 1, i - 2]);
      }
      if (inputArray[i] == '/') {
        result = inputArray[i - 2] / inputArray[i - 1];
        inputArray.fill(result, i, i + 1);
        inputArray = removeElementIndex(inputArray, [i - 1, i - 2]);
      }
      if (inputArray[i] == '^') {
        result = Math.pow(inputArray[i - 2], inputArray[i - 1]);
        inputArray.fill(result, i, i + 1);
        inputArray = removeElementIndex(inputArray, [i - 1, i - 2]);
      }
      i -= 2;
    }
    i++;
  }
  inputField.value = inputArray[0];
}

function getNumber(inputArray) {
  let tempArray = new Array();
  console.log("Inside get number");
  console.log(`The array received is ${inputArray}`);
  for (let i = 0; i < inputArray.length; i++) {
    console.log(i);
    console.log(inputArray[i]);
    if (inputArray[i].match(reg_op)) {
      console.log(`got ${inputArray[i]}`);
      tempArray.push(inputArray[i]);
      continue;
    }
    for (let j = i + 1; j < inputArray.length; j++) {
      if (inputArray[j].match(reg_op)) {
        console.log(`${inputArray[j]}`);
        tempArray.push(inputArray.slice(i, j).reduce((acc, cur) => acc + cur) - 0);
        tempArray.push(inputArray[j]);
        i = j;
        break;
      } else if (j == inputArray.length - 1) {
        tempArray.push(inputArray.slice(i, j + 1).reduce((acc, cur) => acc + cur) - 0);
        i = j + 1;
        break;
      }
    }
    if (i == inputArray.length - 1 && !inputArray[i].match(reg_op)) {
      tempArray.push(inputArray[i] - 0);
    }

  }
  console.log(`Temp array is ${tempArray}`);
  return tempArray;
}

function getpostfix(inputArray) {
  console.log("Inside postfix");
  console.log(`array received is ${inputArray}`);
  let tempArray = new Array();
  let stack = new Array();
  let precedanceModifier = 0;
  for (let i = 0; i < inputArray.length; i++) {
    console.log(`${inputArray[i]}`);
    if (typeof inputArray[i] != 'number') {
      if (inputArray[i] == '(') {
        precedanceModifier += 3;
        continue;
      } else if (inputArray[i] == ')') {
        precedanceModifier -= 3;
        continue;
      }
      if (stack.length == 0 || stack.at(-1)[1] < (precedanceModifier + precedance.get(inputArray.at(i)))) {
        stack.push([inputArray[i], precedanceModifier + precedance.get(inputArray.at(i))]);
      } else {
        while (stack.length != 0 && stack.at(-1)[1] >= (precedanceModifier + precedance.get(inputArray.at(i)))) {
          tempArray.push(stack.pop()[0]);
        }
        stack.push([inputArray[i], precedanceModifier + precedance.get(inputArray.at(i))]);
      }
    } else {
      tempArray.push(inputArray[i]);
    }
  }
  while (stack.length != 0) {
    tempArray.push(stack.pop()[0]);
  }
  console.log(tempArray);
  return tempArray;
}

function removeElementIndex(array, [...index]) {
  let tempArray = new Array();
  for (let i = 0; i < array.length; i++) {
    if (index.includes(i)) continue;
    else {
      tempArray.push(array[i]);
    }
  }
  return tempArray;
}