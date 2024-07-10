function NameWord() {
	var typevar;
	function isAlpha(char){typevar = (typeof char === "string" && char.length === 1 && (char >= "a" && char <= "z" || char >= "A" && char <= "Z"));}
	var x = document.getElementById('WordName').value;
	var Letters = ["Adventurous","Affectionate","Amazing","Amicable ","Astute","Attentive","Awesome","Beautiful","Benevolent","Best","Bold","Brave","Bright","Brilliant","Calm","Capable","Caring","Charismatic","Charming","Cheerful","Compassionate","Confident","Cool","Courageous","Courteous","Creative","Curious","Dearest","Delightful","Determined","Dynamic","Endearing","Energetic","Enthusiastic","Exceptional","Extraordinary","Fantastic","Fascinating","Fearless","Friendly","Funny","Generous","Gentle","Gifted","Good","Great","Grit","Happy","Helpful","Honest","Humble","Iconic","Impeccable","Impressive","Incredible","Inspirational","Inspiring","Intelligent","Invaluable","Jolly","Joyful","Judicious","Keen","Kind","Knowledgeable","Loving","Loyal","Lucky","Majestic","Marvellous","Mesmerizing","Mindful","Neat","Nice","Optimistic","Original","Outstanding","Perfect","Positive","Positive","Precious","Priceless","Pure","Quick","Rad","Respectful","Responsible","Sensible","Sincere","Smart","Sparkling","Special","Spectacular","Successful","Super","Talented","Terrific","Thoughtful","Timeless","Treasured","Trustworthy","Ultimate","Unique","Versatile","Vibrant","Vital","Vivacious","Warm","Warm Hearted","Wise","Witty","Wonderful","Wondrous","Xtraordinary","Youthful","Zealful","Zesty","Zippy"];
	var i;
	var a;
	document.getElementById("nameis").innerHTML = x+ ' is ';
	var string = '';
	for(i of x) {
		isAlpha(i);
		if (typevar == false){
			string+=i;
			string+="<br>";
		} else {var LetterLetters = [];
		for(a of Letters) {
			if (a[0] == i.toUpperCase()) {
				LetterLetters[(LetterLetters.length)] = a;
			};
		};
		var randomNumber = Math.floor(Math.random() * Math.floor(LetterLetters.length));
		string+=LetterLetters[randomNumber];
		string+=" <br>";}
	};
	document.getElementById("Output").innerHTML=string;
}; 
