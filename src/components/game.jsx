import React, { useEffect } from 'react'
import "../styles/tic.css";
import { useState } from 'react';
function Game({setGameOn, values, setValues, sock, roomid, makeMove}) {
    const [turn, setTurn] = useState(true);
    const boxClick = (i,j) => {
        if (values[i][j] == '.') {
            values[i][j] = localStorage.getItem("uservalue");
            setTurn(false);
            makeMove(values);
        }
    }
    useEffect(()=>{
        setTurn(true);
        console.log(values);
    },[values])
    return (
        <div className='body-tag'>
            <div>
            <button onClick={()=>{setGameOn(false)}}>close</button>
            <h2> Tic Tac Toc Game</h2>
            <br />
            <div id="status">Play Now</div>
            <br />
            <div class="container">
                <div class="box" onClick={()=>{turn && boxClick(0,0)}}>{values[0][0]}</div>
                <div class="box" onClick={()=>{turn && boxClick(0,1)}}>{values[0][1]}</div>
                <div class="box" onClick={()=>{turn && boxClick(0,2)}}>{values[0][2]}</div>
                <div class="box" onClick={()=>{turn && boxClick(1,0)}}>{values[1][0]}</div>
                <div class="box" onClick={()=>{turn && boxClick(1,1)}}>{values[1][1]}</div>
                <div class="box" onClick={()=>{turn && boxClick(1,2)}}>{values[1][2]}</div>
                <div class="box" onClick={()=>{turn && boxClick(2,0)}}>{values[2][0]}</div>
                <div class="box" onClick={()=>{turn && boxClick(2,1)}}>{values[2][1]}</div>
                <div class="box" onClick={()=>{turn && boxClick(2,2)}}>{values[2][2]}</div>
            </div>

            <script src="tic.js"></script>
            </div>
        </div>
    )
}

export default Game