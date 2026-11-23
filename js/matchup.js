// ==========================================================================
// PokeMatch · 1세대 151종 포켓몬 상성 & 종족값 판독기 스크립트
// ==========================================================================

// 1. 타입 한글명
const TYPE_KO = {
  normal: "노말", fire: "불꽃", water: "물", grass: "풀", electric: "전기",
  ice: "얼음", fighting: "격투", poison: "독", ground: "땅", flying: "비행",
  psychic: "에스퍼", bug: "벌레", rock: "바위", ghost: "고스트", dragon: "드래곤",
  dark: "악", steel: "강철", fairy: "페어리"
};
const ALL_TYPES = Object.keys(TYPE_KO);

// 2. 공격 상성표 (1배가 아닌 상성만 정의)
const TYPE_CHART = {
  normal:   { rock: 0.5, ghost: 0, steel: 0.5 },
  fire:     { fire: 0.5, water: 0.5, grass: 2, ice: 2, bug: 2, rock: 0.5, dragon: 0.5, steel: 2 },
  water:    { fire: 2, water: 0.5, grass: 0.5, ground: 2, rock: 2, dragon: 0.5 },
  electric: { water: 2, electric: 0.5, grass: 0.5, ground: 0, flying: 2, dragon: 0.5 },
  grass:    { fire: 0.5, water: 2, grass: 0.5, poison: 0.5, ground: 2, flying: 0.5, bug: 0.5, rock: 2, dragon: 0.5, steel: 0.5 },
  ice:      { fire: 0.5, water: 0.5, grass: 2, ice: 0.5, ground: 2, flying: 2, dragon: 2, steel: 0.5 },
  fighting: { normal: 2, ice: 2, poison: 0.5, flying: 0.5, psychic: 0.5, bug: 0.5, rock: 2, ghost: 0, dark: 2, steel: 2, fairy: 0.5 },
  poison:   { grass: 2, poison: 0.5, ground: 0.5, rock: 0.5, ghost: 0.5, steel: 0, fairy: 2 },
  ground:   { fire: 2, electric: 2, grass: 0.5, poison: 2, flying: 0, bug: 0.5, rock: 2, steel: 2 },
  flying:   { electric: 0.5, grass: 2, fighting: 2, bug: 2, rock: 0.5, steel: 0.5 },
  psychic:  { fighting: 2, poison: 2, psychic: 0.5, dark: 0, steel: 0.5 },
  bug:      { fire: 0.5, grass: 2, fighting: 0.5, poison: 0.5, flying: 0.5, psychic: 2, ghost: 0.5, dark: 2, steel: 0.5, fairy: 0.5 },
  rock:     { fire: 2, ice: 2, fighting: 0.5, ground: 0.5, flying: 2, bug: 2, steel: 0.5 },
  ghost:    { normal: 0, psychic: 2, ghost: 2, dark: 0.5 },
  dragon:   { dragon: 2, steel: 0.5, fairy: 0 },
  dark:     { fighting: 0.5, psychic: 2, ghost: 2, dark: 0.5, fairy: 0.5 },
  steel:    { fire: 0.5, water: 0.5, electric: 0.5, ice: 2, rock: 2, steel: 0.5, fairy: 2 },
  fairy:    { fire: 0.5, fighting: 2, poison: 0.5, dragon: 2, dark: 2, steel: 0.5 }
};

