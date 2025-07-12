var obj;
var categories;
var answers;

fetch('answers.json')
  .then(res => res.json())
  .then(data => {
    obj = data;
   })
  .then(data => {categories = Object.keys(obj); answers = obj;});


//function to lower case a string

function lowerCase(str) {
  return str.toLowerCase();
}

//list of letters
const letters = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Z', 'X', 'C', 'V', 'B', 'N', 'M'];
//the categories

var chosencategory = ""


//function to choose a random element from an array
const chooseRandom = (arr, num) => {
  const res = [];
  while (res.length < num) {
    var r = Math.floor(Math.random() * arr.length - 1) + 1;
    if (res.indexOf(arr[r]) === -1) { res.push(arr[r]) };
  }
  return res;
};



function FastFacts() {
  //making a list of all the input boxes
  var inputs = document.querySelectorAll('input[type="text"]');


  //changing all of the input boxes to be empty and black

  inputs.forEach(function(input) {
    input.value = '';
    input.style.color = "black";
  });

  var categoryletters = document.getElementsByClassName("letter");
  chosenletters = chooseRandom(letters, 5);
  //choose the letters 
  for (i = 0; i < 5; i++) {
    categoryletters[i].innerHTML = chosenletters[i];
  }
  for (i = 0; i < 5; i++) {
    chosencategory = chooseRandom(categories, 1)[0];
    document.getElementById("category" + i).innerText = chosencategory;
  }


}

function Check() {
  // Get the input elements
  for (var i = 0; i < 5; i++) {
    for (var j = 0; j < 5; j++) {
      inputs = document.querySelectorAll('input[type="text"]');
      categorio = document.getElementById('category' + j.toString()).innerHTML;
      num = 5 * i + j;
      inputs[num].style.color = answers[categorio].includes(lowerCase(inputs[num].value.trim())) ? "lime" : "red";
    }
  }


}
