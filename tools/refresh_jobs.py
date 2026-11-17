"""Refresh curated game/AI jobs from public Greenhouse boards. No third-party packages."""
import datetime, html, json, re, urllib.request, urllib.error
from pathlib import Path
from html.parser import HTMLParser

ROOT = Path(__file__).resolve().parents[1]
FILE = ROOT / 'src/content/jobs.json'
BOARDS = {'epicgames':'Epic Games','riotgames':'Riot Games','roblox':'Roblox','scopely':'Scopely','2k':'2K','escapevelocityentertainmentinc':'Escape Velocity Entertainment','neteasegames':'NetEase Games','gsgcareers':'Ghost Story Games','studiokraftonboard':'KRAFTON Montréal Studio','tripledotstudios':'Tripledot Studios','rushdownstudios':'Rushdown Studios','digitalextremes':'Digital Extremes','wooga':'Wooga','goodjobgames':'Good Job Games','atariinc':'Atari'}
BOARDS['insomniac'] = 'Insomniac Games'
CITIES = {
 'cary':('United States','North America',35.7915,-78.7811),'montreal':('Canada','North America',45.5019,-73.5674),
 'montréal':('Canada','North America',45.5019,-73.5674),'vancouver':('Canada','North America',49.2827,-123.1207),
 'london':('United Kingdom','Europe',51.5072,-0.1276),'porto alegre':('Brazil','South America',-30.0346,-51.2177),
 'bellevue':('United States','North America',47.6101,-122.2015),'los angeles':('United States','North America',34.0522,-118.2437),
 'san mateo':('United States','North America',37.5630,-122.3255),'san francisco':('United States','North America',37.7749,-122.4194),
 'barcelona':('Spain','Europe',41.3874,2.1686),'tokyo':('Japan','Asia',35.6762,139.6503),
 'bangalore':('India','Asia',12.9716,77.5946),'bengaluru':('India','Asia',12.9716,77.5946),
 'brighton':('United Kingdom','Europe',50.8225,-0.1372),'dublin':('Ireland','Europe',53.3498,-6.2603),
 'novato':('United States','North America',38.1074,-122.5697),'burnaby':('Canada','North America',49.2488,-122.9805),
 'shanghai':('China','Asia',31.2304,121.4737),'sydney':('Australia','Oceania',-33.8688,151.2093),
 'seoul':('South Korea','Asia',37.5665,126.9780),'austin':('United States','North America',30.2672,-97.7431),
 'culver city':('United States','North America',34.0211,-118.3965),'gurugram':('India','Asia',28.4595,77.0266),
 'singapore':('Singapore','Asia',1.3521,103.8198),'stockholm':('Sweden','Europe',59.3293,18.0686),
 'new york':('United States','North America',40.7128,-74.0060),'paris':('France','Europe',48.8566,2.3522),
 'berlin':('Germany','Europe',52.52,13.405),'seattle':('United States','North America',47.6062,-122.3321),
 'helsinki':('Finland','Europe',60.1699,24.9384),'mexico city':('Mexico','North America',19.4326,-99.1332),
 'istanbul':('Turkey','Europe',41.0082,28.9784),'jakarta':('Indonesia','Asia',-6.2088,106.8456),'tbilisi':('Georgia','Asia',41.7151,44.8271),'tblisi':('Georgia','Asia',41.7151,44.8271),
 'minsk':('Belarus','Europe',53.9006,27.5590),'warsaw':('Poland','Europe',52.2297,21.0122),
 'dallas':('United States','North America',32.7767,-96.7970),'tel aviv':('Israel','Asia',32.0853,34.7818),
 'kyiv':('Ukraine','Europe',50.4501,30.5234),'lviv':('Ukraine','Europe',49.8397,24.0297),
 'bucharest':('Romania','Europe',44.4268,26.1025),'ho chi minh city':('Vietnam','Asia',10.8231,106.6297),
 'dundee':('United Kingdom','Europe',56.4620,-2.9707),'seville':('Spain','Europe',37.3891,-5.9845),
 'newcastle':('United Kingdom','Europe',54.9783,-1.6178),'manchester':('United Kingdom','Europe',53.4808,-2.2426),
}
PATTERN = re.compile(r'\b(?:AI|artificial intelligence|machine learning|generative AI|genAI)\b', re.I)
HYBRID = re.compile(r'\b(?:on (?:a )?hybrid basis|hybrid\s+(?:working|work(?:ing)? model|work schedule|schedule|arrangement|basis|with|[0-9])|work(?:ing)?\s+(?:in\s+)?(?:a\s+)?hybrid)\b', re.I)
CREATIVE = re.compile(r'\b(?:game|gameplay|developer|programmer|engineer|designer|artist|animator|animation|quality|tools)\b', re.I)
SKILLS = ['Unreal Engine','Unity','Godot','Python','C++','C#','Java','Lua','GDScript','Machine Learning','Generative AI','LLM','Deep Learning','PyTorch','TensorFlow','Photoshop','Illustrator','Figma','Blender','Maya','Houdini','ZBrush','Substance Painter','After Effects','Premiere Pro','Stable Diffusion','ComfyUI','Flux','Midjourney','GitHub','Git','Jira','Confluence','SQL','TypeScript','JavaScript','Docker','Kubernetes','AWS','Google Cloud','Azure','CMake','Perforce','Blueprints','3D Studio Max','3ds Max','Aseprite','LibreSprite','Solar2D','Defold','Panda3D','LLMs','Claude Code','Codex','GitHub Copilot','ChatGPT','Cinema 4D','Octane Render','Premiere Pro','Visual Studio','Terraform','Datadog','Kibana','Miro','Excel','PowerPoint','Shader Graph','HLSL','Ruby','Unreal','CryEngine','Cinema4D','Fiddler','Firebug','Charles Proxy','MySQL','PostgreSQL','Prometheus','Grafana','K6','Locust','NATS','A1111']

