import React, { useEffect } from 'react'
import "../styles/tic.css";
import { useState } from 'react';
function Game({setGameOn, values, setValues, sock, roomid, makeMove}) {
    const [turn, setTurn] = useState(true);
    const [wini, setWin] = useState(false);
    const [lose, setLose] = useState(false);
    const [draw, setDraw] = useState(false);
    const boxs = document.getElementsByClassName("box");
    const boxClick = (i,j) => {
        if (values[i][j] == '.') {
            var c = [...values];
            c[i][j] = localStorage.getItem("uservalue");
            var m = checkWinner(c);
            if (m[0]) {
                alert("You win !");
                setWin(true);
            }
            if (m[1]) {
                alert("Match draw !");
                setDraw(true);
            }
            setTurn(false);
            makeMove(c);
        }
    }
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
    function k(num) {
        var x = parseInt(num / 3);
        var y = num % 3;
        console.log(x,y);
        return [x,y];
    }
    function checkWinner(v){
        let isWon=false;
        let isDraw = true;
        for(let i=0;i<win.length;i++){
          const c = win[i]; //[0,1,2]
          const [f1, f2] = k(c[0]);
          const [s1, s2] = k(c[1]);
          const [t1, t2] = k(c[2]);
        
          const box1=v[f1][f2]; //x
          const box2=v[s1][s2]; //''
          const box3=v[t1][t2]; //''
          if (box1 == "." || box2 == "." || box3 == ".") {
            isDraw = false;
          }
          if(box1==box2 && box2==box3 && box1 != "."){
            isWon=true;
            boxs[c[0]].classList.add('win');
            boxs[c[1]].classList.add('win');
            boxs[c[2]].classList.add('win');
          }
        }
        return [isWon, isDraw];
      }
    useEffect(()=>{
        setTurn(true);
        console.log("Vlues");
        console.log(values);
        const l = checkWinner(values);
        if (l[0]) {
            setLose(true);
            setTurn(false);
            return;
        } 
        if (l[1]) {
            setDraw(true);
            setTurn(false);
            return;
        }
        for (let i = 0; i < boxs.length; i++) {
            boxs[i].className = "box";
        }
    },[values])

  
    return (
        <div className='body-tag'>
            <div style={{textAlign:"center"}}>
            <button onClick={()=>{setGameOn(false)}} style={{margin:"auto",position:"absolute",top:"10%",left:"46%"}}>close</button>
            <h2> Tic Tac Toc </h2>
            <br />
            {draw && <h1>Match draw</h1>}
            {wini ? <h1>You Win :)</h1> : 
            lose && <h1>You lose :(</h1>
            }
            
            <br />
            <div class="container">
                <div class="box" onClick={()=>{turn && boxClick(0,0)}}>{values != undefined && values[0][0]}</div>
                <div class="box" onClick={()=>{turn && boxClick(0,1)}}>{values != undefined && values[0][1]}</div>
                <div class="box" onClick={()=>{turn && boxClick(0,2)}}>{values != undefined && values[0][2]}</div>
                <div class="box" onClick={()=>{turn && boxClick(1,0)}}>{values != undefined && values[1][0]}</div>
                <div class="box" onClick={()=>{turn && boxClick(1,1)}}>{values != undefined && values[1][1]}</div>
                <div class="box" onClick={()=>{turn && boxClick(1,2)}}>{values != undefined && values[1][2]}</div>
                <div class="box" onClick={()=>{turn && boxClick(2,0)}}>{values != undefined && values[2][0]}</div>
                <div class="box" onClick={()=>{turn && boxClick(2,1)}}>{values != undefined && values[2][1]}</div>
                <div class="box" onClick={()=>{turn && boxClick(2,2)}}>{values != undefined && values[2][2]}</div>
            </div>

            <script src="tic.js"></script>
            </div>
        </div>
    )
}

export default Game