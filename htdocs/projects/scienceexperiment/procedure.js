var words = `hygroscope
cyclorama
saiga
janthina
tullibee
ranunculus
balalaika
huipil
teledu
unakite`;
var textdef = `an instrument that shows changes in humidity
a large pictorial representation encircling the spectator and often having real objects as a foreground
a sheeplike antelope
snails of warm seas that have a thin spiral purple shell, a large head, and protrusible gills
any of several whitefishes of central and northern North America`;
var imgs = `https://i.guim.co.uk/img/media/69329e5bf7f47b54f69a16e83eaa4f3699ca775c/0_261_5155_3093/master/5155.jpg?width=1200&quality=85&auto=format&fit=max&s=b2f3f7c4421464f5c63decc97dac0ef5
https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/3_string_prim_balalaika.png/800px-3_string_prim_balalaika.png
https://vanda-production-assets.s3.amazonaws.com/2018/06/13/11/09/08/d85364a5-94c2-47a9-b542-314a44226812/Frida-huipiles-comp2.jpg
https://cdn.britannica.com/96/172396-050-7B768F9B/American-badger.jpg
https://upload.wikimedia.org/wikipedia/commons/a/a8/Colored_minerals_closeup.jpg`;
words = words.split("\n");
textdef = textdef.split("\n");
imgs = imgs.split("\n");
for (i = 1; i<=5; i++) {
    document.getElementById("Word"+i).innerHTML = words[i-1];
    document.getElementById("img"+i).style.display = "none";   
    document.getElementById("def"+i).innerHTML = textdef[i-1];
}
document.getElementById("nextbutton").style.display = "none";
function part2() {
    document.getElementById("wordtable").style.display = "table";  
    for (i = 1; i<=5; i++) {
        document.getElementById("Word"+i).innerHTML = words[i+4];
        document.getElementById("img"+i).style.display = "list-item";   
        document.getElementById("img"+i).src = imgs[i-1];
        document.getElementById("def"+i).innerHTML = "";
    }
    document.getElementById("nextbutton").style.display = "none";
    document.getElementById("nextbutton").innerHTML = "";
document.getElementById("nextbutton").setAttribute("onclick","");
    setTimeout(remove2, 20000);
    
}
var next;
function remove() {
        for (i = 1; i<=5; i++) {
        document.getElementById("Word"+i).innerHTML = "";
        document.getElementById("def"+i).innerHTML = "";    document.getElementById("img"+i).style.display = "none";          
    }
document.getElementById("nextbutton").style.display = "flex";
    document.getElementById("nextbutton").innerHTML = "Part 2";
document.getElementById("nextbutton").setAttribute("onclick","part2()");
document.getElementById("wordtable").style.display = "none";  
}
function remove2() {
    for (i = 1; i<=5; i++) {
        document.getElementById("Word"+i).innerHTML = "";
        document.getElementById("img"+i).style.display = "none";          
    }
    document.getElementById("nextbutton").style.display = "flex";
    document.getElementById("wordtable").style.display = "none";  
}
setTimeout(remove, 20000);