class ListingBlocks(HTMLParser):
 def __init__(self):
  super().__init__(convert_charrefs=True); self.stack=[]; self.blocks=[]; self.order=0
 def handle_starttag(self,tag,attrs):
  if tag in ('h1','h2','h3','h4','h5','h6','p','li'):
   self.order+=1;self.stack.append([tag,self.order,[]])
  elif tag=='br' and self.stack: self.stack[-1][2].append(' ')
 def handle_data(self,data):
  if self.stack: self.stack[-1][2].append(data)
 def handle_endtag(self,tag):
  if self.stack and self.stack[-1][0]==tag:
   kind,order,parts=self.stack.pop();value=re.sub(r'\s+',' ',''.join(parts)).strip()
   if value:self.blocks.append((order,kind,value))

REQUIRED_HEADING=re.compile(r"(?:requirements?|qualifications?|eligibility|required skills|what (?:we|you).{0,25}(?:looking for|bring|need)|what you.ll (?:need|bring)|who you are|your (?:profile|skills|experience)|about you|must.have|what you have|you have|you should have|your background|your expertise|your toolkit|your player profile|votre profil|knowledge and experience|knowledge/skills|connaissances/compétences)",re.I)
PREFERRED_HEADING=re.compile(r"(?:nice.to.have|bonus|preferred|desirable|desired skills|extra credit|would be a plus|additional (?:skills|qualifications))",re.I)
END_HEADING=re.compile(r"(?:benefits|perks|what we offer|working at|about (?:us|the company|scopely)|equal opportunity|compensation|salary|how to apply|responsibilities|what you.ll do|what you will do|why join|why krafton|pourquoi krafton|our benefits|open to applicants|open in [0-9]+ countries|job expectations|fair employment)",re.I)

