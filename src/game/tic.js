const boxs=document.querySelectorAll('.box');
const statusTxt=document.querySelector('#status');
const btnRestart=document.querySelector('#restart');
let x="<image src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAACICAMAAAAvUR7lAAAAZlBMVEX///8AAADy8vL4+Pjl5eWEhIT19fW6urrCwsKxsbE6OjpwcHDu7u7q6upYWFjLy8uenp4YGBhmZmY0NDTc3NxfX1/U1NSMjIxMTEwtLS0kJCSoqKiXl5ceHh5SUlJ3d3cQEBBBQUGBbXYXAAADZklEQVRoge2a25bCIAxFhdaOOvXW1mrtaPX/f3K8WwgJoeCDa7EfR3qoEE4SnNEoEolEIpEvJUs+qS5Xx+bc1Z+ST9q1uFHMP6I/KcWTUxpevlqIHk3onUjGQuUvrP6PAISUlxuoLwKG0sQgL8RPMP3OqC+mgeTTvVlfVGH0p4i8mIXR/8X0heWk1eOW8RXzcqh+fvuSS4u+OXqurG1O0XICYYvql1avey4t8R0y0+G6s5M2/aR5jkVfpcKi8+LVdp+T78VEBqPRKURnlX/s8Z2jcYBunT1YLip7D4zhx/MFKs91oL5Cq39YH1D5A9dC//pPaaHU4q+/YyfKVHmuH0oJ4p1XOoc0eew/WGbvmXe4/oovr4fh5vlqkxMqf7IZi0qiKu1uzpcS0clf/ge60Ry7DvcGt+W/kxNqkCHpEU8lgGZQdqzZ+kVmVzMxY+oPLuFWPH236Owj7eJCnK25hYCxRgardQDPuU8mXvqmilmhyf30NUsFFJ7ytgn8G4wET1wiSHFOOL9P9L8gMlcQfTJGA/QWf5R+gNKfXB/P8zuiM/sVUCk5ssQz+x2n8gFit+lfH3nJSJUHD4+uWXls+C4TZb/CwING1Z0qw05CZYnOPtsB+rb8ouJ+l0LUnZfKFvzl7CifE13RJfBT+LHbIhFNqRD7S25PYPi6LBK5/Ntb4Zw1+t8bvj7RdT06gws5mIF93Cj9nnHOwTIyjxuxPhvFdCoQS6yuo8L19cINXN9sOBOg5m+4cwCLyUjOmPuvjVFY6MPsl+DIAUAiRK61cXvrBEZ5/MphyVhIBWP9ST0E6hlLDWlq9eiqH7gS3YHDCRaWhCv1mpi2DHAK7CUJeCeyUcjUsSWnpQaJm3wpZeSYd+MANpoypV4ZdGD3dKB2Ijb6Hdgdv5xK9PKgIZ59vM3ZqdSRenJYEIOni3JWuHa8c90jyXpVDrguAfE9pFIiAa7kWdRDQPoJ9avQC3DgPK8uICDBBehuVUA6/MIZnGzpW2YI9yMpNoNvnw4AOx3cNcCJ8+rUTQBf2g28bUYB5ZX1x0xXMtBiBQ8mkKe9b5V0QDAF34gatBq+V8M68N8rfO7mjejLFHwfRrXa0FDVzEAyJZpYXaIr016bFdyVbsj23qTsi+CVzIs8rap58BCKRCKRSATjHyv3IjP9e14UAAAAAElFTkSuQmCC' style='mix-blend-mode:multiply' width=40 height=40 >";
let o="<image src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqAkRLJhbxVU8WQS2l2szuKmIsM3b1kjHkeGnin7fSAXBQxFDcL__tNKzcd72gkuznatQ&usqp=CAU' style='mix-blend-mode:multiply;transform:scale(2)' width=40 height=40 >";

const win=[
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [2,4,6]
];

let options=["","","","","","","","",""];
let currentPlayer=x;
let player="X";
let running=false;
init();

function init(){
  boxs.forEach(box=>box.addEventListener('click',boxClick));
  btnRestart.addEventListener('click',restartGame);
  statusTxt.textContent=`${player} Your Turn`;
  running=true;
}

function boxClick(){
  const index=this.dataset.index;
  if(options[index]!="" || !running){
    return;
  }
  updateBox(this,index);
  checkWinner();
}

function updateBox(box,index){
  options[index]=player;
  box.innerHTML=currentPlayer;
}

function changePlayer(){
    player=(player=='X') ? "O" :"X";
    currentPlayer=(currentPlayer==x) ? o :x;
    statusTxt.textContent=`${player} Your Turn`;
}

function checkWinner(){
  let isWon=false;
  for(let i=0;i<win.length;i++){
    const condition=win[i]; //[0,1,2]
    const box1=options[condition[0]]; //x
    const box2=options[condition[1]]; //''
    const box3=options[condition[2]]; //''
    if(box1=="" || box2=="" || box3==""){
      continue;
    }
    if(box1==box2 && box2==box3){
      isWon=true;
      boxs[condition[0]].classList.add('win');
      boxs[condition[1]].classList.add('win');
      boxs[condition[2]].classList.add('win');
    }
  }

  if(isWon){
    statusTxt.textContent=`${player} Won..`;
    running=false;
  }else if(!options.includes("")){
    statusTxt.textContent=`Game Draw..!`;
    setTimeout(() => {document.getElementById("restart").click()}, 2000);
    //document.getElementById("restart").click();
    running=false;
  }else{
    changePlayer();
  }

}

function restartGame(){
  options=["","","","","","","","",""];
  currentPlayer=x;
  player="X";
  running=true;
  statusTxt.textContent=`${player} Your Turn`;

  boxs.forEach(box=>{
      box.innerHTML="";
      box.classList.remove('win');
  });
}