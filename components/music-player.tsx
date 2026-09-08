'use client';
import {useRef,useState} from 'react';
import {Music2,Pause,Play,SkipForward} from 'lucide-react';
import tracksData from '@/lib/music.json';
const tracks=tracksData as {src:string;title:string}[];
export function MusicPlayer(){
 const audio=useRef<HTMLAudioElement>(null);
 const [playing,setPlaying]=useState(false);const [index,setIndex]=useState(0);const [error,setError]=useState('');
 const play=async()=>{if(!audio.current)return;try{await audio.current.play();setError('');}catch{setPlaying(false);setError('Music could not play. Try again.');}};
 const toggle=()=>{if(playing)audio.current?.pause();else void play();};
 const next=()=>{const nextIndex=(index+1)%tracks.length;setIndex(nextIndex);if(audio.current){audio.current.src=tracks[nextIndex].src;void play();}};
 if(!tracks.length)return <div className="music-player music-empty"><Music2 size={16}/><span>Music coming soon</span></div>;
 return <div className="music-player"><audio ref={audio} src={tracks[index].src} preload="none" loop={tracks.length===1} onEnded={next} onPlay={()=>setPlaying(true)} onPause={()=>setPlaying(false)} onError={()=>{setPlaying(false);setError('This track is unavailable.');}}/><button onClick={toggle} aria-label={playing?'Pause background music':'Play background music'} aria-pressed={playing}>{playing?<Pause size={16}/>:<Play size={16}/>}<span>{playing?'Music on':'Music off'}</span></button><span className="music-track" title={tracks[index].title}>{tracks[index].title}</span>{tracks.length>1&&<button onClick={next} aria-label="Next music track"><SkipForward size={16}/></button>}{error&&<span className="music-error" role="status">{error}</span>}</div>
}
