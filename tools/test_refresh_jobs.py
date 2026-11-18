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
  self.workablepatch=patch.object(bot,'WORKABLE_BOARDS',{});self.workablepatch.start();self.addCleanup(self.workablepatch.stop)
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
 def test_custom_listing_keeps_check_date_when_source_is_unavailable(self):
  self.file.write_text(json.dumps({'lastUpdated':'2026-01-01','jobs':[{'id':'junior','sourceId':'custom:superspline-junior','title':'Junior Animator','url':'https://example.com/jobs','checkedAt':'2026-01-01'}]}),encoding='utf-8')
  def fetch(url):
   if 'example.com' in url: raise OSError('unavailable')
   if 'greenhouse' in url: return json.dumps({'jobs':[]})
   return json.dumps({'content':[],'totalFound':0})
  self.run_bot(fetch)
  jobs=json.loads(self.file.read_text(encoding='utf-8'))['jobs'];self.assertEqual(jobs[0]['checkedAt'],'2026-01-01')
 def test_unavailable_workable_feed_preserves_previous_check(self):
  self.file.write_text(json.dumps({'lastUpdated':'2026-01-01','jobs':[{'id':'workable-storytoys-old','sourceId':'workable:storytoys','title':'Junior Artist','checkedAt':'2026-01-01'}]}),encoding='utf-8')
  def fetch(url):
   if 'workable' in url: raise OSError('unavailable')
   if 'greenhouse' in url: return json.dumps({'jobs':[]})
   return json.dumps({'content':[],'totalFound':0})
  with patch.object(bot,'WORKABLE_BOARDS',{'storytoys':'StoryToys'}): self.run_bot(fetch)
  jobs=json.loads(self.file.read_text(encoding='utf-8'))['jobs'];self.assertEqual(jobs[0]['checkedAt'],'2026-01-01')
class HybridTests(unittest.TestCase):
 def test_work_arrangement_is_not_confused_with_game_genre(self):
  self.assertFalse(bot.is_hybrid_listing('Game Designer (Hybrid Casual)','Build a hybrid casual mobile game.','Barcelona, Spain'))
  self.assertTrue(bot.is_hybrid_listing('Game Designer','Join our Barcelona team on a hybrid basis.','Barcelona, Spain'))
 def test_remote_location_is_not_mislabelled_by_other_office(self):
  self.assertFalse(bot.is_hybrid_listing('Game Engineer','Hybrid work in Barcelona or remotely in the UK.','United Kingdom'))
  self.assertFalse(bot.is_hybrid_listing('Platform Engineer','Our company has a hybrid work model.','United States (Remote)'))
  self.assertFalse(bot.is_hybrid_listing('Engineer','Remote basis in the United States or Mexico City on a hybrid basis.','United States'))

class RequirementTests(unittest.TestCase):
 def test_required_and_preferred_with_short_source_excerpts(self):
  markup = "<h2>Requirements</h2><ul><li>Experience with Unity and C#</li></ul><h2>Nice to have</h2><ul><li>Blender experience</li></ul><h2>Benefits</h2><ul><li>Paid holiday</li></ul>"
  result=bot.extract_requirements(markup)
  self.assertEqual([x['kind'] for x in result],['required','preferred'])
  self.assertEqual(result[0]['tools'],['Unity','C#'])
  self.assertNotIn('Paid holiday',str(result))
 def test_bullets_in_paragraph_and_company_heading_stop(self):
  markup='<p>Qualifications:</p><p>• Python experience • Godot experience</p><p>Why Krafton Montreal</p><ul><li>Free games</li></ul>'
  result=bot.extract_requirements(markup);self.assertEqual([x['text'] for x in result],['Python experience','Godot experience'])
 def test_requirements_in_plain_paragraphs(self):
  result=bot.extract_requirements('<p>Requirements:</p><p>3+ years of experience in animation.</p><p>Experience with Maya.</p>')
  self.assertEqual(len(result),2)
 def test_requirement_subheadings_keep_full_requirement_section(self):
  result=bot.extract_requirements('<h2>Requirements</h2><p>Design Skills</p><ul><li>Good portfolio</li></ul><p>Education & Experience</p><ul><li>5-7 years of experience as a designer.</li></ul>')
  self.assertEqual(len(result),2)
  self.assertTrue(bot.senior_role('Designer',result))
 def test_a_paragraph_after_a_list_is_not_a_requirement(self):
  markup='<h2>Requirements</h2><ul><li>Experience with Python</li></ul><p>We provide equal opportunities for everyone.</p>'
  result=bot.extract_requirements(markup);self.assertEqual([x['text'] for x in result],['Experience with Python'])
 def test_no_requirements_section_returns_no_fabricated_bullets(self):
  self.assertEqual(bot.extract_requirements('<h2>About us</h2><ul><li>We love games</li></ul>'),[])
 def test_eligibility_and_optional_internship_experience(self):
  markup='<h2>Requirements</h2><li>Experience is beneficial but not required.</li><p>Eligibility:</p><li>Currently enrolled student.</li><p>Applicants must be authorized to work for any employer in the United States and will not require work visa sponsorship.</p>'
  result=bot.extract_requirements(markup)
  self.assertEqual([x['kind'] for x in result],['preferred','required','required'])
  self.assertIn('no current or future visa sponsorship',result[-1]['text'])
 def test_long_requirement_is_short(self):
  result=bot.extract_requirements('<h2>Requirements</h2><li>One two three four five six seven eight nine ten eleven twelve thirteen fourteen</li>')
  self.assertLessEqual(len(result[0]['text'].split()),12)

