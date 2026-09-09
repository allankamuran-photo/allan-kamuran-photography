"""Import local originals without changing them; retain capture dates, not file dates."""
from pathlib import Path
from datetime import datetime
import hashlib,json
from PIL import Image,ImageOps

ROOT=Path(__file__).resolve().parents[1]
FOLDERS={'Travel':'travel','Street photography':'street','Weddings':'weddings','People':'people','Nature':'nature','Cars':'cars'}

def capture_date(image):
    exif=image.getexif()
    try: detail=exif.get_ifd(34665)
    except (KeyError,TypeError): detail={}
    # Original capture and digitized capture dates only. Never filesystem timestamps.
    for raw in [detail.get(36867),exif.get(36867),detail.get(36868),exif.get(36868)]:
        try:return datetime.strptime(str(raw),'%Y:%m:%d %H:%M:%S').isoformat()
        except (ValueError,TypeError):pass
    return None

def import_photos(input_dir,output_dir):
    records=[]
    folders={p.name.casefold():p for p in input_dir.iterdir() if p.is_dir()}
    for folder,category in FOLDERS.items():
        candidates=[]
        for source in sorted(folders.get(folder.casefold(),input_dir/folder).rglob('*')):
            if source.suffix.lower() not in {'.jpg','.jpeg','.png','.webp','.tif','.tiff'}:continue
            with Image.open(source) as image:
                date=capture_date(image)
            candidates.append((date,source))
        candidates.sort(key=lambda item:(item[0] or '',item[1].name),reverse=True)
        for date,source in candidates:
            identity=hashlib.sha256(str(source.relative_to(input_dir)).encode()).hexdigest()[:16]
            output_dir.mkdir(parents=True,exist_ok=True)
            with Image.open(source) as original:
                image=ImageOps.exif_transpose(original).convert('RGB')
                for size,suffix,quality in [(760,'thumb',82),(2200,'full',90)]:
                    resized=image.copy();resized.thumbnail((size,size))
                    resized.save(output_dir/f'{identity}-{suffix}.webp',quality=quality)
            records.append({'id':identity,'category':category,'src':f'/photos/{identity}-thumb.webp','full':f'/photos/{identity}-full.webp','alt':source.stem.replace('_',' ').replace('-',' '),'credit':'Allan Kamuran','year':int(date[:4]) if date else None,'takenAt':date,'sample':False})
    return records

if __name__=='__main__':
    records=import_photos(ROOT/'Images',ROOT/'public'/'photos')
    (ROOT/'lib'/'gallery-originals.json').write_text(json.dumps(records,ensure_ascii=False,indent=2)+'\n')
    retained={Path(r[key]).name for r in records for key in ('src','full')}
    for asset in (ROOT/'public'/'photos').glob('*-*.webp'):
        if asset.name.endswith(('-thumb.webp','-full.webp')) and asset.name not in retained: asset.unlink()
    print(f'Imported {len(records)} photographs. Photos without capture metadata remain undated.')