// 3. 1세대 포켓몬 151종 전체 데이터 (관동 전국도감 No.001 ~ No.151)
const GEN1_POKEDEX = [
  { id: 1, name: "이상해씨", types: ["grass", "poison"], stats: { hp: 45, atk: 49, def: 49, spa: 65, spd: 65, spe: 45 } },
  { id: 2, name: "이상해풀", types: ["grass", "poison"], stats: { hp: 60, atk: 62, def: 63, spa: 80, spd: 80, spe: 60 } },
  { id: 3, name: "이상해꽃", types: ["grass", "poison"], stats: { hp: 80, atk: 82, def: 83, spa: 100, spd: 100, spe: 80 } },
  { id: 4, name: "파이리", types: ["fire"], stats: { hp: 39, atk: 52, def: 43, spa: 60, spd: 50, spe: 65 } },
  { id: 5, name: "리자드", types: ["fire"], stats: { hp: 58, atk: 64, def: 58, spa: 80, spd: 65, spe: 80 } },
  { id: 6, name: "리자몽", types: ["fire", "flying"], stats: { hp: 78, atk: 84, def: 78, spa: 109, spd: 85, spe: 100 } },
  { id: 7, name: "꼬부기", types: ["water"], stats: { hp: 44, atk: 48, def: 65, spa: 50, spd: 64, spe: 43 } },
  { id: 8, name: "어니부기", types: ["water"], stats: { hp: 59, atk: 63, def: 80, spa: 65, spd: 80, spe: 58 } },
  { id: 9, name: "거북왕", types: ["water"], stats: { hp: 79, atk: 83, def: 100, spa: 85, spd: 105, spe: 78 } },
  { id: 10, name: "캐터피", types: ["bug"], stats: { hp: 45, atk: 30, def: 35, spa: 20, spd: 20, spe: 45 } },
  { id: 11, name: "단데기", types: ["bug"], stats: { hp: 50, atk: 20, def: 55, spa: 25, spd: 25, spe: 30 } },
  { id: 12, name: "버터플", types: ["bug", "flying"], stats: { hp: 60, atk: 45, def: 50, spa: 90, spd: 80, spe: 70 } },
  { id: 13, name: "뿔충이", types: ["bug", "poison"], stats: { hp: 40, atk: 35, def: 30, spa: 20, spd: 20, spe: 50 } },
  { id: 14, name: "딱충이", types: ["bug", "poison"], stats: { hp: 45, atk: 25, def: 50, spa: 25, spd: 25, spe: 35 } },
  { id: 15, name: "독침붕", types: ["bug", "poison"], stats: { hp: 65, atk: 90, def: 40, spa: 45, spd: 80, spe: 75 } },
  { id: 16, name: "구구", types: ["normal", "flying"], stats: { hp: 40, atk: 45, def: 40, spa: 35, spd: 35, spe: 56 } },
  { id: 17, name: "피죤", types: ["normal", "flying"], stats: { hp: 63, atk: 60, def: 55, spa: 50, spd: 50, spe: 71 } },
  { id: 18, name: "피죤투", types: ["normal", "flying"], stats: { hp: 83, atk: 80, def: 75, spa: 70, spd: 70, spe: 101 } },
  { id: 19, name: "꼬렛", types: ["normal"], stats: { hp: 30, atk: 56, def: 35, spa: 25, spd: 35, spe: 72 } },
  { id: 20, name: "레트라", types: ["normal"], stats: { hp: 55, atk: 81, def: 60, spa: 50, spd: 70, spe: 97 } },
  { id: 21, name: "깨비참", types: ["normal", "flying"], stats: { hp: 40, atk: 60, def: 30, spa: 31, spd: 31, spe: 70 } },
  { id: 22, name: "깨비드릴조", types: ["normal", "flying"], stats: { hp: 65, atk: 90, def: 65, spa: 61, spd: 61, spe: 100 } },
  { id: 23, name: "아보", types: ["poison"], stats: { hp: 35, atk: 60, def: 44, spa: 40, spd: 54, spe: 55 } },
  { id: 24, name: "아보크", types: ["poison"], stats: { hp: 60, atk: 95, def: 69, spa: 65, spd: 79, spe: 80 } },
  { id: 25, name: "피카츄", types: ["electric"], stats: { hp: 35, atk: 55, def: 40, spa: 50, spd: 50, spe: 90 } },
  { id: 26, name: "라이츄", types: ["electric"], stats: { hp: 60, atk: 90, def: 55, spa: 90, spd: 80, spe: 110 } },
  { id: 27, name: "모래두지", types: ["ground"], stats: { hp: 50, atk: 75, def: 85, spa: 20, spd: 30, spe: 40 } },
  { id: 28, name: "고지", types: ["ground"], stats: { hp: 75, atk: 100, def: 110, spa: 45, spd: 55, spe: 65 } },
  { id: 29, name: "니드런♀", types: ["poison"], stats: { hp: 55, atk: 47, def: 52, spa: 40, spd: 40, spe: 41 } },
  { id: 30, name: "니드리나", types: ["poison"], stats: { hp: 70, atk: 62, def: 67, spa: 55, spd: 55, spe: 56 } },
  { id: 31, name: "니드퀸", types: ["poison", "ground"], stats: { hp: 90, atk: 92, def: 87, spa: 75, spd: 85, spe: 76 } },
  { id: 32, name: "니드런♂", types: ["poison"], stats: { hp: 46, atk: 57, def: 40, spa: 40, spd: 40, spe: 50 } },
  { id: 33, name: "니드리노", types: ["poison"], stats: { hp: 61, atk: 72, def: 57, spa: 55, spd: 55, spe: 65 } },
  { id: 34, name: "니드킹", types: ["poison", "ground"], stats: { hp: 81, atk: 102, def: 77, spa: 85, spd: 75, spe: 85 } },
  { id: 35, name: "삐삐", types: ["fairy"], stats: { hp: 70, atk: 45, def: 48, spa: 60, spd: 65, spe: 35 } },
  { id: 36, name: "픽시", types: ["fairy"], stats: { hp: 95, atk: 70, def: 73, spa: 95, spd: 90, spe: 60 } },
  { id: 37, name: "식스테일", types: ["fire"], stats: { hp: 38, atk: 41, def: 40, spa: 50, spd: 65, spe: 65 } },
  { id: 38, name: "나인테일", types: ["fire"], stats: { hp: 73, atk: 76, def: 75, spa: 81, spd: 100, spe: 100 } },
  { id: 39, name: "푸린", types: ["normal", "fairy"], stats: { hp: 115, atk: 45, def: 20, spa: 45, spd: 25, spe: 20 } },
  { id: 40, name: "푸크린", types: ["normal", "fairy"], stats: { hp: 140, atk: 70, def: 45, spa: 85, spd: 50, spe: 45 } },
  { id: 41, name: "주뱃", types: ["poison", "flying"], stats: { hp: 40, atk: 45, def: 35, spa: 30, spd: 40, spe: 55 } },
  { id: 42, name: "골뱃", types: ["poison", "flying"], stats: { hp: 75, atk: 80, def: 70, spa: 65, spd: 75, spe: 90 } },
  { id: 43, name: "뚜벅쵸", types: ["grass", "poison"], stats: { hp: 45, atk: 50, def: 55, spa: 75, spd: 65, spe: 30 } },
  { id: 44, name: "냄새꼬", types: ["grass", "poison"], stats: { hp: 60, atk: 65, def: 70, spa: 85, spd: 75, spe: 40 } },
  { id: 45, name: "라플레시아", types: ["grass", "poison"], stats: { hp: 75, atk: 80, def: 85, spa: 110, spd: 90, spe: 50 } },
  { id: 46, name: "파라스", types: ["bug", "grass"], stats: { hp: 35, atk: 70, def: 55, spa: 45, spd: 55, spe: 25 } },
  { id: 47, name: "파라섹트", types: ["bug", "grass"], stats: { hp: 60, atk: 95, def: 80, spa: 60, spd: 80, spe: 30 } },
  { id: 48, name: "콘팡", types: ["bug", "poison"], stats: { hp: 60, atk: 55, def: 50, spa: 40, spd: 55, spe: 45 } },
  { id: 49, name: "도나리", types: ["bug", "poison"], stats: { hp: 70, atk: 65, def: 60, spa: 90, spd: 75, spe: 90 } },
  { id: 50, name: "디그다", types: ["ground"], stats: { hp: 10, atk: 55, def: 25, spa: 35, spd: 45, spe: 95 } },
  { id: 51, name: "닥트리오", types: ["ground"], stats: { hp: 35, atk: 100, def: 50, spa: 50, spd: 70, spe: 120 } },
  { id: 52, name: "나옹", types: ["normal"], stats: { hp: 40, atk: 45, def: 35, spa: 40, spd: 40, spe: 90 } },
  { id: 53, name: "페르시온", types: ["normal"], stats: { hp: 65, atk: 70, def: 60, spa: 65, spd: 65, spe: 115 } },
  { id: 54, name: "고라파덕", types: ["water"], stats: { hp: 50, atk: 52, def: 48, spa: 65, spd: 50, spe: 55 } },
  { id: 55, name: "골덕", types: ["water"], stats: { hp: 80, atk: 82, def: 78, spa: 95, spd: 80, spe: 85 } },
  { id: 56, name: "망키", types: ["fighting"], stats: { hp: 40, atk: 80, def: 35, spa: 35, spd: 45, spe: 70 } },
  { id: 57, name: "성원숭", types: ["fighting"], stats: { hp: 65, atk: 105, def: 60, spa: 60, spd: 70, spe: 95 } },
  { id: 58, name: "가디", types: ["fire"], stats: { hp: 55, atk: 70, def: 45, spa: 70, spd: 50, spe: 60 } },
  { id: 59, name: "윈디", types: ["fire"], stats: { hp: 90, atk: 110, def: 80, spa: 100, spd: 80, spe: 95 } },
  { id: 60, name: "발챙이", types: ["water"], stats: { hp: 40, atk: 50, def: 40, spa: 40, spd: 40, spe: 90 } },
  { id: 61, name: "슈륙챙이", types: ["water"], stats: { hp: 65, atk: 65, def: 65, spa: 50, spd: 50, spe: 90 } },
  { id: 62, name: "강챙이", types: ["water", "fighting"], stats: { hp: 90, atk: 95, def: 95, spa: 70, spd: 90, spe: 70 } },
  { id: 63, name: "캐이시", types: ["psychic"], stats: { hp: 25, atk: 20, def: 15, spa: 105, spd: 55, spe: 90 } },
  { id: 64, name: "윤겔라", types: ["psychic"], stats: { hp: 40, atk: 35, def: 30, spa: 120, spd: 70, spe: 105 } },
  { id: 65, name: "후딘", types: ["psychic"], stats: { hp: 55, atk: 50, def: 45, spa: 135, spd: 95, spe: 120 } },
  { id: 66, name: "알통몬", types: ["fighting"], stats: { hp: 70, atk: 80, def: 50, spa: 35, spd: 35, spe: 35 } },
  { id: 67, name: "근육몬", types: ["fighting"], stats: { hp: 80, atk: 100, def: 70, spa: 50, spd: 60, spe: 45 } },
  { id: 68, name: "괴력몬", types: ["fighting"], stats: { hp: 90, atk: 130, def: 80, spa: 65, spd: 85, spe: 55 } },
  { id: 69, name: "모다피", types: ["grass", "poison"], stats: { hp: 50, atk: 75, def: 35, spa: 70, spd: 30, spe: 40 } },
  { id: 70, name: "우츠동", types: ["grass", "poison"], stats: { hp: 65, atk: 90, def: 50, spa: 85, spd: 45, spe: 55 } },
  { id: 71, name: "우츠보트", types: ["grass", "poison"], stats: { hp: 80, atk: 105, def: 65, spa: 100, spd: 70, spe: 70 } },
  { id: 72, name: "왕눈해", types: ["water", "poison"], stats: { hp: 40, atk: 40, def: 35, spa: 50, spd: 100, spe: 70 } },
  { id: 73, name: "독파리", types: ["water", "poison"], stats: { hp: 80, atk: 70, def: 65, spa: 80, spd: 120, spe: 100 } },
  { id: 74, name: "꼬마돌", types: ["rock", "ground"], stats: { hp: 40, atk: 80, def: 100, spa: 30, spd: 30, spe: 20 } },
  { id: 75, name: "데구리", types: ["rock", "ground"], stats: { hp: 55, atk: 95, def: 115, spa: 45, spd: 45, spe: 35 } },
  { id: 76, name: "딱구리", types: ["rock", "ground"], stats: { hp: 80, atk: 120, def: 130, spa: 55, spd: 65, spe: 45 } },
  { id: 77, name: "포니타", types: ["fire"], stats: { hp: 50, atk: 85, def: 55, spa: 65, spd: 65, spe: 90 } },
  { id: 78, name: "날쌩마", types: ["fire"], stats: { hp: 65, atk: 100, def: 70, spa: 80, spd: 80, spe: 105 } },
  { id: 79, name: "야돈", types: ["water", "psychic"], stats: { hp: 90, atk: 65, def: 65, spa: 40, spd: 40, spe: 15 } },
  { id: 80, name: "야도란", types: ["water", "psychic"], stats: { hp: 95, atk: 75, def: 110, spa: 100, spd: 80, spe: 30 } },
  { id: 81, name: "코일", types: ["electric", "steel"], stats: { hp: 25, atk: 35, def: 70, spa: 95, spd: 55, spe: 45 } },
  { id: 82, name: "레어코일", types: ["electric", "steel"], stats: { hp: 50, atk: 60, def: 95, spa: 120, spd: 70, spe: 70 } },
  { id: 83, name: "파오리", types: ["normal", "flying"], stats: { hp: 52, atk: 90, def: 55, spa: 58, spd: 62, spe: 60 } },
  { id: 84, name: "두두", types: ["normal", "flying"], stats: { hp: 35, atk: 85, def: 45, spa: 35, spd: 35, spe: 75 } },
  { id: 85, name: "두트리오", types: ["normal", "flying"], stats: { hp: 60, atk: 110, def: 70, spa: 60, spd: 60, spe: 110 } },
  { id: 86, name: "쥬쥬", types: ["water"], stats: { hp: 65, atk: 45, def: 55, spa: 45, spd: 70, spe: 45 } },
  { id: 87, name: "쥬레곤", types: ["water", "ice"], stats: { hp: 90, atk: 70, def: 80, spa: 70, spd: 95, spe: 70 } },
  { id: 88, name: "질퍽이", types: ["poison"], stats: { hp: 80, atk: 80, def: 50, spa: 40, spd: 50, spe: 25 } },
  { id: 89, name: "질뻐기", types: ["poison"], stats: { hp: 105, atk: 105, def: 75, spa: 65, spd: 100, spe: 50 } },
  { id: 90, name: "셀러", types: ["water"], stats: { hp: 30, atk: 65, def: 100, spa: 45, spd: 25, spe: 40 } },
  { id: 91, name: "파르셀", types: ["water", "ice"], stats: { hp: 50, atk: 95, def: 180, spa: 85, spd: 45, spe: 70 } },
  { id: 92, name: "고오스", types: ["ghost", "poison"], stats: { hp: 30, atk: 35, def: 30, spa: 100, spd: 35, spe: 80 } },
  { id: 93, name: "고우스트", types: ["ghost", "poison"], stats: { hp: 45, atk: 50, def: 45, spa: 115, spd: 55, spe: 95 } },
  { id: 94, name: "팬텀", types: ["ghost", "poison"], stats: { hp: 60, atk: 65, def: 60, spa: 130, spd: 75, spe: 110 } },
  { id: 95, name: "롱스톤", types: ["rock", "ground"], stats: { hp: 35, atk: 45, def: 160, spa: 30, spd: 45, spe: 70 } },
  { id: 96, name: "슬리프", types: ["psychic"], stats: { hp: 60, atk: 48, def: 45, spa: 43, spd: 90, spe: 42 } },
  { id: 97, name: "슬리퍼", types: ["psychic"], stats: { hp: 85, atk: 73, def: 70, spa: 73, spd: 115, spe: 67 } },
  { id: 98, name: "크랩", types: ["water"], stats: { hp: 30, atk: 105, def: 90, spa: 25, spd: 25, spe: 50 } },
  { id: 99, name: "킹크랩", types: ["water"], stats: { hp: 55, atk: 130, def: 115, spa: 50, spd: 50, spe: 75 } },
  { id: 100, name: "찌리리공", types: ["electric"], stats: { hp: 40, atk: 30, def: 50, spa: 55, spd: 55, spe: 100 } },
  { id: 101, name: "붐볼", types: ["electric"], stats: { hp: 60, atk: 50, def: 70, spa: 80, spd: 80, spe: 150 } },
  { id: 102, name: "아라리", types: ["grass", "psychic"], stats: { hp: 60, atk: 40, def: 80, spa: 60, spd: 45, spe: 40 } },
  { id: 103, name: "나시", types: ["grass", "psychic"], stats: { hp: 95, atk: 95, def: 85, spa: 125, spd: 75, spe: 55 } },
  { id: 104, name: "탕구리", types: ["ground"], stats: { hp: 50, atk: 50, def: 95, spa: 40, spd: 50, spe: 35 } },
  { id: 105, name: "텅구리", types: ["ground"], stats: { hp: 60, atk: 80, def: 110, spa: 50, spd: 80, spe: 45 } },
  { id: 106, name: "시라소몬", types: ["fighting"], stats: { hp: 50, atk: 120, def: 53, spa: 35, spd: 110, spe: 87 } },
  { id: 107, name: "홍수몬", types: ["fighting"], stats: { hp: 50, atk: 105, def: 79, spa: 35, spd: 110, spe: 76 } },
  { id: 108, name: "내루미", types: ["normal"], stats: { hp: 90, atk: 55, def: 75, spa: 60, spd: 75, spe: 30 } },
  { id: 109, name: "또가스", types: ["poison"], stats: { hp: 40, atk: 65, def: 95, spa: 60, spd: 45, spe: 35 } },
  { id: 110, name: "또도가스", types: ["poison"], stats: { hp: 65, atk: 90, def: 120, spa: 85, spd: 70, spe: 60 } },
  { id: 111, name: "뿔카노", types: ["ground", "rock"], stats: { hp: 80, atk: 85, def: 95, spa: 30, spd: 30, spe: 25 } },
  { id: 112, name: "코뿌리", types: ["ground", "rock"], stats: { hp: 105, atk: 130, def: 120, spa: 45, spd: 45, spe: 40 } },
  { id: 113, name: "럭키", types: ["normal"], stats: { hp: 250, atk: 5, def: 5, spa: 35, spd: 105, spe: 50 } },
  { id: 114, name: "덩쿠리", types: ["grass"], stats: { hp: 65, atk: 55, def: 115, spa: 100, spd: 40, spe: 60 } },
  { id: 115, name: "캥카", types: ["normal"], stats: { hp: 105, atk: 95, def: 80, spa: 40, spd: 80, spe: 90 } },
  { id: 116, name: "쏘드라", types: ["water"], stats: { hp: 30, atk: 40, def: 70, spa: 70, spd: 25, spe: 60 } },
  { id: 117, name: "시드라", types: ["water"], stats: { hp: 55, atk: 65, def: 95, spa: 95, spd: 45, spe: 85 } },
  { id: 118, name: "콘치", types: ["water"], stats: { hp: 45, atk: 67, def: 60, spa: 35, spd: 50, spe: 63 } },
  { id: 119, name: "왕콘치", types: ["water"], stats: { hp: 80, atk: 92, def: 65, spa: 65, spd: 80, spe: 68 } },
  { id: 120, name: "별가사리", types: ["water"], stats: { hp: 30, atk: 45, def: 55, spa: 70, spd: 55, spe: 85 } },
  { id: 121, name: "아쿠스타", types: ["water", "psychic"], stats: { hp: 60, atk: 75, def: 85, spa: 100, spd: 85, spe: 115 } },
  { id: 122, name: "마임맨", types: ["psychic", "fairy"], stats: { hp: 40, atk: 45, def: 65, spa: 100, spd: 120, spe: 90 } },
  { id: 123, name: "스라크", types: ["bug", "flying"], stats: { hp: 70, atk: 110, def: 80, spa: 55, spd: 80, spe: 105 } },
  { id: 124, name: "루주라", types: ["ice", "psychic"], stats: { hp: 65, atk: 50, def: 35, spa: 115, spd: 95, spe: 95 } },
  { id: 125, name: "에레브", types: ["electric"], stats: { hp: 65, atk: 83, def: 57, spa: 95, spd: 85, spe: 105 } },
  { id: 126, name: "마그마", types: ["fire"], stats: { hp: 65, atk: 95, def: 57, spa: 100, spd: 85, spe: 93 } },
  { id: 127, name: "쁘사이저", types: ["bug"], stats: { hp: 65, atk: 125, def: 100, spa: 55, spd: 70, spe: 85 } },
  { id: 128, name: "켄타로스", types: ["normal"], stats: { hp: 75, atk: 100, def: 95, spa: 40, spd: 70, spe: 110 } },
  { id: 129, name: "잉어킹", types: ["water"], stats: { hp: 20, atk: 10, def: 55, spa: 15, spd: 20, spe: 80 } },
  { id: 130, name: "갸라도스", types: ["water", "flying"], stats: { hp: 95, atk: 125, def: 79, spa: 60, spd: 100, spe: 81 } },
  { id: 131, name: "라프라스", types: ["water", "ice"], stats: { hp: 130, atk: 85, def: 80, spa: 85, spd: 95, spe: 60 } },
  { id: 132, name: "메타몽", types: ["normal"], stats: { hp: 48, atk: 48, def: 48, spa: 48, spd: 48, spe: 48 } },
  { id: 133, name: "이브이", types: ["normal"], stats: { hp: 55, atk: 55, def: 50, spa: 45, spd: 65, spe: 55 } },
  { id: 134, name: "샤미드", types: ["water"], stats: { hp: 130, atk: 65, def: 60, spa: 110, spd: 95, spe: 65 } },
  { id: 135, name: "쥬피썬더", types: ["electric"], stats: { hp: 65, atk: 65, def: 60, spa: 110, spd: 95, spe: 130 } },
  { id: 136, name: "부스터", types: ["fire"], stats: { hp: 65, atk: 130, def: 60, spa: 95, spd: 110, spe: 65 } },
  { id: 137, name: "폴리곤", types: ["normal"], stats: { hp: 65, atk: 60, def: 70, spa: 85, spd: 75, spe: 40 } },
  { id: 138, name: "암나이트", types: ["rock", "water"], stats: { hp: 35, atk: 40, def: 100, spa: 90, spd: 55, spe: 35 } },
  { id: 139, name: "암스타", types: ["rock", "water"], stats: { hp: 70, atk: 60, def: 125, spa: 115, spd: 70, spe: 55 } },
  { id: 140, name: "투구", types: ["rock", "water"], stats: { hp: 30, atk: 80, def: 90, spa: 55, spd: 45, spe: 55 } },
  { id: 141, name: "투구푸스", types: ["rock", "water"], stats: { hp: 60, atk: 115, def: 105, spa: 65, spd: 70, spe: 80 } },
  { id: 142, name: "프테라", types: ["rock", "flying"], stats: { hp: 80, atk: 105, def: 65, spa: 60, spd: 75, spe: 130 } },
  { id: 143, name: "잠만보", types: ["normal"], stats: { hp: 160, atk: 110, def: 65, spa: 65, spd: 110, spe: 30 } },
  { id: 144, name: "프리져", types: ["ice", "flying"], stats: { hp: 90, atk: 85, def: 100, spa: 95, spd: 125, spe: 85 } },
  { id: 145, name: "썬더", types: ["electric", "flying"], stats: { hp: 90, atk: 90, def: 85, spa: 125, spd: 90, spe: 100 } },
  { id: 146, name: "파이어", types: ["fire", "flying"], stats: { hp: 90, atk: 100, def: 90, spa: 125, spd: 85, spe: 90 } },
  { id: 147, name: "미뇽", types: ["dragon"], stats: { hp: 41, atk: 64, def: 45, spa: 50, spd: 50, spe: 50 } },
  { id: 148, name: "신뇽", types: ["dragon"], stats: { hp: 61, atk: 84, def: 65, spa: 70, spd: 70, spe: 70 } },
  { id: 149, name: "망나뇽", types: ["dragon", "flying"], stats: { hp: 91, atk: 134, def: 95, spa: 100, spd: 100, spe: 80 } },
  { id: 150, name: "뮤츠", types: ["psychic"], stats: { hp: 106, atk: 110, def: 90, spa: 154, spd: 90, spe: 130 } },
  { id: 151, name: "뮤", types: ["psychic"], stats: { hp: 100, atk: 100, def: 100, spa: 100, spd: 100, spe: 100 } }
];

