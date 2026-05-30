/* timer-worker.js — precise background timer using wall-clock time */
let startTime=null,totalSeconds=0,running=false,intervalId=null;

function tick(){
  if(!running||startTime===null) return;
  const elapsed=Math.floor((Date.now()-startTime)/1000);
  const remaining=Math.max(0,totalSeconds-elapsed);
  postMessage({type:'tick',remaining,total:totalSeconds});
  if(remaining<=0){
    running=false;
    if(intervalId){clearInterval(intervalId);intervalId=null;}
    postMessage({type:'done'});
  }
}

self.onmessage=function(e){
  const d=e.data;
  if(d.type==='start'){
    if(running&&intervalId) clearInterval(intervalId);
    const offset=(d.total||d.remaining)-d.remaining;
    startTime=Date.now()-(offset*1000);
    totalSeconds=d.total||d.remaining;
    running=true;
    intervalId=setInterval(tick,200);
    tick();
  }else if(d.type==='pause'){
    running=false;
    if(intervalId){clearInterval(intervalId);intervalId=null;}
    if(startTime!==null){
      const elapsed=Math.floor((Date.now()-startTime)/1000);
      postMessage({type:'paused',remaining:Math.max(0,totalSeconds-elapsed),total:totalSeconds});
    }
    startTime=null;
  }else if(d.type==='stop'){
    running=false;
    if(intervalId){clearInterval(intervalId);intervalId=null;}
    startTime=null;totalSeconds=0;
  }
};
