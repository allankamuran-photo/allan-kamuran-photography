from pathlib import Path
import hashlib,json,shutil
ROOT=Path(__file__).resolve().parents[1]
def import_music():
    tracks=[]
    for source in sorted((ROOT/'Music').rglob('*')):
        if source.suffix.lower() not in {'.mp3','.m4a','.ogg','.wav','.aac','.flac'}:continue
        identity=hashlib.sha256(source.name.encode()).hexdigest()[:12]+source.suffix.lower()
        target=ROOT/'public'/'music'/identity;target.parent.mkdir(parents=True,exist_ok=True)
        shutil.copy2(source,target)
        tracks.append({'src':'/music/'+identity,'title':source.stem.replace('_',' ')})
    (ROOT/'lib'/'music.json').write_text(json.dumps(tracks,ensure_ascii=False,indent=2)+'\n')
    print(f'Imported {len(tracks)} music tracks')
if __name__=='__main__':import_music()