const STAT_LABELS = [
  { key: "hp",  label: "HP" },
  { key: "atk", label: "공격" },
  { key: "def", label: "방어" },
  { key: "spa", label: "특수공격" },
  { key: "spd", label: "특수방어" },
  { key: "spe", label: "스피드" }
];

const mySelect = document.getElementById("my-select");
const oppSelect = document.getElementById("opp-select");
const mySearch = document.getElementById("my-search");
const oppSearch = document.getElementById("opp-search");

// 단일 공격 타입이 방어 타입 조합에 주는 배율 계산
function getTypeMultiplier(atkType, defTypes) {
  let mult = 1;
  const chart = TYPE_CHART[atkType] || {};
  for (const d of defTypes) {
    if (chart[d] !== undefined) mult *= chart[d];
  }
  return mult;
}

// 공격자의 고유 타입 중 상대에게 들어가는 최고 배율 계산
function getBestStabMultiplier(attacker, defender) {
  let bestMult = 0;
  let bestType = attacker.types[0];
  for (const t of attacker.types) {
    const m = getTypeMultiplier(t, defender.types);
    if (m > bestMult) {
      bestMult = m;
      bestType = t;
    }
  }
  return { mult: bestMult, type: bestType };
}

// 방어 약점(2배·4배) 및 무효(0배) 타입 계산
function getDefenseSummary(defTypes) {
  const weak = [];
  const immune = [];
  for (const atk of ALL_TYPES) {
    const m = getTypeMultiplier(atk, defTypes);
    if (m >= 2) weak.push({ type: atk, mult: m });
    else if (m === 0) immune.push(atk);
  }
  weak.sort((a, b) => b.mult - a.mult);
  return { weak, immune };
}

