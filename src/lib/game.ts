export type Mode='mini'|'big';
export type Task={kind:'count'|'plus'|'minus'|'divide'|'times';a:number;b:number;answer:number};
export type Journey={tasks:Task[];step:number;round:number};
export const AVATARS=[
 {id:'pippo',name:'Pippo',price:0,effect:'Der mutige Pinguin für den Start.',world:'ice-world.png',worldName:'Eiswelt',destination:'Iglu',destinationPhrase:'zum Iglu',arrival:'AM IGLU!'},
 {id:'dino',name:'Dino',price:30,effect:'Landet mit einem kräftigen Wackler.',world:'jungle-world.png',worldName:'Urzeit-Dschungel',destination:'Dinonest',destinationPhrase:'zum Dinonest',arrival:'AM DINONEST!'},
 {id:'skeleton',name:'Skelett',price:50,effect:'Klappert fröhlich beim Landen.',world:'graveyard-world.png',worldName:'Mondfriedhof',destination:'Gruft',destinationPhrase:'zur Gruft',arrival:'AN DER GRUFT!'},
 {id:'cactus',name:'Kaktus',price:100,effect:'Lässt kleine Blüten aufploppen.',world:'desert-world.png',worldName:'Wüstenoase',destination:'Oase',destinationPhrase:'zur Oase',arrival:'AN DER OASE!'},
] as const;
export type AvatarId=typeof AVATARS[number]['id'];
export type PlayerProfile={coins:number;owned:AvatarId[];active:AvatarId};
const avatarIds=new Set<AvatarId>(AVATARS.map(avatar=>avatar.id));
const roll=(max:number)=>1+Math.floor(Math.random()*max);
const pick=<T,>(items:T[])=>items[Math.floor(Math.random()*items.length)];
const shuffled=<T,>(items:T[])=>{const result=[...items];for(let i=result.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[result[i],result[j]]=[result[j],result[i]]}return result};
function miniPlus():Task{const pairs:{a:number;b:number}[]=[];for(let a=3;a<=17;a++)for(let b=2;b<=17;b++)if(a+b>=11&&a+b<=20)pairs.push({a,b});const {a,b}=pick(pairs);return {kind:'plus',a,b,answer:a+b}}
function miniMinus():Task{const pairs:{a:number;b:number}[]=[];for(let a=11;a<=20;a++)for(let b=2;b<=9;b++)if(a-b>=2)pairs.push({a,b});const {a,b}=pick(pairs);return {kind:'minus',a,b,answer:a-b}}
function miniTimes(kind:'times'|'divide',easy=false):Task{const pairs:{a:number;b:number}[]=[];for(const a of easy?[2,5,10]:[2,3,4,5,6,7,8,9])for(let b=2;b<=9;b++)if(a*b<=20)pairs.push({a,b});const {a,b}=pick(pairs);return kind==='times'?{kind,a,b,answer:a*b}:{kind,a:a*b,b:a,answer:b}}
function miniWildcard():Task{const roll=Math.random();if(roll<.25)return miniTimes('divide');if(roll<.4)return miniTimes('times',true);return Math.random()<.5?miniPlus():miniMinus()}
export function makeTasks(mode:Mode,round=0):Task[]{if(mode==='mini')return shuffled([miniPlus(),miniPlus(),miniMinus(),miniMinus(),miniWildcard()]);return Array.from({length:5},(_,i)=>{const b=[2,5,2,3,5][i],answer=roll(round>1?6:4);return i===2?{kind:'times',a:b,b:answer,answer:b*answer}:{kind:'divide',a:b*answer,b,answer}})}
export function taskText(t:Task){return t.kind==='count'?'Wie viele Fische siehst du?':t.kind==='plus'?`${t.a} plus ${t.b}. Wie viel ist das zusammen?`:t.kind==='minus'?`${t.a} minus ${t.b}. Wie viel bleibt übrig?`:t.kind==='times'?`${t.a} mal ${t.b}. Wie viel ist das?`:`${t.a} Fische für ${t.b} Pinguine. Wie viele bekommt jeder?`}
export function afterWrongAnswer(previousWrongAnswers:number){const wrongAnswers=previousWrongAnswers+1;return {wrongAnswers,forfeitCoin:wrongAnswers>=2}}
export function parseNumber(text:string):number|null{const s=text.toLowerCase().trim().replace(/[.!?,]/g,'');if(/^\d{1,2}$/.test(s))return Number(s);const words=['null','eins','zwei','drei','vier','fünf','sechs','sieben','acht','neun','zehn','elf','zwölf','dreizehn','vierzehn','fünfzehn','sechzehn','siebzehn','achtzehn','neunzehn','zwanzig'];const n=words.indexOf(s.replace(/^(das ist|es sind|die antwort ist|ich sage) /,''));return n>=0?n:s==='ein'||s==='eine'?1:null}
export function initialProfile():PlayerProfile{return {coins:0,owned:['pippo'],active:'pippo'}}
export function restoreProfile(raw:string|null):PlayerProfile{try{const x=JSON.parse(raw||'null');const owned:AvatarId[]=Array.isArray(x?.owned)?x.owned.filter((id:unknown):id is AvatarId=>typeof id==='string'&&avatarIds.has(id as AvatarId)):[];if(!Number.isInteger(x?.coins)||x.coins<0)return initialProfile();const unique=['pippo',...owned.filter((id,index)=>id!=='pippo'&&owned.indexOf(id)===index)] as AvatarId[],active=avatarIds.has(x.active)&&unique.includes(x.active)?x.active:'pippo';return {coins:x.coins,owned:unique,active}}catch{return initialProfile()}}
export function restore(raw:string|null):Journey|null{try{const x=JSON.parse(raw||'null');if(!x||!Number.isInteger(x.step)||x.step<0||x.step>5||!Number.isInteger(x.round)||x.round<0||!Array.isArray(x.tasks)||x.tasks.length!==5)return null;for(const t of x.tasks){if(!t||!['count','plus','minus','divide','times'].includes(t.kind)||![t.a,t.b,t.answer].every(Number.isInteger)||t.a<1||t.a>50||t.b<0||t.b>10||t.answer<1||t.answer>50)return null;const answer=t.kind==='count'?t.a:t.kind==='plus'?t.a+t.b:t.kind==='minus'?t.a-t.b:t.kind==='divide'?t.a/t.b:t.a*t.b;if(answer!==t.answer)return null}return {tasks:x.tasks,step:x.step,round:x.round}}catch{return null}}
