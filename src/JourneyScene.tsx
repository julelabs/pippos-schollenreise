'use client';
import {useEffect,useRef,useState} from 'react';
import {STOPS,MARKERS,sampleJump,cameraOffset} from './lib/route';
export default function JourneyScene({destination,fish,active,onArrive}:{destination:number;fish:number;active:boolean;onArrive:()=>void}){
 const viewport=useRef<HTMLDivElement>(null),callback=useRef(onArrive);callback.current=onArrive;
 const [position,setPosition]=useState<{x:number;y:number;size:number;lift:number;label:string}>({...STOPS[destination],lift:0}),positionRef=useRef(position),[moving,setMoving]=useState(false),[bounds,setBounds]=useState({width:0,height:0});
 useEffect(()=>{const node=viewport.current;if(!node)return;const measure=()=>setBounds({width:node.clientWidth,height:node.clientHeight});measure();const observer=new ResizeObserver(measure);observer.observe(node);return()=>observer.disconnect()},[]);
 useEffect(()=>{const from=positionRef.current,to=STOPS[destination];if(from.x===to.x&&from.y===to.y)return;const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;let frame=0;const begin=performance.now();setMoving(true);const tick=(now:number)=>{const t=reduced?1:Math.min(1,(now-begin)/1000),next=sampleJump(from,to,t);positionRef.current={...next,label:to.label};setPosition(positionRef.current);if(t<1)frame=requestAnimationFrame(tick);else{setMoving(false);callback.current()}};frame=requestAnimationFrame(tick);return()=>cancelAnimationFrame(frame)},[destination]);
 const offset=cameraOffset(bounds.width,bounds.height,position.y);
 return <section className="landscape route-scene" aria-label={`Pippo: ${STOPS[destination].label}, ${destination} von 5 Sprüngen`}>
 <div className="scene-window" ref={viewport}><div className="scene-stage" style={{transform:`translateY(-${offset}px)`}}>
 <img className="world-art" src={`${import.meta.env.BASE_URL}ice-world.png`} alt="Ein Schollenweg führt über türkisfarbenes Wasser zu einem Iglu." width={1086} height={1448}/>
 <svg className="route-line" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><polyline points={STOPS.map(p=>`${p.x},${p.y}`).join(' ')} fill="none" stroke="white" strokeWidth=".6" strokeDasharray="1 1" opacity=".8"/></svg>
 {MARKERS.map((point,i)=><span key={i} className={`route-marker ${point.flag?'flag-number':''} ${destination>=i+1?'visited':''} ${destination+1===i+1?'up-next':''}`} style={{left:`${point.x}%`,top:`${point.y}%`}} aria-label={`Wegmarke ${i+1}${destination>=i+1?' erreicht':''}`}>{destination>=i+1?'✓':i+1}</span>)}
 <div className={'penguin-anchor '+(moving?'in-flight':'')} style={{left:`${position.x}%`,top:`${position.y-position.lift}%`,width:`${position.size}%`}}><img src={`${import.meta.env.BASE_URL}pippo.png`} alt="Pippo, ein ganzer Pinguin mit orangefarbenen Füßen und rotem Schal" draggable={false}/></div>
 </div></div><div className="journey-label">{destination===5&&!moving?'AM IGLU!':'FÜNF SPRÜNGE ZUM IGLU'}<span>{moving?'Huuuupf!':destination===5?'Direkt vor der Tür.':active?`Nächstes Ziel: ${destination+1}`:'Folge den nummerierten Wegmarken.'}</span></div>{active&&<span className="fish-total">🐟 {fish}</span>}<div className="scene-caption">{moving?'Von einer Scholle zur nächsten …':destination===5?'Geschafft! Pippo ist zu Hause.':active?`${destination} von 5 Sprüngen geschafft`:'Jede richtige Antwort bringt Pippo ein Ziel weiter.'}</div>
 </section>
}
