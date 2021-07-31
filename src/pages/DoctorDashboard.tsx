import React, { useState } from "react";
import { AppointmentsCalendar } from "../components/AppointmentsCalendar";
import { AppointmentsHistory } from "../components/AppointmentsHistory";
import { PageLayout } from "../components/PageLayout";
import Dayjs from "../helpers/dayjs";
import { Appointment, AppointmentsService } from "../services/AppointmentsService";
import { Patient, PatientsService } from "../services/PatientsService";
import { useAsync, useIsMounted } from "@henriqueinonhe/react-hooks";

//TEMP
const mockedPatients = [
  {
    "id": 1,
    "name": "Glen Elliott",
    "document": "89302156003",
    "healthSystemId": "5652605649",
    "birthday": "1958-01-20T13:03:14.206Z",
    "insurancePlan": "National Basic"
  },
  {
    "id": 2,
    "name": "Cory Murphy",
    "document": "13688099831",
    "healthSystemId": "5070840392",
    "birthday": "1990-11-07T09:49:13.745Z",
    "insurancePlan": "Regional"
  },
  {
    "id": 3,
    "name": "Annie Cross",
    "document": "84709623042",
    "healthSystemId": "8570716494",
    "birthday": "1967-03-16T22:02:56.091Z",
    "insurancePlan": "Regional"
  },
  {
    "id": 4,
    "name": "Mayme Fowler",
    "document": "55252426552",
    "healthSystemId": "4475825719",
    "birthday": "1992-05-13T13:43:15.905Z",
    "insurancePlan": "Regional"
  },
  {
    "id": 5,
    "name": "Maud White",
    "document": "72418656078",
    "healthSystemId": "8045571318",
    "birthday": "1980-09-18T12:01:01.922Z",
    "insurancePlan": "Regional"
  },
  {
    "id": 6,
    "name": "Louis Warner",
    "document": "19103024787",
    "healthSystemId": "2935691407",
    "birthday": "2008-07-05T13:20:25.952Z",
    "insurancePlan": "Diamond"
  },
  {
    "id": 7,
    "name": "Jesus Carpenter",
    "document": "36618480982",
    "healthSystemId": "7406716571",
    "birthday": "1979-05-16T18:40:12.716Z",
    "insurancePlan": "National Premium"
  },
  {
    "id": 8,
    "name": "Mildred Holt",
    "document": "75756060255",
    "healthSystemId": "2617475970",
    "birthday": "1950-09-01T13:55:07.130Z",
    "insurancePlan": "Regional"
  },
  {
    "id": 9,
    "name": "Gordon Harris",
    "document": "38666313987",
    "healthSystemId": "5871167255",
    "birthday": "1977-07-07T04:06:10.674Z",
    "insurancePlan": "National Premium"
  },
  {
    "id": 10,
    "name": "Katie Houston",
    "document": "31803640409",
    "healthSystemId": "6591900911",
    "birthday": "1959-11-23T05:00:36.489Z",
    "insurancePlan": "Diamond"
  },
  {
    "id": 11,
    "name": "Ruby Hodges",
    "document": "74575841435",
    "healthSystemId": "4127278865",
    "birthday": "2011-12-08T20:31:25.917Z",
    "insurancePlan": "Diamond"
  },
  {
    "id": 12,
    "name": "Jeremiah Park",
    "document": "86764616996",
    "healthSystemId": "6529895707",
    "birthday": "2011-02-08T08:57:34.232Z",
    "insurancePlan": "Diamond"
  },
  {
    "id": 13,
    "name": "Dylan Turner",
    "document": "91631869923",
    "healthSystemId": "4018014437",
    "birthday": "1950-05-12T15:52:23.107Z",
    "insurancePlan": "Regional"
  },
  {
    "id": 14,
    "name": "Barry Gomez",
    "document": "29550414197",
    "healthSystemId": "4659359531",
    "birthday": "1958-04-16T12:42:52.284Z",
    "insurancePlan": "Regional"
  },
  {
    "id": 15,
    "name": "Winnie Ryan",
    "document": "71688389617",
    "healthSystemId": "7009762581",
    "birthday": "2013-09-07T01:04:47.552Z",
    "insurancePlan": "Regional"
  }
];