def short_requirement(value):
 # Keep factual requirements in short, source-linked fragments; the original
 # listing remains the authority for context and the full wording.
 value=re.sub(r'\s+',' ',value).strip(' •–—:-')
 words=value.split()
 return value if len(words)<=12 else ' '.join(words[:12]).rstrip(',;:')+'…'

def mentioned_tools(text):
 matches=list(dict.fromkeys(skill for skill in SKILLS if skill not in ('Machine Learning','Generative AI','LLM','LLMs','Deep Learning') and re.search(r'(?<![\w])'+re.escape(skill)+r'(?![\w])',text,re.I)))
 if 'Unreal Engine' in matches and 'Unreal' in matches: matches.remove('Unreal')
 return matches

def extract_requirements(markup, qualifications_only=False, abbreviated=True):
 parser=ListingBlocks();parser.feed(html.unescape(markup or ''));blocks=sorted(parser.blocks)
 mode='required' if qualifications_only else None; result=[];seen=set(); section_has_li=False
 for _,kind,value in blocks:
  # A few sources put bullet characters in a paragraph instead of HTML <li>s.
  if kind=='p' and '•' in value:
   prefix,*items=value.split('•')
   if PREFERRED_HEADING.search(prefix): mode='preferred'
   elif REQUIRED_HEADING.search(prefix): mode='required'
   for item in items:
    clean=item.strip()
    if clean and mode:
     short=short_requirement(clean) if abbreviated else clean;key=short.casefold()
     if key not in seen:result.append({'text':short,'kind':mode,'tools':mentioned_tools(clean)});seen.add(key)
   continue
  heading=kind.startswith('h') or (kind=='p' and len(value)<140 and not re.search(r'[.!?]$',value))
  if heading:
   if PREFERRED_HEADING.search(value): mode='preferred';section_has_li=False;continue
   if REQUIRED_HEADING.search(value): mode='required';section_has_li=False;continue
   if END_HEADING.search(value): mode=None;continue
   if kind.startswith('h') or value.endswith(':') or value.isupper(): mode=None;continue
   if kind=='p' and len(value.split())<=8 and not value.endswith('.') and (section_has_li or re.search(r'\b(?:skills|qualifications|experience|education|toolkit)\b$',value,re.I)): continue
  if kind not in ('li','p') or mode is None:continue
  if kind=='p' and section_has_li and not re.search(r'\bauthorized to work\b.*\b(?:visa|sponsorship)\b',value,re.I): mode=None;continue
  if kind=='li': section_has_li=True
  clean=value.strip(' •–—:-');short=short_requirement(clean) if abbreviated else clean;key=short.casefold()
  if abbreviated and re.search(r'authorized to work for any employer in the United States.*will not require work visa sponsorship',clean,re.I):
   short='US work authorisation required; no current or future visa sponsorship.';key=short.casefold()
  if len(clean)<4 or key in seen:continue
  optional=re.search(r'\b(?:a bonus|a plus|nice to have|preferred|is a plus|desirable|beneficial but not required)\b',clean,re.I)
  item_mode=('mixed' if optional and re.search(r'[.!?]\s+\S',clean[:optional.start()]) else 'preferred') if optional else mode
  seen.add(key);result.append({'text':short,'kind':item_mode,'tools':mentioned_tools(clean)})
 return result

def request(url):
 req=urllib.request.Request(url,headers={'User-Agent':'AI-Game-Makers-Club-Job-Board/1.0 (public job listings)'})
 with urllib.request.urlopen(req,timeout=35) as r: return r.read().decode('utf-8')

# Keep the board focused on roles that do not explicitly demand seniority.
EARLY_TITLE = re.compile(r'\b(?:junior|jr\.?|intern|internship|graduate|new[ -]grad|entry[ -]level|associate)\b',re.I)
SENIOR_TITLE = re.compile(r"\b(?:senior|sr\.?|lead|principal|staff|director|head|vice[ -]president|vp|chief|manager|supervisor|architect|distinguished|expert)\b", re.I)
SENIOR_LEVEL = re.compile(r"\b(?:senior|executive|director|mid[ -]senior)\b", re.I)
YEARS = re.compile(r"(?<![\d\-–])\b(\d{1,2}|five|six|seven|eight|nine|ten)\s*(?:\+|(?:-|–|to)\s*\d+\+?)?\s*(?:years?|yrs?)\b", re.I)

