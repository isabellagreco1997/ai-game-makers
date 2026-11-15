"""Refresh curated game/AI jobs from public Greenhouse boards. No third-party packages."""
import datetime, html, json, re, urllib.request, urllib.error
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
FILE = ROOT / 'src/content/jobs.json'
BOARDS = {'epicgames':'Epic Games','riotgames':'Riot Games','roblox':'Roblox','scopely':'Scopely','2k':'2K','escapevelocityentertainmentinc':'Escape Velocity Entertainment','neteasegames':'NetEase Games','gsgcareers':'Ghost Story Games','studiokraftonboard':'KRAFTON Montréal Studio','tripledotstudios':'Tripledot Studios','rushdownstudios':'Rushdown Studios','digitalextremes':'Digital Extremes','wooga':'Wooga'}
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
 'jakarta':('Indonesia','Asia',-6.2088,106.8456),'tbilisi':('Georgia','Asia',41.7151,44.8271),'tblisi':('Georgia','Asia',41.7151,44.8271),
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
SKILLS = ['Unreal Engine','Unity','Godot','Python','C++','C#','Java','Lua','GDScript','Machine Learning','Generative AI','LLM','Deep Learning','PyTorch','TensorFlow']

def request(url):
 req=urllib.request.Request(url,headers={'User-Agent':'AI-Game-Makers-Club-Job-Board/1.0 (public job listings)'})
 with urllib.request.urlopen(req,timeout=35) as r: return r.read().decode('utf-8')

def is_hybrid_listing(title, text, raw_location):
 raw_location=raw_location.lower()
 explicit=bool(HYBRID.search(text) or HYBRID.search(title) or HYBRID.search(raw_location))
 if 'remote' in raw_location or (not any(re.search(r'(?<!\w)'+re.escape(name)+r'(?!\w)',raw_location) for name in CITIES) and re.search(r'\bremote(?:ly)?\b',text,re.I)):
  return False
 return explicit