// 종족값 총합(BST) 계산
function getBST(stats) {
  return Object.values(stats).reduce((a, b) => a + b, 0);
}

// 종합 유불리 판정 로직
function evaluateMatchup(me, opp) {
  const myOff = getBestStabMultiplier(me, opp);
  const oppOff = getBestStabMultiplier(opp, me);

  const myBST = getBST(me.stats);
  const oppBST = getBST(opp.stats);
  const bstDiff = myBST - oppBST;
  const speDiff = me.stats.spe - opp.stats.spe;

  const multScore = (m) => {
    if (m >= 4) return 45;
    if (m >= 2) return 25;
    if (m === 1) return 0;
    if (m > 0) return -20;
    return -40;
  };

  let score = multScore(myOff.mult) - multScore(oppOff.mult);
  score += Math.max(-20, Math.min(20, bstDiff / 8));
  if (speDiff > 0) score += 8;
  else if (speDiff < 0) score -= 8;

  let badgeText = "호각 (50 : 50)";
  let badgeClass = "v-even";
  let headline = `${me.name}과(와) ${opp.name}은(는) 팽팽한 승부가 예상됩니다.`;

  if (score >= 30) {
    badgeText = "매우 유리함";
    badgeClass = "v-great";
    headline = `${me.name}이(가) ${opp.name}을(를) 압도적으로 유리하게 상대할 수 있습니다!`;
  } else if (score >= 12) {
    badgeText = "유리함";
    badgeClass = "v-good";
    headline = `${me.name} 쪽이 상성 또는 체급에서 우위를 점하고 있습니다.`;
  } else if (score <= -30) {
    badgeText = "매우 불리함";
    badgeClass = "v-worst";
    headline = `${me.name}에게 매우 위험한 상대입니다. 교체를 권장합니다!`;
  } else if (score <= -12) {
    badgeText = "불리함";
    badgeClass = "v-bad";
    headline = `${opp.name} 쪽이 상성 또는 능력치에서 더 유리합니다.`;
  }

  const reasons = [];
  reasons.push(
    `자속 공격 상성: ${me.name}의 [${TYPE_KO[myOff.type]}] 공격은 ${myOff.mult}배, ` +
    `${opp.name}의 [${TYPE_KO[oppOff.type]}] 공격은 ${oppOff.mult}배로 들어갑니다.`
  );

  if (bstDiff > 0) {
    reasons.push(`종족값 총합: ${me.name}(${myBST})이(가) ${opp.name}(${oppBST})보다 ${bstDiff} 높습니다.`);
  } else if (bstDiff < 0) {
    reasons.push(`종족값 총합: ${me.name}(${myBST})이(가) ${opp.name}(${oppBST})보다 ${Math.abs(bstDiff)} 낮습니다.`);
  } else {
    reasons.push(`종족값 총합: 두 포켓몬 모두 ${myBST}으로 체급이 같습니다.`);
  }

  if (speDiff > 0) {
    reasons.push(`선공권(스피드): ${me.name}(${me.stats.spe})이(가) ${opp.name}(${opp.stats.spe})보다 빨라 먼저 공격합니다.`);
  } else if (speDiff < 0) {
    reasons.push(`선공권(스피드): ${opp.name}(${opp.stats.spe})이(가) ${me.name}(${me.stats.spe})보다 빨라 선공을 내줍니다.`);
  } else {
    reasons.push(`선공권(스피드): 스피드가 ${me.stats.spe}로 동일합니다.`);
  }

  return { badgeText, badgeClass, headline, reasons, myOff, oppOff };
}

