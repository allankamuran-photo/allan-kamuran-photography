import tempfile,unittest
from pathlib import Path
from PIL import Image
from import_photos import import_photos
class ImportPhotosTest(unittest.TestCase):
    def test_capture_dates_and_unknown_dates(self):
        with tempfile.TemporaryDirectory() as folder:
            root=Path(folder);nature=root/'Images'/'Travel';nature.mkdir(parents=True)
            for name,date in [('old','2021:05:10 13:45:00'),('new','2025:01:02 09:10:00'),('unknown',None)]:
                image=Image.new('RGB',(20,30));exif=Image.Exif()
                if date:exif[36867]=date
                image.save(nature/f'{name}.jpg',exif=exif)
            records=import_photos(root/'Images',root/'out')
            self.assertEqual([r['year'] for r in records],[2025,2021,None])
            self.assertEqual(len(list((root/'out').glob('*.webp'))),6)
            self.assertEqual(len(list(nature.glob('*.jpg'))),3)
            self.assertFalse(any(r['sample'] for r in records))
    def test_imports_more_than_twenty(self):
        with tempfile.TemporaryDirectory() as folder:
            root=Path(folder);travel=root/'Images'/'Travel';travel.mkdir(parents=True)
            for i in range(22):Image.new('RGB',(5,5)).save(travel/f'{i}.jpg')
            self.assertEqual(len(import_photos(root/'Images',root/'out')),22)
if __name__=='__main__':unittest.main()