def refresh():
 old=json.loads(FILE.read_text(encoding='utf-8')); today=datetime.date.today().isoformat()
 out=[]; failures=[]
 # Existing curated third-party listings: 200 alone is not proof of availability.
 for j in old['jobs']:
  if j.get('sourceId','').startswith(('gh:','sr:')): continue
  try:
   body=request(j['url']).lower()
   if 'apply now' in body and j['title'].lower() in html.unescape(body): j['checkedAt']=today
  except urllib.error.HTTPError as e:
   if e.code in (404,410): continue
   failures.append(f"{j['url']}: {e}")
  except Exception as e: failures.append(f"{j['url']}: {e}")
  out.append(j)
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
   text=html.unescape(re.sub(r'<[^>]+>', ' ', html.unescape(item.get('content',''))))
   # Require AI in the role title or a specific stated AI tool skill in a game-creation role.
   workflow=bool(re.search(r'\b(?:experience|proficiency|proficient|hands.on|using|use of)\b.{0,75}\b(?:AI tools|generative AI|AI-powered tools|AI-assisted|LLMs?)\b',text,re.I))
   creative=bool(re.search(r'\b(?:game|gameplay|artist|animat|creative|design|tools programmer)\b',title,re.I))
   explicit_hybrid=is_hybrid_listing(title,text,item.get('location',{}).get('name',''))
   ai_role=bool(PATTERN.search(title) or (workflow and creative))
   if not ai_role and not (explicit_hybrid and CREATIVE.search(title)): continue
   if re.search(r'\b(?:HR systems|enterprise security|enterprise data|enterprise AI|advertis|ads |ad platform)\b',title,re.I): continue
   if not ai_role: category='Game industry - AI mentioned' if PATTERN.search(text) else 'Game industry - AI not specified'
   elif re.search(r'\b(?:NPC|behaviou?r trees?|enemy behaviors?|gameplay AI)\b',text,re.I) and not re.search(r'\b(?:generative AI|LLM|large language model)\b',text,re.I): category='Gameplay AI & NPCs'
   elif workflow and not PATTERN.search(title): category='AI tools in game work'
   else: category='AI & machine learning in gaming'
   skills=[skill for skill in SKILLS if re.search(r'(?<![\w])'+re.escape(skill)+r'(?![\w])',text,re.I)]
   location=item.get('location',{}).get('name','').strip().replace('BLANK,BLANK,','')
   meta={x.get('name',''):x.get('value') for x in (item.get('metadata') or []) if isinstance(x,dict)}
   mode='Not specified'; loclower=location.lower()
   if 'remote' in loclower or ('remote' in title.lower() and not explicit_hybrid): mode='Remote eligible'
   elif explicit_hybrid: mode='Hybrid'
   elif meta.get('Careers Page Remote Eligible')=='Yes': mode='Remote eligible'
   elif meta.get('Careers Page Remote Eligible')=='No': mode='Location based'
   elif re.search(r'\b(?:on-site|onsite|in-office) (?:role|position|work|schedule)\b',text,re.I): mode='On-site'
   matches=[(name,info) for name,info in CITIES.items() if re.search(r'(?<!\w)'+re.escape(name)+r'(?!\w)',loclower)]
   city=matches[0] if len(matches)==1 else None
   if city and city[0]=='tblisi': city=('tbilisi',city[1])
   if city and city[0]=='london' and re.search(r'\bontario\b',loclower): city=('london, ontario',('Canada','North America',42.9849,-81.2453))
   countries=[city[1][0]] if city else []
   regions=[city[1][1]] if city else []
   country_regions={'United States':'North America','Canada':'North America','Brazil':'South America','United Kingdom':'Europe','Spain':'Europe','Czech Republic':'Europe','Japan':'Asia','India':'Asia','Australia':'Oceania','France':'Europe','Germany':'Europe','Singapore':'Asia','China':'Asia','Ireland':'Europe','Sweden':'Europe','Mexico':'North America'}
   for country, area in country_regions.items():
    if re.search(r'(?<!\w)'+re.escape(country)+r'(?!\w)',location,re.I):
     if country not in countries: countries.append(country)
     if area not in regions: regions.append(area)
   job={'id':f'gh-{slug}-{item["id"]}','sourceId':'gh:'+slug,'title':title,'company':company,
        'sourceLabel':'Official careers page','url':item['absolute_url'],'category':category,
        'pay':'See listing','payNote':'Check source for pay','location':location or 'See listing',
        'countries':countries,'regions':regions,'posted':(item.get('first_published') or '')[:10],
        'skills':skills[:8], 'summary':('The listing does not specify AI.' if category=='Game industry - AI not specified' else 'AI is mentioned; check the listing for context.' if category=='Game industry - AI mentioned' else 'Explore this AI-related role at a games company. Check the source for the role’s focus.'),
        'requirements':'See the official listing for experience, qualifications and role details.',
        'employment':'See listing','checkedAt':today,'workMode':mode}
   if city and mode in ('Location based','Hybrid','On-site'):
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
   if not loc.get('hybrid') or not CREATIVE.search(title): continue
   try:
    detail=json.loads(request(entry['ref']))
    parts=detail['jobAd']['sections']; text=' '.join(html.unescape(re.sub(r'<[^>]+>',' ',parts.get(k,{}).get('text','') or '')) for k in ('jobDescription','qualifications'))
    url=detail['postingUrl']
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
    'skills':[x for x in SKILLS if re.search(r'(?<![\w])'+re.escape(x)+r'(?![\w])',text,re.I)][:8],
    'summary':'Explore this hybrid role at a games company. Check the listing for its requirements.',
    'requirements':'See the official listing for experience, qualifications and role details.',
    'employment':entry.get('typeOfEmployment',{}).get('label','See listing'),'checkedAt':today,'workMode':'Hybrid'}
   try:
    if loc.get('city') and loc.get('latitude') and loc.get('longitude'):
     job['coordinates']={'lat':float(loc['latitude']),'lon':float(loc['longitude']),'city':loc['city']}
   except (TypeError,ValueError): pass
   out.append(job)
 if len(failures)>=len(BOARDS)+1+len([j for j in old['jobs'] if not j.get('sourceId','').startswith(('gh:','sr:'))]): raise SystemExit('Every source failed; data was not changed')
 out.sort(key=lambda j:(j.get('posted',''),j.get('title','')),reverse=True)
 FILE.write_text(json.dumps({'lastUpdated':today,'jobs':out},ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
 print(f'{len(out)} jobs; {len([x for x in out if x.get("coordinates")])} mappable; {len(failures)} source errors')
 for failure in failures: print('WARNING:',failure)

if __name__=='__main__': refresh()