// 개별 포켓몬 비교 카드 렌더링
function renderPanel(elId, poke, other, isMe, offInfo) {
  const panel = document.getElementById(elId);
  const defInfo = getDefenseSummary(poke.types);
  const bst = getBST(poke.stats);

  const multClass = offInfo.mult >= 2 ? "m-high" : offInfo.mult < 1 ? "m-low" : "m-mid";

  const weakHtml = defInfo.weak.length
    ? defInfo.weak.map(w => `<span class="type-badge t-${w.type}">${TYPE_KO[w.type]} ×${w.mult}</span>`).join("")
    : `<span style="font-size:0.82rem;color:#64748b;">약점 없음</span>`;

  const immuneHtml = defInfo.immune.length
    ? defInfo.immune.map(t => `<span class="type-badge t-${t}">${TYPE_KO[t]} ×0</span>`).join("")
    : `<span style="font-size:0.82rem;color:#64748b;">없음</span>`;

  const statsHtml = STAT_LABELS.map(s => {
    const val = poke.stats[s.key];
    const otherVal = other.stats[s.key];
    const isWin = val > otherVal;
    const pct = Math.min(100, Math.round((val / 250) * 100));
    return `
      <div class="stat-row">
        <span class="stat-name">${s.label}</span>
        <span class="stat-val ${(isWin ? "win" : "")}">${val}</span>
        <div class="bar-bg"><div class="bar-fill ${(isWin ? "win" : "")}" style="width:${pct}%"></div></div>
      </div>
    `;
  }).join("");

  panel.innerHTML = `
    <div class="panel-head">
      <span class="side-tag ${(isMe ? "side-me" : "side-opp")}">${(isMe ? "🔵 내 포켓몬" : "🔴 상대 포켓몬")}</span>
      <span class="dex-tag">관동 No.${String(poke.id).padStart(3, "0")}</span>
    </div>

    <div class="poke-profile">
      <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${poke.id}.png" alt="${poke.name}" />
      <div class="poke-name">${poke.name}</div>
      <div class="type-list">
        ${poke.types.map(t => `<span class="type-badge t-${t}">${TYPE_KO[t]}</span>`).join("")}
      </div>
    </div>

    <div class="matchup-box">
      <div class="matchup-row">
        <span>상대에게 주는 최고 자속 배율</span>
        <span class="mult-pill ${multClass}">${TYPE_KO[offInfo.type]} ×${offInfo.mult}</span>
      </div>
    </div>

    <div class="def-section">
      <div class="def-title">받는 약점 (2배 · 4배)</div>
      <div class="badge-wrap">${weakHtml}</div>
    </div>

    <div class="def-section">
      <div class="def-title">무효화하는 타입 (0배)</div>
      <div class="badge-wrap">${immuneHtml}</div>
    </div>

    <div class="stat-title">
      <span>종족값 비교 (우위 항목 초록색)</span>
      <span>총합 ${bst}</span>
    </div>
    ${statsHtml}
  `;
}