const mockedAppointments = [
  {
    "id": 1,
    "patientId": 4,
    "specialty": "general",
    "type": "surgery",
    "description": "Ahaweg zonaz ci difa vatuvwe sid izzuowa jop guana gu lip woc zespep.",
    "notes": "",
    "status": "completed",
    "startTime": "2021-07-20T12:00:00.504Z",
    "endTime": "2021-07-20T13:00:00.504Z"
  },
  {
    "id": 2,
    "patientId": 8,
    "specialty": "neurology",
    "type": "followUp",
    "description": "Ida bikrahuf fuzracbar zipe akezo mi poribaw ejrumin cuzrihi edu bo fuzsom uweawo.",
    "notes": "Of wogu makzathe ih ko jizof zih ozarti lad ro lasvedzi he wiw mecsavabu.",
    "status": "absent",
    "startTime": "2021-07-19T09:00:00.504Z"
  },
  {
    "id": 3,
    "patientId": 6,
    "specialty": "general",
    "type": "firstVisit",
    "description": "Porsuji jo wirde fisuw iruso us zeta luoka arsu elabo gemimu bojma nu kiblet zuj zet fen izu.",
    "notes": "Gafiwu lofgutgi mogtagtom al ti isuhaf tug albus zo nuwoje lomfaer geti zen utjetin.",
    "status": "cancelled",
    "startTime": "2021-07-19T12:00:00.504Z"
  },
  {
    "id": 4,
    "patientId": 14,
    "specialty": "cardiology",
    "type": "checkUp",
    "description": "Got vul ukeuri veutoka vuneg opule fafaleeno ka veb icjun comecfot zelfem coh pez mon.",
    "notes": "Seajufop ozlu kuhkipner guh nasasereg ida rin sagvim cor ere sev foripdo jemodfi ha rovawize fuac tucunu.",
    "status": "completed",
    "startTime": "2021-07-21T11:30:00.504Z",
    "endTime": "2021-07-21T12:30:00.504Z"
  },
  {
    "id": 5,
    "patientId": 3,
    "specialty": "cardiology",
    "type": "checkUp",
    "description": "Jijok enegaah pofo miswov wakoftez fasi erpu poosi dohwuh zopre pekmi oh zeda rilurih.",
    "notes": "",
    "status": "absent",
    "startTime": "2021-07-18T14:30:00.504Z"
  },
  {
    "id": 6,
    "patientId": 8,
    "specialty": "general",
    "type": "firstVisit",
    "description": "Pa jesav ga mew fuese kob ca labdar behiru ecdomta tituda ewuve.",
    "notes": "",
    "status": "cancelled",
    "startTime": "2021-07-18T11:00:00.504Z"
  },
  {
    "id": 7,
    "patientId": 8,
    "specialty": "neurology",
    "type": "followUp",
    "description": "Ked sesajkid agi luusuro turvef tenkaf zipeh sew uteekosij wefle fujwutik keajili edumile.",
    "notes": "",
    "status": "completed",
    "startTime": "2021-07-17T09:00:00.504Z",
    "endTime": "2021-07-17T10:00:00.504Z"
  },
  {
    "id": 8,
    "patientId": 8,
    "specialty": "cardiology",
    "type": "checkUp",
    "description": "Cilipefaw wusinru magil udawig gowuv uragebboj gapo ji neugeza bevmoube rorachus zuna.",
    "notes": "Rohap mo lo remrut lurinwu sohizvur wuzku zam ku co mosvof dehe.",
    "status": "cancelled",
    "startTime": "2021-07-16T11:30:00.504Z"
  },
  {
    "id": 9,
    "patientId": 9,
    "specialty": "cardiology",
    "type": "checkUp",
    "description": "Nitibama su pohi hunnehnuk mi ivkavgeg zocgik es cal vekuk locumko bohob sispusah.",
    "notes": "Ocpebeb felban gaj jowfan he kifga pegvegoh cuawiron nu lazial femlo bigiz.",
    "status": "absent",
    "startTime": "2021-07-16T13:30:00.504Z"
  },
  {
    "id": 10,
    "patientId": 4,
    "specialty": "cardiology",
    "type": "followUp",
    "description": "Hojusa bej avamijzan nadu hi pijcoj le uje uluomjaz rij owzah ce.",
    "notes": "",
    "status": "absent",
    "startTime": "2021-07-19T11:30:00.504Z"
  },
  {
    "id": 11,
    "patientId": 11,
    "specialty": "neurology",
    "type": "followUp",
    "description": "Lulmaoj norcuw gibupines maara pot su mezne worrecro ipaog agpete ufoot bas dagfucwek zozgurnon inu gef sacir vudbaziz.",
    "notes": "",
    "status": "cancelled",
    "startTime": "2021-07-21T09:30:00.504Z"
  },
  {
    "id": 12,
    "patientId": 3,
    "specialty": "cardiology",
    "type": "exam",
    "description": "Zuiwe re la pafa iv de kaburze afnavu egawubu he corvakow tuhev iwku tevatje sismuob irbezbej zido.",
    "notes": "Hud pipajocid afzo gijfa vip rizuwoh jil jo uzsas zollojer ta niw ni haew limwe uperitew.",
    "status": "completed",
    "startTime": "2021-07-20T16:30:00.504Z",
    "endTime": "2021-07-20T17:30:00.504Z"
  },
  {
    "id": 13,
    "patientId": 6,
    "specialty": "general",
    "type": "firstVisit",
    "description": "Ilso ahnazo rekjiddo idku lilkakti orrokup tij dibadohe gozku urhib doke caksevful fot teckebjoj cu kubebihic.",
    "notes": "Dehalzol hoodze tit afulgof pingozvac zumluwzu omhavhu kijsasuw la nu afida cipfemri vok imrom.",
    "status": "completed",
    "startTime": "2021-07-18T10:00:00.504Z",
    "endTime": "2021-07-18T11:00:00.504Z"
  },
  {
    "id": 14,
    "patientId": 3,
    "specialty": "general",
    "type": "followUp",
    "description": "Vemlucuto turtiodi bugalzab ijsizfu kutja bomamro gosijda awipiwam gu wunifzow ef puwjigen ofe.",
    "notes": "Lej mapu vizata koma itecuzhip we emcal ru pi ovfig touja egapoj bakfe gut fegib fok babvep duez.",
    "status": "cancelled",
    "startTime": "2021-07-18T14:30:00.504Z"
  },
  {
    "id": 15,
    "patientId": 12,
    "specialty": "cardiology",
    "type": "checkUp",
    "description": "Posza rible potnaf de polob codcebo movbonpag bi fup sagec bol talva lozfopvu evi saz zu vojdebdo.",
    "notes": "",
    "status": "cancelled",
    "startTime": "2021-07-19T12:00:00.504Z"
  },
  {
    "id": 16,
    "patientId": 5,
    "specialty": "neurology",
    "type": "followUp",
    "description": "Onnij kortar feerecuh miminmes jak duwgepmuz ulogi rogoh fu pe kat muc libli da govunlo jeososu leslijmit zeh.",
    "notes": "",
    "status": "cancelled",
    "startTime": "2021-07-25T13:30:00.504Z"
  },
  {
    "id": 17,
    "patientId": 10,
    "specialty": "cardiology",
    "type": "surgery",
    "description": "Govzicseh butsero cu gilupno inawid sevo hir dikutub mudrelve upoven fez leadi iba fuwfe.",
    "notes": "Ze hadkeruz hok zol idaonzuf sojiumo duk hapo nine bubfi min nija kofrowwik tobodfe.",
    "status": "absent",
    "startTime": "2021-07-26T11:00:00.504Z"
  },
  {
    "id": 18,
    "patientId": 2,
    "specialty": "cardiology",
    "type": "surgery",
    "description": "Zepfuhes hezapod arkenu adamibdav gihjebu foknu madno neago powun vum ile nurad ijre cim do.",
    "notes": "Raerof we awauh fefaj omiwewe no ahu reba to ma zubge zok culumuv notbon.",
    "status": "cancelled",
    "startTime": "2021-07-24T09:00:00.504Z"
  },
  {
    "id": 19,
    "patientId": 15,
    "specialty": "general",
    "type": "firstVisit",
    "description": "Dewgap conmo monguh fe pufuhto bulsuwod wipla feneghuc elgibca uspirid wa memdumuc ogeso pawus la udekuz hihis ebposgog.",
    "notes": "Juwzirbuj tad tulwoga koviz hemhude pij ef vedfa jeen upo adaalo atiavpat gomwukuw nilmi gihmi wu alewudi jirbegne.",
    "status": "cancelled",
    "startTime": "2021-07-25T17:30:00.504Z"
  },
  {
    "id": 20,
    "patientId": 1,
    "specialty": "neurology",
    "type": "followUp",
    "description": "Ev ruuj lij iclosev pozkizop rah ibsema kut inijemu mandi obcoh gecepfoh kutuwo gumde cidazi garhew gapehiwo.",
    "notes": "Ponizeec gukmi huuda kiwaegi net cevon fejonmep anmutpa obzave dorpuw kabi letviwta relorlu.",
    "status": "absent",
    "startTime": "2021-07-25T16:30:00.504Z"
  },
  {
    "id": 21,
    "patientId": 8,
    "specialty": "cardiology",
    "type": "exam",
    "description": "Kofo woikuz ture wog ize futum opje fabwikov mehijgi zugzew zab baluvuz.",
    "notes": "",
    "status": "cancelled",
    "startTime": "2021-07-24T16:00:00.504Z"
  },
  {
    "id": 22,
    "patientId": 1,
    "specialty": "cardiology",
    "type": "exam",
    "description": "Tu cizej dipbekwo ireel juaha baepwem sabikgi zinjeg kejvullu nu osi sermece idinono derosa nig obovibem onucabo.",
    "notes": "Nepduhu je gemfi uje satakmil ela rek aduetace hekkerkig iwuibe detabo gegu miamafus neiti zifliw.",
    "status": "cancelled",
    "startTime": "2021-07-28T17:30:00.504Z"
  },
  {
    "id": 23,
    "patientId": 9,
    "specialty": "general",
    "type": "firstVisit",
    "description": "Za ha or ohu hidir coijozom pa divuzco sueldi ci builibi efi vor rogliw.",
    "notes": "Enibiv ijafuh moj buge hozijnag atkaswut oga oliijbe fam hu luolani unpif ko wuvuso du rucipem cebhik emdured.",
    "status": "cancelled",
    "startTime": "2021-07-23T14:00:00.504Z"
  },
  {
    "id": 24,
    "patientId": 14,
    "specialty": "neurology",
    "type": "exam",
    "description": "Jejooj su wuzeh laucezeb sakmab muco izuvobu renes gipu lekbobma lunez nez azoos toowig medpeg wiunepa uz pus.",
    "notes": "Nej nigcukuw se tawrosdon tiefbi posga imrufpar tadbapu egracre funucad ejiuv goj sufo jizevbik.",
    "status": "completed",
    "startTime": "2021-07-26T12:30:00.504Z",
    "endTime": "2021-07-26T13:00:00.504Z"
  },
  {
    "id": 25,
    "patientId": 3,
    "specialty": "general",
    "type": "checkUp",
    "description": "Weugjoh mesi bumpojow wujavosew tefuvbod ri vate urito po judel pezigohe mev kued luva inoko bigokac.",
    "notes": "",
    "status": "completed",
    "startTime": "2021-07-24T17:00:00.504Z",
    "endTime": "2021-07-24T17:30:00.504Z"
  },
  {
    "id": 26,
    "patientId": 7,
    "specialty": "neurology",
    "type": "exam",
    "description": "Mengoze ralat nu sehfez diszac lohatjij olpubat ikanucfov elopebari olewima wisgu cimfesiwu kopamiwi ko.",
    "notes": "Ogafuffe tar jefuj fuz noatbib wilibe re gog eriakuso bi pifujsul bobjooh lat.",
    "status": "completed",
    "startTime": "2021-07-25T13:30:00.504Z",
    "endTime": "2021-07-25T14:00:00.504Z"
  },
  {
    "id": 27,
    "patientId": 2,
    "specialty": "general",
    "type": "checkUp",
    "description": "Pe ci mov ahlini popburino searu sohwe uwouz mike ho guz itweg ta wa inu rogoljet cugawu hebotowih.",
    "notes": "Isini nefvac tuzlo vekooc eplobiwi sudvin ub fuf li logij ajkadug zupaj ci.",
    "status": "absent",
    "startTime": "2021-07-24T09:00:00.504Z"
  },
  {
    "id": 28,
    "patientId": 1,
    "specialty": "neurology",
    "type": "checkUp",
    "description": "Emu emizoro mobper maf sasis wub pe dicewwot ze mabzomej fuzomewa tu.",
    "notes": "Cutelit ehe sovvuoj zaus nibo izeho je siwe set gidol emilo nopanood mavera zoclob pawolmu heh lutafoeg veda.",
    "status": "cancelled",
    "startTime": "2021-07-27T16:30:00.504Z"
  },
  {
    "id": 29,
    "patientId": 9,
    "specialty": "neurology",
    "type": "firstVisit",
    "description": "Jabtah omariha kad pac vaho zif beesik kow zouleka du delita wusaw udmikwif vug hatacu ma rubappij.",
    "notes": "",
    "status": "absent",
    "startTime": "2021-07-27T09:30:00.504Z"
  },
  {
    "id": 30,
    "patientId": 12,
    "specialty": "neurology",
    "type": "followUp",
    "description": "Rigudew cad pip ido hipekik usihalow pu lugluj sok hal jac fo mim ahiajkaj evaiktir kolmurhac kaniw.",
    "notes": "",
    "status": "absent",
    "startTime": "2021-07-25T16:30:00.504Z"
  },
  {
    "id": 31,
    "patientId": 8,
    "specialty": "neurology",
    "type": "firstVisit",
    "description": "Kaojzi ro mohumam nafogjoj ode da ilwi mol kazotban kiget zuwfutmun riskifij ir jez owwa zah ocukaca.",
    "notes": "Ugauwte orikulzo vu nifnacu cu eheikovap kitof tew wiv lomevtes meok kewezajo.",
    "status": "pending",
    "startTime": "2021-08-01T13:00:00.504Z"
  },
  {
    "id": 32,
    "patientId": 11,
    "specialty": "cardiology",
    "type": "firstVisit",
    "description": "Cetoffa lufona digawwes mewikiku ala pimahrev mawcokgis ro utirinor if zin iz liapo osveihu.",
    "notes": "Ekbovu tak dosob ca uwkib vebnorgi etbeh keit kasu wozewgoc sawkav gub cofzuohi.",
    "status": "cancelled",
    "startTime": "2021-07-27T09:00:00.504Z"
  },
  {
    "id": 33,
    "patientId": 14,
    "specialty": "cardiology",
    "type": "exam",
    "description": "Evdid uta af olpem picuto fo sec siih zuvdig acfajoc nikezbu bevuwbuw pijderpof zo uraw.",
    "notes": "Dicow sulo si dobwillob novo pehwo akkekwej pa nun ojiv nal benuvlis zo.",
    "status": "cancelled",
    "startTime": "2021-07-30T11:00:00.504Z"
  },
  {
    "id": 34,
    "patientId": 12,
    "specialty": "cardiology",
    "type": "exam",
    "description": "Ni niba opi sa alasod dud hola eru vuzah lajmohko dalam lika attosa dehi wiw.",
    "notes": "",
    "status": "absent",
    "startTime": "2021-07-30T14:30:00.504Z"
  },
  {
    "id": 35,
    "patientId": 2,
    "specialty": "general",
    "type": "surgery",
    "description": "Rejawe wofwi ilo jobuf li etehehe ga ovhoar uze hucuk wudaeho upu oviadafef susu ma nonuba icuj sef.",
    "notes": "",
    "status": "absent",
    "startTime": "2021-07-29T15:30:00.504Z"
  },
  {
    "id": 36,
    "patientId": 13,
    "specialty": "cardiology",
    "type": "checkUp",
    "description": "Sergeg fim wet zuw vib nu vaz jelinso zeti mertukba seonu kocmi camtij.",
    "notes": "Jum ra lakargo ivegiwi li ledtara ni uwoocu ew kige ucov keuwo firajozi ele honi pofvasrej selvahug.",
    "status": "cancelled",
    "startTime": "2021-07-27T11:00:00.504Z"
  },
  {
    "id": 37,
    "patientId": 6,
    "specialty": "neurology",
    "type": "checkUp",
    "description": "Lecol sela coviclu neh oti uhha heoje avionore pu zeasu wu tuzevtoj oluvebje.",
    "notes": "Wusnugmet uni oligojoc jibu oleh noknocsod lopof evafo pum merhohun zacathok do hotnahis apupe po rokuc.",
    "status": "pending",
    "startTime": "2021-08-02T16:30:00.504Z"
  },
  {
    "id": 38,
    "patientId": 4,
    "specialty": "general",
    "type": "exam",
    "description": "Vo ure hanah fut geeh esi zeppinob bufic afujufse du sinazahon jijpazozu rozosaiwe fodap.",
    "notes": "",
    "status": "pending",
    "startTime": "2021-07-31T15:30:00.504Z"
  },
  {
    "id": 39,
    "patientId": 5,
    "specialty": "cardiology",
    "type": "surgery",
    "description": "Ge ku nubanet va lig muvkuze ava necowe ti rukuge eg ogcamog la.",
    "notes": "",
    "status": "completed",
    "startTime": "2021-07-29T13:00:00.504Z",
    "endTime": "2021-07-29T14:00:00.504Z"
  },
  {
    "id": 40,
    "patientId": 13,
    "specialty": "neurology",
    "type": "firstVisit",
    "description": "Oke gambo gudjase jecjesol bih ama zuviim wopuvin net de cuulah rec ohibehu bi hotutuka lile we ze.",
    "notes": "",
    "status": "pending",
    "startTime": "2021-07-31T11:00:00.504Z"
  },
  {
    "id": 41,
    "patientId": 12,
    "specialty": "general",
    "type": "firstVisit",
    "description": "Febsod suf mokihwi saazoud neuje kameeti sufafezi sac jo utapje kev je wif avahu.",
    "notes": "",
    "status": "cancelled",
    "startTime": "2021-07-30T14:30:00.504Z"
  },
  {
    "id": 42,
    "patientId": 7,
    "specialty": "neurology",
    "type": "exam",
    "description": "Etiolosat sudew kifub aheal ge nuw wednima kef maletpi uw ceken su kelop meg uc rebzos hasap.",
    "notes": "Uma cecaw seepo zep wu ukohidme binori ufmavo jo tuca zif as cil ku wi ip hivwakpa woito.",
    "status": "completed",
    "startTime": "2021-07-30T10:30:00.504Z",
    "endTime": "2021-07-30T11:00:00.504Z"
  },
  {
    "id": 43,
    "patientId": 6,
    "specialty": "neurology",
    "type": "firstVisit",
    "description": "Bodsim deew caslel ehuge ciwi rem jeaze rigazis fu osonege kacoar ha ib zan ne.",
    "notes": "",
    "status": "pending",
    "startTime": "2021-07-30T12:00:00.504Z"
  },
  {
    "id": 44,
    "patientId": 11,
    "specialty": "neurology",
    "type": "firstVisit",
    "description": "Ifa katozi ceimaihi def cogu ul bil uva ve lu juguhmo iboafad hiwi mihuj unuus cohrada.",
    "notes": "Bugev effuado fehifo cakzakcod duziih hium afi cubet okzit lip lieva ezduh tu mibozto.",
    "status": "absent",
    "startTime": "2021-07-27T13:30:00.504Z"
  },
  {
    "id": 45,
    "patientId": 10,
    "specialty": "general",
    "type": "surgery",
    "description": "Sispahu ikaah jatkob liz suap sotonu zazerviv ba zihjitub woebsoz li pabzet zob vot javzin nedakuf gemle.",
    "notes": "",
    "status": "cancelled",
    "startTime": "2021-07-27T09:30:00.504Z"
  },
  {
    "id": 47,
    "patientId": 14,
    "specialty": "neurology",
    "type": "exam",
    "description": "Foufa zetrofta peni hed hohocihe pacanu pugcu wu li rudfesi erike go mormokfi vokek ruaza.",
    "notes": "",
    "status": "absent",
    "startTime": "2021-07-27T10:30:00.504Z"
  },
  {
    "id": 48,
    "patientId": 4,
    "specialty": "cardiology",
    "type": "followUp",
    "description": "Jo vedewuper zicigider varicwu zowolado cojro tat ih pawbilad si zodce fuwaro lohama effawcin modce ap.",
    "notes": "Cen cer tubesiw gip sozofen vo fucbus odjaawe pom hiafevo re ave ube iddawtid jib nar lic lojanzo.",
    "status": "completed",
    "startTime": "2021-07-27T12:30:00.504Z",
    "endTime": "2021-07-27T13:00:00.504Z"
  },
  {
    "id": 49,
    "patientId": 14,
    "specialty": "general",
    "type": "checkUp",
    "description": "Fule zenunhud tevvel nu uhzi tibfonal lim cujita hocujo dalatihe kow vib utfeefo zivonaki fabe huavu rijrokeru cathukozu.",
    "notes": "",
    "status": "absent",
    "startTime": "2021-07-29T14:30:00.504Z"
  },
  {
    "id": 50,
    "patientId": 4,
    "specialty": "general",
    "type": "firstVisit",
    "description": "Awohifu di ja vatlo rive fo mohumfem woc ajivaf guglownos rugpit lelce.",
    "notes": "Now anivo ivdaj anguda welnilra talibeza rueba zan horiz ev saghet cobogzu.",
    "status": "pending",
    "startTime": "2021-08-01T12:00:00.504Z"
  },
  {
    "id": 51,
    "patientId": 9,
    "specialty": "cardiology",
    "type": "followUp",
    "description": "Zepzeko opgucub pisom cipsu nojce dadhud veutojum jashub ha natucvec navovpa iz wohab fe.",
    "notes": "",
    "status": "pending",
    "startTime": "2021-08-02T11:30:00.504Z"
  },
  {
    "id": 54,
    "patientId": 12,
    "specialty": "neurology",
    "type": "surgery",
    "description": "Duda lowufo nu his pedna waszakug lokida kobpub weili cekir inetohinu ticta ciofehek goazfo wowaver gofwut.",
    "notes": "",
    "status": "pending",
    "startTime": "2021-08-01T15:00:00.504Z"
  },
  {
    "id": 55,
    "patientId": 5,
    "specialty": "general",
    "type": "exam",
    "description": "Huik fi zicac inabu nimasop adbur da saf udbabib laaku houbi dufoso.",
    "notes": "",
    "status": "completed",
    "startTime": "2021-07-29T12:00:00.504Z",
    "endTime": "2021-07-29T13:00:00.504Z"
  },
  {
    "id": 56,
    "patientId": 13,
    "specialty": "general",
    "type": "surgery",
    "description": "Zi ofiik siuc hi obju adjiic atnun lished apsudvec pegizvoh bonuf gounebip pa zopli.",
    "notes": "",
    "status": "pending",
    "startTime": "2021-07-31T13:00:00.504Z"
  },
  {
    "id": 57,
    "patientId": 15,
    "specialty": "neurology",
    "type": "checkUp",
    "description": "Bec izi vevetid iblat lekzotim timpek da wa danikvow sutiuwu mobuzcoh hedbo iwukukpik.",
    "notes": "",
    "status": "absent",
    "startTime": "2021-07-28T11:30:00.504Z"
  },
  {
    "id": 59,
    "patientId": 8,
    "specialty": "general",
    "type": "exam",
    "description": "Junmal utuahso so nimenut tuz musa vij sehgu be ragjar ecasali reij bulsipwi icioge muomepi cawilji.",
    "notes": "",
    "status": "cancelled",
    "startTime": "2021-07-30T11:00:00.504Z"
  },
  {
    "id": 60,
    "patientId": 13,
    "specialty": "neurology",
    "type": "surgery",
    "description": "Heldaf jioneju gar luwcaba hug tivhicil zalowez zu soufi kuddocdan kipa fiuj vuaki pufzo tiletloj nuj hosmorhaw.",
    "notes": "",
    "status": "absent",
    "startTime": "2021-07-30T10:00:00.504Z"
  },
  {
    "id": 61,
    "patientId": 6,
    "specialty": "cardiology",
    "type": "exam",
    "description": "Ossi itpi ni dudje gib poidgo ba warhacan rocif ka vet guvuf maca su noztihmom ur colejik.",
    "notes": "Na lire jakaca zikufi miniva zemuvare gelupej cakajgil owocosan il cojdo sikopohic ito koc azo haewdeg wajtuwgap.",
    "status": "cancelled",
    "startTime": "2021-07-29T14:30:00.504Z"
  },
  {
    "id": 62,
    "patientId": 2,
    "specialty": "cardiology",
    "type": "exam",
    "description": "Opebezi ukecu zate tonwaeri en ave keveto pigit fedisu kivrivco ovu soop gagputwo.",
    "notes": "",
    "status": "pending",
    "startTime": "2021-07-31T14:00:00.504Z"
  },
  {
    "id": 63,
    "patientId": 14,
    "specialty": "cardiology",
    "type": "surgery",
    "description": "Lekcejko ulbulov lomrusadu tuwvutut geb hasuwmug du la ca movfu ajute ev.",
    "notes": "",
    "status": "absent",
    "startTime": "2021-07-27T12:30:00.504Z"
  },
  {
    "id": 64,
    "patientId": 12,
    "specialty": "general",
    "type": "checkUp",
    "description": "Zagupar geteg nimuho finzi jeom zearne noj wafa ba tepkuw paf awbirhu kun dujva omwas bojmo poap zoj.",
    "notes": "",
    "status": "absent",
    "startTime": "2021-07-30T14:30:00.504Z"
  },
  {
    "id": 65,
    "patientId": 8,
    "specialty": "general",
    "type": "checkUp",
    "description": "Papbiv fadezru hu kun pi bafridaf fibaggem jijmetma zoppewjop we cela bulep cise vopef ceglewtu duozaju riv.",
    "notes": "Vused nojmit enulim viwin fu ser huf luppig bawop la zuh vingimwi sahhuton coh condosih.",
    "status": "cancelled",
    "startTime": "2021-07-28T14:30:00.504Z"
  },
  {
    "id": 66,
    "patientId": 10,
    "specialty": "cardiology",
    "type": "firstVisit",
    "description": "Us vomam lois remo et kuavad ep liwgab goltewep fojiul wapmoku vuwesgad basgamjo wole feri tobejo jowhod les.",
    "notes": "Dusi ipvimezu wilwo soghaove daeh zu deoj fu uvevef gakivo ticumer otzov.",
    "status": "pending",
    "startTime": "2021-08-06T12:30:00.504Z"
  },
  {
    "id": 67,
    "patientId": 14,
    "specialty": "cardiology",
    "type": "firstVisit",
    "description": "Or iba hatazfe ti ciro ashe coca zavhuhzef du pikku coospal ba votza.",
    "notes": "",
    "status": "pending",
    "startTime": "2021-08-10T17:30:00.504Z"
  },
  {
    "id": 68,
    "patientId": 6,
    "specialty": "cardiology",
    "type": "surgery",
    "description": "Pifgoopu des wawidu iwtegnic ciwfajwu soabhu kuzvas zovehew uzigu rissun su hi uraiblek.",
    "notes": "Teput fo ovisupib pe rigba vojobu dohor dautu wimmiel gi jajicago jasi gu fa ji vonvipow ibouz volguof.",
    "status": "pending",
    "startTime": "2021-08-06T11:30:00.504Z"
  },
  {
    "id": 69,
    "patientId": 6,
    "specialty": "neurology",
    "type": "checkUp",
    "description": "Hipac odnaahe jekleg esumo gil dihraiz joagu molwuno siigja huhjoj votnoj ogevunos gejhog.",
    "notes": "",
    "status": "pending",
    "startTime": "2021-08-07T10:30:00.504Z"
  },
  {
    "id": 70,
    "patientId": 4,
    "specialty": "general",
    "type": "firstVisit",
    "description": "Bemsavel kibobelo wafos vi hobsalbam kupa kaagli fawesah nacow cahguug leunevif jepaude takjafsa jacebzop sujza pabap we.",
    "notes": "",
    "status": "pending",
    "startTime": "2021-08-11T17:00:00.504Z"
  },
  {
    "id": 71,
    "patientId": 4,
    "specialty": "neurology",
    "type": "followUp",
    "description": "Egcukec vurpuv ketacur za giw me hevozjog rugekut vuldokuvo ozihef obejulmaw ek.",
    "notes": "",
    "status": "pending",
    "startTime": "2021-08-11T12:00:00.504Z"
  },
  {
    "id": 72,
    "patientId": 3,
    "specialty": "neurology",
    "type": "surgery",
    "description": "Fodjij nurwepi mu ociida cib mikaw varugoh enca raecise pus owaoro peuda na ded zofezojev datafapo.",
    "notes": "Enuehejoc niliuz mek komumri godkelbu has wumkuwik fuz loluhbom fo na ubmam dafu paje.",
    "status": "pending",
    "startTime": "2021-08-11T14:00:00.504Z"
  }
]
  .map(appointment => ({
    ...appointment,
    patient: mockedPatients.find(patient => patient.id === appointment.patientId)
  }))
  .filter(e => 0 < Dayjs(e.startTime).day() && Dayjs(e.startTime).day() < 6)
  .sort((e1, e2) => Dayjs(e1.startTime).isBefore(Dayjs(e2.startTime)) ? -1 : 1) as Array<Appointment>;

export function DoctorDashboard() : JSX.Element {
  const [patients, setPatients] = useState<Array<Patient>>([]);
  const [appointments, setAppointments] = useState<Array<Appointment>>([]);
  const [dataIsLoading, setDataIsLoading] = useState(true);
  const isMounted = useIsMounted();
  
  useAsync(isMounted, async () => {
    return await Promise.all([
      PatientsService.fetchPatients(),
      AppointmentsService.fetchAppointments()
    ]);
  }, ([fetchedPatients, fetchedAppointments]) => {
    setPatients(fetchedPatients);
    setAppointments(fetchedAppointments);
  }, [], setDataIsLoading);

  console.log({
    patients,
    appointments
  });

  return (
    <PageLayout>
      <AppointmentsCalendar 
        minWeekday="monday"
        maxWeekday="friday"
        minTime="09:00"
        maxTime="18:00"
        currentDate={Dayjs()}
        appointments={mockedAppointments}
      />

      <AppointmentsHistory 
        appointments={mockedAppointments}
      />
    </PageLayout>
  );
}

export default DoctorDashboard;