def senior_role(title, requirements=(), level=''):
 if SENIOR_TITLE.search(title) or SENIOR_LEVEL.search(level or ''): return True
 for item in requirements:
  if item.get('kind')=='preferred': continue
  line=item.get('text','')
  if re.search(r'\bexperience\s*:\s*(?:mid[ -])?senior',line,re.I): return True
  for match in YEARS.finditer(line):
   number=match.group(1).lower(); years=int(number) if number.isdigit() else {'five':5,'six':6,'seven':7,'eight':8,'nine':9,'ten':10}[number]
   if years>=5 and re.search(r'\b(?:experience|professional|minimum|at least|working|worked|practice)\b',line,re.I): return True
 return False

def is_remote_listing(title, location, metadata):
 if re.search(r'\b(?:on[ -]site|in[ -]office)\b',title,re.I): return False
 return bool(re.search(r'\bremote\b',title+' '+location,re.I) or metadata.get('Careers Page Remote Eligible')=='Yes')

def remote_locations(location, mode):
 # Some postings combine remote countries and an onsite office in one listing.
 if mode == 'Remote eligible' and ';' in location and re.search(r'\bremote\b',location,re.I):
  return '; '.join(part.strip() for part in location.split(';') if re.search(r'\bremote\b',part,re.I))
 return location

def is_hybrid_listing(title, text, raw_location):
 raw_location=raw_location.lower()
 explicit=bool(HYBRID.search(text) or HYBRID.search(title) or HYBRID.search(raw_location))
 if 'remote' in raw_location or (not any(re.search(r'(?<!\w)'+re.escape(name)+r'(?!\w)',raw_location) for name in CITIES) and re.search(r'\bremote(?:ly)?\b',text,re.I)):
  return False
 return explicit

def superspline_junior_requirements(markup):
 """Return the junior role's requirements, None if removed, or raise for an ambiguous page."""
 body=html.unescape(markup)
 if not re.search(r'Open Positions',body,re.I): raise ValueError('Unrecognised careers page')
 headings=list(re.finditer(r'<h3\b[^>]*>.*?</h3>',body,re.I|re.S))
 junior=next((i for i,m in enumerate(headings) if re.search(r'Junior\s+3D\s+Games\s+Animator',re.sub(r'<[^>]+>',' ',m.group()),re.I)),None)
 if junior is None: return None
 start=headings[junior].end();end=headings[junior+1].start() if junior+1<len(headings) else len(body)
 section=body[start:end]
 plain=re.sub(r'<[^>]+>',' ',section)
 if not re.search(r'UK\s+Remote',plain,re.I) or not re.search(r'APPLY\s+HERE',plain,re.I): raise ValueError('Junior role availability or location is unclear')
 parser=ListingBlocks();parser.feed(section);result=[];in_list=False
 for _,kind,value in sorted(parser.blocks):
  if kind=='li':
   in_list=True;optional=bool(re.search(r'\b(?:a plus|preferred|bonus)\b',value,re.I))
   result.append({'text':short_requirement(value),'kind':'preferred' if optional else 'required','tools':mentioned_tools(value)})
  elif in_list and kind=='p': break
 if not result: raise ValueError('Junior requirements not found')
 return result