function updateComparison() {
  const me = GEN1_POKEDEX.find(p => p.id === Number(mySelect.value));
  const opp = GEN1_POKEDEX.find(p => p.id === Number(oppSelect.value));
  if (!me || !opp) return;

  const res = evaluateMatchup(me, opp);

  const badge = document.getElementById("verdict-badge");
  badge.textContent = res.badgeText;
  badge.className = `verdict-badge ${res.badgeClass}`;

  document.getElementById("verdict-title").textContent = res.headline;
  document.getElementById("verdict-reasons").innerHTML =
    res.reasons.map(r => `<li>${r}</li>`).join("");

  renderPanel("my-panel", me, opp, true, res.myOff);
  renderPanel("opp-panel", opp, me, false, res.oppOff);
}

// 검색어에 맞춰 드롭다운 목록 갱신
function populateSelect(selectEl, keyword = "", preserveId = null) {
  const q = keyword.trim().toLowerCase();
  const currentVal = preserveId !== null ? Number(preserveId) : Number(selectEl.value);
  selectEl.innerHTML = "";

  const filtered = GEN1_POKEDEX.filter(p => {
    const no = String(p.id).padStart(3, "0");
    return !q || p.name.includes(q) || no.includes(q) || String(p.id) === q;
  });

  filtered.forEach(p => {
    const no = String(p.id).padStart(3, "0");
    const label = `No.${no} ${p.name} (${p.types.map(t => TYPE_KO[t]).join("/")})`;
    selectEl.add(new Option(label, p.id));
  });

  if (filtered.some(p => p.id === currentVal)) {
    selectEl.value = currentVal;
  } else if (filtered.length > 0) {
    selectEl.value = filtered[0].id;
  }
}

