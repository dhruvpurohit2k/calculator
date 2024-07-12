
let inputField = document.querySelector(".input");

// function applyHoverEffect(element) {
//   element.classlist.add("button_hover")
// }

document.querySelectorAll("button").forEach((element) => {
  element.addEventListener("mouseover", (e) => {
    e.preventDefault();
    element.classList.add("button_hover");
  })
  element.addEventListener("mouseout", (e) => {
    e.preventDefault();
    element.classList.remove("button_hover");
  })
  element.addEventListener("click", (e) => {
    let action = element.getAttribute("data-action") ?? element.innerText;
    if (action == "clear") {
      inputField.value = '';
    } else if (action == "result") {
      compute();
    } else {
      inputField.value += action;
      inputField.focus();
      inputField.selectionStart = inputField.value.length;
    }
  })
});

function compute() {
  let input = inputField.value;
  let reg = /[\/\w\-\+\(\)\^\*\.]/g;
  let inputArray = input.match(reg);
  let reg_op = /[\(\)\-\+\/\^]/;
  inputArray = getNumber(inputArray);
  console.log(inputArray);
  let result = 0;
  for (let i = 0; i < inputArray.length; i++) {
    console.log(inputArray[i]);
    if (inputArray[i] == '+')
      result += inputArray[i - 1] + inputArray[i + 1];
    if (inputArray[i] == '-')
      result += inputArray[i - 1] - inputArray[i + 1];
    if (inputArray[i] == '*')
      result += inputArray[i - 1] * inputArray[i + 1];
    if (inputArray[i] == '/')
      result += inputArray[i - 1] / inputArray[i + 1];
    if (inputArray[i] == '^') {
      console.log(Math.pow(inputArray[i - 1], inputArray[i + 1]));
      result += Math.pow(inputArray[i - 1], inputArray[i + 1]);
    }
  }
  inputField.value = result;
}

function getNumber(inputArray) {
  let reg_op = /[\/\(\)\-\+\/\^]/;
  let tempArray = new Array();
  for (let i = 0; i < inputArray.length; i++) {
    for (let j = i + 1; j < inputArray.length; j++) {
      if (inputArray[j].match(reg_op)) {
        console.log(inputArray[j]);
        tempArray.push(inputArray.slice(i, j).reduce((acc, cur) => acc + cur) - 0);
        tempArray.push(inputArray[j]);
        i = j;
        break;
      } else if (j == inputArray.length - 1) {
        tempArray.push(inputArray.slice(i, j + 1).reduce((acc, cur) => acc + cur) - 0);
        i = j;
        break;
      }
    }
    if (i + 1 == inputArray.length - 1) {
      tempArray.push(inputArray[i + 1]);
    }

  }
  return tempArray;
}