def refresh():
 old=json.loads(FILE.read_text(encoding='utf-8')); today=datetime.date.today().isoformat()
 out=[]; failures=[]
 # Existing curated third-party listings: 200 alone is not proof of availability.
 for j in old['jobs']:
  if j.get('sourceId','').startswith(('gh:','sr:')): continue
  if j.get('sourceId')=='custom:superspline-junior':
   try:
    found=superspline_junior_requirements(request(j['url']))
    if found is None: continue
    if senior_role(j['title'],found): continue
    j['requirementsList']=found;j['skills']=list(dict.fromkeys(tool for item in found for tool in item['tools']));j['checkedAt']=today
   except Exception as e: failures.append(f"{j['url']}: {e}")
   out.append(j);continue
  try:
   body=request(j['url'])
   if 'apply now' in body.lower() and j['title'].lower() in html.unescape(body).lower():
    j['checkedAt']=today
    found=extract_requirements(body)
    if found: j['requirementsList']=found
    if senior_role(j['title'],extract_requirements(body,abbreviated=False)): continue
  except urllib.error.HTTPError as e:
   if e.code in (404,410): continue
   failures.append(f"{j['url']}: {e}")
  except Exception as e: failures.append(f"{j['url']}: {e}")
  if not senior_role(j['title'],j.get('requirementsList',[])): out.append(j)
 for slug,company in BOARDS.items():
  try:
   payload=json.loads(request(f'https://boards-api.greenhouse.io/v1/boards/{slug}/jobs?content=true'))
   if not isinstance(payload.get('jobs'),list): raise ValueError('Missing jobs list')
  except Exception as e:
   failures.append(f'{company}: {e}')
   out.extend(j for j in old['jobs'] if j.get('sourceId')=='gh:'+slug)
   continue
  for item in payload['jobs']:
   title=item.get('title','').strip()
   if senior_role(title,extract_requirements(item.get('content',''),abbreviated=False)): continue
   text=html.unescape(re.sub(r'<[^>]+>', ' ', html.unescape(item.get('content',''))))
   # Require AI in the role title or a specific stated AI tool skill in a game-creation role.
   workflow=bool(re.search(r'\b(?:experience|proficiency|proficient|hands.on|using|use of)\b.{0,75}\b(?:AI tools|generative AI|AI-powered tools|AI-assisted|LLMs?)\b',text,re.I))
   creative=bool(re.search(r'\b(?:game|gameplay|artist|animat|creative|design|tools programmer)\b',title,re.I))
   explicit_hybrid=is_hybrid_listing(title,text,item.get('location',{}).get('name',''))
   location=item.get('location',{}).get('name','').strip().replace('BLANK,BLANK,','')
   meta={x.get('name',''):x.get('value') for x in (item.get('metadata') or []) if isinstance(x,dict)}
   explicit_onsite=bool(re.search(r'\b(?:on[ -]site|in[ -]office)\b',title,re.I))
   explicit_remote=is_remote_listing(title,location,meta)
   # This studio's board contains many onsite-only internships; add only
   # explicitly remote early-career roles to the remote-focused collection.
   if slug=='insomniac' and not (explicit_remote and EARLY_TITLE.search(title)): continue
   ai_role=bool(PATTERN.search(title) or (workflow and creative))
   if not ai_role and not ((explicit_remote or explicit_hybrid or EARLY_TITLE.search(title)) and CREATIVE.search(title)): continue
   if re.search(r'\b(?:HR systems|enterprise security|enterprise data|enterprise AI|advertis|ads |ad platform)\b',title,re.I): continue
   if not ai_role: category='Game industry - AI mentioned' if PATTERN.search(text) else 'Game industry - AI not specified'
   elif re.search(r'\b(?:NPC|behaviou?r trees?|enemy behaviors?|gameplay AI)\b',text,re.I) and not re.search(r'\b(?:generative AI|LLM|large language model)\b',text,re.I): category='Gameplay AI & NPCs'
   elif workflow and not PATTERN.search(title): category='AI tools in game work'
   else: category='AI & machine learning in gaming'
   skills=[skill for skill in SKILLS if re.search(r'(?<![\w])'+re.escape(skill)+r'(?![\w])',text,re.I)]
   mode='Not specified'; loclower=location.lower()
   if explicit_onsite: mode='On-site'
   elif explicit_hybrid: mode='Hybrid'
   elif explicit_remote: mode='Remote eligible'
   elif meta.get('Careers Page Remote Eligible')=='No': mode='Location based'
   elif re.search(r'\b(?:on-site|onsite|in-office) (?:role|position|work|schedule)\b',text,re.I): mode='On-site'
   matches=[(name,info) for name,info in CITIES.items() if re.search(r'(?<!\w)'+re.escape(name)+r'(?!\w)',loclower)]
   city=matches[0] if len(matches)==1 else None
   if city and city[0]=='tblisi': city=('tbilisi',city[1])
   if city and city[0]=='london' and re.search(r'\bontario\b',loclower): city=('london, ontario',('Canada','North America',42.9849,-81.2453))
   eligible_location=remote_locations(location,mode)
   countries=[city[1][0]] if city and mode != 'Remote eligible' else []
   regions=[city[1][1]] if city and mode != 'Remote eligible' else []
   country_regions={'Turkey':'Europe','United States':'North America','Canada':'North America','Brazil':'South America','United Kingdom':'Europe','Spain':'Europe','Czech Republic':'Europe','Japan':'Asia','India':'Asia','Australia':'Oceania','France':'Europe','Germany':'Europe','Singapore':'Asia','China':'Asia','Ireland':'Europe','Sweden':'Europe','Mexico':'North America'}
   if re.search(r'\b(?:US|USA)\s*\(Remote\)',eligible_location,re.I): countries.append('United States'); regions.append('North America')
   for country, area in country_regions.items():
    if re.search(r'(?<!\w)'+re.escape(country)+r'(?!\w)',eligible_location,re.I):
     if country not in countries: countries.append(country)
     if area not in regions: regions.append(area)
   if mode=='Remote eligible' and re.search(r'\bEurope\b',eligible_location,re.I) and 'Europe' not in regions: regions.append('Europe')
   pay='See listing'; pay_note='Check source for pay'
   if slug=='insomniac' and re.search(r'fixed hourly pay rate',text,re.I):
    match=re.search(r'Intern Pay Range\s*\$([\d,.]+)\s*[-–—]\s*\$([\d,.]+)\s*USD',text,re.I)
    if match: pay=f'${match.group(1)}–${match.group(2)}/hour';pay_note='USD per hour; internship rate'
   job={'id':f'gh-{slug}-{item["id"]}','sourceId':'gh:'+slug,'title':title,'company':company,
        'sourceLabel':'Official careers page','url':item['absolute_url'],'category':category,
        'pay':pay,'payNote':pay_note,'location':eligible_location or 'See listing',
        'countries':countries,'regions':regions,'posted':(item.get('first_published') or '')[:10],
        'requirementsList':extract_requirements(item.get('content','')),
        'skills':skills[:8], 'summary':('The listing does not specify AI.' if category=='Game industry - AI not specified' else 'AI is mentioned; check the listing for context.' if category=='Game industry - AI mentioned' else 'Explore this AI-related role at a games company. Check the source for the role’s focus.'),
        'requirements':'See the official listing for experience, qualifications and role details.',
        'employment':'See listing','checkedAt':today,'workMode':mode}
   if city and mode in ('Hybrid','On-site'):
    job['coordinates']={'lat':city[1][2],'lon':city[1][3],'city':city[0].title()}
   out.append(job)
 # SmartRecruiters publishes an explicit hybrid flag and city coordinates for Gameloft.
 sr_source='sr:Gameloft'; sr_old={j['id']:j for j in old['jobs'] if j.get('sourceId')==sr_source}
 try:
  payload=json.loads(request('https://api.smartrecruiters.com/v1/companies/Gameloft/postings?limit=100&offset=0'))
  entries=payload['content']; total=payload['totalFound']
  if not isinstance(entries,list) or total>len(entries): raise ValueError('Incomplete Gameloft list')
 except Exception as e:
  failures.append(f'Gameloft: {e}');out.extend(sr_old.values())
 else:
  area={'us':'North America','ca':'North America','br':'South America','es':'Europe','fr':'Europe','gb':'Europe','uk':'Europe','de':'Europe','ro':'Europe','ua':'Europe','pl':'Europe','vn':'Asia','in':'Asia','sg':'Asia','id':'Asia','jp':'Asia','au':'Oceania','nz':'Oceania'}
  for entry in entries:
   loc=entry.get('location',{}); title=entry.get('name','').strip(); id='sr-gameloft-'+entry['id']
   if not (loc.get('hybrid') or loc.get('remote')) or not CREATIVE.search(title) or senior_role(title,level=entry.get('experienceLevel',{}).get('label','')): continue
   try:
    detail=json.loads(request(entry['ref']))
    parts=detail['jobAd']['sections']; text=' '.join(html.unescape(re.sub(r'<[^>]+>',' ',parts.get(k,{}).get('text','') or '')) for k in ('jobDescription','qualifications'))
    url=detail['postingUrl']
    if senior_role(title,extract_requirements(parts.get('qualifications',{}).get('text',''),True,False)): continue
   except Exception as e:
    failures.append(f'Gameloft {id}: {e}')
    if id in sr_old: out.append(sr_old[id])
    continue
   is_ai=bool(PATTERN.search(title) or re.search(r'\b(?:experience|proficiency|proficient|hands.on|using|use of)\b.{0,75}\b(?:AI tools|generative AI|AI-powered tools|AI-assisted|LLMs?)\b',text,re.I))
   code=loc.get('country','').lower(); country=next((f['valueLabel'] for f in entry.get('customField',[]) if f.get('fieldLabel')=='Country/Region'),'')
   job={'id':id,'sourceId':sr_source,'title':title,'company':'Gameloft','sourceLabel':'Official careers page','url':url,
    'category':'AI & machine learning in gaming' if is_ai else 'Game industry - AI mentioned' if PATTERN.search(text) else 'Game industry - AI not specified',
    'pay':'See listing','payNote':'Check source for pay','location':loc.get('fullLocation') or loc.get('city','See listing'),
    'countries':[country] if country else [],'regions':[area[code]] if code in area else [],'posted':(entry.get('releasedDate') or '')[:10],
    'requirementsList':extract_requirements(parts.get('qualifications',{}).get('text',''),True),
    'skills':[x for x in SKILLS if re.search(r'(?<![\w])'+re.escape(x)+r'(?![\w])',text,re.I)][:8],
    'summary':'Explore this role at a games company. Check the listing for its requirements.',
    'requirements':'See the official listing for experience, qualifications and role details.',
    'employment':entry.get('typeOfEmployment',{}).get('label','See listing'),'checkedAt':today,'workMode':'Hybrid' if loc.get('hybrid') else 'Remote eligible'}
   try:
    if job['workMode']=='Hybrid' and loc.get('city') and loc.get('latitude') and loc.get('longitude'):
     job['coordinates']={'lat':float(loc['latitude']),'lon':float(loc['longitude']),'city':loc['city']}
   except (TypeError,ValueError): pass
   out.append(job)
 if len(failures)>=len(BOARDS)+1+len([j for j in old['jobs'] if not j.get('sourceId','').startswith(('gh:','sr:'))]): raise SystemExit('Every source failed; data was not changed')
 out=[j for j in out if not senior_role(j.get('title',''),j.get('requirementsList',[]))]
 out.sort(key=lambda j:(j.get('posted',''),j.get('title','')),reverse=True)
 FILE.write_text(json.dumps({'lastUpdated':today,'jobs':out},ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
 print(f'{len(out)} jobs; {len([x for x in out if x.get("coordinates")])} mappable; {len(failures)} source errors')
 for failure in failures: print('WARNING:',failure)

if __name__=='__main__': refresh()