// 초기 목록 채우기 (기본: 리자몽 No.006 vs 거북왕 No.009)
populateSelect(mySelect, "", 6);
populateSelect(oppSelect, "", 9);

mySearch.addEventListener("input", () => {
  populateSelect(mySelect, mySearch.value);
  updateComparison();
});

oppSearch.addEventListener("input", () => {
  populateSelect(oppSelect, oppSearch.value);
  updateComparison();
});

mySelect.addEventListener("change", updateComparison);
oppSelect.addEventListener("change", updateComparison);

document.getElementById("swap-btn").addEventListener("click", () => {
  const myId = mySelect.value;
  const oppId = oppSelect.value;
  mySearch.value = "";
  oppSearch.value = "";
  populateSelect(mySelect, "", oppId);
  populateSelect(oppSelect, "", myId);
  updateComparison();
});

document.getElementById("random-btn").addEventListener("click", () => {
  const i = Math.floor(Math.random() * GEN1_POKEDEX.length);
  let j = Math.floor(Math.random() * GEN1_POKEDEX.length);
  if (i === j) j = (j + 1) % GEN1_POKEDEX.length;

  mySearch.value = "";
  oppSearch.value = "";
  populateSelect(mySelect, "", GEN1_POKEDEX[i].id);
  populateSelect(oppSelect, "", GEN1_POKEDEX[j].id);
  updateComparison();
});

updateComparison();
