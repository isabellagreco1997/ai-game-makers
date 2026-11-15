import contextlib, io, json, tempfile, unittest, urllib.error
from pathlib import Path
from unittest.mock import patch
import refresh_jobs as bot

class RefreshTests(unittest.TestCase):
 def setUp(self):
  self.temp=tempfile.TemporaryDirectory(); self.addCleanup(self.temp.cleanup)
  self.file=Path(self.temp.name)/'jobs.json'
  self.file.write_text(json.dumps({'lastUpdated':'2026-01-01','jobs':[{'id':'old','sourceId':'gh:studio','title':'Old AI role','checkedAt':'2026-01-01','posted':'2026-01-01'}, {'id':'external','title':'External Role','url':'https://example.com/job','checkedAt':'2026-01-01','posted':'2026-01-01'}]}),encoding='utf-8')
  self.filepatch=patch.object(bot,'FILE',self.file); self.filepatch.start(); self.addCleanup(self.filepatch.stop)
  self.boardpatch=patch.object(bot,'BOARDS',{'studio':'Studio'});self.boardpatch.start();self.addCleanup(self.boardpatch.stop)
 def run_bot(self, fn):
  with patch.object(bot,'request',side_effect=fn), contextlib.redirect_stdout(io.StringIO()): bot.refresh()
 def test_closed_job_removed_when_successful_feed_omits_it(self):
  self.run_bot(lambda url: json.dumps({'jobs':[]}) if 'greenhouse' in url else 'External Role Apply now')
  jobs=json.loads(self.file.read_text(encoding='utf-8'))['jobs']; self.assertEqual([j['id'] for j in jobs],['external']);self.assertNotEqual(jobs[0]['checkedAt'],'2026-01-01')
 def test_unavailable_feed_preserves_old_job_and_check_date(self):
  def fetch(url):
   if 'greenhouse' in url: raise OSError('unavailable')
   return 'External Role Apply now'
  self.run_bot(fetch)
  jobs=json.loads(self.file.read_text(encoding='utf-8'))['jobs']; old=next(j for j in jobs if j['id']=='old');self.assertEqual(old['checkedAt'],'2026-01-01')
 def test_closed_external_listing_removed_on_404(self):
  def fetch(url):
   if 'greenhouse' in url:return json.dumps({'jobs':[]})
   raise urllib.error.HTTPError(url,404,'not found',{},None)
  self.run_bot(fetch);self.assertEqual(json.loads(self.file.read_text(encoding='utf-8'))['jobs'],[])
 def test_failed_all_sources_does_not_write(self):
  before=self.file.read_text(encoding='utf-8')
  with self.assertRaises(SystemExit): self.run_bot(lambda url: (_ for _ in ()).throw(OSError('unavailable')))
  self.assertEqual(self.file.read_text(encoding='utf-8'),before)
class HybridTests(unittest.TestCase):
 def test_work_arrangement_is_not_confused_with_game_genre(self):
  self.assertFalse(bot.is_hybrid_listing('Game Designer (Hybrid Casual)','Build a hybrid casual mobile game.','Barcelona, Spain'))
  self.assertTrue(bot.is_hybrid_listing('Game Designer','Join our Barcelona team on a hybrid basis.','Barcelona, Spain'))
 def test_remote_location_is_not_mislabelled_by_other_office(self):
  self.assertFalse(bot.is_hybrid_listing('Game Engineer','Hybrid work in Barcelona or remotely in the UK.','United Kingdom'))
  self.assertFalse(bot.is_hybrid_listing('Platform Engineer','Our company has a hybrid work model.','United States (Remote)'))
  self.assertFalse(bot.is_hybrid_listing('Engineer','Remote basis in the United States or Mexico City on a hybrid basis.','United States'))

if __name__=='__main__':unittest.main()