class SeniorityTests(unittest.TestCase):
 def test_rejects_senior_and_lead_titles(self):
  for title in ['Senior Game Designer','Lead 2D Artist','Principal Engineer','Staff Programmer','Game Developer (Godot Expert)','3D Artist (Middle/Senior)','Distinguished Engineer']:
   self.assertTrue(bot.senior_role(title),title)
 def test_rejects_five_plus_years_or_explicit_senior_level(self):
  self.assertTrue(bot.senior_role('Game Developer',[{'text':'At least 5 years of game development experience','kind':'required'}]))
  self.assertTrue(bot.senior_role('Game Developer',[{'text':'Experience: Mid-Senior level','kind':'required'}]))
  self.assertTrue(bot.senior_role('Game Developer',level='Mid-Senior Level'))
  self.assertTrue(bot.senior_role('Animator',[{'text':'5+ years of professional animation experience. Game credits preferred.','kind':'mixed'}]))
 def test_keeps_junior_and_non_senior_experience(self):
  self.assertFalse(bot.senior_role('Junior Gameplay Developer',[{'text':'1 to 2 years of professional experience','kind':'required'}]))
  self.assertFalse(bot.senior_role('Game Designer',[{'text':'3-6+ years of professional game design experience','kind':'required'}]))
  self.assertFalse(bot.senior_role('Game Designer',[{'text':'5 years of experience is a plus','kind':'preferred'}]))

class RemoteTests(unittest.TestCase):
 def test_remote_and_onsite_titles(self):
  self.assertTrue(bot.is_remote_listing('Junior Game Developer','United States (Remote)',{}))
  self.assertFalse(bot.is_remote_listing('Intern (On-Site)','United States (Remote)',{}))
  self.assertTrue(bot.is_remote_listing('Artist','Canada',{'Careers Page Remote Eligible':'Yes'}))
 def test_remote_country_excludes_separate_onsite_office(self):
  text='Canada-Remote; United Kingdom - Guildford Onsite; United States-Remote'
  self.assertEqual(bot.remote_locations(text,'Remote eligible'),'Canada-Remote; United States-Remote')

class SuperSplineTests(unittest.TestCase):
 def test_reads_only_junior_role_and_distinguishes_preferred(self):
  markup='<h1>Open Positions</h1><h3>Junior 3D Games Animator</h3><h4>UK Remote</h4><ul><li>Working knowledge of Maya</li><li>Game engine experience is a plus</li></ul><p>Benefits</p><ul><li>Paid holiday</li></ul><p>APPLY HERE</p><h3>Senior Animator</h3><li>5 years experience</li>'
  result=bot.superspline_junior_requirements(markup)
  self.assertEqual([x['kind'] for x in result],['required','preferred'])
  self.assertEqual(result[0]['tools'],['Maya'])
 def test_removal_and_uncertain_layout(self):
  self.assertIsNone(bot.superspline_junior_requirements('<h1>Open Positions</h1><h3>Senior Animator</h3>'))
  with self.assertRaises(ValueError): bot.superspline_junior_requirements('<h1>Access denied</h1>')
  with self.assertRaises(ValueError): bot.superspline_junior_requirements('<h1>Open Positions</h1><h3>Junior 3D Games Animator</h3><p>On-site only</p>')

class WorkableTests(unittest.TestCase):
 def test_extracts_essential_and_desirable_without_duties(self):
  markup='<p>Responsibilities</p><ul><li>Create game art</li></ul><p>Essential</p><ul><li>Portfolio is required. A degree is preferred.</li><li>Photoshop skills</li></ul><p>Desirable</p><ul><li>Unity experience</li></ul>'
  found=bot.workable_requirements(markup)
  self.assertEqual([x['kind'] for x in found],['required','preferred','required','preferred'])
  self.assertEqual(found[2]['tools'],['Photoshop'])

if __name__=='__main__':unittest.main()
